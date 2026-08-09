import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnimatedCounter } from './AnimatedCounter'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  accent?: 'violet' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo'
  delta?: { value: string; positive?: boolean }
  prefix?: string
  suffix?: string
  format?: boolean
}

const accentMap = {
  violet: { bg: 'from-violet-500/20 to-violet-600/5', icon: 'bg-violet-500/20 text-violet-300', ring: 'ring-violet-500/20' },
  blue: { bg: 'from-blue-500/20 to-blue-600/5', icon: 'bg-blue-500/20 text-blue-300', ring: 'ring-blue-500/20' },
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/5', icon: 'bg-cyan-500/20 text-cyan-300', ring: 'ring-cyan-500/20' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/5', icon: 'bg-emerald-500/20 text-emerald-300', ring: 'ring-emerald-500/20' },
  amber: { bg: 'from-amber-500/20 to-amber-600/5', icon: 'bg-amber-500/20 text-amber-300', ring: 'ring-amber-500/20' },
  rose: { bg: 'from-rose-500/20 to-rose-600/5', icon: 'bg-rose-500/20 text-rose-300', ring: 'ring-rose-500/20' },
  indigo: { bg: 'from-indigo-500/20 to-indigo-600/5', icon: 'bg-indigo-500/20 text-indigo-300', ring: 'ring-indigo-500/20' },
}

export function StatCard({ label, value, icon: Icon, accent = 'violet', delta, prefix, suffix, format = true }: StatCardProps) {
  const colors = accentMap[accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('premium-card p-5 bg-gradient-to-br', colors.bg)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              format={format}
              className="text-3xl font-bold text-white font-display tracking-tight"
            />
          </div>
          {delta && (
            <p className={cn(
              'mt-1 text-xs font-medium',
              delta.positive === false ? 'text-rose-400' : 'text-emerald-400'
            )}>
              {delta.value}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl ring-1', colors.icon, colors.ring)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}
