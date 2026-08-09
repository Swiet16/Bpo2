import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail, Lock, Eye, EyeOff, User, UserPlus, AlertCircle, Shield,
  ArrowRight, ArrowLeft, CheckCircle, Phone, Building,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Logo } from '@/components/Logo'
import { supabase } from '@/lib/supabase'

function scorePassword(pwd: string): { score: number; label: string; color: string } {
  let s = 0
  if (pwd.length >= 8) s++
  if (pwd.length >= 12) s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[0-9]/.test(pwd)) s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent']
  const colors = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-400']
  return { score: s, label: labels[s], color: colors[s] }
}

export function SignupPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPwd: '',
    agree: false,
  })
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const strength = scorePassword(form.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.full_name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!form.email.trim()) {
      setError('Please enter your email.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (strength.score < 3) {
      setError('Password is too weak. Use a mix of uppercase, numbers, and symbols.')
      return
    }
    if (form.password !== form.confirmPwd) {
      setError('Passwords do not match.')
      return
    }
    if (!form.agree) {
      setError('Please accept the Terms & Conditions to continue.')
      return
    }

    setLoading(true)
    try {
      // Step 1: Create auth user via Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            company: form.company.trim(),
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        toast.error(signUpError.message)
        return
      }

      // Step 2: If email confirmation is required, tell the user
      if (!signUpData.session) {
        toast.success('Account created! Check your email to confirm, then sign in.')
        navigate('/login', { state: { msg: 'Account created! Please check your email to confirm your account, then sign in.' } })
        return
      }

      // Step 3: Auto-sign in if no email confirmation required
      // The handle_new_user trigger in DB will auto-create the profile
      await signIn(form.email.trim().toLowerCase(), form.password)
      toast.success(`Welcome to MYNE7X BPO, ${form.full_name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Signup failed. Please try again.')
      toast.error(err?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-navy-950">
      {/* Animated background */}
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

      {/* Left side — brand showcase (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
        <Link to="/">
          <Logo size="lg" />
        </Link>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold font-display tracking-tight text-white leading-tight">
              Join the <span className="gradient-text">MYNE7X</span><br />BPO Platform
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-md">
              Create your account to access the enterprise BPO operations platform — workforce management, payroll, contracts, support, and analytics in one premium command center.
            </p>
          </motion.div>

          <div className="space-y-3 max-w-md">
            {[
              { icon: Shield, title: 'Enterprise-grade security', desc: 'Role-based access control & audit logging' },
              { icon: CheckCircle, title: 'Instant access', desc: 'No waiting period — start using your dashboard immediately' },
              { icon: UserPlus, title: 'Auto-provisioned profile', desc: 'Your account is set up automatically on signup' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="p-2 rounded-lg bg-brand-violet/15 text-brand-violet">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MYNE7X BPO. All rights reserved.
        </p>
      </div>

      {/* Right side — signup form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/"><Logo size="md" /></Link>
          </div>

          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-brand-violet/20 to-brand-indigo/10 ring-1 ring-brand-violet/30 mb-4">
                <UserPlus className="h-6 w-6 text-brand-violet" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="mt-1 text-sm text-slate-400">Join the MYNE7X BPO platform</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="John Doe"
                    autoFocus
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Inc."
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${i < strength.score ? strength.color : 'bg-white/10'}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{strength.label}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="input-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPwd}
                    onChange={(e) => setForm({ ...form, confirmPwd: e.target.value })}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.confirmPwd && form.confirmPwd !== form.password && (
                  <p className="mt-1 text-xs text-rose-400">Passwords do not match</p>
                )}
                {form.confirmPwd && form.confirmPwd === form.password && form.password.length >= 8 && (
                  <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Passwords match
                  </p>
                )}
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-white/10 bg-navy-900 text-brand-violet focus:ring-brand-violet/30"
                />
                <span className="text-xs text-slate-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-brand-violet hover:underline">Terms & Conditions</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-brand-violet hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <Shield className="h-3 w-3" />
              <span>Secured by Supabase Authentication · Role-based access control</span>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-violet hover:text-brand-purple inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
