import { motion } from 'framer-motion'
import { Target, Eye, Heart, Award, Users, Building2, Globe, TrendingUp } from 'lucide-react'
import { PublicPageShell } from '@/components/PublicPageShell'

export function AboutPage() {
  return (
    <PublicPageShell
      title="About MYNE7X BPO"
      subtitle="Empowering enterprises with premium business process outsourcing since 2013."
    >
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="premium-card p-8">
          <Target className="h-8 w-8 text-brand-violet mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed">
            To deliver world-class business process outsourcing services that empower our clients to focus on their core business while we handle the operational complexity. We combine human expertise with intelligent automation to drive measurable outcomes for every partner we serve, from startups to multinational corporations.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="premium-card p-8">
          <Eye className="h-8 w-8 text-brand-cyan mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Our Vision</h2>
          <p className="text-slate-400 leading-relaxed">
            To be the most trusted BPO partner in the region, recognized for operational excellence, technological innovation, and unwavering commitment to data security. We envision a future where every enterprise, regardless of size, has access to enterprise-grade operations support that scales seamlessly with their growth ambitions.
          </p>
        </motion.div>
      </div>

      <div className="premium-card p-8 mb-12">
        <Heart className="h-8 w-8 text-brand-purple mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Our Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { title: 'Integrity', desc: 'We operate with complete transparency and ethical standards in every interaction.' },
            { title: 'Excellence', desc: 'We pursue continuous improvement and hold ourselves to the highest quality bar.' },
            { title: 'Innovation', desc: 'We embrace new technologies and methodologies to deliver better outcomes.' },
            { title: 'Partnership', desc: 'We treat every client relationship as a long-term strategic partnership.' },
          ].map((v) => (
            <div key={v.title} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="font-semibold text-white mb-1">{v.title}</h3>
              <p className="text-xs text-slate-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Users, label: 'Team Members', value: '248+' },
          { icon: Building2, label: 'Corporate Clients', value: '14+' },
          { icon: Globe, label: 'Countries Served', value: '8' },
          { icon: Award, label: 'Industry Awards', value: '7' },
        ].map((s) => (
          <div key={s.label} className="premium-card p-6 text-center">
            <s.icon className="h-6 w-6 text-brand-violet mb-2 mx-auto" />
            <p className="text-3xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="premium-card p-8">
        <TrendingUp className="h-8 w-8 text-brand-indigo mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Our Journey</h2>
        <p className="text-slate-400 leading-relaxed mb-6">
          Founded in 2013 as a small customer support operation with twelve agents, MYNE7X BPO has grown into a full-spectrum business process outsourcing platform serving clients across South Asia, the Middle East, and Europe. Our growth has been fueled by an unwavering focus on quality, security, and the success of our clients' operations.
        </p>
        <p className="text-slate-400 leading-relaxed">
          Today, our 248-person team operates from state-of-the-art facilities with redundant connectivity, biometric access controls, and 24/7 monitoring. We continue to invest in our people, our technology stack, and our processes to deliver ever-better outcomes for the enterprises that trust us with their operations.
        </p>
      </div>
    </PublicPageShell>
  )
}
