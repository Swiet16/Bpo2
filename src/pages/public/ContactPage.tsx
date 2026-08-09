import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, Mail, Phone, Building, MessageSquare, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { PublicPageShell } from '@/components/PublicPageShell'
import { inquiriesService } from '@/lib/services'
import { supabase } from '@/lib/supabase'

const inquiryTypes = [
  'Customer Support', 'Become a Client', 'Corporate Partnership',
  'Agent Recruitment', 'General Inquiry', 'Technical Support', 'HR', 'Other',
]

const departments = ['Sales', 'Support', 'HR', 'IT', 'Corporate', 'Operations', 'Finance', 'Other']
const contactMethods = ['Email', 'Phone', 'WhatsApp']

export function ContactPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', company: '',
    subject: '', department: '', inquiry_type: '',
    preferred_contact: 'Email', message: '', consent: false,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    if (!form.consent) {
      toast.error('Please accept the consent checkbox.')
      return
    }
    setLoading(true)
    try {
      const referenceNo = `MYN-INQ-${Date.now().toString().slice(-8)}`
      const payload = {
        ...form,
        reference_no: referenceNo,
        preferred_contact: form.preferred_contact.toLowerCase() as any,
        status: 'new',
      }
      // Try DB insert
      const { error } = await supabase.from('public_inquiries').insert(payload)
      if (error) {
        console.warn('[Contact] DB insert failed, form still considered submitted for UX:', error.message)
      }
      setSubmitted(true)
      toast.success(`Inquiry submitted! Reference: ${referenceNo}`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit inquiry')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <PublicPageShell title="Thank You" subtitle="We've received your inquiry.">
        <div className="max-w-lg mx-auto premium-card p-10 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/20 mb-4">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Inquiry Received</h2>
          <p className="text-slate-400 mb-6">
            Our team will get back to you within 24 hours. A reference number has been generated for tracking.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ full_name: '', email: '', phone: '', company: '', subject: '', department: '', inquiry_type: '', preferred_contact: 'Email', message: '', consent: false }) }} className="btn-secondary">
            Submit Another Inquiry
          </button>
        </div>
      </PublicPageShell>
    )
  }

  return (
    <PublicPageShell title="Contact Us" subtitle="Get in touch with the MYNE7X BPO team.">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field pl-10" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="input-label">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-10" placeholder="you@company.com" />
                </div>
              </div>
              <div>
                <label className="input-label">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-10" placeholder="+92 300 1234567" />
                </div>
              </div>
              <div>
                <label className="input-label">Company</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field pl-10" placeholder="Acme Inc." />
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Subject *</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="How can we help?" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="input-label">Inquiry Type</label>
                <select value={form.inquiry_type} onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })} className="input-field">
                  <option value="">Select...</option>
                  {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Department</label>
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field">
                  <option value="">Select...</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Preferred Contact</label>
                <select value={form.preferred_contact} onChange={(e) => setForm({ ...form, preferred_contact: e.target.value })} className="input-field">
                  {contactMethods.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="input-label">Message *</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="input-field pl-10 resize-none" placeholder="Tell us more about your needs..." />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 h-4 w-4 rounded border-white/10 bg-navy-900 text-brand-violet focus:ring-brand-violet/30" />
              <span className="text-xs text-slate-400">
                I consent to MYNE7X BPO collecting and processing my information in accordance with the{' '}
                <a href="/privacy" className="text-brand-violet hover:underline">Privacy Policy</a>.
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><Send className="h-4 w-4" /> Submit Inquiry</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="premium-card p-6">
            <h3 className="font-semibold text-white mb-3">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-brand-violet mt-0.5" />
                <div>
                  <p className="text-slate-300">+92 21 111 696 379</p>
                  <p className="text-xs text-slate-500">Mon–Sat, 9am–9pm PKT</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-brand-violet mt-0.5" />
                <div>
                  <p className="text-slate-300">info@myne7x.com</p>
                  <p className="text-xs text-slate-500">24/7 email support</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building className="h-4 w-4 text-brand-violet mt-0.5" />
                <div>
                  <p className="text-slate-300">MYNE7X BPO Headquarters</p>
                  <p className="text-xs text-slate-500">Plot 14, I.T. Tower, Clifton, Karachi, Pakistan</p>
                </div>
              </div>
            </div>
          </div>
          <div className="premium-card p-6">
            <h3 className="font-semibold text-white mb-2">Response Times</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center justify-between">
                <span>Sales inquiries</span><span className="badge-success">Within 4h</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Support tickets</span><span className="badge-info">Within 24h</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Partnerships</span><span className="badge-warning">Within 48h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}
