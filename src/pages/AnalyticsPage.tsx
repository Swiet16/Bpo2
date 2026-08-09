import { useState } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Calendar, Filter, Download } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ChartCard } from '@/components/ChartCard'
import {
  monthlyRevenueData, attendanceTrendData, salaryExpenditureData,
  departmentDistribution, ticketResolutionData, workforceUtilization,
  employeeGrowthData,
} from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import toast from 'react-hot-toast'

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')
  const [dept, setDept] = useState('')

  return (
    <div className="space-y-6">
      <PageHeader
        title="BI Analytics"
        description="Advanced business intelligence & insights"
        icon={<BarChart3 className="h-5 w-5 text-brand-purple" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Analytics' }]}
        actions={
          <div className="flex gap-2">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input-field py-2 text-sm w-auto">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="input-field py-2 text-sm w-auto">
              <option value="">All Departments</option>
              <option>Customer Support</option>
              <option>Sales</option>
              <option>Technical</option>
              <option>HR</option>
              <option>IT</option>
            </select>
            <button onClick={() => toast.success('Analytics exported as CSV')} className="btn-primary">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Monthly Revenue" value={37} icon={DollarSign} accent="emerald" prefix="$" suffix="M" delta={{ value: '+18% QoQ', positive: true }} />
        <StatCard label="Active Employees" value={248} icon={Users} accent="violet" delta={{ value: '+12 this month', positive: true }} />
        <StatCard label="Avg Attendance" value={89} icon={Activity} accent="cyan" suffix="%" />
        <StatCard label="Productivity" value={87} icon={TrendingUp} accent="blue" suffix="%" delta={{ value: '+5% MoM', positive: true }} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend" description="Monthly revenue vs target">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="biRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} formatter={(v: any) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fill="url(#biRev)" />
              <Line type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Salary Expenditure" description="Monthly payroll cost">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salaryExpenditureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} formatter={(v: any) => formatCurrency(v)} />
              <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Department Distribution" description="Workforce by department">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={departmentDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {departmentDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ticket Analytics" description="Created vs resolved">
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
        </ChartCard>

        <ChartCard title="Workforce Utilization" description="Hourly utilization">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={workforceUtilization}>
              <defs>
                <linearGradient id="biUtil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} formatter={(v: any) => `${v}%`} />
              <Area type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={2} fill="url(#biUtil)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Employee Growth & Attendance" description="Combined workforce trends">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={employeeGrowthData}>
            <defs>
              <linearGradient id="biEmp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
            <Area type="monotone" dataKey="employees" stroke="#8b5cf6" strokeWidth={2} fill="url(#biEmp)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
