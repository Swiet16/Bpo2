import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert, Home, ArrowLeft, LogIn } from 'lucide-react'
import { Logo } from '@/components/Logo'

interface AccessDeniedPageProps {
  message?: string
}

export function AccessDeniedPage({ message }: AccessDeniedPageProps) {
  const navigate = useNavigate()
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
          <div className="inline-flex p-4 rounded-2xl bg-rose-500/15 ring-1 ring-rose-500/20 mb-6">
            <ShieldAlert className="h-10 w-10 text-rose-400" />
          </div>
          <p className="text-7xl font-bold font-display gradient-text mb-2">403</p>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-sm text-slate-400 mb-2">
            {message || 'You do not have permission to access this resource.'}
          </p>
          <p className="text-xs text-slate-500 mb-6">
            If you believe this is an error, contact your administrator.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button onClick={() => navigate(-1)} className="btn-secondary">
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
            <Link to="/dashboard" className="btn-primary">
              <Home className="h-4 w-4" /> Go Dashboard
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <Link to="/login" className="text-xs text-slate-500 hover:text-brand-violet inline-flex items-center gap-1">
              <LogIn className="h-3 w-3" /> Switch account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
