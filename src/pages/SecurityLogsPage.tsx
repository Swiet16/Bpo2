import { useEffect, useState } from 'react'
import { AlertTriangle, Shield, Lock, KeyRound, UserX, UserCheck, Activity } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { auditService } from '@/lib/services'
import { formatDateTime } from '@/lib/utils'
import type { AuditLog } from '@/types'

const mockLogs: AuditLog[] = [
  { id: '1', user_email: 'unknown@external.com', action: 'login_attempt', target: 'myne7x@gmail.com', target_type: 'auth', result: 'denied', ip_address: '198.51.100.42', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), metadata: { attempts: 5 } },
  { id: '2', user_email: 'myne7x@gmail.com', action: 'login', target: 'Dashboard', target_type: 'session', result: 'success', ip_address: '203.135.42.18', created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: '3', user_email: 'hr@myne7x.com', action: 'password_reset', target: 'agent.ali@myne7x.com', target_type: 'user', result: 'success', ip_address: '203.135.42.22', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '4', user_email: 'admin@myne7x.com', action: 'role_change_attempt', target: 'myne7x@gmail.com', target_type: 'user', result: 'denied', ip_address: '203.135.42.25', created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), metadata: { attempted_role: 'admin', reason: 'Protected Super Admin' } },
  { id: '5', user_email: 'it@myne7x.com', action: 'document_download', target: 'contract_001.pdf', target_type: 'document', result: 'success', ip_address: '203.135.42.30', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: '6', user_email: 'unknown@external.com', action: 'unauthorized_access', target: '/super-admin/users', target_type: 'route', result: 'denied', ip_address: '198.51.100.50', created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
]

const actionIcons: Record<string, any> = {
  login: UserCheck, login_attempt: Lock, password_reset: KeyRound,
  role_change_attempt: Shield, document_download: Activity, unauthorized_access: UserX,
}

export function SecurityLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filterResult, setFilterResult] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await auditService.list()
      if (mounted) {
        setLogs(data && data.length ? data : mockLogs)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = logs.filter((l) => !filterResult || l.result === filterResult)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Logs"
        description="Monitor security events and access attempts"
        icon={<AlertTriangle className="h-5 w-5 text-brand-rose" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Security Logs' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={logs.length} icon={Activity} accent="violet" />
        <StatCard label="Denied" value={logs.filter((l) => l.result === 'denied').length} icon={AlertTriangle} accent="rose" />
        <StatCard label="Successful" value={logs.filter((l) => l.result === 'success').length} icon={UserCheck} accent="emerald" />
        <StatCard label="Failed" value={logs.filter((l) => l.result === 'failure').length} icon={Lock} accent="amber" />
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
          emptyMessage="No security events logged."
          columns={[
            { key: 'action', header: 'Action', render: (l) => {
              const Icon = actionIcons[l.action] || Activity
              return <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-slate-400" /><span className="text-sm text-white">{l.action.replace(/_/g, ' ')}</span></div>
            } },
            { key: 'user_email', header: 'User', render: (l) => <span className="text-xs font-mono">{l.user_email || 'Unknown'}</span> },
            { key: 'target', header: 'Target', render: (l) => <span className="text-xs">{l.target}</span> },
            { key: 'ip_address', header: 'IP Address', render: (l) => <span className="text-xs font-mono text-slate-400">{l.ip_address || '—'}</span> },
            { key: 'created_at', header: 'Time', sortable: true, sortValue: (l) => l.created_at, render: (l) => <span className="text-xs">{formatDateTime(l.created_at)}</span> },
            { key: 'result', header: 'Result', sortable: true, sortValue: (l) => l.result, render: (l) => <StatusBadge status={l.result} /> },
          ]}
        />
      )}
    </div>
  )
}
