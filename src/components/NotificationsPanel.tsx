import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCheck, Info, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { notificationsService } from '@/lib/services'
import { sampleNotifications } from '@/lib/mockData'
import { timeAgo, cn } from '@/lib/utils'
import type { Notification } from '@/types'
import toast from 'react-hot-toast'

const typeMeta = {
  info: { icon: Info, color: 'text-blue-400 bg-blue-500/10' },
  success: { icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10' },
  critical: { icon: AlertOctagon, color: 'text-rose-400 bg-rose-500/10' },
}

interface NotificationsPanelProps {
  open: boolean
  onClose: () => void
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    let mounted = true
    setLoading(true)
    ;(async () => {
      let data: Notification[] = []
      if (profile?.id) {
        const dbData = await notificationsService.list(profile.id)
        if (dbData && dbData.length) data = dbData
      }
      if (!data.length) data = sampleNotifications
      if (mounted) {
        setNotifications(data)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [open, profile?.id])

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    if (profile?.id) {
      await notificationsService.markAllRead(profile.id)
    }
    toast.success('All notifications marked as read')
  }

  const handleNotificationClick = (n: Notification) => {
    if (n.link) navigate(n.link)
    onClose()
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-950/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-navy-900 border-l border-white/5 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-brand-violet" />
                <h2 className="font-semibold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="badge-violet">{unreadCount} new</span>
                )}
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 border-b border-white/5">
              <button onClick={markAllRead} className="btn-secondary w-full text-xs">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-20 w-full rounded-xl" />
                ))
              ) : notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const meta = typeMeta[n.type]
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={cn(
                        'w-full text-left p-3 rounded-xl border transition-all hover:bg-white/5',
                        n.is_read
                          ? 'border-white/5 bg-transparent'
                          : 'border-brand-violet/20 bg-brand-violet/5'
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn('p-2 rounded-lg flex-shrink-0', meta.color)}>
                          <meta.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{n.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{timeAgo(n.created_at)}</p>
                        </div>
                        {!n.is_read && <span className="h-2 w-2 rounded-full bg-brand-violet mt-1.5 flex-shrink-0" />}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
