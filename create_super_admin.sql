-- ============================================================================
-- MYNE7X BPO — Create Super Admin Account (FIXED)
-- ============================================================================
-- Run this in Supabase SQL Editor to create the CEO login account.
--
-- Email:    myne7x@gmail.com
-- Password: 123@@Winn
--
-- ⚠️ PREREQUISITE: You MUST run supabase_schema.sql FIRST to create the tables.
--    If you haven't run it yet, run it now, then come back to this file.
-- ============================================================================

-- Step 1: Fix the protect_super_admin trigger to ALLOW the protected email
-- (This allows super_admin role ONLY for myne7x@gmail.com, blocks everyone else)
create or replace function public.prevent_super_admin_modification()
returns trigger as $$
declare
  protected_email text := 'myne7x@gmail.com';
  target_email text;
  target_old_role text;
begin
  -- Allow Super Admin to do anything
  if public.is_super_admin() then
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

-- Step 2: Create or update the auth user + profile using a DO block
-- (This avoids ON CONFLICT issues and handles both new and existing users)
do $$
declare
  v_user_id uuid;
  v_password text := '123@@Winn';
  v_email text := 'myne7x@gmail.com';
begin
  -- Check if the auth user already exists
  select id into v_user_id from auth.users where lower(email) = lower(v_email);

  if v_user_id is null then
    -- User doesn't exist — create new one
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
      email_change,
      instance_id
    ) values (
      gen_random_uuid(),
      v_email,
      crypt(v_password, gen_salt('bf')),
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
      '',
      '00000000-0000-0000-0000-000000000000'
    )
    returning id into v_user_id;
    
    raise notice '✅ Created new auth user: % (ID: %)', v_email, v_user_id;
  else
    -- User exists — update password
    update auth.users set
      encrypted_password = crypt(v_password, gen_salt('bf')),
      email_confirmed_at = now(),
      updated_at = now(),
      aud = 'authenticated',
      role = 'authenticated'
    where id = v_user_id;
    
    raise notice '✅ Updated existing auth user password: % (ID: %)', v_email, v_user_id;
  end if;

  -- Now create/update the profile (use ON CONFLICT on id — primary key always exists)
  insert into public.profiles (id, email, full_name, role, employment_status, must_change_password)
  values (v_user_id, v_email, 'MYNE7X CEO', 'super_admin', 'active', false)
  on conflict (id) do update
    set role = 'super_admin',
        full_name = 'MYNE7X CEO',
        employment_status = 'active',
        must_change_password = false,
        updated_at = now();

  raise notice '✅ Super Admin profile ready: %', v_email;
end $$;

-- Step 3: Verify the account was created
select
  '✅ Super Admin account ready!' as status,
  email,
  role,
  employment_status,
  'Login at /login with email myne7x@gmail.com' as next_step
from public.profiles
where email = 'myne7x@gmail.com';

-- ============================================================================
-- DONE!
-- Login at your app:
--   Email:    myne7x@gmail.com
--   Password: 123@@Winn
-- ============================================================================
