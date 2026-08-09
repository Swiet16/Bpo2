import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ROLES, type UserRole } from '@/types'
import { hasPermission, ACCESS_DENIED_MESSAGE } from '@/lib/permissions'

import { LoginPage } from '@/pages/auth/LoginPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ForceChangePasswordPage } from '@/pages/auth/ForceChangePasswordPage'
import { AccessDeniedPage } from '@/pages/error/AccessDeniedPage'
import { NotFoundPage } from '@/pages/error/NotFoundPage'
import { ServerErrorPage } from '@/pages/error/ServerErrorPage'

import { PublicLayout } from '@/layouts/PublicLayout'
import { HomePage } from '@/pages/public/HomePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ServicesPage } from '@/pages/public/ServicesPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { CustomerSupportPage } from '@/pages/public/CustomerSupportPage'
import { CareersPage } from '@/pages/public/CareersPage'
import { FaqPage } from '@/pages/public/FaqPage'
import { TermsPage } from '@/pages/public/TermsPage'
import { PrivacyPage } from '@/pages/public/PrivacyPage'
import { CookiePage } from '@/pages/public/CookiePage'
import { SupportCenterPage } from '@/pages/public/SupportCenterPage'

import { DashboardLayout } from '@/layouts/DashboardLayout'
import { SuperAdminDashboard } from '@/dashboards/SuperAdminDashboard'
import { AdminDashboard } from '@/dashboards/AdminDashboard'
import { AgentDashboard } from '@/dashboards/AgentDashboard'
import { TeamLeaderDashboard } from '@/dashboards/TeamLeaderDashboard'
import { HRDashboard } from '@/dashboards/HRDashboard'
import { ITDashboard } from '@/dashboards/ITDashboard'
import { CorporationDashboard } from '@/dashboards/CorporationDashboard'
import { ClientDashboard } from '@/dashboards/ClientDashboard'
import { BIDashboard } from '@/dashboards/BIDashboard'

import { ProfilePage } from '@/pages/ProfilePage'
import { UsersPage } from '@/pages/UsersPage'
import { AttendancePage } from '@/pages/AttendancePage'
import { PayrollPage } from '@/pages/PayrollPage'
import { PayslipsPage } from '@/pages/PayslipsPage'
import { ContractsPage } from '@/pages/ContractsPage'
import { DocumentsPage } from '@/pages/DocumentsPage'
import { SupportPage } from '@/pages/SupportPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { CorporationsPage } from '@/pages/CorporationsPage'
import { AssetsPage } from '@/pages/AssetsPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { AnnouncementsPage } from '@/pages/AnnouncementsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SecurityLogsPage } from '@/pages/SecurityLogsPage'
import { ActivityLogPage } from '@/pages/ActivityLogPage'
import { TasksPage } from '@/pages/TasksPage'
import { LeavePage } from '@/pages/LeavePage'
import { PerformancePage } from '@/pages/PerformancePage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { PublicFormsPage } from '@/pages/PublicFormsPage'
import { RolesPage } from '@/pages/RolesPage'
import { SupportCenterDashPage } from '@/pages/SupportCenterDashPage'

import type { Permission } from '@/types'
import type { ReactNode } from 'react'

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading, profile } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="text-center">
          <div className="inline-block h-10 w-10 rounded-full border-2 border-brand-violet/30 border-t-brand-violet animate-spin" />
          <p className="mt-3 text-sm text-slate-400">Loading MYNE7X BPO...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Force password change gate
  if (profile?.must_change_password && !window.location.pathname.startsWith('/force-change-password')) {
    return <Navigate to="/force-change-password" replace />
  }

  return <>{children}</>
}

