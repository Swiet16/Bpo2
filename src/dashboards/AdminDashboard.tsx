import { Link } from 'react-router-dom'
import {
  Users, Headphones, CalendarCheck, Wallet, Briefcase,
  LifeBuoy, FileText, UserPlus, ClipboardList, BarChart3,
  Building2, CalendarX,
} from 'lucide-react'
import { DashboardTemplate } from '@/components/DashboardTemplate'
import { ChartCard } from '@/components/ChartCard'
import { mockStats, recentActivities } from '@/lib/mockData'
import { timeAgo, statusColor, humanStatus } from '@/lib/utils'
import { Activity } from 'lucide-react'
import { motion } from 'framer-motion'

const basePath = '/admin'

export function AdminDashboard() {
  return (
    <DashboardTemplate
      title="Admin Dashboard"
      description="Business operations management center"
      icon={<Building2 className="h-5 w-5 text-brand-blue" />}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
      stats={[
        { label: 'Total Employees', value: mockStats.totalEmployees, icon: Users, accent: 'violet', delta: { value: '+12 this month', positive: true } },
        { label: 'Active Agents', value: mockStats.activeAgents, icon: Headphones, accent: 'cyan' },
        { label: 'Present Today', value: mockStats.presentToday, icon: CalendarCheck, accent: 'emerald' },
        { label: 'Pending Payroll', value: mockStats.pendingPayroll, icon: Wallet, accent: 'amber' },
        { label: 'Active Clients', value: mockStats.clients, icon: Briefcase, accent: 'blue' },
        { label: 'Open Tickets', value: mockStats.openTickets, icon: LifeBuoy, accent: 'rose' },
        { label: 'Active Contracts', value: mockStats.activeContracts, icon: FileText, accent: 'indigo' },
        { label: 'Absent Today', value: mockStats.absentToday, icon: CalendarX, accent: 'rose' },
      ]}
      quickActions={[
        { icon: UserPlus, label: 'Add Employee', href: `${basePath}/users`, accent: 'violet' },
        { icon: CalendarCheck, label: 'Attendance', href: `${basePath}/attendance`, accent: 'emerald' },
        { icon: Wallet, label: 'Payroll', href: `${basePath}/payroll`, accent: 'amber' },
        { icon: FileText, label: 'Contracts', href: `${basePath}/contracts`, accent: 'cyan' },
        { icon: LifeBuoy, label: 'Support', href: `${basePath}/support`, accent: 'rose' },
        { icon: ClipboardList, label: 'Tasks', href: `${basePath}/tasks`, accent: 'blue' },
      ]}
      charts={['employeeGrowth', 'attendanceTrend', 'ticketResolution']}
    >
      <ChartCard title="Recent Activity" description="Latest operations events">
        <div className="space-y-3">
          {recentActivities.slice(0, 5).map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <div className={`p-2 rounded-lg ${log.result === 'success' ? 'bg-emerald-500/15 text-emerald-400' : log.result === 'denied' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'}`}>
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  <span className="font-medium">{log.user_email}</span> · {log.action.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-slate-500">{log.target} · {timeAgo(log.created_at)}</p>
              </div>
              <span className={`badge ${statusColor(log.result)}`}>{humanStatus(log.result)}</span>
            </motion.div>
          ))}
        </div>
        <Link to={`${basePath}/activity`} className="mt-4 block text-center text-xs text-brand-violet hover:text-brand-purple">
          View all activity
        </Link>
      </ChartCard>
    </DashboardTemplate>
  )
}
