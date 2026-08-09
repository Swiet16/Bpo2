import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, Shield, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Logo } from '@/components/Logo'

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

export function ForceChangePasswordPage() {
  const { updatePassword, signOut } = useAuth()
  const navigate = useNavigate()
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const strength = scorePassword(newPwd)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newPwd.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (strength.score < 3) {
      setError('Password is too weak. Use a mix of letters, numbers, and symbols.')
      return
    }
    if (newPwd !== confirmPwd) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const { error: err } = await updatePassword(newPwd)
    setLoading(false)
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    toast.success('Password updated successfully!')
    navigate('/dashboard')
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
          <Link to="/"><Logo size="md" /></Link>
        </div>
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 ring-1 ring-amber-500/20 mb-4">
              <KeyRound className="h-6 w-6 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Change Your Password</h2>
            <p className="mt-2 text-sm text-slate-400">
              Your temporary password must be changed before continuing.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={show ? 'text' : 'password'}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="input-field pl-10 pr-10"
                />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPwd && (
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
              <label className="input-label">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={show ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
              {confirmPwd && confirmPwd !== newPwd && (
                <p className="mt-1 text-xs text-rose-400">Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Update Password'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Shield className="h-3 w-3" />
            <span>Your temporary password will be invalidated after this change.</span>
          </div>

          <button
            onClick={() => { signOut(); navigate('/login') }}
            className="mt-4 w-full text-xs text-slate-500 hover:text-slate-300"
          >
            Sign out instead
          </button>
        </div>
      </motion.div>
    </div>
  )
}
