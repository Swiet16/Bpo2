import { PublicPageShell } from '@/components/PublicPageShell'

export function TermsPage() {
  return (
    <PublicPageShell title="Terms & Conditions" subtitle="The terms governing your use of MYNE7X BPO services.">
      <div className="max-w-4xl mx-auto glass-card p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using the MYNE7X BPO platform (the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the Service. These terms constitute a legally binding agreement between you and MYNE7X BPO ("we," "us," or "our").</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. Service Description</h2>
          <p>MYNE7X BPO provides business process outsourcing services including but not limited to customer support, workforce management, payroll processing, contract management, IT operations, and business intelligence analytics. The Service is intended for authorized business users and may include both authenticated dashboard access and public-facing information pages.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. User Accounts & Authentication</h2>
          <p>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Accounts are role-based and granted based on your employment or contractual relationship with MYNE7X BPO. The protected Super Admin account (myne7x@gmail.com) represents the CEO and has unrestricted platform authority that cannot be transferred, downgraded, or modified by any other user.</p>
          <p className="mt-2">Unauthorized attempts to access, modify, or compromise the Super Admin account will be logged and may result in immediate account suspension and legal action.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Acceptable Use</h2>
          <p>You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to gain unauthorized access to any portion of the Service, other accounts, or computer systems; (c) upload, transmit, or distribute viruses or malicious code; (d) interfere with or disrupt the Service; (e) attempt to manipulate role assignments or permissions beyond your authorization; (f) share your credentials with unauthorized individuals; or (g) use the Service to store or transmit content that violates applicable laws or third-party rights.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Data Privacy & Security</h2>
          <p>We implement industry-standard security measures including Supabase authentication, role-based access control, audit logging, encrypted storage, and protected storage buckets for sensitive documents. Your use of the Service is also governed by our Privacy Policy, which describes how we collect, use, and protect your information.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">6. Intellectual Property</h2>
          <p>All content, features, and functionality of the Service — including but not limited to text, graphics, logos, software, and the MYNE7X BPO brand identity — are owned by MYNE7X BPO and protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit written permission.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">7. Service Availability</h2>
          <p>We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance, unscheduled outages, force majeure events, and internet connectivity issues may affect availability. We will provide reasonable notice for scheduled maintenance whenever possible.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, MYNE7X BPO shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, business opportunities, or goodwill, arising from your use of or inability to use the Service.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">9. Termination</h2>
          <p>We reserve the right to suspend or terminate your access to the Service at any time, with or without cause or notice. Upon termination, your right to use the Service ceases immediately. The Super Admin may suspend, terminate, or modify any user account based on operational, security, or compliance requirements.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">10. Modifications</h2>
          <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms. We will notify users of significant changes through in-app announcements or email where appropriate.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">11. Contact</h2>
          <p>For questions about these Terms, contact us at legal@myne7x.com or write to: MYNE7X BPO Legal Department, Plot 14, I.T. Tower, Clifton, Karachi, Pakistan.</p>
        </section>
        <p className="text-xs text-slate-500 pt-4 border-t border-white/5">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </PublicPageShell>
  )
}
