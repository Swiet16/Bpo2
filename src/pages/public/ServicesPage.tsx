import { motion } from 'framer-motion'
import { Headphones, Users, ClipboardList, BarChart3, Cpu, Phone, Mail, ShoppingCart, FileText } from 'lucide-react'
import { PublicPageShell } from '@/components/PublicPageShell'

const services = [
  {
    icon: Headphones,
    title: 'Customer Support Outsourcing',
    desc: 'Round-the-clock multilingual customer support across voice, email, chat, and social channels. Our agents are trained on your products and brand voice to deliver consistent, high-quality experiences.',
    features: ['24/7 coverage', 'Multilingual support', 'Quality assurance monitoring', 'SLA-backed response times'],
  },
  {
    icon: Users,
    title: 'Human Resources Operations',
    desc: 'End-to-end HR operations support including recruitment, onboarding, payroll administration, attendance management, performance reviews, and employee document management.',
    features: ['Recruitment & onboarding', 'Payroll processing', 'Attendance tracking', 'Performance management'],
  },
  {
    icon: ClipboardList,
    title: 'Back-Office Processing',
    desc: 'Data entry, document processing, order management, claims processing, and other repetitive back-office tasks handled with precision and scale.',
    features: ['Data entry & validation', 'Document processing', 'Order management', 'Quality control workflows'],
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence & Analytics',
    desc: 'Custom dashboards, KPI tracking, productivity analytics, and actionable reporting to help you make data-driven decisions about your operations.',
    features: ['Custom dashboards', 'Real-time KPI tracking', 'Trend analysis', 'Exportable PDF/Excel reports'],
  },
  {
    icon: Cpu,
    title: 'IT Operations & Asset Management',
    desc: 'Comprehensive IT support including device management, asset tracking, software licensing, helpdesk ticketing, and security monitoring.',
    features: ['Asset lifecycle management', 'Helpdesk ticketing', 'Software license tracking', 'Security monitoring'],
  },
  {
    icon: Phone,
    title: 'Inbound & Outbound Call Center',
    desc: 'Voice-based customer engagement for sales, support, collections, surveys, and retention campaigns with predictive dialing and call recording.',
    features: ['Predictive dialing', 'Call recording & QA', 'CRM integration', 'Script management'],
  },
  {
    icon: Mail,
    title: 'Email & Chat Support',
    desc: 'Async and real-time digital support channels with AI-assisted agent productivity tools and comprehensive conversation history.',
    features: ['Email ticketing', 'Live chat support', 'AI-assisted responses', 'Sentiment analysis'],
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Operations',
    desc: 'Order processing, inventory management, returns handling, and customer lifecycle management tailored to online retailers and marketplaces.',
    features: ['Order fulfillment', 'Inventory sync', 'Returns processing', 'Customer lifecycle management'],
  },
  {
    icon: FileText,
    title: 'Contract & Document Management',
    desc: 'Digital contract lifecycle management, document storage with role-based access, e-signatures, and automated expiry notifications.',
    features: ['Contract lifecycle', 'Secure document storage', 'Role-based access', 'Expiry alerts & automation'],
  },
]

export function ServicesPage() {
  return (
    <PublicPageShell
      title="Our Services"
      subtitle="Comprehensive BPO solutions designed to scale with your enterprise."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.1 }}
            className="premium-card p-6"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-brand-violet/20 to-brand-indigo/10 ring-1 ring-brand-violet/20 mb-4">
              <s.icon className="h-6 w-6 text-brand-violet" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{s.desc}</p>
            <ul className="space-y-1.5">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-1 w-1 rounded-full bg-brand-violet" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </PublicPageShell>
  )
}
