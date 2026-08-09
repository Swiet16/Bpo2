import { useEffect, useState } from 'react'
import { Activity, UserCheck, UserX, KeyRound, FileText, Wallet, Shield } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { auditService } from '@/lib/services'
import { recentActivities } from '@/lib/mockData'
import { formatDateTime } from '@/lib/utils'
import type { AuditLog } from '@/types'

export function ActivityLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filterResult, setFilterResult] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await auditService.list()
      if (mounted) {
        setLogs(data && data.length ? data : recentActivities)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = logs.filter((l) => !filterResult || l.result === filterResult)

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Activity Log"
        description="Complete audit trail of all platform activities"
        icon={<Activity className="h-5 w-5 text-brand-violet" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Activity Log' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={logs.length} icon={Activity} accent="violet" />
        <StatCard label="Logins" value={logs.filter((l) => l.action.includes('login')).length} icon={UserCheck} accent="cyan" />
        <StatCard label="Documents" value={logs.filter((l) => l.action.includes('document')).length} icon={FileText} accent="amber" />
        <StatCard label="Security" value={logs.filter((l) => l.action.includes('password') || l.action.includes('role')).length} icon={Shield} accent="rose" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['user_email', 'action', 'target'] as any}
          filters={[
            { label: 'All Results', value: filterResult, options: [
              { label: 'Success', value: 'success' },
              { label: 'Denied', value: 'denied' },
              { label: 'Failure', value: 'failure' },
            ], onChange: setFilterResult },
          ]}
          emptyMessage="No activity recorded."
          columns={[
            { key: 'user_email', header: 'User', render: (l) => <span className="text-xs font-mono">{l.user_email || 'System'}</span> },
            { key: 'action', header: 'Action', sortable: true, render: (l) => <span className="text-sm text-white capitalize">{l.action.replace(/_/g, ' ')}</span> },
            { key: 'target', header: 'Target', render: (l) => <span className="text-xs">{l.target}</span> },
            { key: 'target_type', header: 'Type', render: (l) => <span className="text-xs text-slate-400">{l.target_type || '—'}</span> },
            { key: 'created_at', header: 'Time', sortable: true, sortValue: (l) => l.created_at, render: (l) => <span className="text-xs">{formatDateTime(l.created_at)}</span> },
            { key: 'result', header: 'Result', sortable: true, sortValue: (l) => l.result, render: (l) => <StatusBadge status={l.result} /> },
          ]}
        />
      )}
    </div>
  )
}
