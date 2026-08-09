import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ServerCrash, Home, RotateCcw } from 'lucide-react'
import { Logo } from '@/components/Logo'

export function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-radial-glow" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 text-center"
      >
        <div className="mb-8 flex justify-center">
          <Logo size="md" showText={false} />
        </div>
        <div className="glass-card p-10">
          <div className="inline-flex p-4 rounded-2xl bg-amber-500/15 ring-1 ring-amber-500/20 mb-6">
            <ServerCrash className="h-10 w-10 text-amber-400" />
          </div>
          <p className="text-7xl font-bold font-display gradient-text mb-2">500</p>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-slate-400 mb-6">
            Connection problem. Please try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button onClick={() => window.location.reload()} className="btn-secondary">
              <RotateCcw className="h-4 w-4" /> Retry
            </button>
            <Link to="/" className="btn-primary">
              <Home className="h-4 w-4" /> Go Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
