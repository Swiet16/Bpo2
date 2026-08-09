import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile, UserRole } from '@/types'

interface AuthContextValue {
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string; mustChangePassword?: boolean }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updatePassword: (newPassword: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Fallback profile builder when no DB row exists yet (e.g. first super admin login)
function buildFallbackProfile(email: string): Profile | null {
  if (!email) return null
  const isSuper = email.toLowerCase() === (import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'myne7x@gmail.com').toLowerCase()
  return {
    id: 'pending-' + email,
    email,
    full_name: isSuper ? 'MYNE7X CEO' : email.split('@')[0],
    role: isSuper ? 'super_admin' : 'agent',
    employment_status: 'active',
    must_change_password: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId: string, email: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.warn('[Auth] Profile load error:', error.message)
        setProfile(buildFallbackProfile(email))
        return
      }

      if (data) {
        // Enforce super_admin override if email matches protected account
        const protectedEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'myne7x@gmail.com'
        if (email.toLowerCase() === protectedEmail.toLowerCase() && data.role !== 'super_admin') {
          // Update profile to super_admin (database RLS should also enforce this)
          const { error: updateErr } = await supabase
            .from('profiles')
            .update({ role: 'super_admin', employment_status: 'active' })
            .eq('id', userId)
          if (updateErr) console.warn('[Auth] Could not enforce super_admin role:', updateErr.message)
          data.role = 'super_admin'
        }
        setProfile(data as Profile)
      } else {
        // No profile row — auto-provision for the protected super admin
        const fallback = buildFallbackProfile(email)
        if (fallback) {
          try {
            await supabase.from('profiles').upsert({
              id: userId,
              email,
              full_name: fallback.full_name,
              role: fallback.role,
              employment_status: 'active',
            })
          } catch (e) {
            console.warn('[Auth] Could not auto-provision profile:', e)
          }
          setProfile(fallback)
        }
      }
    } catch (err) {
      console.error('[Auth] loadProfile exception:', err)
      setProfile(buildFallbackProfile(email))
    }
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      setSession(data.session)
      if (data.session?.user) {
        await loadProfile(data.session.user.id, data.session.user.email || '')
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      if (newSession?.user) {
        await loadProfile(newSession.user.id, newSession.user.email || '')
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      if (data.user) {
        await loadProfile(data.user.id, data.user.email || '')
      }
      return {}
    } catch (err: any) {
      return { error: err?.message || 'Login failed' }
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }

  async function refreshProfile() {
    if (session?.user) {
      await loadProfile(session.user.id, session.user.email || '')
    }
  }

  async function updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) return { error: error.message }
      // Clear must_change_password flag
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({ must_change_password: false })
          .eq('id', session.user.id)
      }
      await refreshProfile()
      return {}
    } catch (err: any) {
      return { error: err?.message || 'Password update failed' }
    }
  }

  return (
    <AuthContext.Provider
      value={{ session, profile, loading, signIn, signOut, refreshProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useRole(): UserRole | undefined {
  return useAuth().profile?.role
}
