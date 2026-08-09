import { PublicPageShell } from '@/components/PublicPageShell'

export function PrivacyPage() {
  return (
    <PublicPageShell title="Privacy Policy" subtitle="How MYNE7X BPO collects, uses, and protects your data.">
      <div className="max-w-4xl mx-auto glass-card p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including: name, email address, phone number, employee identification details, employment records, attendance data, salary information, contract details, support requests, and documents you upload. We also automatically collect technical information such as IP address, browser type, device information, and usage logs through authenticated sessions.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. How We Use Your Information</h2>
          <p>Your information is used to: (a) provide and manage BPO services including payroll, attendance, contracts, and support; (b) authenticate your identity and enforce role-based access controls; (c) communicate with you about your account, support requests, and platform updates; (d) comply with legal and regulatory obligations; (e) monitor for security threats and audit access to sensitive systems; and (f) generate aggregated, anonymized analytics to improve our services.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. Legal Basis for Processing</h2>
          <p>We process personal data based on: (a) your consent (e.g., when you submit public forms or applications); (b) contractual necessity (e.g., to fulfill employment or service agreements); (c) legal obligations (e.g., tax and labor law compliance); and (d) legitimate interests in operating and securing our business, including fraud prevention and audit logging.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Data Storage & Security</h2>
          <p>Data is stored using Supabase infrastructure with encryption at rest and in transit. Access is governed by role-based permissions enforced at both the application and database levels (Row Level Security). Sensitive documents are stored in private Supabase Storage buckets accessible only to authorized users. The protected Super Admin account has elevated privileges for system oversight. All access attempts, password changes, role modifications, and document downloads are logged in audit trails.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Data Sharing</h2>
          <p>We do not sell your personal data. We may share information with: (a) service providers who support our operations (e.g., Supabase for database/storage, Vercel for hosting) under strict contractual safeguards; (b) legal authorities when required by law or to protect our rights; and (c) corporate successors in the event of a merger, acquisition, or asset sale. Client data may be shared with the relevant client organization as part of BPO service delivery.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to: (a) access personal data we hold about you; (b) request correction of inaccurate data; (c) request deletion of your data (subject to legal retention requirements); (d) object to or restrict certain processing; (e) data portability; and (f) withdraw consent at any time. To exercise these rights, contact privacy@myne7x.com.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">7. Data Retention</h2>
          <p>We retain personal data for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations (including employment, tax, and labor law requirements which may mandate retention for 5-7 years), resolve disputes, and enforce our agreements. Inactive account data is reviewed periodically and securely deleted when no longer needed.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">8. International Transfers</h2>
          <p>Your data may be processed in countries other than your own, including Pakistan, the United States, and EU member states, depending on Supabase and Vercel infrastructure locations. We ensure appropriate safeguards are in place for cross-border transfers in accordance with applicable data protection laws.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">9. Cookies</h2>
          <p>We use essential cookies to maintain your authenticated session and remember preferences. See our Cookie Policy for details. We do not use advertising cookies or sell cookie-derived data to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">10. Children's Privacy</h2>
          <p>The Service is not directed to individuals under 18 years of age. We do not knowingly collect personal data from children. If you believe we have collected information from a child, please contact us immediately for deletion.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Material changes will be communicated through in-app announcements or direct notification. Continued use after changes constitutes acceptance.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">12. Contact</h2>
          <p>For privacy questions or requests, contact: privacy@myne7x.com or MYNE7X BPO Privacy Office, Plot 14, I.T. Tower, Clifton, Karachi, Pakistan.</p>
        </section>
        <p className="text-xs text-slate-500 pt-4 border-t border-white/5">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </PublicPageShell>
  )
}
