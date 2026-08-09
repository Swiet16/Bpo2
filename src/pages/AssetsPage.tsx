import { useEffect, useState } from 'react'
import { Cpu, Plus, Eye, HardDrive, Monitor, Headphones, Smartphone } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable, StatusBadge } from '@/components/DataTable'
import { Skeleton } from '@/components/Skeleton'
import { Modal } from '@/components/Modal'
import { assetsService } from '@/lib/services'
import { formatDate } from '@/lib/utils'
import type { ITAsset } from '@/types'
import toast from 'react-hot-toast'
import { CheckCircle, Wrench, Package } from 'lucide-react'

const mockAssets: ITAsset[] = [
  { id: '1', asset_id: 'LTP-0892', type: 'laptop', serial_number: 'SN-LP-0892', brand: 'Dell', model: 'Latitude 5520', assigned_to: 'Ali Raza', department: 'Customer Support', issue_date: '2023-03-15', return_date: null, condition: 'excellent', status: 'assigned', created_at: '2023-03-15', updated_at: '2023-03-15' },
  { id: '2', asset_id: 'MON-0145', type: 'monitor', serial_number: 'SN-MN-0145', brand: 'LG', model: '27UK850', assigned_to: 'Sara Khan', department: 'HR', issue_date: '2023-06-01', return_date: null, condition: 'new', status: 'assigned', created_at: '2023-06-01', updated_at: '2023-06-01' },
  { id: '3', asset_id: 'HST-0028', type: 'headset', serial_number: 'SN-HS-0028', brand: 'Jabra', model: 'Evolve2 65', assigned_to: null, department: null, issue_date: null, return_date: null, condition: 'new', status: 'in_stock', created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '4', asset_id: 'LTP-0893', type: 'laptop', serial_number: 'SN-LP-0893', brand: 'HP', model: 'ProBook 450', assigned_to: 'Bilal Ahmed', department: 'Customer Support', issue_date: '2022-08-01', return_date: null, condition: 'fair', status: 'under_repair', created_at: '2022-08-01', updated_at: '2024-09-01' },
  { id: '5', asset_id: 'PHN-0012', type: 'phone', serial_number: 'SN-PH-0012', brand: 'Yealink', model: 'T54W', assigned_to: 'Ayesha Malik', department: 'Customer Support', issue_date: '2023-06-20', return_date: null, condition: 'good', status: 'assigned', created_at: '2023-06-20', updated_at: '2023-06-20' },
]

const typeIcons = { laptop: HardDrive, desktop: Monitor, monitor: Monitor, keyboard: Cpu, mouse: Cpu, headset: Headphones, phone: Smartphone, other: Cpu }

export function AssetsPage() {
  const [assets, setAssets] = useState<ITAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<ITAsset | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await assetsService.list()
      if (mounted) {
        setAssets(data && data.length ? data : mockAssets)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = assets.filter((a) => {
    if (filterType && a.type !== filterType) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="IT Asset Management"
        description="Track and manage IT assets and equipment"
        icon={<Cpu className="h-5 w-5 text-brand-amber" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Assets' }]}
        actions={<button onClick={() => toast.success('Add asset form would open')} className="btn-primary"><Plus className="h-4 w-4" /> Add Asset</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Assets" value={assets.length} icon={Package} accent="violet" />
        <StatCard label="Assigned" value={assets.filter((a) => a.status === 'assigned').length} icon={CheckCircle} accent="emerald" />
        <StatCard label="In Stock" value={assets.filter((a) => a.status === 'in_stock').length} icon={HardDrive} accent="cyan" />
        <StatCard label="Under Repair" value={assets.filter((a) => a.status === 'under_repair').length} icon={Wrench} accent="amber" />
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <DataTable
          data={filtered}
          searchable
          searchKeys={['asset_id', 'serial_number', 'brand', 'model'] as any}
          filters={[
            { label: 'All Types', value: filterType, options: [
              { label: 'Laptop', value: 'laptop' },
              { label: 'Desktop', value: 'desktop' },
              { label: 'Monitor', value: 'monitor' },
              { label: 'Headset', value: 'headset' },
              { label: 'Phone', value: 'phone' },
              { label: 'Other', value: 'other' },
            ], onChange: setFilterType },
            { label: 'All Status', value: filterStatus, options: [
              { label: 'In Stock', value: 'in_stock' },
              { label: 'Assigned', value: 'assigned' },
              { label: 'Returned', value: 'returned' },
              { label: 'Under Repair', value: 'under_repair' },
              { label: 'Retired', value: 'retired' },
            ], onChange: setFilterStatus },
          ]}
          emptyMessage="No IT assets registered."
          columns={[
            { key: 'asset_id', header: 'Asset ID', sortable: true, render: (a) => <span className="font-mono text-xs text-brand-violet">{a.asset_id}</span> },
            { key: 'type', header: 'Type', render: (a) => {
              const Icon = typeIcons[a.type] || Cpu
              return <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-slate-400" /><span className="text-xs capitalize">{a.type}</span></div>
            } },
            { key: 'brand', header: 'Brand/Model', render: (a) => <span className="text-xs">{a.brand} {a.model}</span> },
            { key: 'assigned_to', header: 'Assigned To', render: (a) => <span className="text-xs">{a.assigned_to || '—'}</span> },
            { key: 'issue_date', header: 'Issue Date', render: (a) => <span className="text-xs">{a.issue_date ? formatDate(a.issue_date) : '—'}</span> },
            { key: 'condition', header: 'Condition', render: (a) => <span className="badge-info capitalize">{a.condition}</span> },
            { key: 'status', header: 'Status', sortable: true, sortValue: (a) => a.status, render: (a) => <StatusBadge status={a.status} /> },
            { key: 'actions', header: 'Actions', render: (a) => <button onClick={() => setSelected(a)} className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button> },
          ]}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Asset Details" size="md">
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Asset ID</p><p className="text-sm text-white font-mono">{selected.asset_id}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Serial Number</p><p className="text-sm text-white font-mono">{selected.serial_number}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Type</p><p className="text-sm text-white capitalize">{selected.type}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Brand</p><p className="text-sm text-white">{selected.brand}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Model</p><p className="text-sm text-white">{selected.model}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Condition</p><span className="badge-info capitalize">{selected.condition}</span></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Assigned To</p><p className="text-sm text-white">{selected.assigned_to || '—'}</p></div>
              <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-slate-400">Status</p><StatusBadge status={selected.status} /></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
