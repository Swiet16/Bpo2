import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Logo } from '@/components/Logo'
import { supabase } from '@/lib/supabase'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) {
        toast.error(error.message)
      } else {
        setSent(true)
        toast.success('Password reset instructions sent to your email.')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-radial-glow" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block"><Logo size="md" /></Link>
        </div>
        <div className="glass-card p-8">
          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-white">Reset Password</h2>
              <p className="mt-1 text-sm text-slate-400">Enter your email and we'll send you reset instructions.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="input-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@myne7x.com"
                      autoFocus
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/20 mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Check your email</h2>
              <p className="mt-2 text-sm text-slate-400">
                We've sent password reset instructions to <span className="text-slate-300 font-mono">{email}</span>
              </p>
            </div>
          )}
          <div className="mt-6 pt-6 border-t border-white/5">
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
