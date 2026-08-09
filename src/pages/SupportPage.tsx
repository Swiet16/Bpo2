import { useEffect, useState } from 'react'
import { LifeBuoy, Plus, Eye, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { ticketsService } from '@/lib/services'
import { formatDateTime } from '@/lib/utils'
import type { SupportTicket } from '@/types'
import toast from 'react-hot-toast'

const mockTickets: SupportTicket[] = [
  { id: '1', ticket_no: 'MYN-SUP-000128', full_name: 'John Smith', email: 'john@acme.com', phone: '+1 555 0100', company: 'Acme Corp', category: 'Customer Support', subject: 'Login issue with portal', message: 'Cannot access customer portal since morning. Getting 500 error.', priority: 'high', preferred_contact: 'email', department: 'Customer Support', status: 'new', is_public: true, created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), updated_at: new Date().toISOString() },
  { id: '2', ticket_no: 'MYN-SUP-000127', full_name: 'Sarah Lee', email: 'sarah@globex.com', phone: '+1 555 0101', company: 'Globex Inc', category: 'Technical Support', subject: 'API integration failing', message: 'Getting authentication errors on production API calls.', priority: 'urgent', preferred_contact: 'phone', department: 'IT', status: 'in_progress', is_public: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), updated_at: new Date().toISOString() },
  { id: '3', ticket_no: 'MYN-SUP-000126', full_name: 'Mike Johnson', email: 'mike@initech.com', company: 'Initech LLC', category: 'Billing', subject: 'Invoice discrepancy', message: 'August invoice shows incorrect amount.', priority: 'medium', preferred_contact: 'email', status: 'assigned', is_public: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), updated_at: new Date().toISOString() },
  { id: '4', ticket_no: 'MYN-SUP-000125', full_name: 'Emma Wilson', email: 'emma@stark.com', company: 'Stark Industries', category: 'General Inquiry', subject: 'Partnership opportunity', message: 'Interested in exploring BPO partnership for our European operations.', priority: 'low', preferred_contact: 'email', status: 'resolved', is_public: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), updated_at: new Date().toISOString() },
  { id: '5', ticket_no: 'MYN-SUP-000124', full_name: 'Ali Raza', email: 'ali@myne7x.com', company: 'MYNE7X BPO', category: 'IT Support', subject: 'Laptop screen flickering', message: 'My laptop screen has started flickering since yesterday.', priority: 'medium', preferred_contact: 'email', department: 'IT', status: 'closed', is_public: false, user_id: '3', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), updated_at: new Date().toISOString() },
]

export function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [selected, setSelected] = useState<SupportTicket | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await ticketsService.list()
      if (mounted) {
        setTickets(data && data.length ? data : mockTickets)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = tickets.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false
    if (filterPriority && t.priority !== filterPriority) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        description="Manage customer and internal support requests"
        icon={<LifeBuoy className="h-5 w-5 text-brand-rose" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Support' }]}
        actions={<button onClick={() => toast.success('New ticket form would open')} className="btn-primary"><Plus className="h-4 w-4" /> New Ticket</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Open Tickets" value={tickets.filter((t) => !['resolved', 'closed'].includes(t.status)).length} icon={Clock} accent="amber" />
        <StatCard label="Urgent" value={tickets.filter((t) => t.priority === 'urgent').length} icon={AlertCircle} accent="rose" />
        <StatCard label="Resolved" value={tickets.filter((t) => t.status === 'resolved').length} icon={CheckCircle} accent="emerald" />
        <StatCard label="Total" value={tickets.length} icon={LifeBuoy} accent="violet" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['ticket_no', 'full_name', 'subject', 'company'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'New', value: 'new' },
              { label: 'Assigned', value: 'assigned' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Waiting', value: 'waiting' },
              { label: 'Resolved', value: 'resolved' },
              { label: 'Closed', value: 'closed' },
            ], onChange: setFilterStatus },
            { label: 'All Priority', value: filterPriority, options: [
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Urgent', value: 'urgent' },
            ], onChange: setFilterPriority },
          ]}
          emptyMessage="No support tickets found."
          columns={[
            { key: 'ticket_no', header: 'Ticket #', sortable: true, render: (t) => <span className="font-mono text-xs text-brand-violet">{t.ticket_no}</span> },
            { key: 'subject', header: 'Subject', render: (t) => (
              <div className="max-w-xs">
                <p className="text-sm text-white truncate">{t.subject}</p>
                <p className="text-xs text-slate-500">{t.full_name} · {t.company || 'Individual'}</p>
              </div>
            ) },
            { key: 'category', header: 'Category', render: (t) => <span className="text-xs">{t.category}</span> },
            { key: 'priority', header: 'Priority', sortable: true, sortValue: (t) => t.priority, render: (t) => <StatusBadge status={t.priority} /> },
            { key: 'created_at', header: 'Created', sortable: true, sortValue: (t) => t.created_at, render: (t) => <span className="text-xs">{formatDateTime(t.created_at)}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (t) => t.status, render: (t) => <StatusBadge status={t.status} /> },
            {
              key: 'actions', header: 'Actions',
              render: (t) => (
                <button onClick={() => setSelected(t)} className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button>
              ),
            },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Ticket ${selected?.ticket_no}`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">From</p><p className="text-sm text-white">{selected.full_name}</p><p className="text-xs text-slate-500">{selected.email}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Company</p><p className="text-sm text-white">{selected.company || 'Individual'}</p></div>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-xs text-slate-400 mb-1">Subject</p>
              <p className="text-sm font-medium text-white">{selected.subject}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-xs text-slate-400 mb-1">Message</p>
              <p className="text-sm text-slate-300">{selected.message}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Priority</p><StatusBadge status={selected.priority} /></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Status</p><StatusBadge status={selected.status} /></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Category</p><p className="text-sm text-white">{selected.category}</p></div>
            </div>
            <button onClick={() => toast.success('Reply sent')} className="btn-primary w-full">
              <MessageSquare className="h-4 w-4" /> Reply to Ticket
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
