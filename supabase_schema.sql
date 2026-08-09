-- ============================================================================
-- MYNE7X BPO — Complete Supabase Database Schema
-- ============================================================================
-- Run this entire file in your Supabase SQL Editor (Dashboard → SQL → New Query)
-- It is idempotent — safe to run multiple times.
--
-- ⚠️ CRITICAL SECURITY NOTES:
-- 1. The protected Super Admin email is myne7x@gmail.com (configurable below)
-- 2. Nobody — including Admin users — can modify/delete/suspend/downgrade this account
-- 3. Row Level Security (RLS) is enabled on ALL tables
-- 4. NEVER expose the service_role key in frontend code
-- 5. All Storage buckets must be PRIVATE (not public)
-- ============================================================================

-- ⚠️ NOTE: Supabase hosted environment does not allow `ALTER DATABASE` commands.
-- The protected Super Admin email is hardcoded in the security functions below.
-- To change it, update the `protected_email` variable in those functions
-- AND update VITE_SUPER_ADMIN_EMAIL in your .env file.

-- (Removed: alter database postgres set app.super_admin_email = 'myne7x@gmail.com';)
-- This command fails on Supabase hosted with: "permission denied to set parameter"

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  username text unique,
  phone text,
  employee_id text unique,
  role text not null default 'agent' check (role in (
    'super_admin', 'admin', 'agent', 'team_leader', 'hr',
    'it', 'corporation', 'client', 'bi'
  )),
  department text,
  team text,
  team_leader_id uuid references public.profiles(id),
  job_title text,
  employment_status text not null default 'active' check (employment_status in (
    'active', 'suspended', 'terminated', 'on_leave'
  )),
  employment_type text check (employment_type in (
    'permanent', 'contract', 'intern', 'probation'
  )),
  joining_date date,
  date_of_birth date,
  emergency_contact text,
  avatar_url text,
  must_change_password boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_employee_id on public.profiles(employee_id);
create index if not exists idx_profiles_department on public.profiles(department);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  protected_email text := 'myne7x@gmail.com';
  assigned_role text;
begin
  assigned_role := case
    when lower(new.email) = lower(protected_email) then 'super_admin'
    else 'agent'
  end;
  insert into public.profiles (id, email, full_name, role, employment_status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    assigned_role,
    'active'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- ============================================================================
-- 2. DEPARTMENTS & TEAMS
-- ============================================================================

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  head_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department_id uuid references public.departments(id) on delete set null,
  leader_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 3. ATTENDANCE
-- ============================================================================

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  check_in timestamptz,
  check_out timestamptz,
  status text not null check (status in (
    'present', 'absent', 'late', 'leave', 'holiday', 'half_day'
  )),
  working_hours numeric,
  late_minutes integer default 0,
  notes text,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

create index if not exists idx_attendance_user_date on public.attendance(user_id, date desc);
create index if not exists idx_attendance_date on public.attendance(date);

-- ============================================================================
-- 4. LEAVE REQUESTS
-- ============================================================================

create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  leave_type text not null check (leave_type in (
    'casual', 'sick', 'annual', 'unpaid', 'maternity', 'emergency'
  )),
  start_date date not null,
  end_date date not null,
  reason text not null,
  attachment_url text,
  status text not null default 'pending' check (status in (
    'pending', 'approved', 'rejected', 'cancelled'
  )),
  approver_id uuid references public.profiles(id) on delete set null,
  approver_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists leave_requests_updated_at on public.leave_requests;
create trigger leave_requests_updated_at
  before update on public.leave_requests
  for each row execute function public.update_updated_at();

create index if not exists idx_leave_user on public.leave_requests(user_id);
create index if not exists idx_leave_status on public.leave_requests(status);

-- ============================================================================
-- 5. PAYROLL & PAYSLIPS
-- ============================================================================

create table if not exists public.payroll (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  pay_period_month integer not null check (pay_period_month between 1 and 12),
  pay_period_year integer not null,
  basic_salary numeric not null default 0,
  allowances numeric not null default 0,
  bonuses numeric not null default 0,
  overtime numeric not null default 0,
  deductions numeric not null default 0,
  tax numeric not null default 0,
  advances numeric not null default 0,
  other_deductions numeric not null default 0,
  net_salary numeric not null default 0,
  payment_status text not null default 'pending' check (payment_status in (
    'pending', 'processed', 'paid', 'failed'
  )),
  payment_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, pay_period_month, pay_period_year)
);

