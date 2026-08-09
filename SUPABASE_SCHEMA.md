# MYNE7X BPO — Supabase Database Schema

This document describes the complete database requirements for the MYNE7X BPO platform.
Run these as SQL migrations in your Supabase SQL Editor.

## ⚠️ Critical Security Notes

1. **Protected Super Admin**: The account `myne7x@gmail.com` (configured via `VITE_SUPER_ADMIN_EMAIL`) must NEVER have its role modified, downgraded, or transferred by anyone except itself. This is enforced at the database level via triggers and RLS policies.

2. **Row Level Security (RLS)**: Enable RLS on ALL tables. Never expose private data via public policies.

3. **Service Role Key**: NEVER expose the `service_role` key in frontend code. Only the `anon` key is safe for frontend use.

4. **Storage Buckets**: All document storage buckets must be PRIVATE (not public). Access via signed URLs only.

---

## 1. Profiles Table

```sql
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

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  protected_email text := coalesce(current_setting('app.super_admin_email', true), 'myne7x@gmail.com');
  assigned_role text;
begin
  assigned_role := case
    when lower(new.email) = lower(protected_email) then 'super_admin'
    else 'agent'
  end;
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), assigned_role)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

---

## 2. Departments & Teams

```sql
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  head_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department_id uuid references public.departments(id),
  leader_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
```

---

## 3. Attendance

```sql
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

create index on public.attendance(user_id, date desc);
```

---

## 4. Leave Requests

```sql
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
  approver_id uuid references public.profiles(id),
  approver_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 5. Payroll & Payslips

```sql
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
```

---

## 6. Contracts

```sql
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
```

---

## 7. Support Tickets

```sql
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
  assigned_to uuid references public.profiles(id),
  attachment_url text,
  status text not null default 'new' check (status in (
    'new', 'assigned', 'in_progress', 'waiting', 'resolved', 'closed'
  )),
  is_public boolean not null default false,
  user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid references public.profiles(id),
  sender_name text not null,
  message text not null,
  attachment_url text,
  created_at timestamptz not null default now()
);
```

---

## 8. Clients & Corporations

```sql
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
```

---

## 9. IT Assets

```sql
create table if not exists public.it_assets (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null unique,
  type text not null check (type in (
    'laptop', 'desktop', 'monitor', 'keyboard', 'mouse', 'headset', 'phone', 'other'
  )),
  serial_number text not null unique,
  brand text,
  model text,
  assigned_to uuid references public.profiles(id),
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
```

---

## 10. Notifications, Announcements, Tasks

```sql
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
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id),
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
```

---

## 11. Performance Reviews

```sql
create table if not exists public.performance_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id),
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
```

---

## 12. Documents

```sql
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
  owner_id uuid references public.profiles(id),
  uploaded_by uuid not null references public.profiles(id),
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);
```

---

## 13. Audit Logs

```sql
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
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

create index on public.audit_logs(created_at desc);
```

---

## 14. Public Inquiries & Career Applications

```sql
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
```

---

## Row Level Security (RLS) Policies

Enable RLS on ALL tables, then apply these policies:

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.attendance enable row level security;
alter table public.leave_requests enable row level security;
alter table public.payroll enable row level security;
alter table public.payslips enable row level security;
alter table public.contracts enable row level security;
alter table public.support_tickets enable row level security;
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

-- Helper function to check if current user is super admin
create or replace function public.is_super_admin()
returns boolean as $$
declare
  protected_email text := coalesce(current_setting('app.super_admin_email', true), 'myne7x@gmail.com');
begin
  return exists (
    select 1 from auth.users
    where id = auth.uid() and lower(email) = lower(protected_email)
  );
end;
$$ language plpgsql security definer;

-- Helper to get current user's role
create or replace function public.current_user_role()
returns text as $$
declare
  r text;
begin
  select role into r from public.profiles where id = auth.uid();
  return r;
end;
$$ language plpgsql security definer;

-- Profiles: users can view their own profile; admins/HR can view all
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for select using (
    public.is_super_admin() or
    public.current_user_role() in ('admin', 'hr', 'team_leader', 'corporation', 'bi')
  );
create policy "Users can update own profile (limited)" on public.profiles
  for update using (
    auth.uid() = id or public.is_super_admin() or
    public.current_user_role() in ('admin', 'hr')
  );

