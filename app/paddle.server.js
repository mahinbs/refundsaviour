import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { PLANS as BASE_PLANS } from "./plans.js";

const paddle = new Paddle(process.env.PADDLE_API_KEY || "", {
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.production
      : Environment.sandbox,
});

export { paddle };

// Inject env-based priceIds at server runtime
export const PLANS = {
  ...BASE_PLANS,
  starter: { ...BASE_PLANS.starter, priceId: process.env.PADDLE_PRICE_ID_STARTER },
  pro: { ...BASE_PLANS.pro, priceId: process.env.PADDLE_PRICE_ID_PRO },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Find or create a Paddle customer for a merchant.
 * Returns the Paddle customer ID.
 */
export async function getOrCreatePaddleCustomer(merchant) {
  if (merchant.paddle_customer_id) {
    return merchant.paddle_customer_id;
  }

  const customer = await paddle.customers.create({
    email: merchant.email || `${merchant.shop_domain}@noreply.refundsavior.com`,
    name: merchant.store_name || merchant.shop_domain,
    customData: { shopDomain: merchant.shop_domain },
  });

  return customer.id;
}

/**
 * Generate a Paddle customer portal URL so the merchant can manage
 * their subscription, update payment method, download invoices, etc.
 */
export async function getPortalUrl(paddleCustomerId) {
  const session = await paddle.customers.createPortalSession(paddleCustomerId, {
    subscriptionIds: [],
  });
  return session.urls.general.overview;
}

/**
 * Cancel a subscription immediately.
 */
export async function cancelSubscription(subscriptionId) {
  return paddle.subscriptions.cancel(subscriptionId, {
    effectiveFrom: "immediately",
  });
}

/**
 * Verify a Paddle webhook and return the parsed event.
 * Throws if the signature is invalid.
 */
export async function verifyWebhook(request) {
  const signature = request.headers.get("paddle-signature") || "";
  const rawBody = await request.text();
  const event = await paddle.webhooks.unmarshal(
    rawBody,
    process.env.PADDLE_WEBHOOK_SECRET || "",
    signature
  );
  return event;
}

/**
 * Returns true if a merchant's subscription allows more interceptions.
 */
export function canIntercept(merchant) {
  const plan = PLANS[merchant.subscription_plan] || PLANS.free;
  if (plan.interceptionLimit === null) return true; // unlimited

  // If status is not active/trialing, fall back to free limit
  const status = merchant.subscription_status || "free";
  const isActive = status === "active" || status === "trialing";
  const effectivePlan = isActive ? plan : PLANS.free;

  if (effectivePlan.interceptionLimit === null) return true;
  // Caller must pass monthly count separately — this just returns the limit
  return effectivePlan.interceptionLimit;
}
