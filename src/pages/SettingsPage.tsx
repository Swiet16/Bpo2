import { useState } from 'react'
import { Settings as SettingsIcon, Building2, Shield, Bell, CreditCard, Calendar, Lock, Database, Globe } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { ChartCard, InfoCard } from '@/components/ChartCard'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES } from '@/types'
import { isProtectedSuperAdmin } from '@/lib/supabase'
import toast from 'react-hot-toast'

type Tab = 'company' | 'security' | 'notifications' | 'payroll' | 'attendance' | 'documents' | 'public_forms'

export function SettingsPage() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('company')
  const isSuperAdmin = isProtectedSuperAdmin(profile?.email)

  const tabs: { id: Tab; label: string; icon: any; superAdminOnly?: boolean }[] = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield, superAdminOnly: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: Database },
    { id: 'public_forms', label: 'Public Forms', icon: Globe, superAdminOnly: true },
  ]

  const visibleTabs = tabs.filter((t) => !t.superAdminOnly || isSuperAdmin)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description={isSuperAdmin ? 'Manage platform configuration and preferences' : 'Manage your account preferences'}
        icon={<SettingsIcon className="h-5 w-5 text-brand-violet" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Settings' }]}
      />

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-56 flex-shrink-0">
          <div className="glass-card p-2 space-y-1">
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === t.id ? 'bg-brand-violet/20 text-white border border-brand-violet/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <ChartCard title={visibleTabs.find((t) => t.id === activeTab)?.label || ''} description="Configure settings">
            {activeTab === 'company' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="input-label">Company Name</label><input defaultValue="MYNE7X BPO" className="input-field" /></div>
                  <div><label className="input-label">CEO Email</label><input defaultValue="myne7x@gmail.com" className="input-field" disabled /></div>
                  <div><label className="input-label">Phone</label><input defaultValue="+92 21 111 696 379" className="input-field" /></div>
                  <div><label className="input-label">Address</label><input defaultValue="Plot 14, I.T. Tower, Clifton, Karachi" className="input-field" /></div>
                </div>
                <button onClick={() => toast.success('Settings saved')} className="btn-primary">Save Changes</button>
              </div>
            )}
            {activeTab === 'security' && isSuperAdmin && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-rose-400" />
                    <p className="text-sm font-medium text-rose-300">Protected Super Admin Account</p>
                  </div>
                  <p className="text-xs text-rose-400/80">The CEO account (myne7x@gmail.com) is protected at the database level. No one can modify, downgrade, or transfer this role.</p>
                </div>
                <InfoCard label="Two-Factor Authentication" value="Enabled for all admin roles" icon={Shield} />
                <InfoCard label="Password Policy" value="Min 8 chars, requires letters + numbers" icon={Lock} />
                <InfoCard label="Session Timeout" value="30 minutes of inactivity" icon={SettingsIcon} />
                <InfoCard label="Failed Login Lockout" value="5 attempts → 15 min lockout" icon={Shield} />
              </div>
            )}
            {activeTab === 'notifications' && (
              <div className="space-y-3">
                {['New ticket created', 'Payslip published', 'Contract expiring soon', 'Leave request submitted', 'Password reset', 'Security alert'].map((n) => (
                  <label key={n} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-sm text-slate-300">{n}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/10 bg-navy-900 text-brand-violet" />
                  </label>
                ))}
                <button onClick={() => toast.success('Notification preferences saved')} className="btn-primary">Save Preferences</button>
              </div>
            )}
            {activeTab === 'payroll' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="input-label">Currency</label><select className="input-field"><option>PKR — Pakistani Rupee</option><option>USD — US Dollar</option></select></div>
                  <div><label className="input-label">Pay Cycle</label><select className="input-field"><option>Monthly</option><option>Bi-weekly</option><option>Weekly</option></select></div>
                  <div><label className="input-label">Pay Day</label><input defaultValue="Last day of month" className="input-field" /></div>
                  <div><label className="input-label">Tax Rate (%)</label><input defaultValue="14" className="input-field" /></div>
                </div>
                <button onClick={() => toast.success('Payroll settings saved')} className="btn-primary">Save Changes</button>
              </div>
            )}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="input-label">Working Hours</label><input defaultValue="9 AM - 6 PM" className="input-field" /></div>
                  <div><label className="input-label">Grace Period (minutes)</label><input defaultValue="15" className="input-field" /></div>
                  <div><label className="input-label">Working Days</label><input defaultValue="Mon-Sat" className="input-field" /></div>
                  <div><label className="input-label">Overtime Rate</label><input defaultValue="1.5x" className="input-field" /></div>
                </div>
                <button onClick={() => toast.success('Attendance settings saved')} className="btn-primary">Save Changes</button>
              </div>
            )}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <InfoCard label="Storage Provider" value="Supabase Storage (private buckets)" icon={Database} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="input-label">Max File Size (MB)</label><input defaultValue="10" className="input-field" /></div>
                  <div><label className="input-label">Allowed Types</label><input defaultValue="PDF, JPG, PNG, DOCX" className="input-field" /></div>
                </div>
                <button onClick={() => toast.success('Document settings saved')} className="btn-primary">Save Changes</button>
              </div>
            )}
            {activeTab === 'public_forms' && isSuperAdmin && (
              <div className="space-y-3">
                {['Contact Form', 'Customer Support Form', 'Career Applications', 'Public Inquiries'].map((f) => (
                  <label key={f} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-sm text-slate-300">{f}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/10 bg-navy-900 text-brand-violet" />
                  </label>
                ))}
                <button onClick={() => toast.success('Public form settings saved')} className="btn-primary">Save Changes</button>
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