function RequireRole({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { profile } = useAuth()
  if (!profile || !roles.includes(profile.role)) {
    return <AccessDeniedPage message={ACCESS_DENIED_MESSAGE} />
  }
  return <>{children}</>
}

function RequirePermission({ permission, children }: { permission: Permission; children: ReactNode }) {
  const { profile } = useAuth()
  if (!profile || !hasPermission(profile.role, permission)) {
    return <AccessDeniedPage message={ACCESS_DENIED_MESSAGE} />
  }
  return <>{children}</>
}

function DashboardRouter() {
  const { profile } = useAuth()
  if (!profile) return <Navigate to="/login" replace />

  const role = profile.role
  switch (role) {
    case 'super_admin': return <SuperAdminDashboard />
    case 'admin': return <AdminDashboard />
    case 'agent': return <AgentDashboard />
    case 'team_leader': return <TeamLeaderDashboard />
    case 'hr': return <HRDashboard />
    case 'it': return <ITDashboard />
    case 'corporation': return <CorporationDashboard />
    case 'client': return <ClientDashboard />
    case 'bi': return <BIDashboard />
    default: return <AccessDeniedPage />
  }
}

function getRoleBasePath(role: UserRole | undefined): string {
  if (!role) return '/dashboard'
  return ROLES[role].dashboardPath
}

// Wrapper that renders a dashboard page inside the shared DashboardLayout
function DashPage({ children, permission }: { children: ReactNode; permission?: Permission }) {
  if (permission) {
    return (
      <RequirePermission permission={permission}>
        <DashboardLayout>{children}</DashboardLayout>
      </RequirePermission>
    )
  }
  return <DashboardLayout>{children}</DashboardLayout>
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/customer-support" element={<CustomerSupportPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiePage />} />
          <Route path="/support-center" element={<SupportCenterPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/force-change-password"
          element={
            <RequireAuth>
              <ForceChangePasswordPage />
            </RequireAuth>
          }
        />

        {/* Dashboard hub — auto routes by role */}
        <Route path="/dashboard" element={<RequireAuth><DashboardLayout><DashboardRouter /></DashboardLayout></RequireAuth>} />

        {/* Role-scoped dashboards */}
        <Route path="/super-admin/*" element={<RequireAuth><RequireRole roles={['super_admin']}><DashboardLayout><SuperAdminDashboard /></DashboardLayout></RequireRole></RequireAuth>} />
        <Route path="/admin/*" element={<RequireAuth><RequireRole roles={['super_admin', 'admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></RequireRole></RequireAuth>} />
        <Route path="/agent/*" element={<RequireAuth><RequireRole roles={['super_admin', 'agent']}><DashboardLayout><AgentDashboard /></DashboardLayout></RequireRole></RequireAuth>} />
        <Route path="/team-leader/*" element={<RequireAuth><RequireRole roles={['super_admin', 'team_leader']}><DashboardLayout><TeamLeaderDashboard /></DashboardLayout></RequireRole></RequireAuth>} />
        <Route path="/hr/*" element={<RequireAuth><RequireRole roles={['super_admin', 'hr']}><DashboardLayout><HRDashboard /></DashboardLayout></RequireRole></RequireAuth>} />
        <Route path="/it/*" element={<RequireAuth><RequireRole roles={['super_admin', 'it']}><DashboardLayout><ITDashboard /></DashboardLayout></RequireRole></RequireAuth>} />
        <Route path="/corporation/*" element={<RequireAuth><RequireRole roles={['super_admin', 'corporation']}><DashboardLayout><CorporationDashboard /></DashboardLayout></RequireRole></RequireAuth>} />
        <Route path="/client-team/*" element={<RequireAuth><RequireRole roles={['super_admin', 'client']}><DashboardLayout><ClientDashboard /></DashboardLayout></RequireRole></RequireAuth>} />
        <Route path="/bi/*" element={<RequireAuth><RequireRole roles={['super_admin', 'bi']}><DashboardLayout><BIDashboard /></DashboardLayout></RequireRole></RequireAuth>} />

        {/* Shared module routes — accessible from any role-scoped dashboard via sidebar */}
        <Route path="/profile" element={<RequireAuth><DashboardLayout><ProfilePage /></DashboardLayout></RequireAuth>} />

        {/* Errors */}
        <Route path="/403" element={<AccessDeniedPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}
