import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ChartCard, QuickAction } from '@/components/ChartCard'
import {
  employeeGrowthData, attendanceTrendData, salaryExpenditureData,
  departmentDistribution, agentPerformanceData, monthlyRevenueData,
  ticketResolutionData, workforceUtilization, mockStats,
} from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface DashboardStat {
  label: string
  value: number
  icon: LucideIcon
  accent: 'violet' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo'
  delta?: { value: string; positive?: boolean }
  prefix?: string
  suffix?: string
}

interface DashboardProps {
  title: string
  description: string
  icon: ReactNode
  breadcrumbs?: { label: string }[]
  actions?: ReactNode
  stats: DashboardStat[]
  quickActions: { icon: LucideIcon; label: string; href: string; accent?: 'violet' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo' }[]
  charts?: ('employeeGrowth' | 'attendanceTrend' | 'salaryExpenditure' | 'departmentDist' | 'agentPerformance' | 'monthlyRevenue' | 'ticketResolution' | 'workforceUtilization')[]
  children?: ReactNode
}

const chartRenderers = {
  employeeGrowth: () => (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={employeeGrowthData}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
        <Area type="monotone" dataKey="employees" stroke="#8b5cf6" strokeWidth={2} fill="url(#g1)" />
      </AreaChart>
    </ResponsiveContainer>
  ),
  attendanceTrend: () => (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={attendanceTrendData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
        <Bar dataKey="present" stackId="a" fill="#10b981" />
        <Bar dataKey="late" stackId="a" fill="#f59e0b" />
        <Bar dataKey="absent" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  ),
  salaryExpenditure: () => (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={salaryExpenditureData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
        <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} formatter={(v: any) => formatCurrency(v)} />
        <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  ),
  departmentDist: () => (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={departmentDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
          {departmentDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
      </PieChart>
    </ResponsiveContainer>
  ),
  agentPerformance: () => (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={agentPerformanceData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" stroke="#64748b" fontSize={12} />
        <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={100} />
        <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
        <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        <Bar dataKey="target" fill="#475569" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  ),
  monthlyRevenue: () => (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={monthlyRevenueData}>
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
        <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} formatter={(v: any) => formatCurrency(v)} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
        <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fill="url(#g2)" />
        <Line type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
      </AreaChart>
    </ResponsiveContainer>
  ),
  ticketResolution: () => (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={ticketResolutionData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
        <Bar dataKey="created" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  ),
  workforceUtilization: () => (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={workforceUtilization}>
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
        <YAxis stroke="#64748b" fontSize={11} />
        <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} formatter={(v: any) => `${v}%`} />
        <Area type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={2} fill="url(#g3)" />
      </AreaChart>
    </ResponsiveContainer>
  ),
}

const chartTitles: Record<string, { title: string; description: string }> = {
  employeeGrowth: { title: 'Employee Growth', description: 'Monthly headcount trend' },
  attendanceTrend: { title: 'Attendance Trend', description: 'Weekly attendance overview' },
  salaryExpenditure: { title: 'Salary Expenditure', description: 'Monthly payroll trend' },
  departmentDist: { title: 'Department Distribution', description: 'Workforce breakdown' },
  agentPerformance: { title: 'Agent Performance', description: 'Top performers vs target' },
  monthlyRevenue: { title: 'Monthly Revenue', description: 'Revenue vs target' },
  ticketResolution: { title: 'Ticket Resolution', description: 'Tickets created vs resolved' },
  workforceUtilization: { title: 'Workforce Utilization', description: 'Hourly utilization today' },
}

export function DashboardTemplate({
  title, description, icon, breadcrumbs, actions, stats, quickActions, charts = [], children,
}: DashboardProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        icon={icon}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {charts.length > 0 && (
        <div className={`grid gap-6 ${charts.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {charts.map((c, i) => (
            <ChartCard
              key={c}
              title={chartTitles[c].title}
              description={chartTitles[c].description}
              className={i === 0 && charts.length >= 3 ? 'lg:col-span-2' : ''}
            >
              {chartRenderers[c]()}
            </ChartCard>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {children}
        <ChartCard title="Quick Actions" description="Common shortcuts">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <a key={a.label} href={a.href}>
                <QuickAction icon={a.icon} label={a.label} accent={a.accent} />
              </a>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
