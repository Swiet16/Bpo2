-- ============================================================================
-- MYNE7X BPO — Create Super Admin Account (SMALL SQL)
-- ============================================================================
-- Run this in Supabase SQL Editor to create the CEO login account.
--
-- Email:    myne7x@gmail.com
-- Password: 123@@Winn
--
-- After running this, you can log in at your app's /login page.
-- ============================================================================

-- Step 1: Fix the protect_super_admin trigger to ALLOW the protected email
-- (The original trigger blocked ALL super_admin inserts, which was a bug)
create or replace function public.prevent_super_admin_modification()
returns trigger as $$
declare
  protected_email text := 'myne7x@gmail.com';
  target_email text;
  target_old_role text;
begin
  -- Allow Super Admin to do anything
  if public.is_super_admin() then
    -- But prevent role downgrade of the protected super admin by themselves
    if TG_OP = 'UPDATE' and OLD.email = protected_email and NEW.role != 'super_admin' then
      raise exception 'Access Denied — The protected Super Admin role cannot be downgraded.';
    end if;
    return coalesce(NEW, OLD);
  end if;

  -- For UPDATE / DELETE: check if target is the protected super admin
  if TG_OP = 'UPDATE' or TG_OP = 'DELETE' then
    select email, role into target_email, target_old_role from public.profiles where id = OLD.id;
    if lower(target_email) = lower(protected_email) then
      raise exception 'Access Denied — This action requires Super Admin authorization.';
    end if;
    -- Prevent role escalation to super_admin for non-protected accounts
    if TG_OP = 'UPDATE' and NEW.role = 'super_admin' and target_old_role != 'super_admin' then
      raise exception 'Access Denied — Only the protected Super Admin can grant Super Admin role.';
    end if;
  end if;

  -- For INSERT: allow super_admin ONLY for the protected email
  if TG_OP = 'INSERT' and NEW.role = 'super_admin' and lower(NEW.email) != lower(protected_email) then
    raise exception 'Access Denied — Super Admin role can only be assigned to the protected email.';
  end if;

  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

-- Step 2: Create the auth user with bcrypt-hashed password
insert into auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) values (
  gen_random_uuid(),
  'myne7x@gmail.com',
  crypt('123@@Winn', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  '',
  '',
  '',
  ''
)
on conflict (email) do update
  set encrypted_password = excluded.encrypted_password,
      email_confirmed_at = now(),
      updated_at = now(),
      aud = 'authenticated',
      role = 'authenticated';

-- Step 3: Create/update the profile with super_admin role
insert into public.profiles (id, email, full_name, role, employment_status, must_change_password)
select id, email, 'MYNE7X CEO', 'super_admin', 'active', false
from auth.users
where email = 'myne7x@gmail.com'
on conflict (email) do update
  set role = 'super_admin',
      full_name = 'MYNE7X CEO',
      employment_status = 'active',
      must_change_password = false;

-- Step 4: Verify the account was created
select '✅ Super Admin account ready!' as status,
       email,
       role,
       employment_status,
       'You can now log in at /login' as next_step
from public.profiles
where email = 'myne7x@gmail.com';

-- ============================================================================
-- DONE!
-- Login at your app:
--   Email:    myne7x@gmail.com
--   Password: 123@@Winn
-- ============================================================================
