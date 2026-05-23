import { Link } from "@remix-run/react";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const meta = () => [
  { title: "Refund Policy — RefundSaviour" },
];

export default function RefundPolicy() {
  return (
    <LegalLayout title="Refund Policy" updated="January 1, 2025">
      <Section title="Our Commitment">
        <p>
          We want you to be fully satisfied with RefundSaviour. This policy explains when and how you can request a refund for your subscription.
        </p>
      </Section>

      <Section title="1. Free Plan">
        <p>
          The Free plan is provided at no charge. No refunds are applicable.
        </p>
      </Section>

      <Section title="2. Paid Subscriptions — 7-Day Money-Back Guarantee">
        <p>
          If you upgrade to the <strong>Starter</strong> or <strong>Pro</strong> plan and are not satisfied for any reason, you may request a full refund within <strong>7 days</strong> of your initial payment. To qualify:
        </p>
        <ul>
          <li>The refund request must be submitted within 7 calendar days of the charge date</li>
          <li>The guarantee applies to your <strong>first payment only</strong> on a new plan tier</li>
          <li>Renewals and subsequent billing cycles are not eligible for the money-back guarantee</li>
        </ul>
        <p>
          To request a refund under this guarantee, email{" "}
          <a href="mailto:billing@refundsaviour.com" className="text-cyan-400 hover:underline">
            billing@refundsaviour.com
          </a>{" "}
          with your store domain and the reason for your request. We aim to process all eligible refunds within 5 business days.
        </p>
      </Section>

      <Section title="3. Renewals">
        <p>
          Monthly subscription renewals are non-refundable. We send an email reminder 3 days before each renewal date. If you wish to cancel, please do so before the renewal date in your Billing settings.
        </p>
        <p>
          After cancellation, your paid plan remains active until the end of the current billing period. You will not be charged again.
        </p>
      </Section>

      <Section title="4. Exceptional Circumstances">
        <p>
          We consider refund requests outside the standard policy on a case-by-case basis in situations such as:
        </p>
        <ul>
          <li>Significant service outages that prevented you from using the app</li>
          <li>Duplicate charges due to a billing error</li>
          <li>Technical issues that we were unable to resolve within a reasonable time</li>
        </ul>
        <p>
          To submit a request, contact{" "}
          <a href="mailto:billing@refundsaviour.com" className="text-cyan-400 hover:underline">
            billing@refundsaviour.com
          </a>{" "}
          with your shop domain and a description of the issue.
        </p>
      </Section>

      <Section title="5. Cancellation">
        <p>
          You can cancel your subscription at any time from <strong>Settings → Billing</strong> in your RefundSaviour dashboard. You may also manage your subscription through the Paddle billing portal. Cancellation is immediate and you will retain access until the period end date.
        </p>
      </Section>

      <Section title="6. How Refunds Are Processed">
        <p>
          Approved refunds are processed via Paddle (our payment processor) back to the original payment method. Processing times depend on your card issuer but typically appear within 5–10 business days.
        </p>
      </Section>

      <Section title="7. Contact">
        <p>
          For billing or refund enquiries:{" "}
          <a href="mailto:billing@refundsaviour.com" className="text-cyan-400 hover:underline">
            billing@refundsaviour.com
          </a>
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
