import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, UserCheck, Headphones, Shield, Building2, Briefcase, CalendarCheck,
  CalendarX, Wallet, FileText, LifeBuoy, ClipboardList,
  TrendingUp, Activity, AlertTriangle, Bell, ArrowRight, UserPlus, KeyRound,
  FileSignature, Megaphone, Search,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ChartCard, QuickAction } from '@/components/ChartCard'
import { EmptyState } from '@/components/EmptyState'
import {
  mockStats, employeeGrowthData, attendanceTrendData, salaryExpenditureData,
  departmentDistribution, agentPerformanceData, monthlyRevenueData,
  ticketResolutionData, workforceUtilization, recentActivities,
} from '@/lib/mockData'
import { timeAgo, statusColor, humanStatus, formatCurrency } from '@/lib/utils'
import { ROLES } from '@/types'

const basePath = '/super-admin'

export function SuperAdminDashboard() {
  const { profile } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const quickActions = [
    { icon: UserPlus, label: 'Add Employee', href: `${basePath}/users`, accent: 'violet' as const },
    { icon: KeyRound, label: 'Reset Password', href: `${basePath}/users`, accent: 'amber' as const },
    { icon: Shield, label: 'Change Role', href: `${basePath}/roles`, accent: 'blue' as const },
    { icon: Wallet, label: 'Generate Payslip', href: `${basePath}/payslips`, accent: 'emerald' as const },
    { icon: FileSignature, label: 'Create Contract', href: `${basePath}/contracts`, accent: 'cyan' as const },
    { icon: Megaphone, label: 'Announcement', href: `${basePath}/announcements`, accent: 'rose' as const },
    { icon: LifeBuoy, label: 'View Tickets', href: `${basePath}/support`, accent: 'amber' as const },
    { icon: FileText, label: 'Reports', href: `${basePath}/reports`, accent: 'violet' as const },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.full_name?.split(' ')[0] || 'CEO'}`}
        description={`MYNE7X BPO Command Center · ${currentTime.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
        icon={<Shield className="h-5 w-5 text-brand-violet" />}
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Dashboard' }]}
        actions={
          <Link to={`${basePath}/analytics`} className="btn-primary">
            <TrendingUp className="h-4 w-4" /> View Analytics
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={mockStats.totalEmployees} icon={Users} accent="violet" delta={{ value: '+12 this month', positive: true }} />
        <StatCard label="Active Agents" value={mockStats.activeAgents} icon={Headphones} accent="cyan" delta={{ value: '+8 this month', positive: true }} />
        <StatCard label="Team Leaders" value={mockStats.teamLeaders} icon={UserCheck} accent="blue" />
        <StatCard label="HR Members" value={mockStats.hrMembers} icon={Shield} accent="rose" />
        <StatCard label="Clients" value={mockStats.clients} icon={Briefcase} accent="emerald" delta={{ value: '+2 this month', positive: true }} />
        <StatCard label="Corporate Accounts" value={mockStats.corporateAccounts} icon={Building2} accent="indigo" />
        <StatCard label="Present Today" value={mockStats.presentToday} icon={CalendarCheck} accent="emerald" delta={{ value: '89% attendance', positive: true }} />
        <StatCard label="Absent Today" value={mockStats.absentToday} icon={CalendarX} accent="rose" />
        <StatCard label="Pending Payroll" value={mockStats.pendingPayroll} icon={Wallet} accent="amber" />
        <StatCard label="Active Contracts" value={mockStats.activeContracts} icon={FileText} accent="violet" />
        <StatCard label="Open Tickets" value={mockStats.openTickets} icon={LifeBuoy} accent="amber" />
        <StatCard label="Pending Requests" value={mockStats.pendingRequests} icon={ClipboardList} accent="cyan" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard
          title="Employee Growth"
          description="Monthly headcount trend"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={employeeGrowthData}>
              <defs>
                <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="employees" stroke="#8b5cf6" strokeWidth={2} fill="url(#empGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Distribution" description="Workforce breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={departmentDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {departmentDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Attendance Trend" description="Weekly attendance overview">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar dataKey="present" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="late" stackId="a" fill="#f59e0b" />
              <Bar dataKey="absent" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Revenue" description="Revenue vs target">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(v: any) => formatCurrency(v)}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fill="url(#revGrad)" />
              <Line type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 3 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Salary Expenditure" description="Monthly payroll trend" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={salaryExpenditureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(v: any) => formatCurrency(v)}
              />
              <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Workforce Utilization" description="Today's hourly utilization">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={workforceUtilization}>
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(v: any) => `${v}%`}
              />
              <Area type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={2} fill="url(#utilGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 4 + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Agent Performance" description="Top performers vs target" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={agentPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={100} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="target" fill="#475569" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quick Actions" description="CEO command shortcuts">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.href}>
                <QuickAction icon={a.icon} label={a.label} accent={a.accent} />
              </Link>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent activity + alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Recent Activity" description="Latest system events" className="lg:col-span-2">
          <div className="space-y-3">
            {recentActivities.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`p-2 rounded-lg ${log.result === 'success' ? 'bg-emerald-500/15 text-emerald-400' : log.result === 'denied' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'}`}>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{log.user_email}</span>
                    <span className="text-slate-400"> · {log.action.replace(/_/g, ' ')}</span>
                  </p>
                  <p className="text-xs text-slate-500 truncate">{log.target} · {timeAgo(log.created_at)}</p>
                </div>
                <span className={`badge ${statusColor(log.result)}`}>{humanStatus(log.result)}</span>
              </motion.div>
            ))}
          </div>
          <Link to={`${basePath}/activity`} className="mt-4 flex items-center justify-center gap-1 text-xs text-brand-violet hover:text-brand-purple">
            View all activity <ArrowRight className="h-3 w-3" />
          </Link>
        </ChartCard>

        <ChartCard title="Security Alerts" description="Recent security events">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-rose-300">Multiple failed logins</p>
                  <p className="text-xs text-slate-400 mt-0.5">5 attempts on admin@myne7x.com from unknown IP</p>
                  <p className="text-[10px] text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Bell className="h-4 w-4 text-amber-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-300">Contract expiring</p>
                  <p className="text-xs text-slate-400 mt-0.5">3 contracts expire within 14 days</p>
                  <p className="text-[10px] text-slate-500 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-300">Role change request</p>
                  <p className="text-xs text-slate-400 mt-0.5">HR requested elevation for 2 team members</p>
                  <p className="text-[10px] text-slate-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
          <Link to={`${basePath}/security-logs`} className="mt-4 flex items-center justify-center gap-1 text-xs text-brand-violet hover:text-brand-purple">
            View all alerts <ArrowRight className="h-3 w-3" />
          </Link>
        </ChartCard>
      </div>

      {/* Pending approvals */}
      <ChartCard title="Pending Approvals" description="Awaiting your review">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Leave Requests', count: 4, href: `${basePath}/leave`, icon: CalendarCheck, accent: 'cyan' as const },
            { label: 'Attendance Corrections', count: 2, href: `${basePath}/attendance`, icon: CalendarX, accent: 'amber' as const },
            { label: 'Payslip Approvals', count: 12, href: `${basePath}/payslips`, icon: Wallet, accent: 'emerald' as const },
            { label: 'Contract Reviews', count: 3, href: `${basePath}/contracts`, icon: FileText, accent: 'violet' as const },
          ].map((p) => (
            <Link key={p.label} to={p.href}>
              <motion.div whileHover={{ y: -2 }} className="premium-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p.icon className="h-5 w-5 text-brand-violet" />
                  <span className="text-2xl font-bold gradient-text">{p.count}</span>
                </div>
                <p className="text-sm text-slate-300">{p.label}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-brand-violet">
                  Review <ArrowRight className="h-3 w-3" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
