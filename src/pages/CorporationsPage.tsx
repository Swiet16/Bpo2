import { useEffect, useState } from 'react'
import { Building2, Plus, Eye, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { corporationsService } from '@/lib/services'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Corporation } from '@/types'
import toast from 'react-hot-toast'
import { Handshake, Briefcase, TrendingUp } from 'lucide-react'

const mockCorps: Corporation[] = [
  { id: '1', company_name: 'Acme Corp', industry: 'Technology', contact_person: 'John Smith', email: 'john@acme.com', phone: '+1 555 0100', address: '123 Tech Ave, San Francisco', contract_value: 24000000, assigned_services: 'Customer Support, IT, Back Office', account_status: 'active', notes: 'Strategic partner', created_at: '2023-01-15', updated_at: '2023-01-15' },
  { id: '2', company_name: 'Globex Inc', industry: 'Manufacturing', contact_person: 'Sarah Lee', email: 'sarah@globex.com', phone: '+1 555 0101', address: '456 Industrial Rd, Detroit', contract_value: 18000000, assigned_services: 'IT Support, Customer Support', account_status: 'active', notes: '', created_at: '2023-06-01', updated_at: '2023-06-01' },
  { id: '3', company_name: 'Initech LLC', industry: 'Finance', contact_person: 'Mike Johnson', email: 'mike@initech.com', phone: '+1 555 0102', address: '789 Finance St, New York', contract_value: 14000000, assigned_services: 'Back Office', account_status: 'active', notes: '', created_at: '2024-03-01', updated_at: '2024-03-01' },
  { id: '4', company_name: 'Umbrella Co', industry: 'Healthcare', contact_person: 'Emma Wilson', email: 'emma@umbrella.com', phone: '+1 555 0103', address: '321 Health Blvd, Boston', contract_value: 9000000, assigned_services: 'Customer Support', account_status: 'prospect', notes: 'In negotiation', created_at: '2024-09-01', updated_at: '2024-09-01' },
]

export function CorporationsPage() {
  const [corps, setCorps] = useState<Corporation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Corporation | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await corporationsService.list()
      if (mounted) {
        setCorps(data && data.length ? data : mockCorps)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corporate Accounts"
        description="Manage corporate client relationships and agreements"
        icon={<Building2 className="h-5 w-5 text-brand-indigo" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Corporations' }]}
        actions={<button onClick={() => toast.success('Add corporation form would open')} className="btn-primary"><Plus className="h-4 w-4" /> Add Corporation</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Accounts" value={corps.length} icon={Building2} accent="indigo" />
        <StatCard label="Active" value={corps.filter((c) => c.account_status === 'active').length} icon={Handshake} accent="emerald" />
        <StatCard label="Prospects" value={corps.filter((c) => c.account_status === 'prospect').length} icon={TrendingUp} accent="cyan" />
        <StatCard label="Pipeline Value" value={65} icon={DollarSign} accent="violet" prefix="$" suffix="M" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={corps}
          searchable
          searchKeys={['company_name', 'contact_person', 'industry'] as any}
          emptyMessage="No corporate accounts found."
          columns={[
            { key: 'company_name', header: 'Company', sortable: true, render: (c) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-white text-xs font-semibold">
                  {c.company_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div><p className="text-sm text-white">{c.company_name}</p><p className="text-xs text-slate-500">{c.industry}</p></div>
              </div>
            ) },
            { key: 'contact_person', header: 'Contact', render: (c) => <span className="text-xs">{c.contact_person}</span> },
            { key: 'contract_value', header: 'Contract Value', sortable: true, sortValue: (c) => c.contract_value || 0, render: (c) => <span className="text-xs font-mono">{formatCurrency(c.contract_value || 0)}</span> },
            { key: 'assigned_services', header: 'Services', render: (c) => <span className="text-xs">{c.assigned_services}</span> },
            { key: 'account_status', header: 'Status', sortable: true, sortValue: (c) => c.account_status, render: (c) => <StatusBadge status={c.account_status} /> },
            { key: 'actions', header: 'Actions', render: (c) => <button onClick={() => setSelected(c)} className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button> },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Corporate Account Details" size="lg">
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Company</p><p className="text-sm text-white">{selected.company_name}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Industry</p><p className="text-sm text-white">{selected.industry || '—'}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Contact</p><p className="text-sm text-white">{selected.contact_person}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Phone</p><p className="text-sm text-white">{selected.phone}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Contract Value</p><p className="text-sm text-white font-mono">{formatCurrency(selected.contract_value || 0)}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Status</p><StatusBadge status={selected.account_status} /></div>
            </div>
            {selected.assigned_services && <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400 mb-1">Services</p><p className="text-sm text-slate-300">{selected.assigned_services}</p></div>}
          </div>
        )}
      </Modal>
    </div>
  )
}
