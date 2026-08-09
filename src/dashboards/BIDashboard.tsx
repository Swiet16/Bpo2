import {
  BarChart3, Users, TrendingUp, DollarSign, Activity,
  FileText, Download, Calendar, Target, Award,
} from 'lucide-react'
import { DashboardTemplate } from '@/components/DashboardTemplate'
import { ChartCard } from '@/components/ChartCard'
import { mockStats } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

const basePath = '/bi'

export function BIDashboard() {
  return (
    <DashboardTemplate
      title="Business Intelligence"
      description="Advanced analytics & insights dashboard"
      icon={<BarChart3 className="h-5 w-5 text-brand-purple" />}
      breadcrumbs={[{ label: 'BI' }, { label: 'Dashboard' }]}
      stats={[
        { label: 'Total Employees', value: mockStats.totalEmployees, icon: Users, accent: 'violet' },
        { label: 'Monthly Revenue', value: 37, icon: DollarSign, accent: 'emerald', prefix: '$', suffix: 'M' },
        { label: 'Avg Attendance', value: 89, icon: Activity, accent: 'cyan', suffix: '%' },
        { label: 'CSAT Score', value: 92, icon: Award, accent: 'amber', suffix: '%' },
        { label: 'Productivity Index', value: 87, icon: Target, accent: 'blue', suffix: '%' },
        { label: 'Open Tickets', value: mockStats.openTickets, icon: FileText, accent: 'rose' },
        { label: 'Growth Rate', value: 12, icon: TrendingUp, accent: 'indigo', suffix: '%' },
        { label: 'Reports Generated', value: 142, icon: FileText, accent: 'violet' },
      ]}
      quickActions={[
        { icon: FileText, label: 'Generate Report', href: `${basePath}/reports`, accent: 'violet' },
        { icon: Download, label: 'Export Data', href: `${basePath}/reports`, accent: 'emerald' },
        { icon: Calendar, label: 'Date Filter', href: `${basePath}/analytics`, accent: 'amber' },
        { icon: BarChart3, label: 'Analytics', href: `${basePath}/analytics`, accent: 'cyan' },
      ]}
      charts={['monthlyRevenue', 'employeeGrowth', 'salaryExpenditure', 'departmentDist', 'ticketResolution', 'workforceUtilization']}
    >
      <ChartCard title="Key Insights" description="AI-generated observations">
        <div className="space-y-3">
          {[
            { text: 'Revenue up 18% QoQ, driven by 3 new enterprise clients', tag: 'growth', color: 'emerald' },
            { text: 'Customer Support dept has highest utilization at 96%', tag: 'utilization', color: 'blue' },
            { text: 'Friday attendance drops 12% — consider shift incentives', tag: 'attendance', color: 'amber' },
            { text: 'Top performer Ayesha Malik exceeds target by 11%', tag: 'performance', color: 'violet' },
          ].map((i, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-lg bg-${i.color}-500/15 text-${i.color}-400`}>
                  <TrendingUp className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{i.text}</p>
                  <span className={`badge badge-${i.color} mt-1.5`}>{i.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Salary Analytics" description="Department-wise spend">
        <div className="space-y-3">
          {[
            { dept: 'Customer Support', amount: 8400000, color: 'violet' },
            { dept: 'Operations', amount: 5200000, color: 'cyan' },
            { dept: 'Sales', amount: 3800000, color: 'blue' },
            { dept: 'Technical', amount: 3200000, color: 'emerald' },
            { dept: 'IT', amount: 1400000, color: 'amber' },
          ].map((s) => (
            <div key={s.dept}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-300">{s.dept}</span>
                <span className="text-white font-medium">{formatCurrency(s.amount)}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-brand-${s.color} rounded-full`} style={{ width: `${(s.amount / 8400000) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </DashboardTemplate>
  )
}
