import {
  Users, CalendarCheck, Award, ClipboardList, UserCheck,
  Clock, CalendarX, TrendingUp, BarChart3,
} from 'lucide-react'
import { DashboardTemplate } from '@/components/DashboardTemplate'
import { ChartCard } from '@/components/ChartCard'
import { mockStats } from '@/lib/mockData'

const basePath = '/team-leader'

export function TeamLeaderDashboard() {
  return (
    <DashboardTemplate
      title="Team Leader Dashboard"
      description="Manage your team's performance, attendance, and tasks"
      icon={<UserCheck className="h-5 w-5 text-brand-teal" />}
      breadcrumbs={[{ label: 'Team Leader' }, { label: 'Dashboard' }]}
      stats={[
        { label: 'Team Members', value: 18, icon: Users, accent: 'violet' },
        { label: 'Present Today', value: 16, icon: CalendarCheck, accent: 'emerald' },
        { label: 'Absent Today', value: 2, icon: CalendarX, accent: 'rose' },
        { label: 'Late Today', value: 1, icon: Clock, accent: 'amber' },
        { label: 'Pending Tasks', value: 7, icon: ClipboardList, accent: 'cyan' },
        { label: 'Leave Requests', value: 3, icon: CalendarX, accent: 'amber' },
        { label: 'Avg Performance', value: 89, icon: Award, accent: 'blue', suffix: '%' },
        { label: 'Team CSAT', value: 92, icon: TrendingUp, accent: 'emerald', suffix: '%' },
      ]}
      quickActions={[
        { icon: Users, label: 'My Team', href: `${basePath}/users`, accent: 'violet' },
        { icon: ClipboardList, label: 'Assign Task', href: `${basePath}/tasks`, accent: 'cyan' },
        { icon: CalendarCheck, label: 'Attendance', href: `${basePath}/attendance`, accent: 'emerald' },
        { icon: Award, label: 'Performance', href: `${basePath}/performance`, accent: 'amber' },
      ]}
      charts={['attendanceTrend', 'agentPerformance']}
    >
      <ChartCard title="My Team" description="Top performers">
        <div className="space-y-3">
          {[
            { name: 'Ali Raza', score: 94, status: 'active' },
            { name: 'Sara Khan', score: 91, status: 'active' },
            { name: 'Bilal Ahmed', score: 88, status: 'active' },
            { name: 'Ayesha Malik', score: 96, status: 'active' },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center text-white text-xs font-semibold">
                {m.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{m.name}</p>
                <p className="text-xs text-slate-500">Score: {m.score}%</p>
              </div>
              <span className="badge-success">Active</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </DashboardTemplate>
  )
}
