import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Users, Headphones, Briefcase, Building2, FileText, Wallet, FolderOpen, BarChart3 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES, type Permission } from '@/types'
import { hasPermission } from '@/lib/permissions'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  type: 'people' | 'tickets' | 'clients' | 'corporations' | 'contracts' | 'payslips' | 'documents' | 'reports'
  href: string
}

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

const categoryIcons = {
  people: Users,
  tickets: Headphones,
  clients: Briefcase,
  corporations: Building2,
  contracts: FileText,
  payslips: Wallet,
  documents: FolderOpen,
  reports: BarChart3,
}

const categoryLabels = {
  people: 'People',
  tickets: 'Tickets',
  clients: 'Clients',
  corporations: 'Corporations',
  contracts: 'Contracts',
  payslips: 'Payslips',
  documents: 'Documents',
  reports: 'Reports',
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const role = profile?.role
  const basePath = role ? ROLES[role].dashboardPath : '/dashboard'

  // Build available result categories based on permissions
  const results = useMemo<SearchResult[]>(() => {
    if (!query || query.length < 2 || !role) return []
    const q = query.toLowerCase()
    const out: SearchResult[] = []

    // Static navigation-based results — guide users to the right module
    if (hasPermission(role, 'view_users') || hasPermission(role, 'view_all_employees')) {
      out.push({
        id: 'people-search', title: 'Browse all employees', subtitle: 'Open the user directory',
        type: 'people', href: `${basePath}/users`,
      })
    }
    if (hasPermission(role, 'manage_tickets') || hasPermission(role, 'manage_support')) {
      out.push({
        id: 'ticket-search', title: 'Search support tickets', subtitle: 'Open ticket center',
        type: 'tickets', href: `${basePath}/support`,
      })
    }
    if (hasPermission(role, 'manage_clients')) {
      out.push({
        id: 'client-search', title: 'Search clients', subtitle: 'Open client directory',
        type: 'clients', href: `${basePath}/clients`,
      })
    }
    if (hasPermission(role, 'manage_corporations')) {
      out.push({
        id: 'corp-search', title: 'Search corporate accounts', subtitle: 'Open corporate directory',
        type: 'corporations', href: `${basePath}/corporations`,
      })
    }
    if (hasPermission(role, 'manage_contracts')) {
      out.push({
        id: 'contract-search', title: 'Search contracts', subtitle: 'Open contract management',
        type: 'contracts', href: `${basePath}/contracts`,
      })
    }
    if (hasPermission(role, 'manage_payslips')) {
      out.push({
        id: 'payslip-search', title: 'Search payslips', subtitle: 'Open payslip management',
        type: 'payslips', href: `${basePath}/payslips`,
      })
    }
    if (hasPermission(role, 'view_analytics')) {
      out.push({
        id: 'report-search', title: 'Open reports center', subtitle: 'Generate & download reports',
        type: 'reports', href: `${basePath}/reports`,
      })
    }

    return out.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.subtitle?.toLowerCase().includes(q) ||
      r.type.includes(q)
    )
  }, [query, role, basePath])

  // Group results by category
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>()
    for (const r of results) {
      if (!map.has(r.type)) map.set(r.type, [])
      map.get(r.type)!.push(r)
    }
    return Array.from(map.entries())
  }, [results])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] bg-navy-950/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="glass-card w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <Search className="h-5 w-5 text-brand-violet" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across authorized records..."
                className="flex-1 bg-transparent border-0 outline-none text-base text-white placeholder-slate-500"
              />
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.length < 2 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  Type at least 2 characters to search
                </div>
              ) : grouped.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No results found for "{query}"
                </div>
              ) : (
                grouped.map(([category, items]) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons]
                  return (
                    <div key={category} className="py-2">
                      <p className="px-4 py-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                        <Icon className="h-3 w-3" /> {categoryLabels[category as keyof typeof categoryLabels]}
                      </p>
                      {items.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => { navigate(r.href); onClose() }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{r.title}</p>
                            {r.subtitle && <p className="text-xs text-slate-500 truncate">{r.subtitle}</p>}
                          </div>
                        </button>
                      ))}
                    </div>
                  )
                })
              )}
            </div>

            <div className="px-4 py-2 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Only showing records you're authorized to see</span>
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/5 font-mono">ESC</kbd>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
