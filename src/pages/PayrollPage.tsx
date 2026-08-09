import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Download, Eye, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { payrollService } from '@/lib/services'
import { formatCurrency, formatDate, getMonthName } from '@/lib/utils'
import { generatePayslipPDF } from '@/lib/pdfEngine'
import type { Payroll } from '@/types'
import toast from 'react-hot-toast'

const mockPayroll: Payroll[] = [
  { id: '1', user_id: '1', pay_period_month: 8, pay_period_year: 2025, basic_salary: 85000, allowances: 15000, bonuses: 5000, overtime: 3000, deductions: 2000, tax: 12000, advances: 0, other_deductions: 500, net_salary: 93500, payment_status: 'paid', payment_date: '2025-08-31', created_at: '2025-08-31', updated_at: '2025-08-31' },
  { id: '2', user_id: '2', pay_period_month: 8, pay_period_year: 2025, basic_salary: 120000, allowances: 25000, bonuses: 10000, overtime: 0, deductions: 3000, tax: 18000, advances: 5000, other_deductions: 1000, net_salary: 128000, payment_status: 'paid', payment_date: '2025-08-31', created_at: '2025-08-31', updated_at: '2025-08-31' },
  { id: '3', user_id: '3', pay_period_month: 8, pay_period_year: 2025, basic_salary: 65000, allowances: 10000, bonuses: 2000, overtime: 5000, deductions: 1500, tax: 8000, advances: 0, other_deductions: 300, net_salary: 72200, payment_status: 'pending', created_at: '2025-08-30', updated_at: '2025-08-30' },
  { id: '4', user_id: '4', pay_period_month: 8, pay_period_year: 2025, basic_salary: 95000, allowances: 18000, bonuses: 5000, overtime: 2000, deductions: 2000, tax: 14000, advances: 0, other_deductions: 400, net_salary: 103600, payment_status: 'processed', created_at: '2025-08-30', updated_at: '2025-08-30' },
  { id: '5', user_id: '5', pay_period_month: 8, pay_period_year: 2025, basic_salary: 75000, allowances: 12000, bonuses: 3000, overtime: 0, deductions: 1800, tax: 9000, advances: 2000, other_deductions: 200, net_salary: 77000, payment_status: 'paid', payment_date: '2025-08-31', created_at: '2025-08-31', updated_at: '2025-08-31' },
]

