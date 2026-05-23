import { Link } from "@remix-run/react";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const meta = () => [
  { title: "Privacy Policy — RefundSaviour" },
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updated="January 1, 2025">
      <Section title="1. Information We Collect">
        <p>When you install RefundSaviour on your Shopify store, we collect:</p>
        <ul>
          <li><strong>Store information:</strong> Your Shopify shop domain, shop name, store owner email, and shop currency/timezone settings.</li>
          <li><strong>Order data:</strong> Order IDs, item names, prices, and customer email addresses — only for orders where a refund interception is triggered.</li>
          <li><strong>Usage data:</strong> Number of interceptions, offers made, and outcomes (accepted/declined) for analytics purposes.</li>
          <li><strong>Account data:</strong> Email address and name if you create an admin account on our platform.</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul>
          <li>Provide the refund interception and AI negotiation service</li>
          <li>Display analytics and reporting in your dashboard</li>
          <li>Process subscription billing via Paddle</li>
          <li>Send transactional emails (billing receipts, alerts)</li>
          <li>Improve our AI models and service quality</li>
        </ul>
        <p>We do <strong>not</strong> sell your data or your customers' data to any third party.</p>
      </Section>

      <Section title="3. Customer Data">
        <p>
          We process your customers' email addresses and order information solely to deliver the RefundSaviour service to your store. This data is used to:
        </p>
        <ul>
          <li>Identify which order a refund request relates to</li>
          <li>Generate personalised AI responses</li>
          <li>Record interception outcomes in your merchant dashboard</li>
        </ul>
        <p>
          Customer email addresses are stored securely and never used for marketing purposes. You, as the merchant, remain the data controller for your customers' personal data under GDPR and applicable privacy laws.
        </p>
      </Section>

      <Section title="4. Data Sharing">
        <p>We share data only with the following service providers, strictly to operate the platform:</p>
        <ul>
          <li><strong>Supabase</strong> — database hosting (EU/US region, SOC 2 compliant)</li>
          <li><strong>OpenAI</strong> — AI response generation (data processed under OpenAI's API terms; not used for model training)</li>
          <li><strong>Paddle</strong> — subscription billing and payment processing</li>
          <li><strong>Shopify</strong> — app platform and OAuth authentication</li>
        </ul>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain your store data for as long as your account is active. If you uninstall the app, we delete your store data within 30 days, except where we are required to retain records for legal or tax compliance purposes.
        </p>
        <p>
          Interception records are retained for 12 months to support analytics and then automatically deleted.
        </p>
      </Section>

      <Section title="6. Security">
        <p>
          We implement industry-standard security measures including:
        </p>
        <ul>
          <li>Encryption in transit (TLS 1.2+) and at rest (AES-256)</li>
          <li>Row-level security on all database tables</li>
          <li>API keys and secrets stored as encrypted environment variables, never in code</li>
          <li>Regular security audits</li>
        </ul>
      </Section>

      <Section title="7. Your Rights">
        <p>Under GDPR and similar regulations, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Export your data in a portable format</li>
          <li>Object to or restrict processing</li>
        </ul>
        <p>To exercise any of these rights, email us at <a href="mailto:privacy@refundsaviour.com" className="text-cyan-400 hover:underline">privacy@refundsaviour.com</a>.</p>
      </Section>

      <Section title="8. Cookies">
        <p>
          Our web application uses session cookies for authentication only. We do not use tracking cookies or advertising cookies. The Shopify theme widget runs in your storefront and does not set any cookies.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify active merchants via email and display a notice in the dashboard at least 7 days before material changes take effect.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          For privacy-related questions, contact us at{" "}
          <a href="mailto:privacy@refundsaviour.com" className="text-cyan-400 hover:underline">
            privacy@refundsaviour.com
          </a>.
        </p>
      </Section>
    </LegalLayout>
  );
}

function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#080810]/80 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/30">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="font-bold text-white">RefundSaviour</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-3">{title}</h1>
          <p className="text-sm text-slate-500">Last updated: {updated}</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 mt-16">
        <div className="mx-auto max-w-4xl flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-white/5">{title}</h2>
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-white">
        {children}
      </div>
    </div>
  );
}
