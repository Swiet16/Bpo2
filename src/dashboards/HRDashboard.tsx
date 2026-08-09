import { Link } from 'react-router-dom'
import {
  Users, CalendarCheck, Wallet, FileText, UserPlus, ClipboardList,
  Award, FolderOpen, LifeBuoy, Megaphone, Building2, CalendarX,
  Briefcase, Clock, Activity,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { DashboardTemplate } from '@/components/DashboardTemplate'
import { ChartCard } from '@/components/ChartCard'
import { mockStats, recentActivities } from '@/lib/mockData'
import { timeAgo, statusColor, humanStatus } from '@/lib/utils'

const basePath = '/hr'

export function HRDashboard() {
  return (
    <DashboardTemplate
      title="HR Dashboard"
      description="Workforce management & human resources operations"
      icon={<Users className="h-5 w-5 text-brand-rose" />}
      breadcrumbs={[{ label: 'HR' }, { label: 'Dashboard' }]}
      stats={[
        { label: 'Total Employees', value: mockStats.totalEmployees, icon: Users, accent: 'violet', delta: { value: '+12 this month', positive: true } },
        { label: 'Present Today', value: mockStats.presentToday, icon: CalendarCheck, accent: 'emerald' },
        { label: 'On Leave', value: 8, icon: CalendarX, accent: 'amber' },
        { label: 'Pending Leave', value: 4, icon: Clock, accent: 'rose' },
        { label: 'Pending Payroll', value: mockStats.pendingPayroll, icon: Wallet, accent: 'amber' },
        { label: 'Active Contracts', value: mockStats.activeContracts, icon: FileText, accent: 'cyan' },
        { label: 'New Hires', value: 12, icon: UserPlus, accent: 'blue', delta: { value: 'This month', positive: true } },
        { label: 'Open Positions', value: 6, icon: Briefcase, accent: 'indigo' },
      ]}
      quickActions={[
        { icon: UserPlus, label: 'Add Employee', href: `${basePath}/users`, accent: 'violet' },
        { icon: CalendarCheck, label: 'Attendance', href: `${basePath}/attendance`, accent: 'emerald' },
        { icon: Wallet, label: 'Payroll', href: `${basePath}/payroll`, accent: 'amber' },
        { icon: FileText, label: 'Payslips', href: `${basePath}/payslips`, accent: 'cyan' },
        { icon: FileText, label: 'Contracts', href: `${basePath}/contracts`, accent: 'blue' },
        { icon: Award, label: 'Performance', href: `${basePath}/performance`, accent: 'rose' },
      ]}
      charts={['employeeGrowth', 'attendanceTrend', 'departmentDist']}
    >
      <ChartCard title="Pending HR Tasks" description="Awaiting your action">
        <div className="space-y-3">
          {[
            { label: 'Leave requests to approve', count: 4, href: `${basePath}/leave`, color: 'amber' },
            { label: 'Attendance corrections', count: 2, href: `${basePath}/attendance`, color: 'rose' },
            { label: 'Payslips to publish', count: 12, href: `${basePath}/payslips`, color: 'emerald' },
            { label: 'Contracts to review', count: 3, href: `${basePath}/contracts`, color: 'violet' },
          ].map((t) => (
            <Link key={t.label} to={t.href}>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-violet/30 transition-colors">
                <span className="text-sm text-slate-300">{t.label}</span>
                <span className={`badge badge-${t.color}`}>{t.count} pending</span>
              </div>
            </Link>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Recent Activity" description="Latest HR events">
        <div className="space-y-3">
          {recentActivities.slice(0, 4).map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <div className={`p-2 rounded-lg ${log.result === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{log.action.replace(/_/g, ' ')}</p>
                <p className="text-xs text-slate-500">{log.target} · {timeAgo(log.created_at)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ChartCard>
    </DashboardTemplate>
  )
}
