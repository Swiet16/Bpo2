import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Headphones, Mail, Phone, MessageSquare, FileText, ArrowRight, LifeBuoy, Clock, Zap } from 'lucide-react'
import { PublicPageShell } from '@/components/PublicPageShell'

export function SupportCenterPage() {
  return (
    <PublicPageShell title="Support Center" subtitle="Get help with MYNE7X BPO services and find answers fast.">
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Headphones, title: 'Submit a Ticket', desc: 'Open a support ticket and our team will respond within 24 hours.', cta: 'Create Ticket', href: '/customer-support' },
          { icon: Mail, title: 'Email Support', desc: 'Reach us directly via email for non-urgent inquiries.', cta: 'Email Us', href: '/contact' },
          { icon: Phone, title: 'Phone Support', desc: 'Call our support line for urgent issues during business hours.', cta: 'View Numbers', href: '/contact' },
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
            <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{s.desc}</p>
            <Link to={s.href} className="btn-secondary text-xs">
              {s.cta} <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="premium-card p-6">
          <LifeBuoy className="h-6 w-6 text-brand-violet mb-3" />
          <h3 className="font-semibold text-white mb-2">Popular Topics</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="text-slate-300 hover:text-brand-violet flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Frequently Asked Questions</Link></li>
            <li><Link to="/customer-support" className="text-slate-300 hover:text-brand-violet flex items-center gap-2"><MessageSquare className="h-3 w-3" /> How to submit a support ticket</Link></li>
            <li><Link to="/privacy" className="text-slate-300 hover:text-brand-violet flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Data privacy & security</Link></li>
            <li><Link to="/terms" className="text-slate-300 hover:text-brand-violet flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Terms & conditions</Link></li>
            <li><Link to="/careers" className="text-slate-300 hover:text-brand-violet flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Careers & application process</Link></li>
          </ul>
        </div>
        <div className="premium-card p-6">
          <Clock className="h-6 w-6 text-brand-cyan mb-3" />
          <h3 className="font-semibold text-white mb-2">Support Hours & SLAs</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-slate-300">Email & ticket support</span>
              <span className="badge-success">24/7</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-slate-300">Phone support</span>
              <span className="badge-info">9am–9pm PKT</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-slate-300">Urgent response SLA</span>
              <span className="badge-warning">2 hours</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-slate-300">Standard response SLA</span>
              <span className="badge-info">24 hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="premium-card p-8 text-center">
        <Zap className="h-8 w-8 text-brand-violet mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Need immediate assistance?</h2>
        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
          For urgent production issues affecting your operations, contact our priority support line and we'll escalate your case immediately.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/customer-support" className="btn-primary">
            <FileText className="h-4 w-4" /> Submit Ticket
          </Link>
          <Link to="/contact" className="btn-secondary">
            <Mail className="h-4 w-4" /> Contact Us
          </Link>
        </div>
      </div>
    </PublicPageShell>
  )
}
