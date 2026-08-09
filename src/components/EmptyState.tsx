import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  message: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {icon && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-brand-violet/10 to-brand-indigo/5 ring-1 ring-brand-violet/20">
          {icon}
        </div>
      )}
      {title && <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>}
      <p className="text-sm text-slate-500 max-w-sm">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
