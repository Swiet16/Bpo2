import { useEffect, useState } from 'react'
import { Briefcase, Plus, Eye, Mail, Phone } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { clientsService } from '@/lib/services'
import { formatDate } from '@/lib/utils'
import type { Client } from '@/types'
import toast from 'react-hot-toast'
import { CheckCircle, Building2, TrendingUp } from 'lucide-react'

const mockClients: Client[] = [
  { id: '1', company_name: 'Acme Corp', contact_person: 'John Smith', email: 'john@acme.com', phone: '+1 555 0100', service: 'Customer Support', assigned_team: 'Team Alpha', contract_start: '2023-01-15', contract_end: '2026-01-14', status: 'active', notes: 'Premium tier client', created_at: '2023-01-15', updated_at: '2023-01-15' },
  { id: '2', company_name: 'Globex Inc', contact_person: 'Sarah Lee', email: 'sarah@globex.com', phone: '+1 555 0101', service: 'IT Support', assigned_team: 'Team Beta', contract_start: '2023-06-01', contract_end: '2025-12-31', status: 'active', notes: '24/7 support required', created_at: '2023-06-01', updated_at: '2023-06-01' },
  { id: '3', company_name: 'Initech LLC', contact_person: 'Mike Johnson', email: 'mike@initech.com', phone: '+1 555 0102', service: 'Back Office', assigned_team: 'Team Gamma', contract_start: '2024-03-01', contract_end: '2025-09-30', status: 'active', notes: '', created_at: '2024-03-01', updated_at: '2024-03-01' },
  { id: '4', company_name: 'Stark Industries', contact_person: 'Emma Wilson', email: 'emma@stark.com', phone: '+1 555 0103', service: 'Customer Support', assigned_team: 'Team Alpha', contract_start: '2024-09-01', contract_end: '2025-12-31', status: 'prospect', notes: 'Evaluating partnership', created_at: '2024-09-01', updated_at: '2024-09-01' },
]

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<Client | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await clientsService.list()
      if (mounted) {
        setClients(data && data.length ? data : mockClients)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = clients.filter((c) => !filterStatus || c.status === filterStatus)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Management"
        description="Manage client relationships and service delivery"
        icon={<Briefcase className="h-5 w-5 text-brand-emerald" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Clients' }]}
        actions={<button onClick={() => toast.success('Add client form would open')} className="btn-primary"><Plus className="h-4 w-4" /> Add Client</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={clients.length} icon={Briefcase} accent="emerald" />
        <StatCard label="Active" value={clients.filter((c) => c.status === 'active').length} icon={CheckCircle} accent="violet" />
        <StatCard label="Prospects" value={clients.filter((c) => c.status === 'prospect').length} icon={TrendingUp} accent="cyan" />
        <StatCard label="Total Services" value={new Set(clients.map((c) => c.service)).size} icon={Building2} accent="blue" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['company_name', 'contact_person', 'email'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Prospect', value: 'prospect' },
              { label: 'Churned', value: 'churned' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No clients found."
          columns={[
            { key: 'company_name', header: 'Company', sortable: true, render: (c) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-emerald to-brand-cyan flex items-center justify-center text-white text-xs font-semibold">
                  {c.company_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div><p className="text-sm text-white">{c.company_name}</p><p className="text-xs text-slate-500">{c.contact_person}</p></div>
              </div>
            ) },
            { key: 'service', header: 'Service', render: (c) => <span className="text-xs">{c.service}</span> },
            { key: 'assigned_team', header: 'Team', render: (c) => <span className="text-xs">{c.assigned_team || '—'}</span> },
            { key: 'contract_end', header: 'Contract End', render: (c) => <span className="text-xs">{c.contract_end ? formatDate(c.contract_end) : '—'}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (c) => c.status, render: (c) => <StatusBadge status={c.status} /> },
            { key: 'actions', header: 'Actions', render: (c) => <button onClick={() => setSelected(c)} className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button> },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Client Details" size="lg">
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Company</p><p className="text-sm text-white">{selected.company_name}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Contact Person</p><p className="text-sm text-white">{selected.contact_person}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Email</p><p className="text-sm text-white">{selected.email}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Phone</p><p className="text-sm text-white">{selected.phone}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Service</p><p className="text-sm text-white">{selected.service}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Assigned Team</p><p className="text-sm text-white">{selected.assigned_team || '—'}</p></div>
            </div>
            {selected.notes && <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400 mb-1">Notes</p><p className="text-sm text-slate-300">{selected.notes}</p></div>}
          </div>
        )}
      </Modal>
    </div>
  )
}
