import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Headphones, Briefcase, Users, Mail, Sparkles, Shield, Zap, Globe, TrendingUp } from 'lucide-react'
import { Logo } from '@/components/Logo'

export function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" />
        <div className="absolute inset-0 bg-radial-glow" />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 h-72 w-72 rounded-full bg-brand-violet/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-brand-cyan/20 blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-6"
          >
            <Sparkles className="h-3 w-3 text-brand-violet" />
            Enterprise BPO Operations Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-tight"
          >
            MYNE7X <span className="gradient-text">BPO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Professional Customer Support & Business Process Outsourcing — premium workforce, payroll, contracts, support, and analytics in one unified platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/contact" className="btn-primary">
              <Mail className="h-4 w-4" /> Contact Us
            </Link>
            <Link to="/customer-support" className="btn-secondary">
              <Headphones className="h-4 w-4" /> Customer Support
            </Link>
            <Link to="/careers" className="btn-secondary">
              <Briefcase className="h-4 w-4" /> Careers
            </Link>
            <Link to="/login" className="btn-secondary">
              Login <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { label: 'Active Employees', value: '248+', icon: Users },
              { label: 'Client Companies', value: '32+', icon: Briefcase },
              { label: 'Tickets Resolved', value: '18K+', icon: Headphones },
              { label: 'Years Experience', value: '12+', icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="premium-card p-5">
                <stat.icon className="h-5 w-5 text-brand-violet mb-2 mx-auto" />
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">Comprehensive BPO Solutions</h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            Everything your enterprise needs to manage operations, people, and clients — in one premium platform.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Headphones, title: 'Customer Support', desc: '24/7 multilingual support with advanced ticketing, SLA tracking, and quality assurance.' },
            { icon: Users, title: 'Workforce Management', desc: 'Complete HR suite: attendance, leave, payroll, contracts, performance reviews.' },
            { icon: Shield, title: 'Secure Operations', desc: 'Role-based access, audit logging, protected CEO account, and Supabase-powered security.' },
            { icon: Zap, title: 'Process Automation', desc: 'Automated payroll, contract generation, attendance tracking, and notification workflows.' },
            { icon: TrendingUp, title: 'BI & Analytics', desc: 'Real-time dashboards, KPIs, productivity trends, and exportable PDF/CSV reports.' },
            { icon: Globe, title: 'Multi-Client Platform', desc: 'Manage multiple corporate clients, projects, teams, and SLAs from one command center.' },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-card p-6"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-brand-violet/20 to-brand-indigo/10 ring-1 ring-brand-violet/20 mb-4">
                <s.icon className="h-6 w-6 text-brand-violet" />
              </div>
              <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="premium-card p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Ready to transform your <span className="gradient-text">operations</span>?
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Partner with MYNE7X BPO for premium outsourcing services. Get in touch today for a tailored proposal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-primary">
                <Mail className="h-4 w-4" /> Get in Touch
              </Link>
              <Link to="/customer-support" className="btn-secondary">
                <Headphones className="h-4 w-4" /> Submit a Ticket
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
