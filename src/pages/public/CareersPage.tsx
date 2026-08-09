import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Briefcase, Clock, CheckCircle, Upload, User, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { PublicPageShell } from '@/components/PublicPageShell'
import { supabase } from '@/lib/supabase'

const positions = [
  { title: 'Senior Customer Support Agent', dept: 'Customer Support', type: 'Full-time', location: 'Karachi, PK', desc: 'Handle complex customer queries across voice, email, and chat channels. Mentor junior agents and contribute to QA processes.', reqs: ['3+ years BPO experience', 'Excellent English communication', 'Willingness to work shifts'] },
  { title: 'Technical Support Specialist', dept: 'IT', type: 'Full-time', location: 'Karachi, PK', desc: 'Provide tier-1 and tier-2 technical support to enterprise clients. Troubleshoot software, network, and hardware issues.', reqs: ['IT certification or CS degree', 'Experience with ticketing systems', 'Strong problem-solving skills'] },
  { title: 'Team Leader — Operations', dept: 'Operations', type: 'Full-time', location: 'Karachi, PK', desc: 'Lead a team of 15-20 agents. Monitor performance, conduct reviews, and ensure SLA compliance.', reqs: ['2+ years leadership experience', 'Proven track record in BPO', 'Excellent people management'] },
  { title: 'HR Generalist', dept: 'Human Resources', type: 'Full-time', location: 'Karachi, PK', desc: 'Manage end-to-end HR operations including recruitment, onboarding, payroll support, and employee relations.', reqs: ['Bachelors in HR or related', '2+ years HR generalist experience', 'Knowledge of labor laws'] },
  { title: 'BI Analyst', dept: 'Analytics', type: 'Full-time', location: 'Karachi, PK', desc: 'Build dashboards, analyze operational data, and deliver insights to leadership. Work with cross-functional teams.', reqs: ['Experience with SQL & BI tools', 'Strong analytical skills', 'Excellent data visualization'] },
  { title: 'Sales Development Representative', dept: 'Sales', type: 'Full-time', location: 'Remote', desc: 'Generate and qualify leads, conduct discovery calls, and support the sales pipeline for BPO services.', reqs: ['1+ year sales experience', 'Excellent communication', 'Self-motivated with target-driven mindset'] },
]

export function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', position: '',
    experience: '', cover_letter: '', consent: false,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleApply = (position: string) => {
    setSelectedPosition(position)
    setForm((f) => ({ ...f, position }))
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.phone || !form.position) {
      toast.error('Please fill in all required fields.')
      return
    }
    if (!form.consent) {
      toast.error('Please accept the consent checkbox.')
      return
    }
    setLoading(true)
    try {
      const ref = `MYN-APP-${Date.now().toString().slice(-8)}`
      const { error } = await supabase.from('career_applications').insert({
        reference_no: ref,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        experience: form.experience,
        cover_letter: form.cover_letter,
        status: 'new',
      })
      if (error) console.warn('[Careers] DB insert failed:', error.message)
      setSubmitted(true)
      toast.success(`Application ${ref} submitted!`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicPageShell title="Careers at MYNE7X BPO" subtitle="Join a team that's redefining premium BPO operations.">
      <div className="space-y-4 mb-12">
        {positions.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="premium-card p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                  <span className="badge-info">{p.type}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {p.dept}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Full-time</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{p.desc}</p>
                <div>
                  <p className="text-xs font-medium text-slate-300 mb-1">Requirements:</p>
                  <ul className="space-y-1">
                    {p.reqs.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle className="h-3 w-3 text-brand-violet" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={() => handleApply(p.title)} className="btn-primary text-xs whitespace-nowrap">
                Apply Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div id="application-form" className="premium-card p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8">
            <div className="inline-flex p-4 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/20 mb-4">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Application Submitted</h2>
            <p className="text-slate-400 mb-6">Thank you for applying! Our HR team will review your application and reach out if there's a fit.</p>
            <button onClick={() => { setSubmitted(false); setForm({ full_name: '', email: '', phone: '', position: '', experience: '', cover_letter: '', consent: false }) }} className="btn-secondary">
              Submit Another Application
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Submit Your Application</h2>
            <p className="text-sm text-slate-400 mb-6">Fill out the form below to apply for an open position.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="input-label">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-10" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Position *</label>
                  <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input-field">
                    <option value="">Select position...</option>
                    {positions.map((p) => <option key={p.title} value={p.title}>{p.title}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="input-label">Years of Experience</label>
                <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="input-field" placeholder="e.g. 3 years" />
              </div>
              <div>
                <label className="input-label">Cover Letter</label>
                <textarea value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} rows={5} className="input-field resize-none" placeholder="Tell us why you'd be a great fit..." />
              </div>
              <div>
                <label className="input-label">CV / Resume Upload</label>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/10 bg-navy-950/40">
                  <Upload className="h-5 w-5 text-slate-500" />
                  <span className="text-xs text-slate-400">Drag & drop or click to upload (PDF, DOC, DOCX — max 5MB)</span>
                </div>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 h-4 w-4 rounded border-white/10 bg-navy-900 text-brand-violet focus:ring-brand-violet/30" />
                <span className="text-xs text-slate-400">
                  I consent to MYNE7X BPO processing my application data in accordance with the Privacy Policy.
                </span>
              </label>
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                {loading ? <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><Send className="h-4 w-4" /> Submit Application</>}
              </button>
            </form>
          </>
        )}
      </div>
    </PublicPageShell>
  )
}
