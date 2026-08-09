import { Award, TrendingUp, Star, Target } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ChartCard } from '@/components/ChartCard'
import { agentPerformanceData } from '@/lib/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const radarData = [
  { metric: 'Attendance', value: 92 },
  { metric: 'Productivity', value: 88 },
  { metric: 'Quality', value: 95 },
  { metric: 'CSAT', value: 90 },
  { metric: 'Teamwork', value: 85 },
  { metric: 'Communication', value: 87 },
]

export function PerformancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Management"
        description="Track and review employee performance metrics"
        icon={<Award className="h-5 w-5 text-brand-amber" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Performance' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Avg Score" value={89} icon={Award} accent="violet" suffix="%" />
        <StatCard label="Top Performer" value={96} icon={Star} accent="emerald" suffix="%" />
        <StatCard label="Reviews Done" value={184} icon={Target} accent="cyan" />
        <StatCard label="Improvement" value={12} icon={TrendingUp} accent="blue" suffix="%" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Agent Performance" description="Top performers vs target">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={100} />
              <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="target" fill="#475569" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance Breakdown" description="Multi-dimensional view">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis stroke="#64748b" fontSize={10} />
              <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              <Tooltip contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top Performers Leaderboard" description="By overall score">
        <div className="space-y-3">
          {agentPerformanceData.sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-500/20 text-amber-300' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-700/20 text-orange-400' : 'bg-white/5 text-slate-400'}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{p.name}</p>
                <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan rounded-full" style={{ width: `${p.score}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-white">{p.score}%</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
