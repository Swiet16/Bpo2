import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, Wallet, FileText, ClipboardList, FolderOpen, Bell,
  CheckCircle, Clock, TrendingUp, User, CalendarCheck, CalendarX,
  LifeBuoy, Award,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ChartCard, InfoCard } from '@/components/ChartCard'
import { useAuth } from '@/contexts/AuthContext'
import { attendanceTrendData } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const basePath = '/agent'

export function AgentDashboard() {
  const { profile } = useAuth()
  const today = new Date()
  const monthName = today.toLocaleString('en-US', { month: 'long' })

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${profile?.full_name?.split(' ')[0] || 'Agent'}`}
        description={`Welcome back to your dashboard · ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`}
        icon={<User className="h-5 w-5 text-brand-cyan" />}
        breadcrumbs={[{ label: 'Agent' }, { label: 'Dashboard' }]}
        actions={
          <Link to={`${basePath}/support-center`} className="btn-primary">
            <LifeBuoy className="h-4 w-4" /> Get Help
          </Link>
        }
      />

      {/* Personal stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Present Days" value={18} icon={CalendarCheck} accent="emerald" delta={{ value: 'This month', positive: true }} />
        <StatCard label="Absent Days" value={2} icon={CalendarX} accent="rose" />
        <StatCard label="Late Days" value={1} icon={Clock} accent="amber" />
        <StatCard label="Leave Days" value={1} icon={Calendar} accent="blue" />
      </div>

      {/* Today's attendance + Quick links */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Today's Attendance" description={formatDate(today)}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-white">Checked In</span>
              </div>
              <span className="font-mono text-sm text-emerald-300">09:02 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Check Out</span>
              </div>
              <span className="font-mono text-sm text-slate-400">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Working Hours</span>
              </div>
              <span className="font-mono text-sm text-slate-300">4h 32m</span>
            </div>
            <button className="btn-primary w-full">
              <Clock className="h-4 w-4" /> Check Out Now
            </button>
          </div>
        </ChartCard>

        <ChartCard title="Quick Links" description="Common shortcuts">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Wallet, label: 'My Salary', href: `${basePath}/salary` },
              { icon: FileText, label: 'Payslips', href: `${basePath}/payslips` },
              { icon: FileText, label: 'Contracts', href: `${basePath}/contracts` },
              { icon: ClipboardList, label: 'My Tasks', href: `${basePath}/tasks` },
              { icon: FolderOpen, label: 'Documents', href: `${basePath}/documents` },
              { icon: Award, label: 'Performance', href: `${basePath}/performance` },
            ].map((q) => (
              <Link key={q.label} to={q.href}>
                <motion.button
                  whileHover={{ y: -2 }}
                  className="w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-violet/30 transition-all"
                >
                  <q.icon className="h-4 w-4 text-brand-violet" />
                  <span className="text-xs text-slate-300">{q.label}</span>
                </motion.button>
              </Link>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="My Info" description="Employment details">
          <div className="space-y-3">
            <InfoCard label="Employee ID" value={profile?.employee_id || 'MYN-EMP-0128'} icon={User} />
            <InfoCard label="Department" value={profile?.department || 'Customer Support'} icon={ClipboardList} />
            <InfoCard label="Joining Date" value={formatDate(profile?.joining_date || '2023-03-15')} icon={Calendar} />
            <InfoCard label="Status" value="Active" icon={CheckCircle} />
          </div>
        </ChartCard>
      </div>

      {/* Attendance trend + Announcements */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="My Attendance" description="Last 7 days" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={attendanceTrendData}>
              <defs>
                <linearGradient id="agentAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="present" stroke="#06b6d4" strokeWidth={2} fill="url(#agentAtt)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Announcements" description="Recent updates">
          <div className="space-y-3">
            {[
              { title: 'August payslips published', time: '2h ago', priority: 'success' },
              { title: 'Team meeting on Friday', time: '1d ago', priority: 'info' },
              { title: 'New shift schedule', time: '2d ago', priority: 'warning' },
            ].map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-start gap-2">
                  <Bell className="h-4 w-4 text-brand-violet mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Performance snapshot */}
      <ChartCard title="My Performance Snapshot" description={`${monthName} ${today.getFullYear()}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Attendance Score', value: 92, color: 'text-emerald-400', bar: 'bg-emerald-500' },
            { label: 'Productivity', value: 88, color: 'text-blue-400', bar: 'bg-blue-500' },
            { label: 'Quality Score', value: 95, color: 'text-violet-400', bar: 'bg-violet-500' },
            { label: 'CSAT', value: 90, color: 'text-cyan-400', bar: 'bg-cyan-500' },
          ].map((p) => (
            <div key={p.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">{p.label}</p>
              <p className={`text-2xl font-bold ${p.color}`}>{p.value}%</p>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${p.bar} rounded-full transition-all`} style={{ width: `${p.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
