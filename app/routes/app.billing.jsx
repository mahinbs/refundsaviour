import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { db } from "../supabase.server";
import {
  PLANS,
  getOrCreatePaddleCustomer,
  getPortalUrl,
} from "../paddle.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const merchant = await db.getMerchantByShop(session.shop);

  if (!merchant) {
    throw new Response("Merchant not found", { status: 404 });
  }

  const monthlyCount = await db.getMonthlyInterceptionCount(merchant.id);

  // Get Paddle portal URL if merchant already has a subscription
  let portalUrl = null;
  if (merchant.paddle_customer_id) {
    try {
      portalUrl = await getPortalUrl(merchant.paddle_customer_id);
    } catch {
      // Non-fatal — portal link just won't show
    }
  }

  return json({
    merchant,
    monthlyCount,
    portalUrl,
    plans: PLANS,
    paddleClientToken: process.env.PADDLE_CLIENT_TOKEN,
    paddleEnvironment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
    shop: session.shop,
  });
}

export default function BillingRoute() {
  const { merchant, monthlyCount, portalUrl, plans, paddleClientToken, paddleEnvironment, shop } =
    useLoaderData();

  const currentPlan = merchant.subscription_plan || "free";
  const currentStatus = merchant.subscription_status || "free";
  const isActive = currentStatus === "active" || currentStatus === "trialing";
  const planLimit = plans[currentPlan]?.interceptionLimit;

  function openCheckout(priceId) {
    if (!window.Paddle) return alert("Paddle is still loading. Please wait a moment.");
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: merchant.email || "" },
      customData: { shopDomain: shop },
    });
  }

  return (
    <>
      {/* Paddle.js */}
      <script src="https://cdn.paddle.com/paddle/v2/paddle.js" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              if (window.Paddle) {
                Paddle.Environment.set("${paddleEnvironment}");
                Paddle.Initialize({
                  token: "${paddleClientToken}",
                  eventCallback: function(data) {
                    if (data.name === "checkout.completed") {
                      setTimeout(() => window.location.reload(), 2000);
                    }
                  }
                });
              }
            });
          `,
        }}
      />

      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Billing & Plan</h2>
            <p className="text-sm text-slate-400">Manage your subscription and usage</p>
          </div>
        </div>

        {/* Current plan status */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white capitalize">{currentPlan}</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : currentStatus === "past_due"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : currentStatus === "cancelled"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                  }`}
                >
                  {currentStatus === "free" ? "Free tier" : currentStatus.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Interceptions this month</p>
                <p className="text-lg font-bold text-white">
                  {monthlyCount}
                  {planLimit !== null && (
                    <span className="text-slate-400 text-sm font-normal"> / {planLimit}</span>
                  )}
                  {planLimit === null && (
                    <span className="text-emerald-400 text-sm font-normal"> / ∞</span>
                  )}
                </p>
                {planLimit !== null && (
                  <div className="h-1.5 w-32 rounded-full bg-white/10 mt-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${Math.min((monthlyCount / planLimit) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {portalUrl && (
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Manage subscription
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {currentStatus === "past_due" && (
            <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-300">
              ⚠️ Your last payment failed. Please update your payment method to keep your subscription active.
              {portalUrl && (
                <a href={portalUrl} target="_blank" rel="noreferrer" className="ml-2 underline font-semibold">
                  Update payment method →
                </a>
              )}
            </div>
          )}

          {currentStatus === "cancelled" && (
            <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300">
              Your subscription has been cancelled.
              {merchant.subscription_ends_at && (
                <> Access continues until <strong>{new Date(merchant.subscription_ends_at).toLocaleDateString()}</strong>.</>
              )}
            </div>
          )}
        </div>

        {/* Plans */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Choose a Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([key, plan]) => {
              const isCurrent = key === currentPlan && isActive;
              const isPopular = key === "starter";

              return (
                <div
                  key={key}
                  className={`relative rounded-2xl border p-6 flex flex-col ${
                    isPopular
                      ? "border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-neon-blue">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">
                      {plan.name}
                    </p>
                    <p className="text-3xl font-bold text-white">{plan.price}</p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <svg className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {key === "free" ? (
                    <div className="h-10 flex items-center justify-center text-sm text-slate-500 border border-white/5 rounded-xl">
                      {isCurrent ? "Your current plan" : "Default free tier"}
                    </div>
                  ) : isCurrent ? (
                    <div className="h-10 flex items-center justify-center text-sm font-semibold text-primary border border-primary/30 rounded-xl bg-primary/5">
                      Current plan
                    </div>
                  ) : plan.priceId ? (
                    <button
                      onClick={() => openCheckout(plan.priceId)}
                      className={`w-full h-10 rounded-xl text-sm font-bold transition-all ${
                        isPopular
                          ? "bg-primary text-white hover:bg-primary/90 shadow-neon-blue"
                          : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {currentPlan === "free" ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`}
                    </button>
                  ) : (
                    <div className="h-10 flex items-center justify-center text-sm text-slate-500 border border-white/5 rounded-xl">
                      Price not configured
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Billing FAQ</h3>
          <dl className="space-y-4">
            {[
              {
                q: "When am I charged?",
                a: "You're charged at the start of each billing period. Paddle handles all payment processing securely.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Click 'Manage subscription' above to cancel. You'll keep access until the end of the period you've paid for.",
              },
              {
                q: "What happens if I hit my interception limit?",
                a: "New interceptions are paused until the next month or you upgrade. Existing data is never deleted.",
              },
              {
                q: "Which payment methods are accepted?",
                a: "Visa, Mastercard, Amex, PayPal, and more — all handled securely by Paddle.",
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <dt className="text-sm font-semibold text-white mb-1">{q}</dt>
                <dd className="text-sm text-slate-400">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