drop trigger if exists payroll_updated_at on public.payroll;
create trigger payroll_updated_at
  before update on public.payroll
  for each row execute function public.update_updated_at();

create table if not exists public.payslips (
  id uuid primary key default gen_random_uuid(),
  reference_no text not null unique,
  payroll_id uuid not null references public.payroll(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'draft' check (status in (
    'draft', 'approved', 'published', 'archived'
  )),
  generated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists idx_payslips_user on public.payslips(user_id);
create index if not exists idx_payslips_status on public.payslips(status);

-- ============================================================================
-- 6. CONTRACTS
-- ============================================================================

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  position text not null,
  department text,
  start_date date not null,
  end_date date,
  salary numeric not null default 0,
  working_hours text not null default '40h/week',
  work_location text,
  employment_type text not null check (employment_type in (
    'permanent', 'contract', 'intern', 'probation'
  )),
  responsibilities text,
  benefits text,
  confidentiality text,
  termination_conditions text,
  status text not null default 'draft' check (status in (
    'draft', 'pending_approval', 'active', 'expiring_soon', 'expired', 'terminated'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists contracts_updated_at on public.contracts;
create trigger contracts_updated_at
  before update on public.contracts
  for each row execute function public.update_updated_at();

create index if not exists idx_contracts_user on public.contracts(user_id);
create index if not exists idx_contracts_status on public.contracts(status);
create index if not exists idx_contracts_end_date on public.contracts(end_date);

-- ============================================================================
-- 7. SUPPORT TICKETS & MESSAGES
-- ============================================================================

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_no text not null unique,
  full_name text not null,
  email text not null,
  phone text,
  company text,
  category text not null,
  subject text not null,
  message text not null,
  priority text not null default 'medium' check (priority in (
    'low', 'medium', 'high', 'urgent'
  )),
  preferred_contact text not null default 'email' check (preferred_contact in (
    'email', 'phone', 'whatsapp'
  )),
  department text,
  assigned_to uuid references public.profiles(id) on delete set null,
  attachment_url text,
  status text not null default 'new' check (status in (
    'new', 'assigned', 'in_progress', 'waiting', 'resolved', 'closed'
  )),
  is_public boolean not null default false,
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists support_tickets_updated_at on public.support_tickets;
create trigger support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.update_updated_at();

create index if not exists idx_tickets_status on public.support_tickets(status);
create index if not exists idx_tickets_assigned on public.support_tickets(assigned_to);
create index if not exists idx_tickets_email on public.support_tickets(email);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_name text not null,
  message text not null,
  attachment_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ticket_messages_ticket on public.ticket_messages(ticket_id);

-- ============================================================================
-- 8. CLIENTS & CORPORATIONS
-- ============================================================================

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  service text not null,
  assigned_team text,
  contract_start date,
  contract_end date,
  status text not null default 'active' check (status in (
    'active', 'inactive', 'prospect', 'churned'
  )),
  notes text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at
  before update on public.clients
  for each row execute function public.update_updated_at();

create table if not exists public.corporations (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  industry text,
  contact_person text not null,
  email text not null,
  phone text not null,
  address text,
  contract_value numeric,
  assigned_services text,
  account_status text not null default 'active' check (account_status in (
    'active', 'inactive', 'prospect', 'suspended'
  )),
  notes text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists corporations_updated_at on public.corporations;
create trigger corporations_updated_at
  before update on public.corporations
  for each row execute function public.update_updated_at();

-- ============================================================================
-- 9. IT ASSETS
-- ============================================================================

create table if not exists public.it_assets (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null unique,
  type text not null check (type in (
    'laptop', 'desktop', 'monitor', 'keyboard', 'mouse', 'headset', 'phone', 'other'
  )),
  serial_number text not null unique,
  brand text,
  model text,
  assigned_to uuid references public.profiles(id) on delete set null,
  department text,
  issue_date date,
  return_date date,
  condition text not null default 'new' check (condition in (
    'new', 'excellent', 'good', 'fair', 'poor', 'damaged'
  )),
  status text not null default 'in_stock' check (status in (
    'in_stock', 'assigned', 'returned', 'under_repair', 'retired'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists it_assets_updated_at on public.it_assets;
create trigger it_assets_updated_at
  before update on public.it_assets
  for each row execute function public.update_updated_at();

-- ============================================================================
-- 10. NOTIFICATIONS, ANNOUNCEMENTS, TASKS
-- ============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in (
    'info', 'success', 'warning', 'critical'
  )),
  is_read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications(user_id, is_read);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  audience text[] not null default '{everyone}',
  priority text not null default 'medium' check (priority in (
    'low', 'medium', 'high', 'critical'
  )),
  publish_date timestamptz not null default now(),
  expiry_date timestamptz,
  attachment_url text,
  status text not null default 'draft' check (status in (
    'draft', 'published', 'archived'
  )),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id) on delete cascade,
  due_date date,
  priority text not null default 'medium' check (priority in (
    'low', 'medium', 'high', 'urgent'
  )),
  status text not null default 'todo' check (status in (
    'todo', 'in_progress', 'review', 'done', 'blocked'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.update_updated_at();

create index if not exists idx_tasks_assigned_to on public.tasks(assigned_to);
create index if not exists idx_tasks_status on public.tasks(status);

-- ============================================================================
-- 11. PERFORMANCE REVIEWS
-- ============================================================================

create table if not exists public.performance_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  review_period text not null,
  attendance_score numeric not null default 0 check (attendance_score between 0 and 100),
  productivity numeric not null default 0 check (productivity between 0 and 100),
  quality numeric not null default 0 check (quality between 0 and 100),
  customer_satisfaction numeric not null default 0 check (customer_satisfaction between 0 and 100),
  teamwork numeric not null default 0 check (teamwork between 0 and 100),
  communication numeric not null default 0 check (communication between 0 and 100),
  overall_score numeric not null default 0 check (overall_score between 0 and 100),
  comments text,
  created_at timestamptz not null default now()
);

create index if not exists idx_performance_user on public.performance_reviews(user_id);

-- ============================================================================
-- 12. DOCUMENTS
-- ============================================================================

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in (
    'contract', 'payslip', 'certificate', 'employee_doc', 'hr_doc',
    'client_doc', 'corporate_doc', 'it_doc', 'report'
  )),
  file_url text not null,
  file_size bigint,
  mime_type text,
  owner_id uuid references public.profiles(id) on delete set null,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_documents_owner on public.documents(owner_id);
create index if not exists idx_documents_type on public.documents(type);

-- ============================================================================
-- 13. AUDIT LOGS
-- ============================================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  user_email text,
  action text not null,
  target text,
  target_type text,
  result text not null check (result in ('success', 'failure', 'denied')),
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_user on public.audit_logs(user_id);
create index if not exists idx_audit_logs_action on public.audit_logs(action);

-- ============================================================================
-- 14. PUBLIC INQUIRIES & CAREER APPLICATIONS
-- ============================================================================

create table if not exists public.public_inquiries (
  id uuid primary key default gen_random_uuid(),
  reference_no text not null unique,
  full_name text not null,
  email text not null,
  phone text,
  company text,
  subject text not null,
  message text not null,
  inquiry_type text not null,
  preferred_contact text not null default 'email' check (preferred_contact in (
    'email', 'phone', 'whatsapp'
  )),
  department text,
  attachment_url text,
  status text not null default 'new' check (status in (
    'new', 'in_progress', 'resolved', 'closed'
  )),
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_status on public.public_inquiries(status);

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  reference_no text not null unique,
  full_name text not null,
  email text not null,
  phone text not null,
  position text not null,
  experience text,
  cover_letter text,
  cv_url text,
  status text not null default 'new' check (status in (
    'new', 'reviewing', 'shortlisted', 'interviewed', 'hired', 'rejected'
  )),
  created_at timestamptz not null default now()
);

create index if not exists idx_applications_status on public.career_applications(status);

-- ============================================================================
-- 15. SYSTEM SETTINGS
-- ============================================================================

create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — Enable on ALL tables
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.teams enable row level security;
alter table public.attendance enable row level security;
alter table public.leave_requests enable row level security;
alter table public.payroll enable row level security;
alter table public.payslips enable row level security;
alter table public.contracts enable row level security;
alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.clients enable row level security;
alter table public.corporations enable row level security;
alter table public.it_assets enable row level security;
alter table public.notifications enable row level security;
alter table public.announcements enable row level security;
alter table public.tasks enable row level security;
alter table public.performance_reviews enable row level security;
alter table public.documents enable row level security;
alter table public.audit_logs enable row level security;
alter table public.public_inquiries enable row level security;
alter table public.career_applications enable row level security;
alter table public.system_settings enable row level security;

-- ============================================================================
-- SECURITY HELPER FUNCTIONS
-- ============================================================================

-- Check if current user is the protected Super Admin
-- NOTE: protected_email is hardcoded here (Supabase hosted doesn't allow ALTER DATABASE)
create or replace function public.is_super_admin()
returns boolean as $$
declare
  protected_email text := 'myne7x@gmail.com';
begin
  return exists (
    select 1 from auth.users
    where id = auth.uid() and lower(email) = lower(protected_email)
  );
end;
$$ language plpgsql security definer;

-- Get current user's role
create or replace function public.current_user_role()
returns text as $$
declare
  r text;
begin
  select role into r from public.profiles where id = auth.uid();
  return r;
end;
$$ language plpgsql security definer;

-- Check if user has a specific permission/role
create or replace function public.has_role(r text)
returns boolean as $$
begin
  return public.current_user_role() = r;
end;
$$ language plpgsql security definer;

-- Check if user is in a list of roles
create or replace function public.has_any_role(roles text[])
returns boolean as $$
begin
  return public.current_user_role() = any(roles);
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 🔒 CRITICAL: PROTECT THE SUPER ADMIN ACCOUNT
-- This trigger prevents anyone (including Admins) from modifying,
-- deleting, suspending, or changing the role of the protected Super Admin.
-- Only the Super Admin themselves can modify their own account.
-- ============================================================================

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
    -- Prevent role escalation to super_admin
    if TG_OP = 'UPDATE' and NEW.role = 'super_admin' and target_old_role != 'super_admin' then
      raise exception 'Access Denied — Only the protected Super Admin can grant Super Admin role.';
    end if;
  end if;

  -- For INSERT: prevent creating a new super_admin UNLESS it's the protected email
  if TG_OP = 'INSERT' and NEW.role = 'super_admin' and lower(NEW.email) != lower(protected_email) then
    raise exception 'Access Denied — Super Admin role can only be assigned to the protected email.';
  end if;

  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

drop trigger if exists protect_super_admin on public.profiles;
create trigger protect_super_admin
  before update or delete or insert on public.profiles
  for each row execute function public.prevent_super_admin_modification();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- ---- PROFILES ----
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Admins view all profiles" on public.profiles;
create policy "Admins view all profiles" on public.profiles
  for select using (
    public.is_super_admin() or
    public.has_any_role(array['admin', 'hr', 'team_leader', 'corporation', 'bi'])
  );

drop policy if exists "Users update own profile limited" on public.profiles;
create policy "Users update own profile limited" on public.profiles
  for update using (
    auth.uid() = id or public.is_super_admin() or
    public.has_any_role(array['admin', 'hr'])
  );

drop policy if exists "Super admin manages profiles" on public.profiles;
create policy "Super admin manages profiles" on public.profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "Admin HR create profiles" on public.profiles;
create policy "Admin HR create profiles" on public.profiles
  for insert with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

-- ---- DEPARTMENTS & TEAMS ----
drop policy if exists "Authenticated view departments" on public.departments;
create policy "Authenticated view departments" on public.departments
  for select using (auth.uid() is not null);

drop policy if exists "Super admin manages departments" on public.departments;
create policy "Super admin manages departments" on public.departments
  for all using (public.is_super_admin() or public.has_role('admin')) with check (public.is_super_admin() or public.has_role('admin'));

drop policy if exists "Authenticated view teams" on public.teams;
create policy "Authenticated view teams" on public.teams
  for select using (auth.uid() is not null);

drop policy if exists "Super admin manages teams" on public.teams;
create policy "Super admin manages teams" on public.teams
  for all using (public.is_super_admin() or public.has_role('admin')) with check (public.is_super_admin() or public.has_role('admin'));

-- ---- ATTENDANCE ----
drop policy if exists "Users view own attendance" on public.attendance;
create policy "Users view own attendance" on public.attendance
  for select using (
    auth.uid() = user_id or public.is_super_admin() or
    public.has_any_role(array['admin', 'hr', 'team_leader'])
  );

drop policy if exists "Admins manage attendance" on public.attendance;
create policy "Admins manage attendance" on public.attendance
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'team_leader'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'team_leader'])
  );

drop policy if exists "Users insert own attendance" on public.attendance;
create policy "Users insert own attendance" on public.attendance
  for insert with check (auth.uid() = user_id or public.is_super_admin() or public.has_any_role(array['admin', 'hr']));

-- ---- LEAVE REQUESTS ----
drop policy if exists "Users view own leave" on public.leave_requests;
create policy "Users view own leave" on public.leave_requests
  for select using (
    auth.uid() = user_id or public.is_super_admin() or
    public.has_any_role(array['admin', 'hr', 'team_leader'])
  );

drop policy if exists "Users create own leave" on public.leave_requests;
create policy "Users create own leave" on public.leave_requests
  for insert with check (auth.uid() = user_id);

drop policy if exists "Admins manage leave" on public.leave_requests;
create policy "Admins manage leave" on public.leave_requests
  for update using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'team_leader'])
  );

-- ---- PAYROLL ----
drop policy if exists "Users view own payroll" on public.payroll;
create policy "Users view own payroll" on public.payroll
  for select using (
    auth.uid() = user_id or public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

drop policy if exists "Admins manage payroll" on public.payroll;
create policy "Admins manage payroll" on public.payroll
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

-- ---- PAYSLIPS ----
drop policy if exists "Users view own payslips" on public.payslips;
create policy "Users view own payslips" on public.payslips
  for select using (
    auth.uid() = user_id or public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

drop policy if exists "Admins manage payslips" on public.payslips;
create policy "Admins manage payslips" on public.payslips
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

-- ---- CONTRACTS ----
drop policy if exists "Users view own contracts" on public.contracts;
create policy "Users view own contracts" on public.contracts
  for select using (
    auth.uid() = user_id or public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

drop policy if exists "Admins manage contracts" on public.contracts;
create policy "Admins manage contracts" on public.contracts
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

-- ---- SUPPORT TICKETS ----
-- Public can submit tickets (insert only)
drop policy if exists "Public submit tickets" on public.support_tickets;
create policy "Public submit tickets" on public.support_tickets
  for insert with check (true);

-- Authenticated users with manage perms can view all
drop policy if exists "Admins view all tickets" on public.support_tickets;
create policy "Admins view all tickets" on public.support_tickets
  for select using (
    public.is_super_admin() or
    public.has_any_role(array['admin', 'hr', 'it', 'client', 'corporation']) or
    user_id = auth.uid() or
    assigned_to = auth.uid()
  );

drop policy if exists "Admins manage tickets" on public.support_tickets;
create policy "Admins manage tickets" on public.support_tickets
  for update using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'it', 'client', 'corporation'])
  );

-- ---- TICKET MESSAGES ----
drop policy if exists "View ticket messages" on public.ticket_messages;
create policy "View ticket messages" on public.ticket_messages
  for select using (
    exists (
      select 1 from public.support_tickets t
      where t.id = ticket_id and (
        t.user_id = auth.uid() or t.assigned_to = auth.uid() or
        public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'it'])
      )
    )
  );

