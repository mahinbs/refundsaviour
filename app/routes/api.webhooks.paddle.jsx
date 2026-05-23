import { verifyWebhook } from "../paddle.server";
import { db } from "../supabase.server";

/**
 * POST /api/webhooks/paddle
 *
 * Handles all Paddle subscription & transaction events.
 * Paddle sends a `paddle-signature` header — we verify it before processing.
 */
export async function action({ request }) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch (err) {
    console.error("[Paddle webhook] Invalid signature:", err.message);
    return new Response("Invalid signature", { status: 401 });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error(`[Paddle webhook] Error handling ${event.eventType}:`, err);
    return new Response("Internal error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

// ── Event dispatcher ──────────────────────────────────────────────────────────

async function handleEvent(event) {
  const { eventType, data } = event;
  console.log(`[Paddle webhook] ${eventType}`);

  switch (eventType) {
    // ── Subscription became active (new sign-up or trial converted) ──────────
    case "subscription.activated":
      await onSubscriptionActivated(data);
      break;

    // ── Subscription updated (plan change, quantity change) ──────────────────
    case "subscription.updated":
      await onSubscriptionUpdated(data);
      break;

    // ── Subscription cancelled (still active until period end) ──────────────
    case "subscription.cancelled":
      await onSubscriptionCancelled(data);
      break;

    // ── Subscription paused (payment failure, voluntary) ─────────────────────
    case "subscription.paused":
      await onSubscriptionPaused(data);
      break;

    // ── Subscription resumed after pause ────────────────────────────────────
    case "subscription.resumed":
      await onSubscriptionResumed(data);
      break;

    // ── Renewal payment succeeded ────────────────────────────────────────────
    case "transaction.completed":
      await onTransactionCompleted(data);
      break;

    // ── Payment failed ───────────────────────────────────────────────────────
    case "transaction.payment_failed":
      await onPaymentFailed(data);
      break;

    default:
      console.log(`[Paddle webhook] Unhandled event: ${eventType}`);
  }
}

// ── Handlers ─────────────────────────────────────────────────────────────────

async function onSubscriptionActivated(data) {
  const shopDomain = data.customData?.shopDomain;
  if (!shopDomain) return;

  const plan = resolvePlan(data.items);

  await db.updatePaddleSubscription(shopDomain, {
    paddle_customer_id: data.customerId,
    paddle_subscription_id: data.id,
    subscription_status: "active",
    subscription_plan: plan,
    subscription_ends_at: data.currentBillingPeriod?.endsAt ?? null,
  });
}

async function onSubscriptionUpdated(data) {
  const shopDomain = data.customData?.shopDomain;
  if (!shopDomain) return;

  const plan = resolvePlan(data.items);
  const status = mapPaddleStatus(data.status);

  await db.updatePaddleSubscription(shopDomain, {
    paddle_subscription_id: data.id,
    subscription_status: status,
    subscription_plan: plan,
    subscription_ends_at: data.currentBillingPeriod?.endsAt ?? null,
  });
}

async function onSubscriptionCancelled(data) {
  const shopDomain = data.customData?.shopDomain;
  if (!shopDomain) return;

  await db.updatePaddleSubscription(shopDomain, {
    subscription_status: "cancelled",
    subscription_ends_at: data.canceledAt ?? data.currentBillingPeriod?.endsAt ?? null,
  });
}

async function onSubscriptionPaused(data) {
  const shopDomain = data.customData?.shopDomain;
  if (!shopDomain) return;

  await db.updatePaddleSubscription(shopDomain, {
    subscription_status: "paused",
  });
}

async function onSubscriptionResumed(data) {
  const shopDomain = data.customData?.shopDomain;
  if (!shopDomain) return;

  await db.updatePaddleSubscription(shopDomain, {
    subscription_status: "active",
    subscription_ends_at: data.currentBillingPeriod?.endsAt ?? null,
  });
}

async function onTransactionCompleted(data) {
  // Renewal payment succeeded — make sure subscription stays active
  const shopDomain = data.customData?.shopDomain;
  if (!shopDomain || !data.subscriptionId) return;

  await db.updatePaddleSubscription(shopDomain, {
    subscription_status: "active",
  });
}

async function onPaymentFailed(data) {
  const shopDomain = data.customData?.shopDomain;
  if (!shopDomain) return;

  await db.updatePaddleSubscription(shopDomain, {
    subscription_status: "past_due",
  });
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function resolvePlan(items = []) {
  if (!items.length) return "free";
  const priceId = items[0]?.price?.id ?? "";

  if (priceId === process.env.PADDLE_PRICE_ID_PRO) return "pro";
  if (priceId === process.env.PADDLE_PRICE_ID_STARTER) return "starter";
  return "free";
}

function mapPaddleStatus(paddleStatus) {
  const map = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    paused: "paused",
    cancelled: "cancelled",
    canceled: "cancelled",
  };
  return map[paddleStatus] ?? "free";
}
