import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { box: 'h-8 w-8', text: 'text-base', icon: 16 },
    md: { box: 'h-10 w-10', text: 'text-xl', icon: 20 },
    lg: { box: 'h-14 w-14', text: 'text-2xl', icon: 28 },
  }
  const s = sizes[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn('relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet via-brand-indigo to-brand-cyan shadow-glow-violet', s.box)}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" className="text-white">
          <path
            d="M4 4h4v16H4V4zm6 0h4v16h-4V4zm6 0h4v16h-4V4z"
            fill="currentColor"
            opacity="0.95"
          />
          <circle cx="6" cy="6" r="1.5" fill="#06b6d4" />
          <circle cx="12" cy="18" r="1.5" fill="#a855f7" />
          <circle cx="18" cy="6" r="1.5" fill="#3b82f6" />
        </svg>
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 pointer-events-none" />
      </div>
      {showText && (
        <div className="leading-none">
          <div className={cn('font-display font-extrabold tracking-tight text-white', s.text)}>
            MYNE7<span className="gradient-text">X</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">BPO Platform</div>
        </div>
      )}
    </div>
  )
}