drop policy if exists "Authenticated send messages" on public.ticket_messages;
create policy "Authenticated send messages" on public.ticket_messages
  for insert with check (auth.uid() is not null or sender_id is null);

-- ---- CLIENTS ----
drop policy if exists "Admins manage clients" on public.clients;
create policy "Admins manage clients" on public.clients
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'client', 'corporation'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'client', 'corporation'])
  );

-- ---- CORPORATIONS ----
drop policy if exists "Admins manage corporations" on public.corporations;
create policy "Admins manage corporations" on public.corporations
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'corporation'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'corporation'])
  );

-- ---- IT ASSETS ----
drop policy if exists "IT manage assets" on public.it_assets;
create policy "IT manage assets" on public.it_assets
  for all using (
    public.is_super_admin() or public.has_any_role(array['it', 'admin'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['it', 'admin'])
  );

drop policy if exists "Users view own assets" on public.it_assets;
create policy "Users view own assets" on public.it_assets
  for select using (
    assigned_to = auth.uid() or public.is_super_admin() or public.has_any_role(array['it', 'admin', 'hr'])
  );

-- ---- NOTIFICATIONS ----
drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

drop policy if exists "System creates notifications" on public.notifications;
create policy "System creates notifications" on public.notifications
  for insert with check (true);

-- ---- ANNOUNCEMENTS ----
drop policy if exists "View published announcements" on public.announcements;
create policy "View published announcements" on public.announcements
  for select using (
    status = 'published' or public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements" on public.announcements
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

-- ---- TASKS ----
drop policy if exists "Users view own tasks" on public.tasks;
create policy "Users view own tasks" on public.tasks
  for select using (
    assigned_to = auth.uid() or assigned_by = auth.uid() or
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'team_leader'])
  );

