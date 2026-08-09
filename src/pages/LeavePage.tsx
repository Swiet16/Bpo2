import { useEffect, useState } from 'react'
import { Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { leaveService } from '@/lib/services'
import { formatDate } from '@/lib/utils'
import type { LeaveRequest } from '@/types'
import toast from 'react-hot-toast'

const mockLeave: LeaveRequest[] = [
  { id: '1', user_id: '3', leave_type: 'casual', start_date: '2025-08-25', end_date: '2025-08-26', reason: 'Personal work', status: 'pending', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: '4', leave_type: 'sick', start_date: '2025-08-20', end_date: '2025-08-21', reason: 'Fever and flu', status: 'approved', approver_id: '2', approver_notes: 'Get well soon', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), updated_at: new Date().toISOString() },
  { id: '3', user_id: '6', leave_type: 'annual', start_date: '2025-09-10', end_date: '2025-09-15', reason: 'Family vacation', status: 'pending', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), updated_at: new Date().toISOString() },
  { id: '4', user_id: '5', leave_type: 'emergency', start_date: '2025-08-15', end_date: '2025-08-16', reason: 'Family emergency', status: 'approved', approver_id: '1', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), updated_at: new Date().toISOString() },
  { id: '5', user_id: '7', leave_type: 'unpaid', start_date: '2025-08-10', end_date: '2025-08-12', reason: 'Personal reasons', status: 'rejected', approver_id: '2', approver_notes: 'Project deadline conflict', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), updated_at: new Date().toISOString() },
]

export function LeavePage() {
  const [leave, setLeave] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await leaveService.listAll()
      if (mounted) {
        setLeave(data && data.length ? data : mockLeave)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = leave.filter((l) => !filterStatus || l.status === filterStatus)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Review and manage employee leave requests"
        icon={<Calendar className="h-5 w-5 text-brand-rose" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Leave' }]}
        actions={<button onClick={() => toast.success('New leave request form would open')} className="btn-primary"><Plus className="h-4 w-4" /> Request Leave</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={leave.length} icon={Calendar} accent="violet" />
        <StatCard label="Pending" value={leave.filter((l) => l.status === 'pending').length} icon={Clock} accent="amber" />
        <StatCard label="Approved" value={leave.filter((l) => l.status === 'approved').length} icon={CheckCircle} accent="emerald" />
        <StatCard label="Rejected" value={leave.filter((l) => l.status === 'rejected').length} icon={XCircle} accent="rose" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['reason', 'leave_type'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Cancelled', value: 'cancelled' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No leave requests found."
          columns={[
            { key: 'user_id', header: 'Employee', render: (l) => <span className="text-sm">Employee #{l.user_id}</span> },
            { key: 'leave_type', header: 'Type', sortable: true, render: (l) => <span className="badge-info capitalize">{l.leave_type}</span> },
            { key: 'start_date', header: 'Start', sortable: true, sortValue: (l) => l.start_date, render: (l) => <span className="text-xs">{formatDate(l.start_date)}</span> },
            { key: 'end_date', header: 'End', render: (l) => <span className="text-xs">{formatDate(l.end_date)}</span> },
            { key: 'reason', header: 'Reason', render: (l) => <span className="text-xs text-slate-300 truncate max-w-xs block">{l.reason}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (l) => l.status, render: (l) => <StatusBadge status={l.status} /> },
          ]}
        />
      )}
    </div>
  )
}
