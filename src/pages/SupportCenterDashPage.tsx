import { Link } from 'react-router-dom'
import { LifeBuoy, Mail, Phone, Clock, Zap, FileText, MessageSquare, ArrowRight, BookOpen } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { ChartCard } from '@/components/ChartCard'

export function SupportCenterDashPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Center"
        description="Get help, browse resources, and contact our team"
        icon={<LifeBuoy className="h-5 w-5 text-brand-rose" />}
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Support Center' }]}
      />

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, title: 'Create Ticket', desc: 'Open a new support ticket', href: '/customer-support' },
          { icon: Mail, title: 'Email Support', desc: 'Email our team directly', href: 'mailto:support@myne7x.com' },
          { icon: Phone, title: 'Call Us', desc: 'Phone support 9 AM - 9 PM', href: 'tel:+9221111696379' },
        ].map((s) => (
          <Link key={s.title} to={s.href} className="premium-card p-6 hover:border-brand-violet/30 transition-all">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-brand-violet/20 to-brand-indigo/10 ring-1 ring-brand-violet/20 mb-4">
              <s.icon className="h-6 w-6 text-brand-violet" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{s.title}</h3>
            <p className="text-sm text-slate-400 mb-3">{s.desc}</p>
            <div className="flex items-center gap-1 text-xs text-brand-violet">
              Get help <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Support Hours" description="When we're available">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Email & Ticket Support</span>
              </div>
              <span className="badge-success">24/7</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">Phone Support</span>
              </div>
              <span className="badge-info">9 AM - 9 PM PKT</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-300">Urgent Response SLA</span>
              </div>
              <span className="badge-warning">2 hours</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-slate-300">Standard Response SLA</span>
              </div>
              <span className="badge-info">24 hours</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Quick Resources" description="Self-service guides">
          <div className="space-y-2">
            {[
              'How to check in / check out',
              'Downloading your payslip',
              'Requesting leave',
              'Updating personal information',
              'Submitting a support ticket',
              'Understanding your performance score',
            ].map((q) => (
              <Link key={q} to="/faq" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-300">{q}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-500" />
              </Link>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