drop policy if exists "Admins manage tasks" on public.tasks;
create policy "Admins manage tasks" on public.tasks
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'team_leader'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'team_leader'])
  );

-- ---- PERFORMANCE REVIEWS ----
drop policy if exists "Users view own reviews" on public.performance_reviews;
create policy "Users view own reviews" on public.performance_reviews
  for select using (
    user_id = auth.uid() or public.is_super_admin() or
    public.has_any_role(array['admin', 'hr', 'team_leader'])
  );

drop policy if exists "Admins manage reviews" on public.performance_reviews;
create policy "Admins manage reviews" on public.performance_reviews
  for all using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'team_leader'])
  ) with check (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'team_leader'])
  );

-- ---- DOCUMENTS ----
drop policy if exists "Users view own documents" on public.documents;
create policy "Users view own documents" on public.documents
  for select using (
    auth.uid() = owner_id or auth.uid() = uploaded_by or
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'it'])
  );

drop policy if exists "Admins manage documents" on public.documents;
create policy "Admins manage documents" on public.documents
  for insert with check (auth.uid() is not null);

drop policy if exists "Owners delete documents" on public.documents;
create policy "Owners delete documents" on public.documents
  for delete using (
    auth.uid() = uploaded_by or public.is_super_admin()
  );

-- ---- AUDIT LOGS — Super Admin only ----
drop policy if exists "Super admin view audit logs" on public.audit_logs;
create policy "Super admin view audit logs" on public.audit_logs
  for select using (public.is_super_admin());

