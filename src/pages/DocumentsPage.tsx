import { useEffect, useState } from 'react'
import { FolderOpen, Upload, Download, Eye, FileText, FileImage, File } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { formatDate } from '@/lib/utils'
import { emptyStateMessages } from '@/lib/mockData'
import toast from 'react-hot-toast'

interface DocRecord {
  id: string
  name: string
  type: string
  size: string
  uploaded_by: string
  created_at: string
  is_private: boolean
}

const mockDocs: DocRecord[] = [
  { id: '1', name: 'Employment Contract - Ali Raza.pdf', type: 'contract', size: '245 KB', uploaded_by: 'HR Manager', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), is_private: true },
  { id: '2', name: 'Payslip - August 2025.pdf', type: 'payslip', size: '128 KB', uploaded_by: 'HR Manager', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), is_private: true },
  { id: '3', name: 'Employee Handbook 2025.pdf', type: 'hr_doc', size: '1.2 MB', uploaded_by: 'HR Manager', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), is_private: false },
  { id: '4', name: 'CNIC - Sara Khan.jpg', type: 'employee_doc', size: '456 KB', uploaded_by: 'HR Manager', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), is_private: true },
  { id: '5', name: 'Client Agreement - Acme Corp.pdf', type: 'client_doc', size: '342 KB', uploaded_by: 'Client Team', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(), is_private: true },
]

function getIcon(type: string) {
  if (type === 'payslip' || type === 'contract') return FileText
  if (type === 'employee_doc') return FileImage
  return File
}

export function DocumentsPage() {
  const [docs, setDocs] = useState<DocRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setDocs(mockDocs)
      setLoading(false)
    }, 600)
  }, [])

  const filtered = docs.filter((d) => !filterType || d.type === filterType)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Management"
        description="Centralized storage for all organizational documents"
        icon={<FolderOpen className="h-5 w-5 text-brand-cyan" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Documents' }]}
        actions={
          <button onClick={() => toast.success('Upload modal would open')} className="btn-primary">
            <Upload className="h-4 w-4" /> Upload Document
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Documents" value={docs.length} icon={FileText} accent="violet" />
        <StatCard label="Contracts" value={docs.filter((d) => d.type === 'contract').length} icon={FileText} accent="cyan" />
        <StatCard label="Payslips" value={docs.filter((d) => d.type === 'payslip').length} icon={FileText} accent="emerald" />
        <StatCard label="Private" value={docs.filter((d) => d.is_private).length} icon={FolderOpen} accent="amber" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['name', 'uploaded_by'] as any}
          filters={[
            { label: 'All Types', value: filterType, options: [
              { label: 'Contract', value: 'contract' },
              { label: 'Payslip', value: 'payslip' },
              { label: 'Employee Doc', value: 'employee_doc' },
              { label: 'HR Doc', value: 'hr_doc' },
              { label: 'Client Doc', value: 'client_doc' },
              { label: 'Corporate Doc', value: 'corporate_doc' },
              { label: 'IT Doc', value: 'it_doc' },
              { label: 'Report', value: 'report' },
            ], onChange: setFilterType },
          ]}
          emptyMessage={emptyStateMessages.documents}
          columns={[
            {
              key: 'name', header: 'Document', sortable: true, sortValue: (d) => d.name,
              render: (d) => {
                const Icon = getIcon(d.type)
                return (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5"><Icon className="h-4 w-4 text-brand-violet" /></div>
                    <span className="text-sm text-white">{d.name}</span>
                  </div>
                )
              },
            },
            { key: 'type', header: 'Type', render: (d) => <span className="badge-info">{d.type.replace('_', ' ')}</span> },
            { key: 'size', header: 'Size', render: (d) => <span className="text-xs font-mono">{d.size}</span> },
            { key: 'uploaded_by', header: 'Uploaded By', render: (d) => <span className="text-xs">{d.uploaded_by}</span> },
            { key: 'created_at', header: 'Date', sortable: true, sortValue: (d) => d.created_at, render: (d) => <span className="text-xs">{formatDate(d.created_at)}</span> },
            { key: 'is_private', header: 'Access', render: (d) => d.is_private ? <span className="badge-warning">Private</span> : <span className="badge-success">Public</span> },
            {
              key: 'actions', header: 'Actions',
              render: (d) => (
                <div className="flex gap-1">
                  <button onClick={() => toast(`Preview ${d.name}`)} className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button>
                  <button onClick={() => toast.success(`Downloading ${d.name}`)} className="btn-ghost p-1.5"><Download className="h-3.5 w-3.5" /></button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
