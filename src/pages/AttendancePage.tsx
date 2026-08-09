import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, CalendarX, CalendarCheck, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { attendanceService } from '@/lib/services'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { Attendance } from '@/types'

const mockAttendance: Attendance[] = Array.from({ length: 15 }).map((_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - i)
  const statuses = ['present', 'present', 'present', 'late', 'present', 'absent', 'leave'] as const
  const status = statuses[i % statuses.length]
  const checkIn = status === 'present' ? '09:00' : status === 'late' ? '09:30' : null
  const checkOut = status === 'present' || status === 'late' ? '18:00' : null
  return {
    id: String(i + 1),
    user_id: '',
    date: date.toISOString().split('T')[0],
    check_in: checkIn ? new Date(`${date.toISOString().split('T')[0]}T${checkIn}:00`).toISOString() : null,
    check_out: checkOut ? new Date(`${date.toISOString().split('T')[0]}T${checkOut}:00`).toISOString() : null,
    status,
    working_hours: checkIn && checkOut ? 9 : 0,
    late_minutes: status === 'late' ? 30 : 0,
    created_at: date.toISOString(),
  }
})

export function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await attendanceService.listAll()
      if (mounted) {
        setRecords(data && data.length ? data : mockAttendance)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = records.filter((r) => !filterStatus || r.status === filterStatus)
  const today = new Date().toISOString().split('T')[0]
  const todayRec = records.find((r) => r.date === today)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Management"
        description="Track and manage employee attendance across the organization"
        icon={<Calendar className="h-5 w-5 text-brand-cyan" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Attendance' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Present Today" value={221} icon={CalendarCheck} accent="emerald" />
        <StatCard label="Absent Today" value={27} icon={CalendarX} accent="rose" />
        <StatCard label="Late Today" value={12} icon={Clock} accent="amber" />
        <StatCard label="On Leave" value={8} icon={Calendar} accent="blue" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['date', 'status'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'Present', value: 'present' },
              { label: 'Late', value: 'late' },
              { label: 'Absent', value: 'absent' },
              { label: 'Leave', value: 'leave' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No attendance records available."
          columns={[
            { key: 'date', header: 'Date', sortable: true, sortValue: (r) => r.date, render: (r) => <span className="text-sm">{formatDate(r.date)}</span> },
            { key: 'check_in', header: 'Check In', render: (r) => <span className="font-mono text-xs">{r.check_in ? formatDateTime(r.check_in).split(',')[1]?.trim() : '—'}</span> },
            { key: 'check_out', header: 'Check Out', render: (r) => <span className="font-mono text-xs">{r.check_out ? formatDateTime(r.check_out).split(',')[1]?.trim() : '—'}</span> },
            { key: 'working_hours', header: 'Hours', render: (r) => <span className="text-xs">{r.working_hours ? `${r.working_hours}h` : '—'}</span> },
            { key: 'late_minutes', header: 'Late', render: (r) => <span className="text-xs">{r.late_minutes ? `${r.late_minutes}m` : '—'}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      )}
    </div>
  )
}
