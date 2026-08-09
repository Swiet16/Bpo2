import {
  Cpu, LifeBuoy, Users, ClipboardList, HardDrive, Monitor,
  Headphones, Smartphone, Wrench, ShieldCheck, AlertTriangle,
} from 'lucide-react'
import { DashboardTemplate } from '@/components/DashboardTemplate'
import { ChartCard } from '@/components/ChartCard'

const basePath = '/it'

export function ITDashboard() {
  return (
    <DashboardTemplate
      title="IT Team Dashboard"
      description="IT operations, assets, and support ticketing"
      icon={<Cpu className="h-5 w-5 text-brand-amber" />}
      breadcrumbs={[{ label: 'IT' }, { label: 'Dashboard' }]}
      stats={[
        { label: 'Total Assets', value: 312, icon: HardDrive, accent: 'violet' },
        { label: 'Assigned Assets', value: 248, icon: Monitor, accent: 'blue' },
        { label: 'In Stock', value: 47, icon: Cpu, accent: 'cyan' },
        { label: 'Under Repair', value: 17, icon: Wrench, accent: 'amber' },
        { label: 'Open Tickets', value: 23, icon: LifeBuoy, accent: 'rose' },
        { label: 'Resolved Today', value: 14, icon: ShieldCheck, accent: 'emerald' },
        { label: 'Pending Requests', value: 8, icon: ClipboardList, accent: 'amber' },
        { label: 'Active Users', value: 221, icon: Users, accent: 'indigo' },
      ]}
      quickActions={[
        { icon: LifeBuoy, label: 'New Ticket', href: `${basePath}/support`, accent: 'rose' },
        { icon: Cpu, label: 'Assign Asset', href: `${basePath}/assets`, accent: 'violet' },
        { icon: HardDrive, label: 'Manage Assets', href: `${basePath}/assets`, accent: 'cyan' },
        { icon: Users, label: 'Employees', href: `${basePath}/users`, accent: 'blue' },
      ]}
      charts={['ticketResolution', 'workforceUtilization']}
    >
      <ChartCard title="Asset Distribution" description="By type">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Monitor, label: 'Monitors', count: 96, color: 'blue' },
            { icon: HardDrive, label: 'Laptops', count: 142, color: 'violet' },
            { icon: Headphones, label: 'Headsets', count: 84, color: 'cyan' },
            { icon: Smartphone, label: 'Phones', count: 38, color: 'emerald' },
          ].map((a) => (
            <div key={a.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between">
                <a.icon className="h-5 w-5 text-brand-violet" />
                <span className="text-lg font-bold text-white">{a.count}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{a.label}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Critical Alerts" description="Requires attention">
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5" />
            <div>
              <p className="text-sm text-rose-300">Server CPU at 92%</p>
              <p className="text-xs text-slate-400">PROD-DB-01 — 5 min ago</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm text-amber-300">License expiring soon</p>
              <p className="text-xs text-slate-400">Microsoft 365 — 14 days</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300">Security patch available</p>
              <p className="text-xs text-slate-400">3 endpoints need updates</p>
            </div>
          </div>
        </div>
      </ChartCard>
    </DashboardTemplate>
  )
}
