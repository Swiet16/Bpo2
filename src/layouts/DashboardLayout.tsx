import { type ReactNode, useState, useEffect, useMemo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Shield, Headphones, UserCog, Calendar,
  Wallet, FileText, FolderOpen, Building2, Briefcase, Cpu, BarChart3,
  ClipboardList, Bell, Megaphone, Mail, Settings, Search, Menu, X,
  LogOut, ChevronDown, User, Command, Clock, FileSpreadsheet, AlertTriangle,
  Network, GitBranch, Award, LifeBuoy,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES, type UserRole, type Permission } from '@/types'
import { hasPermission } from '@/lib/permissions'
import { cn, initials } from '@/lib/utils'
import { CommandPalette } from '@/components/CommandPalette'
import { NotificationsPanel } from '@/components/NotificationsPanel'
import { GlobalSearch } from '@/components/GlobalSearch'
import { supabase } from '@/lib/supabase'

interface NavItem {
  label: string
  href: string
  icon: any
  permission?: Permission
  badge?: number
}

interface NavSection {
  title?: string
  items: NavItem[]
}

function getAllNavSections(role: UserRole | undefined): NavSection[] {
  if (!role) return []
  const roleInfo = ROLES[role]
  const basePath = roleInfo.dashboardPath

  const sections: NavSection[] = []

  // Common dashboard
  sections.push({
    items: [
      { label: 'Dashboard', href: basePath, icon: LayoutDashboard },
    ],
  })

  // User management — for elevated roles
  if (hasPermission(role, 'view_users') || hasPermission(role, 'view_all_employees')) {
    sections.push({
      title: 'People',
      items: [
        ...(hasPermission(role, 'view_all_employees') ? [{ label: 'Users', href: `${basePath}/users`, icon: Users, permission: 'view_users' as Permission }] : []),
        ...(hasPermission(role, 'view_all_employees') && role !== 'agent' && role !== 'bi' ? [{ label: 'Employees', href: `${basePath}/employees`, icon: UserCog }] : []),
        ...(role === 'super_admin' ? [{ label: 'Roles & Permissions', href: `${basePath}/roles`, icon: Shield, permission: 'change_roles' as Permission }] : []),
        ...(hasPermission(role, 'manage_attendance') ? [{ label: 'Attendance', href: `${basePath}/attendance`, icon: Calendar, permission: 'manage_attendance' as Permission }] : []),
        ...(hasPermission(role, 'manage_leave') ? [{ label: 'Leave Requests', href: `${basePath}/leave`, icon: Clock, permission: 'manage_leave' as Permission }] : []),
      ].filter(Boolean),
    })
  }

  // Agent-only navigation
  if (role === 'agent') {
    sections.push({
      title: 'My Workspace',
      items: [
        { label: 'My Attendance', href: `${basePath}/attendance`, icon: Calendar },
        { label: 'My Salary', href: `${basePath}/salary`, icon: Wallet },
        { label: 'My Payslips', href: `${basePath}/payslips`, icon: FileText },
        { label: 'My Contracts', href: `${basePath}/contracts`, icon: FileText },
        { label: 'My Tasks', href: `${basePath}/tasks`, icon: ClipboardList },
        { label: 'My Documents', href: `${basePath}/documents`, icon: FolderOpen },
      ],
    })
  }

  // Payroll
  if (hasPermission(role, 'manage_payroll') || hasPermission(role, 'manage_payslips')) {
    sections.push({
      title: 'Payroll',
      items: [
        ...(hasPermission(role, 'manage_payroll') ? [{ label: 'Payroll', href: `${basePath}/payroll`, icon: Wallet, permission: 'manage_payroll' as Permission }] : []),
        ...(hasPermission(role, 'manage_payslips') ? [{ label: 'Payslips', href: `${basePath}/payslips`, icon: FileText, permission: 'manage_payslips' as Permission }] : []),
        ...(hasPermission(role, 'manage_contracts') ? [{ label: 'Contracts', href: `${basePath}/contracts`, icon: FileText, permission: 'manage_contracts' as Permission }] : []),
      ].filter(Boolean),
    })
  }

  // Operations
  const opsItems: NavItem[] = []
  if (hasPermission(role, 'manage_clients')) opsItems.push({ label: 'Clients', href: `${basePath}/clients`, icon: Briefcase, permission: 'manage_clients' })
  if (hasPermission(role, 'manage_corporations')) opsItems.push({ label: 'Corporations', href: `${basePath}/corporations`, icon: Building2, permission: 'manage_corporations' })
  if (hasPermission(role, 'manage_support') || hasPermission(role, 'manage_tickets')) opsItems.push({ label: 'Support', href: `${basePath}/support`, icon: Headphones, permission: 'manage_tickets' })
  if (hasPermission(role, 'manage_tasks')) opsItems.push({ label: 'Tasks', href: `${basePath}/tasks`, icon: ClipboardList, permission: 'manage_tasks' })
  if (hasPermission(role, 'manage_assets')) opsItems.push({ label: 'IT Assets', href: `${basePath}/assets`, icon: Cpu, permission: 'manage_assets' })

  if (opsItems.length > 0) {
    sections.push({ title: 'Operations', items: opsItems })
  }

  // Performance
  if (hasPermission(role, 'manage_performance')) {
    sections.push({
      title: 'Performance',
      items: [
        { label: 'Performance', href: `${basePath}/performance`, icon: Award, permission: 'manage_performance' },
      ],
    })
  }

  // Insights
  if (hasPermission(role, 'view_analytics')) {
    sections.push({
      title: 'Insights',
      items: [
        { label: 'BI Analytics', href: `${basePath}/analytics`, icon: BarChart3, permission: 'view_analytics' },
        { label: 'Reports', href: `${basePath}/reports`, icon: FileSpreadsheet, permission: 'export_reports' },
      ],
    })
  }

  // Communication
  const commItems: NavItem[] = [
    { label: 'Announcements', href: `${basePath}/announcements`, icon: Megaphone },
    { label: 'Support Center', href: `${basePath}/support-center`, icon: LifeBuoy },
  ]
  if (role === 'super_admin' || role === 'hr') {
    commItems.unshift({ label: 'Public Forms', href: `${basePath}/public-forms`, icon: Mail })
  }
  sections.push({ title: 'Communication', items: commItems })

  // Admin
  if (role === 'super_admin') {
    sections.push({
      title: 'Administration',
      items: [
        { label: 'Security Logs', href: `${basePath}/security-logs`, icon: AlertTriangle, permission: 'view_security_logs' },
        { label: 'System Activity', href: `${basePath}/activity`, icon: Network, permission: 'view_audit_logs' },
        { label: 'Settings', href: `${basePath}/settings`, icon: Settings, permission: 'manage_settings' },
      ],
    })
  } else if (hasPermission(role, 'manage_settings')) {
    sections.push({
      title: 'Administration',
      items: [
        { label: 'Settings', href: `${basePath}/settings`, icon: Settings, permission: 'manage_settings' },
      ],
    })
  }

  return sections
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((v) => !v)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const navSections = useMemo(() => getAllNavSections(profile?.role), [profile?.role])

  const roleInfo = profile?.role ? ROLES[profile.role] : null

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-navy-900/80 backdrop-blur-xl border-r border-white/5 z-40">
        <div className="p-4 border-b border-white/5">
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">
          {navSections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <p className="px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === roleInfo?.dashboardPath}
                    className={({ isActive }) =>
                      cn('sidebar-link', isActive && 'sidebar-link-active')
                    }
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <div className="premium-card p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center text-white text-sm font-semibold">
              {initials(profile?.full_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name}</p>
              <p className="text-[10px] text-slate-400 truncate">{roleInfo?.label}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-rose-400 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar — mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-navy-900 border-r border-white/5 z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">
                {navSections.map((section, si) => (
                  <div key={si}>
                    {section.title && (
                      <p className="px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                        {section.title}
                      </p>
                    )}
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          end={item.href === roleInfo?.dashboardPath}
                          className={({ isActive }) =>
                            cn('sidebar-link', isActive && 'sidebar-link-active')
                          }
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex-1 max-w-md flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:bg-white/10 hover:border-brand-violet/30 transition-all"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search employees, tickets, contracts...</span>
              <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400 font-mono">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>

            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setCommandOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Command palette"
                title="Command palette (Ctrl+K)"
              >
                <Command className="h-5 w-5" />
              </button>
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-navy-950" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center text-white text-xs font-semibold">
                    {initials(profile?.full_name)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-white leading-tight">{profile?.full_name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{roleInfo?.label}</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-56 glass-card p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-white/5 mb-2">
                          <p className="text-sm font-medium text-white truncate">{profile?.full_name}</p>
                          <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
                          <span className={cn('badge mt-1.5', `badge-${roleInfo?.color === 'violet' ? 'violet' : 'info'}`)}>
                            {roleInfo?.label}
                          </span>
                        </div>
                        <button
                          onClick={() => { navigate('/profile'); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                        >
                          <User className="h-4 w-4" /> My Profile
                        </button>
                        <button
                          onClick={() => { navigate(`${roleInfo?.dashboardPath}/settings`); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                        >
                          <Settings className="h-4 w-4" /> Settings
                        </button>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Floating panels */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
