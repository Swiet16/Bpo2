import { useEffect, useState } from 'react'
import { Megaphone, Plus, Eye, Calendar, Users } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { announcementsService } from '@/lib/services'
import { formatDate } from '@/lib/utils'
import type { Announcement } from '@/types'
import toast from 'react-hot-toast'

const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'August 2025 Payslips Published', message: 'All August payslips have been published. Employees can now download them from their dashboard.', audience: ['everyone'], priority: 'high', publish_date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), expiry_date: null, status: 'published', created_by: '1', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '2', title: 'Team Meeting — Friday 3 PM', message: 'Monthly team meeting scheduled for Friday at 3 PM in the main conference room.', audience: ['agents', 'team_leaders'], priority: 'medium', publish_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), expiry_date: null, status: 'published', created_by: '2', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '3', title: 'New Shift Schedule Effective Sept 1', message: 'New shift rotations will be effective from September 1st. Please check your assigned shifts.', audience: ['agents'], priority: 'high', publish_date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), expiry_date: '2025-09-01', status: 'published', created_by: '2', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: '4', title: 'IT Maintenance Window', message: 'Scheduled maintenance on Saturday 2 AM - 4 AM. Systems may be briefly unavailable.', audience: ['everyone'], priority: 'critical', publish_date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), expiry_date: null, status: 'published', created_by: '5', created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
]

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<Announcement | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await announcementsService.list()
      if (mounted) {
        setAnnouncements(data && data.length ? data : mockAnnouncements)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = announcements.filter((a) => !filterStatus || a.status === filterStatus)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Manage company-wide announcements and notifications"
        icon={<Megaphone className="h-5 w-5 text-brand-violet" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Announcements' }]}
        actions={<button onClick={() => toast.success('New announcement form would open')} className="btn-primary"><Plus className="h-4 w-4" /> New Announcement</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={announcements.length} icon={Megaphone} accent="violet" />
        <StatCard label="Published" value={announcements.filter((a) => a.status === 'published').length} icon={Megaphone} accent="emerald" />
        <StatCard label="Critical" value={announcements.filter((a) => a.priority === 'critical').length} icon={Megaphone} accent="rose" />
        <StatCard label="Drafts" value={announcements.filter((a) => a.status === 'draft').length} icon={Megaphone} accent="amber" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['title', 'message'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' },
              { label: 'Archived', value: 'archived' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No announcements available."
          columns={[
            { key: 'title', header: 'Title', sortable: true, render: (a) => <span className="text-sm text-white">{a.title}</span> },
            { key: 'audience', header: 'Audience', render: (a) => <span className="text-xs">{a.audience.join(', ')}</span> },
            { key: 'publish_date', header: 'Published', sortable: true, sortValue: (a) => a.publish_date, render: (a) => <span className="text-xs">{formatDate(a.publish_date)}</span> },
            { key: 'priority', header: 'Priority', sortable: true, sortValue: (a) => a.priority, render: (a) => <StatusBadge status={a.priority} /> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (a) => a.status, render: (a) => <StatusBadge status={a.status} /> },
            { key: 'actions', header: 'Actions', render: (a) => <button onClick={() => setSelected(a)} className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button> },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Announcement Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{selected.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={selected.priority} />
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-slate-300">{selected.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Audience</p><p className="text-sm text-white">{selected.audience.join(', ')}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Published</p><p className="text-sm text-white">{formatDate(selected.publish_date)}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
