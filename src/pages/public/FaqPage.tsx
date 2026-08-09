import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { PublicPageShell } from '@/components/PublicPageShell'

const faqs = [
  { q: 'What services does MYNE7X BPO offer?', a: 'We offer a comprehensive suite of BPO services including customer support (voice, email, chat), back-office processing, HR operations, IT support, business intelligence & analytics, call center operations, e-commerce operations, and contract/document management.' },
  { q: 'How can I contact customer support?', a: 'You can submit a support ticket via our Customer Support page, email us at info@myne7x.com, or call +92 21 111 696 379. Our support team operates 24/7 for urgent issues.' },
  { q: 'Where is MYNE7X BPO located?', a: 'Our headquarters is at Plot 14, I.T. Tower, Clifton, Karachi, Pakistan. We serve clients across South Asia, the Middle East, and Europe.' },
  { q: 'How do I apply for a job at MYNE7X BPO?', a: 'Visit our Careers page to view open positions and submit your application online. Our HR team reviews all applications and reaches out to qualified candidates within 5-7 business days.' },
  { q: 'What security measures do you have in place?', a: 'We implement enterprise-grade security including role-based access control, biometric facility access, 24/7 monitoring, audit logging, secure Supabase authentication, encrypted data storage, and a protected CEO account with elevated privileges.' },
  { q: 'Can I get a custom BPO solution tailored to my business?', a: 'Absolutely. We specialize in tailored outsourcing solutions. Contact us through the Contact page with your requirements and our team will prepare a custom proposal within 48 hours.' },
  { q: 'What are your typical response times?', a: 'Sales inquiries: within 4 hours. Support tickets: within 24 hours. Partnership discussions: within 48 hours. Urgent issues are handled with priority SLAs based on your contract.' },
  { q: 'Do you offer multilingual support?', a: 'Yes, our team supports English, Urdu, Hindi, Arabic, and several regional languages. We can scale language coverage based on client requirements.' },
  { q: 'How do you handle data privacy?', a: 'We comply with applicable data protection regulations and follow strict internal privacy policies. All client data is stored securely with role-based access controls, and we never share data with third parties without explicit consent.' },
  { q: 'What is the typical onboarding timeline?', a: 'For standard BPO services, onboarding typically takes 2-4 weeks including contract signing, team training, system integration, and quality assurance setup. Complex implementations may take longer.' },
]

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <PublicPageShell title="Frequently Asked Questions" subtitle="Find answers to common questions about MYNE7X BPO.">
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4 text-brand-violet flex-shrink-0" />
                <span className="font-medium text-white">{faq.q}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 text-sm text-slate-400 border-t border-white/5"
              >
                <p className="pt-3 leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </PublicPageShell>
  )
}
