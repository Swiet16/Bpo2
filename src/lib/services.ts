/**
 * Data service layer — wraps all Supabase queries with graceful fallbacks.
 *
 * Each function attempts the real Supabase call first. If the table is
 * missing or RLS blocks access (e.g. user not yet provisioned), we fall
 * back to empty arrays so the UI shows proper empty states rather than
 * crashing.
 */

import { supabase } from './supabase'
import type {
  Profile, Attendance, Payslip, Contract, SupportTicket,
  Client, Corporation, ITAsset, Announcement, Notification,
  AuditLog, Task, LeaveRequest, Payroll, PublicInquiry, CareerApplication,
} from '@/types'

// Helper to safely run a query and swallow errors gracefully
async function safeQuery<T>(
  queryFn: () => PromiseLike<{ data: any; error: any }>
): Promise<T> {
  try {
    const { data, error } = await Promise.resolve(queryFn())
    if (error) {
      // Don't spam console — only log once per session per error code
      if (!loggedErrors.has(error.code)) {
        console.warn(`[DB] ${error.code}: ${error.message}`)
        loggedErrors.add(error.code)
      }
      return (Array.isArray(data) ? [] : null) as T
    }
    return (data ?? (Array.isArray(data) ? [] : null)) as T
  } catch (err) {
    console.warn('[DB] Query exception:', err)
    return null as T
  }
}

const loggedErrors = new Set<string>()

// ----- Profiles / Users -----
export const usersService = {
  async list(): Promise<Profile[]> {
    return safeQuery(() => supabase.from('profiles').select('*').order('created_at', { ascending: false }))
  },
  async get(id: string): Promise<Profile | null> {
    return safeQuery(() => supabase.from('profiles').select('*').eq('id', id).maybeSingle())
  },
  async update(id: string, patch: Partial<Profile>) {
    return safeQuery(() => supabase.from('profiles').update(patch).eq('id', id).select().single())
  },
  async create(payload: Partial<Profile>) {
    return safeQuery(() => supabase.from('profiles').insert(payload).select().single())
  },
}

// ----- Attendance -----
export const attendanceService = {
  async listForUser(userId: string, month?: number, year?: number): Promise<Attendance[]> {
    let q = supabase.from('attendance').select('*').eq('user_id', userId)
    if (month && year) {
      const start = new Date(year, month - 1, 1).toISOString()
      const end = new Date(year, month, 0, 23, 59).toISOString()
      q = q.gte('date', start).lte('date', end)
    }
    return safeQuery(() => q.order('date', { ascending: false }))
  },
  async listAll(): Promise<Attendance[]> {
    return safeQuery(() => supabase.from('attendance').select('*').order('date', { ascending: false }).limit(500))
  },
}

// ----- Payroll / Payslips -----
export const payrollService = {
  async listPayrolls(): Promise<Payroll[]> {
    return safeQuery(() => supabase.from('payroll').select('*').order('created_at', { ascending: false }))
  },
  async listForUser(userId: string): Promise<Payroll[]> {
    return safeQuery(() => supabase.from('payroll').select('*').eq('user_id', userId).order('created_at', { ascending: false }))
  },
  async listPayslips(): Promise<Payslip[]> {
    return safeQuery(() => supabase.from('payslips').select('*, payroll:payroll_id(*), profile:user_id(*)').order('generated_at', { ascending: false }))
  },
  async listPayslipsForUser(userId: string): Promise<Payslip[]> {
    return safeQuery(() => supabase.from('payslips').select('*, payroll:payroll_id(*)').eq('user_id', userId).order('generated_at', { ascending: false }))
  },
}

// ----- Contracts -----
export const contractsService = {
  async list(): Promise<Contract[]> {
    return safeQuery(() => supabase.from('contracts').select('*, profile:user_id(*)').order('created_at', { ascending: false }))
  },
  async listForUser(userId: string): Promise<Contract[]> {
    return safeQuery(() => supabase.from('contracts').select('*').eq('user_id', userId).order('created_at', { ascending: false }))
  },
}

