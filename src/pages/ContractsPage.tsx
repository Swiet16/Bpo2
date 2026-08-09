import { useEffect, useState } from 'react'
import { FileText, Download, Eye, Plus, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { contractsService } from '@/lib/services'
import { formatCurrency, formatDate } from '@/lib/utils'
import { generateContractPDF } from '@/lib/pdfEngine'
import type { Contract } from '@/types'
import toast from 'react-hot-toast'
import { CheckCircle, Clock, FileCheck, AlertCircle } from 'lucide-react'

const mockContracts: Contract[] = [
  { id: '1', user_id: '1', position: 'Chief Executive Officer', department: 'Executive', start_date: '2013-01-01', end_date: null, salary: 500000, working_hours: '40h/week', work_location: 'On-site', employment_type: 'permanent', responsibilities: 'Strategic leadership, board governance, executive decision-making', benefits: 'Health insurance, performance bonus, stock options', confidentiality: 'Standard NDA', termination_conditions: '90 days notice', status: 'active', created_at: '2013-01-01', updated_at: '2013-01-01' },
  { id: '2', user_id: '2', position: 'HR Manager', department: 'Human Resources', start_date: '2020-03-15', end_date: '2026-03-14', salary: 120000, working_hours: '40h/week', work_location: 'On-site', employment_type: 'permanent', responsibilities: 'HR operations, recruitment, employee relations', benefits: 'Health insurance, provident fund', confidentiality: 'Standard NDA', termination_conditions: '60 days notice', status: 'active', created_at: '2020-03-15', updated_at: '2020-03-15' },
  { id: '3', user_id: '3', position: 'Senior Support Agent', department: 'Customer Support', start_date: '2023-03-15', end_date: '2025-09-14', salary: 65000, working_hours: '40h/week', work_location: 'On-site', employment_type: 'contract', responsibilities: 'Customer support, ticket resolution, mentoring', benefits: 'Health insurance', confidentiality: 'Standard NDA', termination_conditions: '30 days notice', status: 'expiring_soon', created_at: '2023-03-15', updated_at: '2023-03-15' },
  { id: '4', user_id: '4', position: 'Team Leader', department: 'Customer Support', start_date: '2022-08-01', end_date: '2025-07-31', salary: 95000, working_hours: '40h/week', work_location: 'On-site', employment_type: 'permanent', responsibilities: 'Team management, performance reviews', benefits: 'Health insurance, performance bonus', confidentiality: 'Standard NDA', termination_conditions: '60 days notice', status: 'active', created_at: '2022-08-01', updated_at: '2022-08-01' },
]

export function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<Contract | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await contractsService.list()
      if (mounted) {
        setContracts(data && data.length ? (data as Contract[]) : mockContracts)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = contracts.filter((c) => !filterStatus || c.status === filterStatus)

  const downloadContract = (c: Contract) => {
    const doc = generateContractPDF({
      referenceNo: `MYN-CT-${c.id.padStart(6, '0')}`,
      employeeName: `Employee ${c.user_id}`,
      employeeId: `MYN-EMP-${c.user_id.padStart(3, '0')}`,
      position: c.position,
      department: c.department || undefined,
      startDate: formatDate(c.start_date),
      endDate: c.end_date ? formatDate(c.end_date) : undefined,
      salary: c.salary,
      workingHours: c.working_hours,
      workLocation: c.work_location || undefined,
      employmentType: c.employment_type,
      responsibilities: c.responsibilities || undefined,
      benefits: c.benefits || undefined,
      confidentiality: c.confidentiality || undefined,
      terminationConditions: c.termination_conditions || undefined,
    })
    doc.save(`Contract-${c.id}.pdf`)
    toast.success('Contract PDF downloaded')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contract Management"
        description="Manage employment contracts and agreements"
        icon={<FileText className="h-5 w-5 text-brand-violet" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Contracts' }]}
        actions={<button onClick={() => toast.success('New contract form would open')} className="btn-primary"><Plus className="h-4 w-4" /> Create Contract</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Contracts" value={mockContracts.length} icon={FileText} accent="violet" />
        <StatCard label="Active" value={mockContracts.filter((c) => c.status === 'active').length} icon={CheckCircle} accent="emerald" />
        <StatCard label="Expiring Soon" value={mockContracts.filter((c) => c.status === 'expiring_soon').length} icon={AlertCircle} accent="amber" />
        <StatCard label="Draft" value={mockContracts.filter((c) => c.status === 'draft').length} icon={Clock} accent="blue" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['position', 'department'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Pending Approval', value: 'pending_approval' },
              { label: 'Active', value: 'active' },
              { label: 'Expiring Soon', value: 'expiring_soon' },
              { label: 'Expired', value: 'expired' },
              { label: 'Terminated', value: 'terminated' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No contracts available."
          columns={[
            { key: 'position', header: 'Position', sortable: true, render: (c) => <span className="text-sm text-white">{c.position}</span> },
            { key: 'department', header: 'Department', render: (c) => <span className="text-xs">{c.department || '—'}</span> },
            { key: 'start_date', header: 'Start Date', sortable: true, sortValue: (c) => c.start_date, render: (c) => <span className="text-xs">{formatDate(c.start_date)}</span> },
            { key: 'end_date', header: 'End Date', render: (c) => <span className="text-xs">{c.end_date ? formatDate(c.end_date) : 'Open-ended'}</span> },
            { key: 'salary', header: 'Salary', sortable: true, sortValue: (c) => c.salary, render: (c) => <span className="text-xs font-mono">{formatCurrency(c.salary)}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (c) => c.status, render: (c) => <StatusBadge status={c.status} /> },
            {
              key: 'actions', header: 'Actions',
              render: (c) => (
                <div className="flex gap-1">
                  <button onClick={() => setSelected(c)} className="btn-ghost p-1.5" title="View"><Eye className="h-3.5 w-3.5" /></button>
                  <button onClick={() => downloadContract(c)} className="btn-ghost p-1.5" title="Download PDF"><Download className="h-3.5 w-3.5" /></button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Contract Details" size="lg">
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Position</p><p className="text-sm text-white">{selected.position}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Department</p><p className="text-sm text-white">{selected.department || '—'}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Start Date</p><p className="text-sm text-white">{formatDate(selected.start_date)}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">End Date</p><p className="text-sm text-white">{selected.end_date ? formatDate(selected.end_date) : 'Open-ended'}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Salary</p><p className="text-sm text-white font-mono">{formatCurrency(selected.salary)}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Working Hours</p><p className="text-sm text-white">{selected.working_hours}</p></div>
            </div>
            {selected.responsibilities && <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400 mb-1">Responsibilities</p><p className="text-sm text-slate-300">{selected.responsibilities}</p></div>}
            {selected.benefits && <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400 mb-1">Benefits</p><p className="text-sm text-slate-300">{selected.benefits}</p></div>}
            <button onClick={() => downloadContract(selected)} className="btn-primary w-full">
              <Download className="h-4 w-4" /> Download Contract PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
