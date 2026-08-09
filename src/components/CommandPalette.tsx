import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserPlus, FileText, Wallet, Users, Settings, BarChart3, Headphones, Calendar, Plus, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES, type Permission } from '@/types'
import { hasPermission } from '@/lib/permissions'
import { cn } from '@/lib/utils'

interface Command {
  id: string
  label: string
  description?: string
  icon: any
  href?: string
  action?: () => void
  permission?: Permission
  keywords?: string
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const role = profile?.role
  const basePath = role ? ROLES[role].dashboardPath : '/dashboard'

  const commands = useMemo<Command[]>(() => {
    if (!role) return []
    const all: Command[] = [
      { id: 'home', label: 'Go to Dashboard', icon: BarChart3, href: basePath, keywords: 'home overview' },
      { id: 'profile', label: 'Open My Profile', icon: Users, href: '/profile', keywords: 'me account' },
    ]

    if (hasPermission(role, 'create_users')) {
      all.push({ id: 'add-user', label: 'Add New User', icon: UserPlus, href: `${basePath}/users?new=1`, permission: 'create_users', keywords: 'employee create' })
    }
    if (hasPermission(role, 'manage_payslips')) {
      all.push({ id: 'gen-payslip', label: 'Generate Payslip', icon: Wallet, href: `${basePath}/payslips?new=1`, permission: 'manage_payslips', keywords: 'salary payroll' })
    }
    if (hasPermission(role, 'manage_contracts')) {
      all.push({ id: 'gen-contract', label: 'Create Contract', icon: FileText, href: `${basePath}/contracts?new=1`, permission: 'manage_contracts', keywords: 'agreement employment' })
    }
    if (hasPermission(role, 'manage_tickets')) {
      all.push({ id: 'new-ticket', label: 'Create Support Ticket', icon: Headphones, href: `${basePath}/support?new=1`, permission: 'manage_tickets', keywords: 'help request' })
    }
    if (hasPermission(role, 'manage_attendance')) {
      all.push({ id: 'attendance', label: 'View Attendance', icon: Calendar, href: `${basePath}/attendance`, permission: 'manage_attendance' })
    }
    if (hasPermission(role, 'view_analytics')) {
      all.push({ id: 'analytics', label: 'Open BI Analytics', icon: BarChart3, href: `${basePath}/analytics`, permission: 'view_analytics' })
    }
    if (hasPermission(role, 'manage_settings')) {
      all.push({ id: 'settings', label: 'Open Settings', icon: Settings, href: `${basePath}/settings`, permission: 'manage_settings' })
    }
    if (hasPermission(role, 'export_reports')) {
      all.push({ id: 'reports', label: 'Open Reports Center', icon: FileText, href: `${basePath}/reports`, permission: 'export_reports' })
    }

    return all
  }, [role, basePath])

  const filtered = useMemo(() => {
    if (!query) return commands
    const q = query.toLowerCase()
    return commands.filter((c) =>
      c.label.toLowerCase().includes(q) ||
      c.keywords?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    )
  }, [query, commands])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const execute = (cmd: Command) => {
    if (cmd.href) navigate(cmd.href)
    cmd.action?.()
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) execute(filtered[selectedIndex])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh] bg-navy-950/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: 'spring', duration: 0.25 }}
            className="glass-card w-full max-w-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder-slate-500"
              />
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400 font-mono">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No commands match "{query}"
                </div>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      i === selectedIndex ? 'bg-brand-violet/15 text-white' : 'text-slate-300 hover:bg-white/5'
                    )}
                  >
                    <div className={cn(
                      'p-1.5 rounded-lg',
                      i === selectedIndex ? 'bg-brand-violet/30 text-white' : 'bg-white/5 text-slate-400'
                    )}>
                      <cmd.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{cmd.label}</p>
                      {cmd.description && <p className="text-xs text-slate-500">{cmd.description}</p>}
                    </div>
                    {i === selectedIndex && <ArrowRight className="h-3 w-3 text-slate-400" />}
                  </button>
                ))
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-[10px] text-slate-500">
              <span>↑↓ navigate · ↵ select · ESC close</span>
              <span>MYNE7X BPO Command Center</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