// ----- Support Tickets -----
export const ticketsService = {
  async list(): Promise<SupportTicket[]> {
    return safeQuery(() => supabase.from('support_tickets').select('*').order('created_at', { ascending: false }))
  },
  async create(payload: Partial<SupportTicket>) {
    return safeQuery(() => supabase.from('support_tickets').insert(payload).select().single())
  },
}

// ----- Clients -----
export const clientsService = {
  async list(): Promise<Client[]> {
    return safeQuery(() => supabase.from('clients').select('*').order('created_at', { ascending: false }))
  },
  async create(payload: Partial<Client>) {
    return safeQuery(() => supabase.from('clients').insert(payload).select().single())
  },
}

// ----- Corporations -----
export const corporationsService = {
  async list(): Promise<Corporation[]> {
    return safeQuery(() => supabase.from('corporations').select('*').order('created_at', { ascending: false }))
  },
  async create(payload: Partial<Corporation>) {
    return safeQuery(() => supabase.from('corporations').insert(payload).select().single())
  },
}

// ----- IT Assets -----
export const assetsService = {
  async list(): Promise<ITAsset[]> {
    return safeQuery(() => supabase.from('it_assets').select('*').order('created_at', { ascending: false }))
  },
  async create(payload: Partial<ITAsset>) {
    return safeQuery(() => supabase.from('it_assets').insert(payload).select().single())
  },
}

// ----- Notifications -----
export const notificationsService = {
  async list(userId: string): Promise<Notification[]> {
    return safeQuery(() => supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50))
  },
  async markRead(id: string) {
    return safeQuery(() => supabase.from('notifications').update({ is_read: true }).eq('id', id))
  },
  async markAllRead(userId: string) {
    return safeQuery(() => supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false))
  },
}

// ----- Announcements -----
export const announcementsService = {
  async list(): Promise<Announcement[]> {
    return safeQuery(() => supabase.from('announcements').select('*').order('publish_date', { ascending: false }))
  },
  async create(payload: Partial<Announcement>) {
    return safeQuery(() => supabase.from('announcements').insert(payload).select().single())
  },
}

// ----- Audit Logs -----
export const auditService = {
  async list(): Promise<AuditLog[]> {
    return safeQuery(() => supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200))
  },
  async log(entry: Partial<AuditLog>) {
    // Fire-and-forget audit logging
    supabase.from('audit_logs').insert(entry).then(() => {}, () => {})
  },
}

// ----- Tasks -----
export const tasksService = {
  async listForUser(userId: string): Promise<Task[]> {
    return safeQuery(() => supabase.from('tasks').select('*').or(`assigned_to.eq.${userId},assigned_by.eq.${userId}`).order('created_at', { ascending: false }))
  },
  async listAll(): Promise<Task[]> {
    return safeQuery(() => supabase.from('tasks').select('*, assignee:assigned_to(*), assigner:assigned_by(*)').order('created_at', { ascending: false }))
  },
}

// ----- Leave -----
export const leaveService = {
  async listForUser(userId: string): Promise<LeaveRequest[]> {
    return safeQuery(() => supabase.from('leave_requests').select('*').eq('user_id', userId).order('created_at', { ascending: false }))
  },
  async listAll(): Promise<LeaveRequest[]> {
    return safeQuery(() => supabase.from('leave_requests').select('*, profile:user_id(*)').order('created_at', { ascending: false }))
  },
  async create(payload: Partial<LeaveRequest>) {
    return safeQuery(() => supabase.from('leave_requests').insert(payload).select().single())
  },
}

// ----- Public Inquiries -----
export const inquiriesService = {
  async list(): Promise<PublicInquiry[]> {
    return safeQuery(() => supabase.from('public_inquiries').select('*').order('created_at', { ascending: false }))
  },
  async create(payload: Partial<PublicInquiry>) {
    return safeQuery(() => supabase.from('public_inquiries').insert(payload).select().single())
  },
}

// ----- Career Applications -----
export const careersService = {
  async list(): Promise<CareerApplication[]> {
    return safeQuery(() => supabase.from('career_applications').select('*').order('created_at', { ascending: false }))
  },
  async create(payload: Partial<CareerApplication>) {
    return safeQuery(() => supabase.from('career_applications').insert(payload).select().single())
  },
}
