import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import {
  ShieldCheck, TrendingUp, Zap, MessageSquare, BarChart3,
  ArrowRight, Star, CheckCircle2, ChevronRight, Sparkles
} from "lucide-react";

// If Shopify redirects here with ?shop=, forward to auth flow
export async function loader({ request }) {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    return redirect(`/auth/login?${url.searchParams.toString()}`);
  }
  return null;
}

export const meta = () => [
  { title: "RefundSaviour — Stop Losing Revenue to Refunds" },
  { name: "description", content: "AI-powered refund interception for Shopify stores. Convert refund requests into exchanges, store credit, and loyal customers." },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Interception",
    desc: "Widget appears the moment a customer clicks refund — before they even reach your support team.",
  },
  {
    icon: MessageSquare,
    title: "AI Negotiation",
    desc: "GPT-4 powered responses crafted to your brand voice, offering personalised alternatives in real time.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Retention",
    desc: "Turn refund losses into store credit or exchanges. Keep the sale, keep the customer.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Code Setup",
    desc: "Install from the Shopify App Store, connect, and you're live in under 5 minutes.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    desc: "Track every interception, conversion, and dollar saved from your real-time dashboard.",
  },
  {
    icon: Sparkles,
    title: "Smart Offers",
    desc: "Automatically generate discount codes, partial refunds, and exchange offers based on order data.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    desc: "Try it risk-free",
    features: ["10 interceptions/month", "AI negotiation", "Basic analytics", "Email support"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    desc: "For growing stores",
    features: ["200 interceptions/month", "AI negotiation", "Full analytics", "Priority support", "Custom offer templates"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    desc: "Scale without limits",
    features: ["Unlimited interceptions", "AI negotiation", "Advanced analytics", "Dedicated support", "Custom branding", "API access"],
    cta: "Go Pro",
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    store: "Bloom & Wild Co.",
    text: "We saved over $4,200 in the first month. The AI responses feel genuinely helpful, not pushy.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    store: "TechGear Direct",
    text: "Cut our refund rate by 67%. Customers actually appreciate the alternatives offered.",
    stars: 5,
  },
  {
    name: "Priya M.",
    store: "Natura Skin",
    text: "Setup took literally 4 minutes. ROI was positive within the first week.",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080810]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/30">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-lg font-bold tracking-tight">RefundSaviour</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/auth/login"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/auth/login"
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Install Free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Trusted by 500+ Shopify stores
          </div>
          <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Stop Losing Money{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              to Refunds
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 leading-relaxed">
            RefundSaviour intercepts refund requests on your Shopify store and uses AI to offer
            store credit, exchanges, and discounts — saving revenue you would have lost.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/auth/login"
              className="group flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 text-base font-bold text-black hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
            >
              Connect Your Shopify Store
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white hover:bg-white/10 transition-colors"
            >
              See How It Works
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-500">No credit card required · Free plan available · 2-minute setup</p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: "67%", label: "Average refund rate reduction" },
            { value: "$4.2K", label: "Average monthly revenue saved" },
            { value: "500+", label: "Active Shopify stores" },
            { value: "2 min", label: "Average setup time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-cyan-400 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black">Everything you need to retain revenue</h2>
            <p className="text-slate-400 text-lg">
              One app that pays for itself on day one.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                  <f.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black">Up and running in minutes</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Install the app", desc: "Add RefundSaviour to your Shopify store from the App Store in one click." },
              { step: "02", title: "Enable the widget", desc: "Add the refund widget block to your theme via the Theme Editor — no coding required." },
              { step: "03", title: "Watch it work", desc: "The AI intercepts refund requests and starts saving revenue automatically." },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="mb-4 text-5xl font-black text-white/5">{s.step}</div>
                <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                {s.step !== "03" && (
                  <ChevronRight className="absolute top-10 -right-4 hidden h-5 w-5 text-white/10 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? "border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_40px_rgba(6,182,212,0.15)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-1 text-xs font-bold text-black">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="mb-1 text-sm font-medium text-slate-400">{plan.name}</div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="mb-1 text-slate-400 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-500">{plan.desc}</p>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/auth/login"
                  className={`block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all ${
                    plan.highlight
                      ? "bg-cyan-500 text-black hover:bg-cyan-400"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-white/5 bg-white/[0.02] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black">Merchants love it</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-slate-300 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.store}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-4xl font-black">
            Ready to stop losing revenue?
          </h2>
          <p className="mb-10 text-slate-400">
            Join hundreds of Shopify merchants already saving thousands per month.
          </p>
          <a
            href="/auth/login"
            className="group inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-10 py-4 text-base font-bold text-black hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          >
            Connect Your Shopify Store — It's Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <span className="font-bold">RefundSaviour</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link>
              <a href="mailto:support@refundsaviour.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/5 pt-8 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} RefundSaviour. All rights reserved. Built for Shopify merchants.
          </div>
        </div>
      </footer>
    </div>
  );
}
