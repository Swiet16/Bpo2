import { useEffect, useState } from 'react'
import { ClipboardList, Plus, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { tasksService } from '@/lib/services'
import { formatDate } from '@/lib/utils'
import type { Task } from '@/types'
import toast from 'react-hot-toast'

const mockTasks: Task[] = [
  { id: '1', title: 'Review August payroll', description: 'Verify all payroll entries before publication', assigned_to: '2', assigned_by: '1', due_date: '2025-08-31', priority: 'high', status: 'in_progress', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), updated_at: new Date().toISOString() },
  { id: '2', title: 'Onboard new agent', description: 'Complete onboarding for Ayesha Malik', assigned_to: '4', assigned_by: '2', due_date: '2025-08-30', priority: 'medium', status: 'todo', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), updated_at: new Date().toISOString() },
  { id: '3', title: 'Update IT asset inventory', description: 'Audit all assigned assets', assigned_to: '5', assigned_by: '1', due_date: '2025-09-05', priority: 'low', status: 'todo', created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), updated_at: new Date().toISOString() },
  { id: '4', title: 'Client review meeting', description: 'Quarterly review with Acme Corp', assigned_to: '4', assigned_by: '1', due_date: '2025-08-28', priority: 'urgent', status: 'done', created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), updated_at: new Date().toISOString() },
  { id: '5', title: 'Generate BI report', description: 'Monthly BI analytics report', assigned_to: '7', assigned_by: '1', due_date: '2025-09-01', priority: 'medium', status: 'review', created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), updated_at: new Date().toISOString() },
]

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await tasksService.listAll()
      if (mounted) {
        setTasks(data && data.length ? data : mockTasks)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = tasks.filter((t) => !filterStatus || t.status === filterStatus)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Management"
        description="Track and manage assigned tasks"
        icon={<ClipboardList className="h-5 w-5 text-brand-cyan" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Tasks' }]}
        actions={<button onClick={() => toast.success('New task form would open')} className="btn-primary"><Plus className="h-4 w-4" /> Assign Task</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={tasks.length} icon={ClipboardList} accent="violet" />
        <StatCard label="In Progress" value={tasks.filter((t) => t.status === 'in_progress').length} icon={Clock} accent="amber" />
        <StatCard label="Completed" value={tasks.filter((t) => t.status === 'done').length} icon={CheckCircle} accent="emerald" />
        <StatCard label="Blocked" value={tasks.filter((t) => t.status === 'blocked').length} icon={AlertCircle} accent="rose" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['title', 'description'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'To Do', value: 'todo' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Review', value: 'review' },
              { label: 'Done', value: 'done' },
              { label: 'Blocked', value: 'blocked' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No tasks assigned yet."
          columns={[
            { key: 'title', header: 'Task', sortable: true, render: (t) => <span className="text-sm text-white">{t.title}</span> },
            { key: 'assigned_to', header: 'Assigned To', render: (t) => <span className="text-xs">Employee #{t.assigned_to}</span> },
            { key: 'due_date', header: 'Due Date', sortable: true, sortValue: (t) => t.due_date || '', render: (t) => <span className="text-xs">{t.due_date ? formatDate(t.due_date) : '—'}</span> },
            { key: 'priority', header: 'Priority', sortable: true, sortValue: (t) => t.priority, render: (t) => <StatusBadge status={t.priority} /> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (t) => t.status, render: (t) => <StatusBadge status={t.status} /> },
          ]}
        />
      )}
    </div>
  )
}
