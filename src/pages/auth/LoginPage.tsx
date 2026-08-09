import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Shield, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Logo } from '@/components/Logo'
import { SUPER_ADMIN_EMAIL } from '@/lib/supabase'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    const { error: signInError } = await signIn(email.trim(), password)
    setLoading(false)

    if (signInError) {
      setError(signInError)
      toast.error(signInError)
      return
    }

    toast.success('Welcome back!')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" />
      <div className="absolute inset-0 bg-radial-glow" />
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand-cyan/20 blur-3xl"
      />

      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
        <Link to="/">
          <Logo size="lg" />
        </Link>
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-5xl font-bold font-display tracking-tight text-white leading-tight">
              Enterprise <span className="gradient-text">BPO</span><br />Operations Platform
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-md">
              Workforce management, payroll, contracts, support, and analytics — unified in one premium command center.
            </p>
          </motion.div>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {[
              { label: 'Employees', value: '248+' },
              { label: 'Clients', value: '32+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="premium-card p-4">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} MYNE7X BPO. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/"><Logo size="md" /></Link>
          </div>
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-brand-violet/20 to-brand-indigo/10 ring-1 ring-brand-violet/30 mb-4">
                <Shield className="h-6 w-6 text-brand-violet" />
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-400">Sign in to access your dashboard</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Email or Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@myne7x.com" autoComplete="email" autoFocus className="input-field pl-10" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="input-label">Password</label>
                  <Link to="/forgot-password" className="text-xs text-brand-violet hover:text-brand-purple transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" aria-label={showPwd ? 'Hide password' : 'Show password'}>
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-white/10 bg-navy-900 text-brand-violet focus:ring-brand-violet/30" />
                  <span className="text-sm text-slate-300">Remember me</span>
                </label>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : (<><LogIn className="h-4 w-4" /> Sign In</>)}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-slate-500 text-center">
                Protected CEO Account: <span className="text-slate-400 font-mono">{SUPER_ADMIN_EMAIL}</span>
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <Shield className="h-3 w-3" />
                <span>Secured by Supabase Authentication · Role-based access control enforced</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/careers" className="text-brand-violet hover:text-brand-purple inline-flex items-center gap-1">
              Join our team <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
