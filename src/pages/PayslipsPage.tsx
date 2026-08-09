import { useEffect, useState } from 'react'
import { FileText, Download, Eye, Printer, Send } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { payrollService } from '@/lib/services'
import { formatCurrency, getMonthName, formatDate } from '@/lib/utils'
import { generatePayslipPDF } from '@/lib/pdfEngine'
import type { Payslip, Payroll } from '@/types'
import toast from 'react-hot-toast'
import { Wallet, CheckCircle, Clock, FileCheck } from 'lucide-react'

const mockPayslips: (Payslip & { payroll?: Payroll })[] = [
  { id: '1', reference_no: 'MYN-PS-000001', payroll_id: '1', user_id: '1', status: 'published', generated_at: '2025-08-31T10:00:00', published_at: '2025-08-31T10:30:00' },
  { id: '2', reference_no: 'MYN-PS-000002', payroll_id: '2', user_id: '2', status: 'published', generated_at: '2025-08-31T10:00:00', published_at: '2025-08-31T10:30:00' },
  { id: '3', reference_no: 'MYN-PS-000003', payroll_id: '3', user_id: '3', status: 'draft', generated_at: '2025-08-30T15:00:00' },
  { id: '4', reference_no: 'MYN-PS-000004', payroll_id: '4', user_id: '4', status: 'approved', generated_at: '2025-08-30T15:00:00' },
  { id: '5', reference_no: 'MYN-PS-000005', payroll_id: '5', user_id: '5', status: 'archived', generated_at: '2025-07-31T10:00:00', published_at: '2025-07-31T10:30:00' },
]

export function PayslipsPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<Payslip | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await payrollService.listPayslips()
      if (mounted) {
        setPayslips(data && data.length ? data : mockPayslips)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = payslips.filter((p) => !filterStatus || p.status === filterStatus)

  const downloadPayslip = (p: Payslip) => {
    const mockPayrollData: Payroll = {
      id: p.payroll_id, user_id: p.user_id, pay_period_month: 8, pay_period_year: 2025,
      basic_salary: 85000, allowances: 15000, bonuses: 5000, overtime: 3000,
      deductions: 2000, tax: 12000, advances: 0, other_deductions: 500, net_salary: 93500,
      payment_status: 'paid', payment_date: '2025-08-31', created_at: '', updated_at: '',
    }
    const doc = generatePayslipPDF({
      referenceNo: p.reference_no,
      employeeName: `Employee ${p.user_id}`,
      employeeId: `MYN-EMP-${p.user_id.padStart(3, '0')}`,
      department: 'Customer Support',
      position: 'Support Agent',
      payPeriod: `${getMonthName(8)} 2025`,
      attendanceSummary: { present: 20, absent: 1, late: 1, leave: 0, workingDays: 22 },
      earnings: [
        { label: 'Basic Salary', amount: mockPayrollData.basic_salary },
        { label: 'Allowances', amount: mockPayrollData.allowances },
        { label: 'Bonuses', amount: mockPayrollData.bonuses },
        { label: 'Overtime', amount: mockPayrollData.overtime },
      ],
      deductions: [
        { label: 'Tax', amount: mockPayrollData.tax },
        { label: 'Deductions', amount: mockPayrollData.deductions },
        { label: 'Advances', amount: mockPayrollData.advances },
        { label: 'Other', amount: mockPayrollData.other_deductions },
      ],
      netSalary: mockPayrollData.net_salary,
      paymentStatus: 'paid',
    })
    doc.save(`${p.reference_no}.pdf`)
    toast.success('Payslip downloaded')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payslip Management"
        description="Generate, publish, and manage employee payslips"
        icon={<FileText className="h-5 w-5 text-brand-emerald" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Payslips' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Payslips" value={mockPayslips.length} icon={FileText} accent="violet" />
        <StatCard label="Published" value={mockPayslips.filter((p) => p.status === 'published').length} icon={CheckCircle} accent="emerald" />
        <StatCard label="Drafts" value={mockPayslips.filter((p) => p.status === 'draft').length} icon={Clock} accent="amber" />
        <StatCard label="Approved" value={mockPayslips.filter((p) => p.status === 'approved').length} icon={FileCheck} accent="blue" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['reference_no', 'user_id'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Approved', value: 'approved' },
              { label: 'Published', value: 'published' },
              { label: 'Archived', value: 'archived' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No payslips available yet."
          columns={[
            { key: 'reference_no', header: 'Reference No', sortable: true, render: (p) => <span className="font-mono text-xs text-brand-violet">{p.reference_no}</span> },
            { key: 'user_id', header: 'Employee', render: (p) => <span className="text-sm">Employee #{p.user_id}</span> },
            { key: 'generated_at', header: 'Generated', sortable: true, sortValue: (p) => p.generated_at, render: (p) => <span className="text-xs">{formatDate(p.generated_at)}</span> },
            { key: 'published_at', header: 'Published', render: (p) => <span className="text-xs">{p.published_at ? formatDate(p.published_at) : '—'}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (p) => p.status, render: (p) => <StatusBadge status={p.status} /> },
            {
              key: 'actions', header: 'Actions',
              render: (p) => (
                <div className="flex gap-1">
                  <button onClick={() => setSelected(p)} className="btn-ghost p-1.5" title="View"><Eye className="h-3.5 w-3.5" /></button>
                  <button onClick={() => downloadPayslip(p)} className="btn-ghost p-1.5" title="Download PDF"><Download className="h-3.5 w-3.5" /></button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Payslip Preview" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-violet/20 to-brand-indigo/10 border border-brand-violet/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Reference Number</p>
                  <p className="text-lg font-mono text-brand-violet">{selected.reference_no}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Employee</p><p className="text-sm text-white">Employee #{selected.user_id}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Generated</p><p className="text-sm text-white">{formatDate(selected.generated_at)}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => downloadPayslip(selected)} className="btn-primary flex-1">
                <Download className="h-4 w-4" /> Download PDF
              </button>
              <button onClick={() => window.print()} className="btn-secondary flex-1">
                <Printer className="h-4 w-4" /> Print
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
