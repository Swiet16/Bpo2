import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, Mail, Phone, MessageSquare, CheckCircle, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { PublicPageShell } from '@/components/PublicPageShell'
import { supabase } from '@/lib/supabase'

const categories = [
  'Customer Support', 'Agent Support', 'Technical Support',
  'Billing', 'Corporate', 'Client Services', 'Other',
]
const priorities = ['Low', 'Medium', 'High', 'Urgent']

export function CustomerSupportPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', customer_ref: '',
    category: 'Customer Support', subject: '', description: '',
    priority: 'Medium', consent: false,
  })
  const [loading, setLoading] = useState(false)
  const [ticketNo, setTicketNo] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.subject || !form.description) {
      toast.error('Please fill in all required fields.')
      return
    }
    if (!form.consent) {
      toast.error('Please accept the consent checkbox.')
      return
    }
    setLoading(true)
    try {
      const ref = `MYN-SUP-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      const { error } = await supabase.from('support_tickets').insert({
        ticket_no: ref,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        company: form.customer_ref,
        category: form.category,
        subject: form.subject,
        message: form.description,
        priority: form.priority.toLowerCase(),
        preferred_contact: 'email',
        status: 'new',
        is_public: true,
      })
      if (error) console.warn('[Support] DB insert failed:', error.message)
      setTicketNo(ref)
      toast.success(`Ticket ${ref} created!`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit ticket')
    } finally {
      setLoading(false)
    }
  }

  if (ticketNo) {
    return (
      <PublicPageShell title="Ticket Submitted" subtitle="Your support request has been received.">
        <div className="max-w-lg mx-auto premium-card p-10 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/20 mb-4">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ticket Created Successfully</h2>
          <p className="text-slate-400 mb-4">Please save your ticket reference for tracking:</p>
          <div className="inline-block px-6 py-3 rounded-xl bg-white/5 border border-brand-violet/30 font-mono text-lg text-brand-violet">
            {ticketNo}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Our support team will respond to <span className="text-slate-300">{form.email}</span> within 24 hours.
          </p>
          <button onClick={() => { setTicketNo(null); setForm({ full_name: '', email: '', phone: '', customer_ref: '', category: 'Customer Support', subject: '', description: '', priority: 'Medium', consent: false }) }} className="btn-secondary mt-6">
            Submit Another Ticket
          </button>
        </div>
      </PublicPageShell>
    )
  }

  return (
    <PublicPageShell title="Customer Support" subtitle="Submit a support request and our team will assist you.">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="input-label">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="input-label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="input-label">Customer / Reference ID</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input value={form.customer_ref} onChange={(e) => setForm({ ...form, customer_ref: e.target.value })} className="input-field pl-10" placeholder="Optional" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Subject *</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="Brief summary of the issue" />
          </div>

          <div>
            <label className="input-label">Description *</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="input-field pl-10 resize-none" placeholder="Describe the issue in detail..." />
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 h-4 w-4 rounded border-white/10 bg-navy-900 text-brand-violet focus:ring-brand-violet/30" />
            <span className="text-xs text-slate-400">
              I consent to MYNE7X BPO processing this support request in accordance with the Privacy Policy.
            </span>
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
            {loading ? <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><Send className="h-4 w-4" /> Submit Ticket</>}
          </button>
        </form>
      </div>
    </PublicPageShell>
  )
}