-- CRITICAL: Prevent non-super-admins from modifying the protected super admin
create or replace function public.prevent_super_admin_modification()
returns trigger as $$
declare
  protected_email text := coalesce(current_setting('app.super_admin_email', true), 'myne7x@gmail.com');
  target_email text;
begin
  -- Allow super admin to do anything
  if public.is_super_admin() then return coalesce(NEW, OLD); end if;

  -- For updates, check if target is the protected super admin
  if TG_OP = 'UPDATE' or TG_OP = 'DELETE' then
    select email into target_email from public.profiles where id = OLD.id;
    if lower(target_email) = lower(protected_email) then
      raise exception 'Access Denied — This action requires Super Admin authorization.';
    end if;
    -- Also prevent role escalation to super_admin
    if NEW.role = 'super_admin' and OLD.role != 'super_admin' then
      raise exception 'Access Denied — Only the protected Super Admin can grant Super Admin role.';
    end if;
  end if;

  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

create trigger protect_super_admin
  before update or delete on public.profiles
  for each row execute function public.prevent_super_admin_modification();

-- Public tables (inquiries, career applications, support tickets) — allow public INSERT
create policy "Public can submit inquiries" on public.public_inquiries
  for insert with check (true);
create policy "Public can submit applications" on public.career_applications
  for insert with check (true);
create policy "Public can submit tickets" on public.support_tickets
  for insert with check (true);

-- Authenticated users can view published announcements
create policy "Authenticated view published announcements" on public.announcements
  for select using (
    status = 'published' or public.is_super_admin() or
    public.current_user_role() in ('admin', 'hr')
  );

-- Users can only view their own notifications
create policy "Users view own notifications" on public.notifications
  for select using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

-- Users can view their own attendance, payroll, payslips, contracts
create policy "Users view own attendance" on public.attendance
  for select using (auth.uid() = user_id or public.is_super_admin() or public.current_user_role() in ('admin', 'hr', 'team_leader'));
create policy "Users view own payroll" on public.payroll
  for select using (auth.uid() = user_id or public.is_super_admin() or public.current_user_role() in ('admin', 'hr'));
create policy "Users view own payslips" on public.payslips
  for select using (auth.uid() = user_id or public.is_super_admin() or public.current_user_role() in ('admin', 'hr'));
create policy "Users view own contracts" on public.contracts
  for select using (auth.uid() = user_id or public.is_super_admin() or public.current_user_role() in ('admin', 'hr'));

-- Documents: owner or authorized roles
create policy "Users view own documents" on public.documents
  for select using (
    auth.uid() = owner_id or auth.uid() = uploaded_by or
    public.is_super_admin() or public.current_user_role() in ('admin', 'hr', 'it')
  );

-- Audit logs: only super admin
create policy "Super admin view audit logs" on public.audit_logs
  for select using (public.is_super_admin());
```

---

## Storage Buckets

Create these PRIVATE buckets in Supabase Storage (Storage → New Bucket):

1. `avatars` — profile pictures (private)
2. `documents` — general documents (private)
3. `contracts` — contract PDFs (private)
4. `payslips` — payslip PDFs (private)
5. `attachments` — support ticket attachments (private)
6. `announcements` — announcement attachments (private)

### Storage Policies Example (avatars bucket):

```sql
-- Users can upload their own avatar
create policy "Users upload own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Users can read their own avatar; admins can read all
create policy "Users read avatars" on storage.objects
  for select using (
    bucket_id = 'avatars' and (
      auth.uid() = (storage.foldername(name))[1]::uuid or
      public.is_super_admin() or public.current_user_role() in ('admin', 'hr')
    )
  );
```

---

## Initial Super Admin Setup

1. In Supabase Auth → Users, create a user with email `myne7x@gmail.com`.
2. Set a strong password.
3. The `handle_new_user` trigger will auto-create a profile with `role = 'super_admin'`.
4. The user can now log in and has unrestricted access.

---

## Environment Configuration

After running the schema, set the `app.super_admin_email` setting in Supabase:

```sql
alter database postgres set app.super_admin_email = 'myne7x@gmail.com';
```

This makes the email configurable at the database level for the security triggers.
