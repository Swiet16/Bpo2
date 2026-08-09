import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users as UsersIcon, UserPlus, KeyRound, Shield, MoreVertical,
  Mail, Phone, Eye, Pencil, Ban, CheckCircle, Search, Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Modal, ConfirmDialog } from '@/components/Modal'
import { EmptyState } from '@/components/EmptyState'
import { Skeleton } from '@/components/Skeleton'
import { usersService, auditService } from '@/lib/services'
import { ROLES, type Profile, type UserRole } from '@/types'
import { canAssignRole, canModifyTarget, ACCESS_DENIED_MESSAGE } from '@/lib/permissions'
import { isProtectedSuperAdmin } from '@/lib/supabase'
import { initials, formatDate } from '@/lib/utils'

const mockUsers: Profile[] = [
  { id: '1', email: 'myne7x@gmail.com', full_name: 'MYNE7X CEO', role: 'super_admin', department: 'Executive', employment_status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), employee_id: 'MYN-EMP-001', joining_date: '2013-01-01', job_title: 'Chief Executive Officer' },
  { id: '2', email: 'hr@myne7x.com', full_name: 'Sara Khan', role: 'hr', department: 'Human Resources', employment_status: 'active', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), updated_at: new Date().toISOString(), employee_id: 'MYN-EMP-014', joining_date: '2020-03-15', job_title: 'HR Manager' },
  { id: '3', email: 'agent.ali@myne7x.com', full_name: 'Ali Raza', role: 'agent', department: 'Customer Support', employment_status: 'active', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), updated_at: new Date().toISOString(), employee_id: 'MYN-EMP-128', joining_date: '2023-03-15', job_title: 'Senior Support Agent' },
  { id: '4', email: 'tl.bilal@myne7x.com', full_name: 'Bilal Ahmed', role: 'team_leader', department: 'Customer Support', employment_status: 'active', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), updated_at: new Date().toISOString(), employee_id: 'MYN-EMP-042', joining_date: '2022-08-01', job_title: 'Team Leader' },
  { id: '5', email: 'it.usman@myne7x.com', full_name: 'Usman Tariq', role: 'it', department: 'IT', employment_status: 'active', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(), updated_at: new Date().toISOString(), employee_id: 'MYN-EMP-008', joining_date: '2021-11-10', job_title: 'IT Specialist' },
  { id: '6', email: 'agent.ayesha@myne7x.com', full_name: 'Ayesha Malik', role: 'agent', department: 'Customer Support', employment_status: 'active', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), updated_at: new Date().toISOString(), employee_id: 'MYN-EMP-156', joining_date: '2023-06-20', job_title: 'Support Agent' },
  { id: '7', email: 'bi.hira@myne7x.com', full_name: 'Hira Noor', role: 'bi', department: 'Analytics', employment_status: 'active', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 75).toISOString(), updated_at: new Date().toISOString(), employee_id: 'MYN-EMP-029', joining_date: '2022-12-01', job_title: 'BI Analyst' },
  { id: '8', email: 'corp.fahad@myne7x.com', full_name: 'Fahad Hassan', role: 'corporation', department: 'Corporate', employment_status: 'suspended', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(), updated_at: new Date().toISOString(), employee_id: 'MYN-EMP-017', joining_date: '2021-05-12', job_title: 'Corporate Manager' },
]

