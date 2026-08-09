import { useEffect, useState } from 'react'
import { Mail, Eye, Inbox, Clock, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { inquiriesService, careersService } from '@/lib/services'
import { formatDateTime } from '@/lib/utils'
import type { PublicInquiry, CareerApplication } from '@/types'

const mockInquiries: PublicInquiry[] = [
  { id: '1', reference_no: 'MYN-INQ-000128', full_name: 'John Smith', email: 'john@acme.com', phone: '+1 555 0100', company: 'Acme Corp', subject: 'BPO Partnership Inquiry', message: 'Interested in customer support outsourcing for our European operations.', inquiry_type: 'Corporate Partnership', preferred_contact: 'email', department: 'Corporate', status: 'new', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '2', reference_no: 'MYN-INQ-000127', full_name: 'Sarah Lee', email: 'sarah@globex.com', phone: '+1 555 0101', company: 'Globex Inc', subject: 'Pricing for IT support services', message: 'Need a quote for 24/7 IT support for 500+ employees.', inquiry_type: 'Become a Client', preferred_contact: 'phone', department: 'Sales', status: 'in_progress', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: '3', reference_no: 'MYN-INQ-000126', full_name: 'Mike Johnson', email: 'mike@initech.com', subject: 'General question about services', message: 'What BPO services do you offer for small businesses?', inquiry_type: 'General Inquiry', preferred_contact: 'email', status: 'resolved', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
]

const mockApps: CareerApplication[] = [
  { id: '1', reference_no: 'MYN-APP-000045', full_name: 'Aisha Khan', email: 'aisha.khan@email.com', phone: '+92 300 1234567', position: 'Senior Customer Support Agent', experience: '4 years', status: 'new', created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: '2', reference_no: 'MYN-APP-000044', full_name: 'Hamza Sheikh', email: 'hamza.s@email.com', phone: '+92 321 9876543', position: 'IT Support Specialist', experience: '2 years', status: 'reviewing', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
]

export function PublicFormsPage() {
  const [tab, setTab] = useState<'inquiries' | 'applications'>('inquiries')
  const [inquiries, setInquiries] = useState<PublicInquiry[]>([])
  const [applications, setApplications] = useState<CareerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const [inq, apps] = await Promise.all([
        inquiriesService.list(),
        careersService.list(),
      ])
      if (mounted) {
        setInquiries(inq && inq.length ? inq : mockInquiries)
        setApplications(apps && apps.length ? apps : mockApps)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public Forms Dashboard"
        description="Inquiries and career applications submitted via the public website"
        icon={<Mail className="h-5 w-5 text-brand-violet" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Public Forms' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="New Inquiries" value={inquiries.filter((i) => i.status === 'new').length} icon={Inbox} accent="violet" />
        <StatCard label="In Progress" value={inquiries.filter((i) => i.status === 'in_progress').length} icon={Clock} accent="amber" />
        <StatCard label="Resolved" value={inquiries.filter((i) => i.status === 'resolved').length} icon={CheckCircle} accent="emerald" />
        <StatCard label="Applications" value={applications.length} icon={Mail} accent="cyan" />
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setTab('inquiries')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'inquiries' ? 'bg-brand-violet/20 text-white border border-brand-violet/30' : 'text-slate-400 hover:bg-white/5'}`}
        >
          Public Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setTab('applications')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'applications' ? 'bg-brand-violet/20 text-white border border-brand-violet/30' : 'text-slate-400 hover:bg-white/5'}`}
        >
          Career Applications ({applications.length})
        </button>
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : tab === 'inquiries' ? (
        <DataTable
          data={inquiries}
          searchable
          searchKeys={['reference_no', 'full_name', 'subject'] as any}
          emptyMessage="No public inquiries yet."
          columns={[
            { key: 'reference_no', header: 'Reference', sortable: true, render: (i) => <span className="font-mono text-xs text-brand-violet">{i.reference_no}</span> },
            { key: 'full_name', header: 'Name', render: (i) => <span className="text-sm text-white">{i.full_name}</span> },
            { key: 'subject', header: 'Subject', render: (i) => <span className="text-xs">{i.subject}</span> },
            { key: 'inquiry_type', header: 'Type', render: (i) => <span className="text-xs">{i.inquiry_type}</span> },
            { key: 'created_at', header: 'Received', sortable: true, sortValue: (i) => i.created_at, render: (i) => <span className="text-xs">{formatDateTime(i.created_at)}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (i) => i.status, render: (i) => <StatusBadge status={i.status} /> },
            { key: 'actions', header: 'Actions', render: (i) => <button onClick={() => setSelected(i)} className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button> },
          ]}
        />
      ) : (
        <DataTable
          data={applications}
          searchable
          searchKeys={['reference_no', 'full_name', 'position'] as any}
          emptyMessage="No career applications yet."
          columns={[
            { key: 'reference_no', header: 'Reference', sortable: true, render: (a) => <span className="font-mono text-xs text-brand-violet">{a.reference_no}</span> },
            { key: 'full_name', header: 'Applicant', render: (a) => <span className="text-sm text-white">{a.full_name}</span> },
            { key: 'position', header: 'Position', render: (a) => <span className="text-xs">{a.position}</span> },
            { key: 'experience', header: 'Experience', render: (a) => <span className="text-xs">{a.experience || '—'}</span> },
            { key: 'created_at', header: 'Applied', sortable: true, sortValue: (a) => a.created_at, render: (a) => <span className="text-xs">{formatDateTime(a.created_at)}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (a) => a.status, render: (a) => <StatusBadge status={a.status} /> },
            { key: 'actions', header: 'Actions', render: (a) => <button onClick={() => setSelected(a)} className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button> },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.reference_no || 'Details'} size="md">
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Name</p><p className="text-sm text-white">{selected.full_name}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Email</p><p className="text-sm text-white">{selected.email}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Phone</p><p className="text-sm text-white">{selected.phone || '—'}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Status</p><StatusBadge status={selected.status} /></div>
            </div>
            {selected.subject && <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400 mb-1">Subject</p><p className="text-sm text-white">{selected.subject}</p></div>}
            {selected.message && <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400 mb-1">Message</p><p className="text-sm text-slate-300">{selected.message}</p></div>}
            {selected.position && <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400 mb-1">Position Applied For</p><p className="text-sm text-white">{selected.position}</p></div>}
          </div>
        )}
      </Modal>
    </div>
  )
}
