import {
  Building2, Briefcase, Users, FileText, Handshake,
  TrendingUp, Mail, Phone, DollarSign,
} from 'lucide-react'
import { DashboardTemplate } from '@/components/DashboardTemplate'
import { ChartCard, InfoCard } from '@/components/ChartCard'
import { formatCurrency } from '@/lib/utils'

const basePath = '/corporation'

export function CorporationDashboard() {
  return (
    <DashboardTemplate
      title="Corporation Team Dashboard"
      description="Corporate relationship & account management"
      icon={<Building2 className="h-5 w-5 text-brand-indigo" />}
      breadcrumbs={[{ label: 'Corporation' }, { label: 'Dashboard' }]}
      stats={[
        { label: 'Corporate Clients', value: 14, icon: Building2, accent: 'indigo' },
        { label: 'Active Contracts', value: 32, icon: FileText, accent: 'violet' },
        { label: 'Pipeline Value', value: 142, icon: DollarSign, accent: 'emerald', prefix: '$', suffix: 'M' },
        { label: 'Active Projects', value: 18, icon: Briefcase, accent: 'cyan' },
        { label: 'Assigned Employees', value: 96, icon: Users, accent: 'blue' },
        { label: 'New This Month', value: 2, icon: TrendingUp, accent: 'amber' },
      ]}
      quickActions={[
        { icon: Building2, label: 'Add Corporate', href: `${basePath}/corporations`, accent: 'indigo' },
        { icon: FileText, label: 'Contracts', href: `${basePath}/contracts`, accent: 'violet' },
        { icon: Users, label: 'Assigned Team', href: `${basePath}/users`, accent: 'blue' },
        { icon: Handshake, label: 'Communications', href: `${basePath}/corporations`, accent: 'cyan' },
      ]}
      charts={['monthlyRevenue', 'employeeGrowth']}
    >
      <ChartCard title="Top Corporate Accounts" description="By contract value">
        <div className="space-y-3">
          {[
            { name: 'Acme Corp', value: 24, status: 'active' },
            { name: 'Globex Inc', value: 18, status: 'active' },
            { name: 'Initech LLC', value: 14, status: 'active' },
            { name: 'Umbrella Co', value: 9, status: 'prospect' },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-sm text-white">{c.name}</p>
                <p className="text-xs text-slate-500">{formatCurrency(c.value * 1000000)}/year</p>
              </div>
              <span className={c.status === 'active' ? 'badge-success' : 'badge-info'}>{c.status}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Quick Contact" description="Key account managers">
        <div className="space-y-3">
          <InfoCard label="Sales Director" value="Jane Cooper" icon={Users} />
          <InfoCard label="Email" value="corporate@myne7x.com" icon={Mail} />
          <InfoCard label="Phone" value="+92 21 111 696 379" icon={Phone} />
          <InfoCard label="Office Hours" value="9 AM – 9 PM PKT" icon={Briefcase} />
        </div>
      </ChartCard>
    </DashboardTemplate>
  )
}