drop policy if exists "System inserts audit logs" on public.audit_logs;
create policy "System inserts audit logs" on public.audit_logs
  for insert with check (true);

-- ---- PUBLIC INQUIRIES ----
drop policy if exists "Public submit inquiries" on public.public_inquiries;
create policy "Public submit inquiries" on public.public_inquiries
  for insert with check (true);

drop policy if exists "Admins view inquiries" on public.public_inquiries;
create policy "Admins view inquiries" on public.public_inquiries
  for select using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr', 'corporation', 'client'])
  );

drop policy if exists "Admins manage inquiries" on public.public_inquiries;
create policy "Admins manage inquiries" on public.public_inquiries
  for update using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

-- ---- CAREER APPLICATIONS ----
drop policy if exists "Public submit applications" on public.career_applications;
create policy "Public submit applications" on public.career_applications
  for insert with check (true);

drop policy if exists "HR view applications" on public.career_applications;
create policy "HR view applications" on public.career_applications
  for select using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

drop policy if exists "HR manage applications" on public.career_applications;
create policy "HR manage applications" on public.career_applications
  for update using (
    public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
  );

-- ---- SYSTEM SETTINGS ----
drop policy if exists "Authenticated view settings" on public.system_settings;
create policy "Authenticated view settings" on public.system_settings
  for select using (auth.uid() is not null);

