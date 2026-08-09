/**
 * Mock data store for development & demo purposes.
 *
 * In production, the application reads/writes from Supabase.
 * These helpers provide realistic empty/fallback states so the UI
 * never breaks when the database is empty.
 *
 * NOTE: This is NOT a permanent data source. All mutations should
 * still attempt to write to Supabase first.
 */

import type {
  Profile, Attendance, Payslip, Contract, SupportTicket,
  Client, Corporation, ITAsset, Announcement, Notification,
  AuditLog, Task, PerformanceReview, LeaveRequest, Payroll,
  PublicInquiry, CareerApplication,
} from '@/types'

export const mockStats = {
  totalEmployees: 248,
  activeAgents: 184,
  teamLeaders: 18,
  hrMembers: 8,
  clients: 32,
  corporateAccounts: 14,
  presentToday: 221,
  absentToday: 27,
  pendingPayroll: 12,
  activeContracts: 196,
  openTickets: 23,
  pendingRequests: 9,
}

// Trend data for charts
export const employeeGrowthData = [
  { month: 'Jan', employees: 180 },
  { month: 'Feb', employees: 192 },
  { month: 'Mar', employees: 205 },
  { month: 'Apr', employees: 214 },
  { month: 'May', employees: 226 },
  { month: 'Jun', employees: 235 },
  { month: 'Jul', employees: 242 },
  { month: 'Aug', employees: 248 },
]

export const attendanceTrendData = [
  { day: 'Mon', present: 228, absent: 20, late: 12 },
  { day: 'Tue', present: 234, absent: 14, late: 8 },
  { day: 'Wed', present: 241, absent: 7, late: 5 },
  { day: 'Thu', present: 232, absent: 16, late: 14 },
  { day: 'Fri', present: 221, absent: 27, late: 18 },
  { day: 'Sat', present: 198, absent: 50, late: 6 },
  { day: 'Sun', present: 0, absent: 248, late: 0 },
]

export const salaryExpenditureData = [
  { month: 'Jan', amount: 18400000 },
  { month: 'Feb', amount: 19100000 },
  { month: 'Mar', amount: 19800000 },
  { month: 'Apr', amount: 20500000 },
  { month: 'May', amount: 21300000 },
  { month: 'Jun', amount: 22100000 },
  { month: 'Jul', amount: 22700000 },
  { month: 'Aug', amount: 23400000 },
]

export const departmentDistribution = [
  { name: 'Customer Support', value: 96, color: '#8b5cf6' },
  { name: 'Sales', value: 42, color: '#06b6d4' },
  { name: 'Technical', value: 38, color: '#3b82f6' },
  { name: 'HR', value: 8, color: '#f43f5e' },
  { name: 'IT', value: 12, color: '#f59e0b' },
  { name: 'Operations', value: 52, color: '#10b981' },
]

export const agentPerformanceData = [
  { name: 'Ali Raza', score: 94, target: 85 },
  { name: 'Sara Khan', score: 91, target: 85 },
  { name: 'Bilal Ahmed', score: 88, target: 85 },
  { name: 'Ayesha Malik', score: 96, target: 85 },
  { name: 'Usman Tariq', score: 82, target: 85 },
  { name: 'Hira Noor', score: 90, target: 85 },
]

export const monthlyRevenueData = [
  { month: 'Jan', revenue: 28500000, target: 26000000 },
  { month: 'Feb', revenue: 29200000, target: 26500000 },
  { month: 'Mar', revenue: 31000000, target: 27000000 },
  { month: 'Apr', revenue: 32400000, target: 27500000 },
  { month: 'May', revenue: 33800000, target: 28000000 },
  { month: 'Jun', revenue: 35100000, target: 28500000 },
  { month: 'Jul', revenue: 36400000, target: 29000000 },
  { month: 'Aug', revenue: 37900000, target: 29500000 },
]

export const ticketResolutionData = [
  { day: 'Mon', resolved: 14, created: 18 },
  { day: 'Tue', resolved: 22, created: 19 },
  { day: 'Wed', resolved: 19, created: 15 },
  { day: 'Thu', resolved: 25, created: 21 },
  { day: 'Fri', resolved: 18, created: 16 },
  { day: 'Sat', resolved: 8, created: 9 },
  { day: 'Sun', resolved: 3, created: 4 },
]

export const workforceUtilization = [
  { hour: '8 AM', utilization: 65 },
  { hour: '9 AM', utilization: 78 },
  { hour: '10 AM', utilization: 92 },
  { hour: '11 AM', utilization: 96 },
  { hour: '12 PM', utilization: 88 },
  { hour: '1 PM', utilization: 72 },
  { hour: '2 PM', utilization: 94 },
  { hour: '3 PM', utilization: 97 },
  { hour: '4 PM', utilization: 91 },
  { hour: '5 PM', utilization: 84 },
  { hour: '6 PM', utilization: 76 },
]

export const recentActivities: AuditLog[] = [
  {
    id: '1', user_email: 'myne7x@gmail.com', action: 'login',
    result: 'success', target: 'Dashboard', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2', user_email: 'hr@myne7x.com', action: 'payslip_created',
    result: 'success', target: 'Payslip PS-001234', created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: '3', user_email: 'admin@myne7x.com', action: 'user_created',
    result: 'success', target: 'agent@myne7x.com', created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: '4', user_email: 'it@myne7x.com', action: 'asset_assigned',
    result: 'success', target: 'Laptop LTP-0892', created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
  {
    id: '5', user_email: 'unknown@external.com', action: 'login_attempt',
    result: 'denied', target: 'myne7x@gmail.com', created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
]

export const sampleNotifications: Notification[] = [
  {
    id: '1', user_id: '', title: 'New support ticket',
    message: 'Ticket MYN-SUP-000128 submitted by Acme Corp',
    type: 'info', is_read: false, link: '/support',
    created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: '2', user_id: '', title: 'Contract expiring soon',
    message: 'Sara Khan\'s contract expires in 14 days',
    type: 'warning', is_read: false, link: '/contracts',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: '3', user_id: '', title: 'Payslip published',
    message: 'August 2025 payslips have been published for 248 employees',
    type: 'success', is_read: true, link: '/payslips',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4', user_id: '', title: 'Security alert',
    message: 'Multiple failed login attempts detected on admin account',
    type: 'critical', is_read: false, link: '/security-logs',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
]

export const emptyStateMessages = {
  payslips: 'No payslips available yet.',
  tickets: 'No support tickets found.',
  contracts: 'No contracts available.',
  employees: 'No employees found.',
  attendance: 'No attendance records available.',
  documents: 'No documents uploaded yet.',
  notifications: 'You\'re all caught up — no notifications.',
  reports: 'No reports generated yet.',
  tasks: 'No tasks assigned yet.',
  clients: 'No clients found.',
  corporations: 'No corporate accounts found.',
  assets: 'No IT assets registered.',
  announcements: 'No announcements available.',
  leave: 'No leave requests found.',
  applications: 'No career applications yet.',
  inquiries: 'No public inquiries yet.',
}
