import { Link } from "@remix-run/react";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const meta = () => [
  { title: "Terms of Service — RefundSaviour" },
];

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" updated="January 1, 2025">
      <Section title="1. Acceptance of Terms">
        <p>
          By installing or using RefundSaviour ("the Service", "we", "us"), you ("Merchant", "you") agree to be bound by these Terms of Service. If you do not agree to these terms, do not install or use the Service.
        </p>
        <p>
          These Terms apply to all users of the Service, including merchants who install the app on their Shopify store.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          RefundSaviour is a Shopify application that intercepts customer refund requests on your storefront and uses AI-powered technology to offer alternative resolutions such as store credit, product exchanges, or discount codes, with the goal of reducing refund rates and retaining revenue.
        </p>
        <p>
          The Service includes:
        </p>
        <ul>
          <li>A Shopify theme extension widget displayed to customers</li>
          <li>AI negotiation powered by OpenAI's API</li>
          <li>A merchant dashboard with analytics and configuration</li>
          <li>Subscription billing managed via Paddle</li>
        </ul>
      </Section>

      <Section title="3. Account Registration">
        <p>
          To use the Service, you must have a valid Shopify store and install the app via Shopify's App Store or direct installation link. By installing the app, you authorise RefundSaviour to access your Shopify store data as specified in the app's requested scopes.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
      </Section>

      <Section title="4. Subscription Plans and Billing">
        <p>
          The Service is offered under three plans: Free, Starter ($29/month), and Pro ($79/month). Plan features and limits are as described on our pricing page and subject to change with 30 days' notice.
        </p>
        <ul>
          <li><strong>Free Plan:</strong> Limited to 10 interceptions per calendar month at no charge.</li>
          <li><strong>Paid Plans:</strong> Billed monthly in advance via Paddle. Payment is due on the subscription renewal date.</li>
          <li><strong>Overages:</strong> Once your monthly interception limit is reached, the widget will silently deactivate until the next billing cycle. No additional charges apply.</li>
          <li><strong>Upgrades/Downgrades:</strong> Plan changes take effect immediately (upgrades) or at the next renewal date (downgrades).</li>
        </ul>
      </Section>

      <Section title="5. Acceptable Use">
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Deceive or mislead customers about their rights to a refund under applicable consumer protection laws</li>
          <li>Override legally mandated refund obligations</li>
          <li>Circumvent Shopify's Platform Terms of Service</li>
          <li>Collect customer data beyond what is necessary for the Service</li>
          <li>Attempt to reverse-engineer, copy, or resell the Service</li>
        </ul>
        <p>
          You remain solely responsible for complying with consumer protection laws in your jurisdiction, including laws that may require you to honour refund requests regardless of the widget's outcome.
        </p>
      </Section>

      <Section title="6. Customer Refund Rights">
        <p>
          <strong>Important:</strong> RefundSaviour is a tool to offer alternatives to refunds — it does not override your legal obligations. You must continue to honour refund requests where required by law (e.g., EU consumer rights, Australian Consumer Law, UK Consumer Rights Act). The Service is designed to offer alternatives first, not to block legally entitled refunds.
        </p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          RefundSaviour and its original content, features, and functionality are owned by RefundSaviour and protected by applicable intellectual property laws. You retain ownership of your store data.
        </p>
      </Section>

      <Section title="8. Disclaimers and Limitation of Liability">
        <p>
          The Service is provided "as is" without warranties of any kind. We do not guarantee a specific reduction in refund rates or revenue savings, as results depend on your store, product category, and customer behaviour.
        </p>
        <p>
          To the maximum extent permitted by law, RefundSaviour's liability for any claim arising from use of the Service is limited to the amount you paid us in the 3 months preceding the claim.
        </p>
      </Section>

      <Section title="9. Termination">
        <p>
          You may cancel your subscription and uninstall the app at any time. Upon uninstallation, we will cease processing your store's data. Cancellation of a paid plan takes effect at the end of the current billing period; no pro-rata refunds are issued for unused time.
        </p>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>
          We may update these Terms from time to time. We will provide at least 14 days' notice of material changes via email and an in-app notification. Continued use after the effective date constitutes acceptance.
        </p>
      </Section>

      <Section title="11. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with applicable law. Disputes shall be resolved through binding arbitration or in courts of competent jurisdiction.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          For questions about these Terms, contact{" "}
          <a href="mailto:legal@refundsaviour.com" className="text-cyan-400 hover:underline">
            legal@refundsaviour.com
          </a>.
        </p>
      </Section>
    </LegalLayout>
  );
}

function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-[#080810] text-white">
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
        <div className="space-y-8">{children}</div>
      </div>

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