drop policy if exists "Super admin manages settings" on public.system_settings;
create policy "Super admin manages settings" on public.system_settings
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- ============================================================================
-- STORAGE BUCKETS — Create via Supabase Dashboard (Storage → New Bucket)
-- All buckets must be PRIVATE (not public)
-- ============================================================================

-- Insert buckets (will create if storage.buckets table is accessible)
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', false),
  ('documents', 'documents', false),
  ('contracts', 'contracts', false),
  ('payslips', 'payslips', false),
  ('attachments', 'attachments', false),
  ('announcements', 'announcements', false)
on conflict (id) do nothing;

-- Storage Policies (avatars bucket)
drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users read avatars" on storage.objects;
create policy "Users read avatars" on storage.objects
  for select to authenticated using (
    bucket_id = 'avatars' and (
      auth.uid()::text = (storage.foldername(name))[1] or
      public.is_super_admin() or public.has_any_role(array['admin', 'hr'])
    )
  );

-- Storage Policies (documents bucket)
drop policy if exists "Authenticated upload documents" on storage.objects;
create policy "Authenticated upload documents" on storage.objects
  for insert to authenticated with check (
    bucket_id in ('documents', 'contracts', 'payslips', 'attachments', 'announcements')
  );

drop policy if exists "Users read documents" on storage.objects;
create policy "Users read documents" on storage.objects
  for select to authenticated using (
    bucket_id in ('documents', 'contracts', 'payslips', 'attachments', 'announcements')
  );

