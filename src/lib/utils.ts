import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'PKR'): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

export function formatDate(date?: string | Date | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  })
}

export function formatDateTime(date?: string | Date | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(date?: string | Date | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export function generateReferenceNo(prefix: string, seq: number): string {
  const padded = String(seq).padStart(6, '0')
  return `${prefix}-${padded}`
}

export function generateTicketNo(): string {
  return `MYN-SUP-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
}

export function initials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'badge-success',
    approved: 'badge-success',
    published: 'badge-success',
    paid: 'badge-success',
    resolved: 'badge-success',
    done: 'badge-success',
    present: 'badge-success',
    hired: 'badge-success',
    pending: 'badge-warning',
    draft: 'badge-warning',
    new: 'badge-info',
    assigned: 'badge-info',
    in_progress: 'badge-info',
    reviewing: 'badge-info',
    shortlisted: 'badge-info',
    'expiring_soon': 'badge-warning',
    'on_leave': 'badge-warning',
    late: 'badge-warning',
    half_day: 'badge-warning',
    urgent: 'badge-danger',
    high: 'badge-warning',
    critical: 'badge-danger',
    failed: 'badge-danger',
    rejected: 'badge-danger',
    cancelled: 'badge-danger',
    terminated: 'badge-danger',
    expired: 'badge-danger',
    closed: 'badge-violet',
    archived: 'badge-violet',
    suspended: 'badge-danger',
    inactive: 'badge-violet',
    prospect: 'badge-info',
    absent: 'badge-danger',
    blocked: 'badge-danger',
  }
  return map[status?.toLowerCase()] || 'badge-info'
}

export function humanStatus(status: string): string {
  return status
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function calculateWorkingHours(checkIn?: string | null, checkOut?: string | null): number {
  if (!checkIn || !checkOut) return 0
  const start = new Date(checkIn).getTime()
  const end = new Date(checkOut).getTime()
  return Math.max(0, (end - start) / (1000 * 60 * 60))
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' })
}
