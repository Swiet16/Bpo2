import { useAuth } from '@/contexts/AuthContext'
import { PageHeader } from '@/components/PageHeader'
import { ChartCard, InfoCard } from '@/components/ChartCard'
import { User, Mail, Phone, Calendar, Building2, Briefcase, Lock, Bell, Shield, Clock, CheckCircle } from 'lucide-react'
import { ROLES } from '@/types'
import { formatDate, initials } from '@/lib/utils'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const { profile, updatePassword } = useAuth()
  const roleInfo = profile?.role ? ROLES[profile.role] : null

  const handleChangePassword = () => {
    toast.success('Password change link sent to your email')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your personal information"
        icon={<User className="h-5 w-5 text-brand-cyan" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Profile' }]}
      />

      {/* Profile header card */}
      <div className="premium-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {initials(profile?.full_name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">{profile?.full_name}</h2>
              <span className={`badge badge-${roleInfo?.color === 'violet' ? 'violet' : 'info'}`}>{roleInfo?.label}</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{profile?.email}</p>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <InfoCard label="Employee ID" value={profile?.employee_id || 'MYN-EMP-001'} icon={User} />
              <InfoCard label="Department" value={profile?.department || 'Executive'} icon={Building2} />
              <InfoCard label="Position" value={profile?.job_title || roleInfo?.label || '—'} icon={Briefcase} />
              <InfoCard label="Joined" value={formatDate(profile?.joining_date || '2023-01-01')} icon={Calendar} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Personal Information" description="Your account details">
          <div className="space-y-3">
            <InfoCard label="Full Name" value={profile?.full_name || '—'} icon={User} />
            <InfoCard label="Email" value={profile?.email || '—'} icon={Mail} />
            <InfoCard label="Phone" value={profile?.phone || 'Not provided'} icon={Phone} />
            <InfoCard label="Employment Status" value={profile?.employment_status || 'Active'} icon={CheckCircle} />
            <InfoCard label="Employment Type" value={profile?.employment_type || 'Permanent'} icon={Briefcase} />
          </div>
        </ChartCard>

        <ChartCard title="Security" description="Account security options">
          <div className="space-y-3">
            <button onClick={handleChangePassword} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-brand-violet" />
                <div><p className="text-sm text-white">Change Password</p><p className="text-xs text-slate-500">Last changed 30 days ago</p></div>
              </div>
            </button>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-400" />
                <div><p className="text-sm text-white">Two-Factor Auth</p><p className="text-xs text-slate-500">Enabled</p></div>
              </div>
              <span className="badge-success">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-blue-400" />
                <div><p className="text-sm text-white">Active Sessions</p><p className="text-xs text-slate-500">1 device</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-amber-400" />
                <div><p className="text-sm text-white">Notification Prefs</p><p className="text-xs text-slate-500">Manage alerts</p></div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Login History" description="Recent account access">
        <div className="space-y-2">
          {[
            { device: 'Chrome on Windows', ip: '203.135.42.18', time: '2 minutes ago', location: 'Karachi, PK', current: true },
            { device: 'Safari on iPhone', ip: '203.135.42.19', time: '5 hours ago', location: 'Karachi, PK', current: false },
            { device: 'Chrome on Windows', ip: '203.135.42.18', time: '1 day ago', location: 'Karachi, PK', current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${s.current ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-white">{s.device} {s.current && <span className="badge-success ml-1">Current</span>}</p>
                  <p className="text-xs text-slate-500">{s.ip} · {s.location} · {s.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
