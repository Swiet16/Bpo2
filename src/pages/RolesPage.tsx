import { Shield, Lock, Users, CheckCircle, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { ChartCard, InfoCard } from '@/components/ChartCard'
import { ROLES, ROLE_PERMISSIONS, type UserRole, type Permission } from '@/types'
import { isProtectedSuperAdmin } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const allPermissions: Permission[] = [
  'view_users', 'create_users', 'edit_users', 'delete_users',
  'reset_password', 'change_roles', 'manage_attendance',
  'manage_payroll', 'manage_payslips', 'manage_contracts',
  'manage_clients', 'manage_corporations', 'manage_support',
  'manage_it', 'manage_bi', 'manage_documents',
  'export_reports', 'view_security_logs', 'manage_settings',
  'manage_announcements', 'manage_leave', 'manage_performance',
  'manage_tasks', 'view_all_employees', 'view_own_data',
  'manage_assets', 'manage_tickets', 'view_analytics',
  'force_password_change', 'view_audit_logs',
]

export function RolesPage() {
  const { profile } = useAuth()
  const isSuperAdmin = isProtectedSuperAdmin(profile?.email)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage role-based access control across the platform"
        icon={<Shield className="h-5 w-5 text-brand-violet" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Roles & Permissions' }]}
      />

      {/* Super Admin protection banner */}
      <div className="premium-card p-6 bg-gradient-to-br from-brand-violet/10 to-brand-indigo/5 border-brand-violet/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-brand-violet/20 ring-1 ring-brand-violet/30">
            <Shield className="h-6 w-6 text-brand-violet" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Protected Super Admin Account</h2>
            <p className="text-sm text-slate-400 mt-1">
              The CEO account (<span className="font-mono text-brand-violet">myne7x@gmail.com</span>) is protected at the database/authorization level. Nobody — including Admin users — can modify, downgrade, suspend, delete, or transfer this role.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge-violet"><Lock className="h-3 w-3" /> Database-protected</span>
              <span className="badge-success"><CheckCircle className="h-3 w-3" /> Cannot be deleted</span>
              <span className="badge-success"><CheckCircle className="h-3 w-3" /> Cannot be suspended</span>
              <span className="badge-success"><CheckCircle className="h-3 w-3" /> Role cannot be changed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(ROLES).map((role) => {
          const perms = ROLE_PERMISSIONS[role.id]
          const isProtected = role.id === 'super_admin'
          return (
            <div key={role.id} className={cn('premium-card p-5', isProtected && 'border-brand-violet/30')}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('p-2 rounded-lg', `bg-brand-${role.color === 'teal' ? 'cyan' : role.color}-500/15 text-${role.color === 'teal' ? 'cyan' : role.color}-300`)}>
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">{role.label}</h3>
                  <p className="text-xs text-slate-500">{role.description}</p>
                </div>
                {isProtected && <Shield className="h-4 w-4 text-brand-violet" />}
              </div>
              <div className="text-xs text-slate-400 mb-2">
                <span className="font-medium text-slate-300">{perms.length}</span> permissions
              </div>
              <div className="flex flex-wrap gap-1">
                {perms.slice(0, 4).map((p) => (
                  <span key={p} className="badge-info text-[10px]">{p.replace(/_/g, ' ')}</span>
                ))}
                {perms.length > 4 && <span className="badge-violet text-[10px]">+{perms.length - 4} more</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Permission matrix */}
      <ChartCard title="Permission Matrix" description="Complete role-permission mapping">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-2 text-slate-400 uppercase tracking-wider">Permission</th>
                {Object.values(ROLES).map((r) => (
                  <th key={r.id} className="p-2 text-center text-slate-400 uppercase tracking-wider" title={r.label}>
                    {r.label.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((perm) => (
                <tr key={perm} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-2 text-slate-300">{perm.replace(/_/g, ' ')}</td>
                  {Object.values(ROLES).map((r) => {
                    const has = ROLE_PERMISSIONS[r.id]?.includes(perm)
                    return (
                      <td key={r.id} className="p-2 text-center">
                        {has ? (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
