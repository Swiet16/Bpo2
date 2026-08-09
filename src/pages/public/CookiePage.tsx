import { PublicPageShell } from '@/components/PublicPageShell'

export function CookiePage() {
  return (
    <PublicPageShell title="Cookie Policy" subtitle="How MYNE7X BPO uses cookies and similar technologies.">
      <div className="max-w-4xl mx-auto glass-card p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They allow the website to remember your actions and preferences over a period of time, so you don't have to re-enter them every time you visit. MYNE7X BPO uses cookies and similar technologies (such as local storage) to operate and secure our platform.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. Types of Cookies We Use</h2>
          <p><strong className="text-white">Essential Cookies:</strong> These are strictly necessary for the website to function. They enable core functionality such as security, session management, and authentication. Without these cookies, the Service cannot operate correctly. We do not require consent for essential cookies.</p>
          <p className="mt-2"><strong className="text-white">Preference Cookies:</strong> These remember your choices (such as theme preferences or language) to provide a more personalized experience.</p>
          <p className="mt-2"><strong className="text-white">Analytics Cookies:</strong> We use these to understand how visitors interact with our website, helping us improve performance and user experience. All analytics data is aggregated and anonymized.</p>
          <p className="mt-2"><strong className="text-white">Security Cookies:</strong> These help detect and prevent fraud, unauthorized access, and other security threats.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. Cookies We Do Not Use</h2>
          <p>MYNE7X BPO does <strong className="text-white">not</strong> use advertising cookies, third-party tracking cookies for marketing purposes, or cookies that sell your data to advertising networks. We respect your privacy and do not monetize your browsing behavior.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Managing Cookies</h2>
          <p>You can control and delete cookies through your browser settings. Note that disabling essential cookies will prevent you from logging in and using the dashboard. Most browsers allow you to: (a) view all cookies currently stored on your device; (b) delete individual or all cookies; (c) block cookies from specific websites; and (d) set preferences for first-party and third-party cookies.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Third-Party Services</h2>
          <p>Our platform uses Supabase for authentication and data storage, and Vercel for hosting. These providers may set their own cookies as part of their service operation. We recommend reviewing their respective privacy policies for details.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">6. Updates</h2>
          <p>We may update this Cookie Policy as our use of cookies evolves. Significant changes will be communicated through the platform. We encourage you to review this policy periodically.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">7. Contact</h2>
          <p>For questions about our cookie practices, contact: privacy@myne7x.com.</p>
        </section>
        <p className="text-xs text-slate-500 pt-4 border-t border-white/5">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </PublicPageShell>
  )
}