export function UsersPage() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false)
  const [tempPassword, setTempPassword] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('agent')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const dbUsers = await usersService.list()
      if (mounted) {
        setUsers(dbUsers && dbUsers.length ? dbUsers : mockUsers)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleResetPassword = (user: Profile) => {
    const check = canModifyTarget(profile?.email, profile?.role, user.email)
    if (!check.allowed) {
      toast.error(check.reason || ACCESS_DENIED_MESSAGE)
      return
    }
    setSelectedUser(user)
    setTempPassword(generateTempPassword())
    setShowResetModal(true)
  }

  const handleChangeRole = (user: Profile) => {
    const check = canModifyTarget(profile?.email, profile?.role, user.email)
    if (!check.allowed) {
      toast.error(check.reason || ACCESS_DENIED_MESSAGE)
      return
    }
    setSelectedUser(user)
    setNewRole(user.role)
    setShowRoleModal(true)
  }

  const handleSuspend = (user: Profile) => {
    const check = canModifyTarget(profile?.email, profile?.role, user.email)
    if (!check.allowed) {
      toast.error(check.reason || ACCESS_DENIED_MESSAGE)
      return
    }
    setSelectedUser(user)
    setShowSuspendConfirm(true)
  }

  const confirmSuspend = async () => {
    if (!selectedUser) return
    const newStatus = selectedUser.employment_status === 'suspended' ? 'active' : 'suspended'
    await usersService.update(selectedUser.id, { employment_status: newStatus })
    setUsers((prev) => prev.map((u) => u.id === selectedUser.id ? { ...u, employment_status: newStatus } : u))
    auditService.log({
      user_id: profile?.id,
      user_email: profile?.email,
      action: newStatus === 'suspended' ? 'user_suspended' : 'user_activated',
      target: selectedUser.email,
      target_type: 'user',
      result: 'success',
    })
    toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`)
  }

  const confirmResetPassword = async () => {
    if (!selectedUser) return
    // In production, this would call a Supabase Edge Function to set the temp password
    auditService.log({
      user_id: profile?.id,
      user_email: profile?.email,
      action: 'password_reset',
      target: selectedUser.email,
      target_type: 'user',
      result: 'success',
      metadata: { method: 'temp_password' },
    })
    toast.success(`Temporary password generated for ${selectedUser.full_name}`)
    setShowResetModal(false)
  }

  const confirmRoleChange = async () => {
    if (!selectedUser) return
    const check = canAssignRole(profile?.email, profile?.role, newRole)
    if (!check.allowed) {
      toast.error(check.reason || ACCESS_DENIED_MESSAGE)
      return
    }
    await usersService.update(selectedUser.id, { role: newRole, must_change_password: true })
    setUsers((prev) => prev.map((u) => u.id === selectedUser.id ? { ...u, role: newRole } : u))
    auditService.log({
      user_id: profile?.id,
      user_email: profile?.email,
      action: 'role_change',
      target: selectedUser.email,
      target_type: 'user',
      result: 'success',
      metadata: { old_role: selectedUser.role, new_role: newRole },
    })
    toast.success(`Role updated to ${ROLES[newRole].label}`)
    setShowRoleModal(false)
  }

  const filtered = users.filter((u) => {
    if (filterRole && u.role !== filterRole) return false
    if (filterStatus && u.employment_status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all platform users, roles, and access permissions"
        icon={<UsersIcon className="h-5 w-5 text-brand-violet" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Users' }]}
        actions={
          <button className="btn-primary" onClick={() => toast.success('Add user form would open here')}>
            <UserPlus className="h-4 w-4" /> Add User
          </button>
        }
      />

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['full_name', 'email', 'employee_id'] as any}
          emptyMessage="No users found."
          filters={[
            { label: 'All Roles', value: filterRole, options: Object.values(ROLES).map((r) => ({ label: r.label, value: r.id })), onChange: setFilterRole },
            { label: 'All Statuses', value: filterStatus, options: [
              { label: 'Active', value: 'active' },
              { label: 'Suspended', value: 'suspended' },
              { label: 'Terminated', value: 'terminated' },
              { label: 'On Leave', value: 'on_leave' },
            ], onChange: setFilterStatus },
          ]}
          columns={[
            {
              key: 'full_name', header: 'User', sortable: true, sortValue: (u) => u.full_name,
              render: (u) => (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {initials(u.full_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate flex items-center gap-1.5">
                      {u.full_name}
                      {isProtectedSuperAdmin(u.email) && <Shield className="h-3 w-3 text-brand-violet" />}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                </div>
              ),
            },
            { key: 'employee_id', header: 'Emp ID', sortable: true, render: (u) => <span className="font-mono text-xs">{u.employee_id || '—'}</span> },
            {
              key: 'role', header: 'Role', sortable: true, sortValue: (u) => u.role,
              render: (u) => (
                <span className={`badge badge-${ROLES[u.role]?.color === 'violet' ? 'violet' : 'info'}`}>
                  {ROLES[u.role]?.label || u.role}
                </span>
              ),
            },
            { key: 'department', header: 'Department', render: (u) => <span className="text-xs">{u.department || '—'}</span> },
            { key: 'joining_date', header: 'Joined', sortable: true, sortValue: (u) => u.joining_date || '', render: (u) => <span className="text-xs">{formatDate(u.joining_date)}</span> },
            {
              key: 'employment_status', header: 'Status', sortable: true, sortValue: (u) => u.employment_status,
              render: (u) => <StatusBadge status={u.employment_status} />,
            },
            {
              key: 'actions', header: 'Actions',
              render: (u) => (
                <div className="flex items-center gap-1">
                  <button onClick={() => toast(`View ${u.full_name}'s profile`)} className="btn-ghost p-1.5" title="View"><Eye className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleResetPassword(u)} className="btn-ghost p-1.5" title="Reset Password"><KeyRound className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleChangeRole(u)} className="btn-ghost p-1.5" title="Change Role"><Shield className="h-3.5 w-3.5" /></button>
                  {!isProtectedSuperAdmin(u.email) && (
                    <button onClick={() => handleSuspend(u)} className="btn-ghost p-1.5" title={u.employment_status === 'suspended' ? 'Activate' : 'Suspend'}>
                      {u.employment_status === 'suspended' ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Ban className="h-3.5 w-3.5 text-rose-400" />}
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      {/* Reset Password Modal */}
      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Password"
        description={`Generate a temporary password for ${selectedUser?.full_name}`}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-300">
              The user will be forced to change this password on next login. The temporary password will be invalidated after successful change.
            </p>
          </div>
          <div>
            <label className="input-label">Temporary Password</label>
            <div className="flex gap-2">
              <input value={tempPassword} readOnly className="input-field font-mono" />
              <button onClick={() => { navigator.clipboard.writeText(tempPassword); toast.success('Copied to clipboard') }} className="btn-secondary">Copy</button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowResetModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={confirmResetPassword} className="btn-primary">Confirm Reset</button>
          </div>
        </div>
      </Modal>

      {/* Change Role Modal */}
      <Modal
        open={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Change Role"
        description={`Update role for ${selectedUser?.full_name}`}
      >
        <div className="space-y-4">
          {isProtectedSuperAdmin(selectedUser?.email) && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-sm text-rose-300 font-medium">⚠️ Protected Super Admin</p>
              <p className="text-xs text-rose-400/80 mt-1">This account's role cannot be changed by anyone.</p>
            </div>
          )}
          <div>
            <label className="input-label">New Role</label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)} className="input-field" disabled={isProtectedSuperAdmin(selectedUser?.email)}>
              {Object.values(ROLES).map((r) => (
                <option key={r.id} value={r.id} disabled={r.id === 'super_admin' && !isProtectedSuperAdmin(profile?.email)}>
                  {r.label} — {r.description}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowRoleModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={confirmRoleChange} className="btn-primary" disabled={isProtectedSuperAdmin(selectedUser?.email)}>Update Role</button>
          </div>
        </div>
      </Modal>

      {/* Suspend Confirm */}
      <ConfirmDialog
        open={showSuspendConfirm}
        onClose={() => setShowSuspendConfirm(false)}
        onConfirm={confirmSuspend}
        title={selectedUser?.employment_status === 'suspended' ? 'Activate User' : 'Suspend User'}
        message={`Are you sure you want to ${selectedUser?.employment_status === 'suspended' ? 'activate' : 'suspend'} ${selectedUser?.full_name}? This action will be logged in the audit trail.`}
        confirmLabel={selectedUser?.employment_status === 'suspended' ? 'Activate' : 'Suspend'}
        danger={selectedUser?.employment_status !== 'suspended'}
      />
    </div>
  )
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  let pwd = ''
  for (let i = 0; i < 12; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
  return pwd
}
