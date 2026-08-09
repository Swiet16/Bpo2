// Core application types for MYNE7X BPO Platform

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'agent'
  | 'team_leader'
  | 'hr'
  | 'it'
  | 'corporation'
  | 'client'
  | 'bi'

export interface RoleInfo {
  id: UserRole
  label: string
  description: string
  color: string
  dashboardPath: string
}

export const ROLES: Record<UserRole, RoleInfo> = {
  super_admin: {
    id: 'super_admin',
    label: 'Super Admin',
    description: 'CEO — Unrestricted platform authority',
    color: 'violet',
    dashboardPath: '/super-admin',
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Business operations manager',
    color: 'blue',
    dashboardPath: '/admin',
  },
  agent: {
    id: 'agent',
    label: 'Agent',
    description: 'Frontline support agent',
    color: 'cyan',
    dashboardPath: '/agent',
  },
  team_leader: {
    id: 'team_leader',
    label: 'Team Leader',
    description: 'Manages assigned agents',
    color: 'teal',
    dashboardPath: '/team-leader',
  },
  hr: {
    id: 'hr',
    label: 'HR',
    description: 'Human Resources management',
    color: 'rose',
    dashboardPath: '/hr',
  },
  it: {
    id: 'it',
    label: 'IT Team',
    description: 'IT operations & assets',
    color: 'amber',
    dashboardPath: '/it',
  },
  corporation: {
    id: 'corporation',
    label: 'Corporation Team',
    description: 'Corporate client relationships',
    color: 'indigo',
    dashboardPath: '/corporation',
  },
  client: {
    id: 'client',
    label: 'Client Team',
    description: 'Client management',
    color: 'emerald',
    dashboardPath: '/client-team',
  },
  bi: {
    id: 'bi',
    label: 'BI Team',
    description: 'Business Intelligence & analytics',
    color: 'purple',
    dashboardPath: '/bi',
  },
}

export type Permission =
  | 'view_users' | 'create_users' | 'edit_users' | 'delete_users'
  | 'reset_password' | 'change_roles' | 'manage_attendance'
  | 'manage_payroll' | 'manage_payslips' | 'manage_contracts'
  | 'manage_clients' | 'manage_corporations' | 'manage_support'
  | 'manage_it' | 'manage_bi' | 'manage_documents'
  | 'export_reports' | 'view_security_logs' | 'manage_settings'
  | 'manage_announcements' | 'manage_leave' | 'manage_performance'
  | 'manage_tasks' | 'view_all_employees' | 'view_own_data'
  | 'manage_assets' | 'manage_tickets' | 'view_analytics'
  | 'force_password_change' | 'view_audit_logs'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'view_users', 'create_users', 'edit_users', 'delete_users',
    'reset_password', 'change_roles', 'manage_attendance',
    'manage_payroll', 'manage_payslips', 'manage_contracts',
    'manage_clients', 'manage_corporations', 'manage_support',
    'manage_it', 'manage_bi', 'manage_documents',
    'export_reports', 'view_security_logs', 'manage_settings',
    'manage_announcements', 'manage_leave', 'manage_performance',
    'manage_tasks', 'view_all_employees', 'view_own_data',
    'manage_assets', 'manage_tickets', 'view_analytics',
    'force_password_change', 'view_audit_logs',
  ],
  admin: [
    'view_users', 'create_users', 'edit_users', 'manage_attendance',
    'manage_payroll', 'manage_payslips', 'manage_contracts',
    'manage_clients', 'manage_support', 'manage_documents',
    'export_reports', 'manage_announcements', 'manage_leave',
    'manage_tasks', 'view_all_employees', 'manage_tickets',
    'view_own_data',
  ],
  hr: [
    'view_users', 'create_users', 'edit_users', 'manage_attendance',
    'manage_payroll', 'manage_payslips', 'manage_contracts',
    'manage_documents', 'export_reports', 'manage_announcements',
    'manage_leave', 'manage_performance', 'view_all_employees',
    'view_own_data',
  ],
  team_leader: [
    'view_users', 'manage_attendance', 'manage_tasks',
    'manage_leave', 'manage_performance', 'view_own_data',
    'view_all_employees',
  ],
  it: [
    'view_users', 'manage_assets', 'manage_tickets', 'manage_it',
    'manage_support', 'view_own_data', 'export_reports',
  ],
  corporation: [
    'manage_corporations', 'manage_clients', 'manage_documents',
    'view_own_data', 'export_reports', 'view_all_employees',
  ],
  client: [
    'manage_clients', 'manage_documents', 'view_own_data',
    'export_reports',
  ],
  bi: [
    'view_analytics', 'view_all_employees', 'export_reports',
    'view_own_data',
  ],
  agent: [
    'view_own_data',
  ],
}

export interface Profile {
  id: string
  email: string
  full_name: string
  username?: string | null
  phone?: string | null
  employee_id?: string | null
  role: UserRole
  department?: string | null
  team?: string | null
  team_leader_id?: string | null
  job_title?: string | null
  employment_status: 'active' | 'suspended' | 'terminated' | 'on_leave'
  employment_type?: 'permanent' | 'contract' | 'intern' | 'probation' | null
  joining_date?: string | null
  date_of_birth?: string | null
  emergency_contact?: string | null
  avatar_url?: string | null
  must_change_password?: boolean
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  description?: string | null
  head_id?: string | null
  created_at: string
}