export function PayrollPage() {
  const [payroll, setPayroll] = useState<Payroll[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<Payroll | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await payrollService.listPayrolls()
      if (mounted) {
        setPayroll(data && data.length ? data : mockPayroll)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = payroll.filter((p) => !filterStatus || p.payment_status === filterStatus)

  const generatePayslip = (p: Payroll) => {
    const doc = generatePayslipPDF({
      referenceNo: `MYN-PS-${p.id.padStart(6, '0')}`,
      employeeName: `Employee ${p.user_id}`,
      employeeId: `MYN-EMP-${p.user_id.padStart(3, '0')}`,
      department: 'Customer Support',
      position: 'Support Agent',
      payPeriod: `${getMonthName(p.pay_period_month)} ${p.pay_period_year}`,
      attendanceSummary: { present: 20, absent: 1, late: 1, leave: 0, workingDays: 22 },
      earnings: [
        { label: 'Basic Salary', amount: p.basic_salary },
        { label: 'Allowances', amount: p.allowances },
        { label: 'Bonuses', amount: p.bonuses },
        { label: 'Overtime', amount: p.overtime },
      ],
      deductions: [
        { label: 'Tax', amount: p.tax },
        { label: 'Deductions', amount: p.deductions },
        { label: 'Advances', amount: p.advances },
        { label: 'Other Deductions', amount: p.other_deductions },
      ],
      netSalary: p.net_salary,
      paymentStatus: p.payment_status,
    })
    doc.save(`Payslip-${getMonthName(p.pay_period_month)}-${p.pay_period_year}.pdf`)
    toast.success('Payslip PDF downloaded')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Management"
        description="Process and manage employee payroll"
        icon={<Wallet className="h-5 w-5 text-brand-amber" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Payroll' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Payroll" value={23400000} icon={DollarSign} accent="violet" prefix="PKR " />
        <StatCard label="Pending" value={mockPayroll.filter((p) => p.payment_status === 'pending').length} icon={Wallet} accent="amber" />
        <StatCard label="Paid" value={mockPayroll.filter((p) => p.payment_status === 'paid').length} icon={TrendingUp} accent="emerald" />
        <StatCard label="Avg Salary" value={94860} icon={DollarSign} accent="cyan" prefix="PKR " />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['user_id'] as any}
          filters={[
            { label: 'All Status', value: filterStatus, options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Processed', value: 'processed' },
              { label: 'Paid', value: 'paid' },
              { label: 'Failed', value: 'failed' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No payroll records available."
          columns={[
            { key: 'user_id', header: 'Employee', render: (p) => <span className="text-sm">Employee #{p.user_id}</span> },
            { key: 'period', header: 'Period', render: (p) => <span className="text-sm">{getMonthName(p.pay_period_month)} {p.pay_period_year}</span> },
            { key: 'basic_salary', header: 'Basic', sortable: true, sortValue: (p) => p.basic_salary, render: (p) => <span className="text-xs font-mono">{formatCurrency(p.basic_salary)}</span> },
            { key: 'allowances', header: 'Allowances', render: (p) => <span className="text-xs font-mono">{formatCurrency(p.allowances)}</span> },
            { key: 'deductions', header: 'Deductions', render: (p) => <span className="text-xs font-mono text-rose-400">-{formatCurrency(p.tax + p.deductions + p.advances + p.other_deductions)}</span> },
            { key: 'net_salary', header: 'Net Salary', sortable: true, sortValue: (p) => p.net_salary, render: (p) => <span className="text-sm font-bold text-emerald-400 font-mono">{formatCurrency(p.net_salary)}</span> },
            { key: 'payment_status', header: 'Status', sortable: true, sortValue: (p) => p.payment_status, render: (p) => <StatusBadge status={p.payment_status} /> },
            {
              key: 'actions', header: 'Actions',
              render: (p) => (
                <div className="flex gap-1">
                  <button onClick={() => setSelected(p)} className="btn-ghost p-1.5" title="View"><Eye className="h-3.5 w-3.5" /></button>
                  <button onClick={() => generatePayslip(p)} className="btn-ghost p-1.5" title="Generate PDF"><Download className="h-3.5 w-3.5" /></button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Payroll Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Employee</p><p className="text-sm text-white">Employee #{selected.user_id}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Period</p><p className="text-sm text-white">{getMonthName(selected.pay_period_month)} {selected.pay_period_year}</p></div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Earnings</h4>
              {[
                { label: 'Basic Salary', amount: selected.basic_salary },
                { label: 'Allowances', amount: selected.allowances },
                { label: 'Bonuses', amount: selected.bonuses },
                { label: 'Overtime', amount: selected.overtime },
              ].map((e) => (
                <div key={e.label} className="flex justify-between p-2 rounded-lg bg-emerald-500/5">
                  <span className="text-sm text-slate-300">{e.label}</span>
                  <span className="text-sm font-mono text-emerald-400">{formatCurrency(e.amount)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Deductions</h4>
              {[
                { label: 'Tax', amount: selected.tax },
                { label: 'Deductions', amount: selected.deductions },
                { label: 'Advances', amount: selected.advances },
                { label: 'Other', amount: selected.other_deductions },
              ].map((d) => (
                <div key={d.label} className="flex justify-between p-2 rounded-lg bg-rose-500/5">
                  <span className="text-sm text-slate-300">{d.label}</span>
                  <span className="text-sm font-mono text-rose-400">-{formatCurrency(d.amount)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between p-4 rounded-xl bg-gradient-to-r from-brand-violet to-brand-indigo">
              <span className="text-white font-semibold">Net Salary</span>
              <span className="text-white font-bold font-mono">{formatCurrency(selected.net_salary)}</span>
            </div>
            <button onClick={() => generatePayslip(selected)} className="btn-primary w-full">
              <FileText className="h-4 w-4" /> Download Payslip PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
