import {
  Briefcase, Users, FileText, LifeBuoy, TrendingUp,
  Mail, Phone, Building2, ClipboardList,
} from 'lucide-react'
import { DashboardTemplate } from '@/components/DashboardTemplate'
import { ChartCard, InfoCard } from '@/components/ChartCard'

const basePath = '/client-team'

export function ClientDashboard() {
  return (
    <DashboardTemplate
      title="Client Team Dashboard"
      description="Client management & service delivery"
      icon={<Briefcase className="h-5 w-5 text-brand-emerald" />}
      breadcrumbs={[{ label: 'Client Team' }, { label: 'Dashboard' }]}
      stats={[
        { label: 'Active Clients', value: 32, icon: Briefcase, accent: 'emerald' },
        { label: 'Open Tickets', value: 23, icon: LifeBuoy, accent: 'amber' },
        { label: 'Active Projects', value: 24, icon: ClipboardList, accent: 'violet' },
        { label: 'Assigned Team', value: 96, icon: Users, accent: 'blue' },
        { label: 'Pending Requests', value: 9, icon: Mail, accent: 'rose' },
        { label: 'Resolved Today', value: 14, icon: TrendingUp, accent: 'emerald' },
      ]}
      quickActions={[
        { icon: Briefcase, label: 'Add Client', href: `${basePath}/clients`, accent: 'emerald' },
        { icon: LifeBuoy, label: 'Tickets', href: `${basePath}/support`, accent: 'amber' },
        { icon: FileText, label: 'Documents', href: `${basePath}/documents`, accent: 'violet' },
        { icon: Users, label: 'Team', href: `${basePath}/users`, accent: 'blue' },
      ]}
      charts={['ticketResolution', 'monthlyRevenue']}
    >
      <ChartCard title="Top Clients" description="By ticket volume">
        <div className="space-y-3">
          {[
            { name: 'Acme Corp', tickets: 8, status: 'active' },
            { name: 'Globex Inc', tickets: 5, status: 'active' },
            { name: 'Initech LLC', tickets: 4, status: 'active' },
            { name: 'Stark Industries', tickets: 3, status: 'active' },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-emerald to-brand-cyan flex items-center justify-center text-white text-xs font-semibold">
                  {c.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm text-white">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.tickets} open tickets</p>
                </div>
              </div>
              <span className="badge-success">Active</span>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Client Services" description="Active service lines">
        <div className="space-y-3">
          <InfoCard label="Customer Support" value="18 active clients" icon={LifeBuoy} />
          <InfoCard label="IT Operations" value="8 active clients" icon={Briefcase} />
          <InfoCard label="Back Office" value="6 active clients" icon={ClipboardList} />
          <InfoCard label="Total SLA Compliance" value="98.4%" icon={TrendingUp} />
        </div>
      </ChartCard>
    </DashboardTemplate>
  )
}
