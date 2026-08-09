import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export function ChartCard({ title, description, children, action, className }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`premium-card p-6 ${className || ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}

interface QuickActionProps {
  icon: any
  label: string
  onClick?: () => void
  href?: string
  accent?: 'violet' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo'
}

const accentColors = {
  violet: 'from-violet-500/20 to-violet-600/5 text-violet-300 ring-violet-500/20',
  blue: 'from-blue-500/20 to-blue-600/5 text-blue-300 ring-blue-500/20',
  cyan: 'from-cyan-500/20 to-cyan-600/5 text-cyan-300 ring-cyan-500/20',
  emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-300 ring-emerald-500/20',
  amber: 'from-amber-500/20 to-amber-600/5 text-amber-300 ring-amber-500/20',
  rose: 'from-rose-500/20 to-rose-600/5 text-rose-300 ring-rose-500/20',
  indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-300 ring-indigo-500/20',
}

export function QuickAction({ icon: Icon, label, onClick, href, accent = 'violet' }: QuickActionProps) {
  const content = (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-violet/30 transition-all text-left"
    >
      <div className={`p-2 rounded-lg bg-gradient-to-br ring-1 ${accentColors[accent]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium text-slate-200">{label}</span>
    </motion.button>
  )
  return content
}

interface InfoCardProps {
  label: string
  value: string | ReactNode
  icon?: any
}

export function InfoCard({ label, value, icon: Icon }: InfoCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
        {Icon && <Icon className="h-3 w-3" />}
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  )
}