drop policy if exists "Owners delete documents" on storage.objects;
create policy "Owners delete documents" on storage.objects
  for delete to authenticated using (
    bucket_id in ('documents', 'contracts', 'payslips', 'attachments', 'announcements') and
    (public.is_super_admin() or auth.uid()::text = (storage.foldername(name))[1])
  );

-- ============================================================================
-- DONE — Schema is ready!
-- ============================================================================
--
-- NEXT STEPS:
-- 1. Create the Super Admin user in Supabase Dashboard → Authentication → Users
--    Email: myne7x@gmail.com
--    Set a strong password
--    The handle_new_user trigger will auto-create a profile with role = 'super_admin'
--
-- 2. (Optional) To change the protected email, edit the `protected_email` variable
--    in these 3 functions: handle_new_user(), is_super_admin(), prevent_super_admin_modification()
--    Then update VITE_SUPER_ADMIN_EMAIL in your .env file to match.
--    NOTE: Supabase hosted does NOT allow `ALTER DATABASE postgres set app.super_admin_email = ...`
--
-- 3. Verify by querying:
--    select * from public.profiles where email = 'myne7x@gmail.com';
--
-- 4. The frontend (.env) must have:
--    VITE_SUPER_ADMIN_EMAIL=myne7x@gmail.com
--
-- ============================================================================
