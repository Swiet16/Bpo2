import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PublicPageShellProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function PublicPageShell({ title, subtitle, children }: PublicPageShellProps) {
  return (
    <div className="relative">
      <section className="relative overflow-hidden pt-16 pb-12">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-white"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {children}
      </div>
    </div>
  )
}