export interface Team {
  id: string
  name: string
  department_id?: string | null
  leader_id?: string | null
  created_at: string
}

export interface Attendance {
  id: string
  user_id: string
  date: string
  check_in?: string | null
  check_out?: string | null
  status: 'present' | 'absent' | 'late' | 'leave' | 'holiday' | 'half_day'
  working_hours?: number | null
  late_minutes?: number | null
  notes?: string | null
  created_at: string
}

export interface LeaveRequest {
  id: string
  user_id: string
  leave_type: 'casual' | 'sick' | 'annual' | 'unpaid' | 'maternity' | 'emergency'
  start_date: string
  end_date: string
  reason: string
  attachment_url?: string | null
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  approver_id?: string | null
  approver_notes?: string | null
  created_at: string
  updated_at: string
}

export interface Payroll {
  id: string
  user_id: string
  pay_period_month: number
  pay_period_year: number
  basic_salary: number
  allowances: number
  bonuses: number
  overtime: number
  deductions: number
  tax: number
  advances: number
  other_deductions: number
  net_salary: number
  payment_status: 'pending' | 'processed' | 'paid' | 'failed'
  payment_date?: string | null
  created_at: string
  updated_at: string
}

export interface Payslip {
  id: string
  reference_no: string
  payroll_id: string
  user_id: string
  status: 'draft' | 'approved' | 'published' | 'archived'
  generated_at: string
  published_at?: string | null
}

export interface Contract {
  id: string
  user_id: string
  position: string
  department?: string | null
  start_date: string
  end_date?: string | null
  salary: number
  working_hours: string
  work_location?: string | null
  employment_type: 'permanent' | 'contract' | 'intern' | 'probation'
  responsibilities?: string | null
  benefits?: string | null
  confidentiality?: string | null
  termination_conditions?: string | null
  status: 'draft' | 'pending_approval' | 'active' | 'expiring_soon' | 'expired' | 'terminated'
  created_at: string
  updated_at: string
}

export interface SupportTicket {
  id: string
  ticket_no: string
  full_name: string
  email: string
  phone?: string | null
  company?: string | null
  category: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  preferred_contact: 'email' | 'phone' | 'whatsapp'
  department?: string | null
  assigned_to?: string | null
  attachment_url?: string | null
  status: 'new' | 'assigned' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
  is_public: boolean
  user_id?: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  service: string
  assigned_team?: string | null
  contract_start?: string | null
  contract_end?: string | null
  status: 'active' | 'inactive' | 'prospect' | 'churned'
  notes?: string | null
  logo_url?: string | null
  created_at: string
  updated_at: string
}

export interface Corporation {
  id: string
  company_name: string
  industry?: string | null
  contact_person: string
  email: string
  phone: string
  address?: string | null
  contract_value?: number | null
  assigned_services?: string | null
  account_status: 'active' | 'inactive' | 'prospect' | 'suspended'
  notes?: string | null
  logo_url?: string | null
  created_at: string
  updated_at: string
}

export interface ITAsset {
  id: string
  asset_id: string
  type: 'laptop' | 'desktop' | 'monitor' | 'keyboard' | 'mouse' | 'headset' | 'phone' | 'other'
  serial_number: string
  brand?: string | null
  model?: string | null
  assigned_to?: string | null
  department?: string | null
  issue_date?: string | null
  return_date?: string | null
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor' | 'damaged'
  status: 'in_stock' | 'assigned' | 'returned' | 'under_repair' | 'retired'
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'critical'
  is_read: boolean
  link?: string | null
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  message: string
  audience: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  publish_date: string
  expiry_date?: string | null
  attachment_url?: string | null
  status: 'draft' | 'published' | 'archived'
  created_by: string
  created_at: string
}

export interface AuditLog {
  id: string
  user_id?: string | null
  user_email?: string | null
  action: string
  target?: string | null
  target_type?: string | null
  result: 'success' | 'failure' | 'denied'
  ip_address?: string | null
  user_agent?: string | null
  metadata?: Record<string, unknown> | null
  created_at: string
}

export interface Task {
  id: string
  title: string
  description?: string | null
  assigned_to: string
  assigned_by: string
  due_date?: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
  created_at: string
  updated_at: string
}

export interface PerformanceReview {
  id: string
  user_id: string
  reviewer_id: string
  review_period: string
  attendance_score: number
  productivity: number
  quality: number
  customer_satisfaction: number
  teamwork: number
  communication: number
  overall_score: number
  comments?: string | null
  created_at: string
}

export interface DocumentRecord {
  id: string
  name: string
  type: 'contract' | 'payslip' | 'certificate' | 'employee_doc' | 'hr_doc' | 'client_doc' | 'corporate_doc' | 'it_doc' | 'report'
  file_url: string
  file_size?: number | null
  mime_type?: string | null
  owner_id?: string | null
  uploaded_by: string
  is_private: boolean
  created_at: string
}

export interface PublicInquiry {
  id: string
  reference_no: string
  full_name: string
  email: string
  phone?: string | null
  company?: string | null
  subject: string
  message: string
  inquiry_type: string
  preferred_contact: 'email' | 'phone' | 'whatsapp'
  department?: string | null
  attachment_url?: string | null
  status: 'new' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
}

export interface CareerApplication {
  id: string
  reference_no: string
  full_name: string
  email: string
  phone: string
  position: string
  experience?: string | null
  cover_letter?: string | null
  cv_url?: string | null
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected'
  created_at: string
}
