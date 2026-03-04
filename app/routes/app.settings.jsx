import { json } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { db } from "../supabase.server";
import Settings from "../../src/pages/Settings";

export async function loader({ request }) {
  // Try OAuth session first — this is the normal embedded-app path.
  // If the user connected manually and is visiting the standalone app,
  // the authenticate call will still work because we stored the session.
  let session;
  try {
    ({ session } = await authenticate.admin(request));
  } catch {
    // If there's no valid Shopify session (e.g. manual-only merchant)
    // fall back to loading the page with no shop context.
    return json({ merchant: null, shop: null });
  }

  const merchant = await db.getMerchantByShop(session.shop);
  return json({ merchant, shop: session.shop });
}

export async function action({ request }) {
  let session;
  try {
    ({ session } = await authenticate.admin(request));
  } catch {
    return json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const intent = formData.get("_action");

  // ── Disconnect store ────────────────────────────────────────────────────
  if (intent === "disconnect") {
    try {
      await db.disconnectMerchant(session.shop);
      return json({ success: true, disconnected: true });
    } catch (error) {
      return json({ success: false, error: error.message }, { status: 500 });
    }
  }

  // ── Update widget / AI settings ─────────────────────────────────────────
  const updates = {
    multiplier: parseFloat(formData.get("multiplier")) || 1.10,
    incentive_type: formData.get("incentive_type") || "store_credit",
    widget_enabled: formData.get("widget_enabled") !== null,
    ai_tone: formData.get("ai_tone") || "friendly",
    primary_color: formData.get("primary_color") || "#6366f1",
  };

  try {
    const updatedMerchant = await db.updateMerchantSettings(session.shop, updates);
    return json({ success: true, merchant: updatedMerchant });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export default function SettingsRoute() {
  const { merchant, shop } = useLoaderData();
  const actionData = useActionData();

  return <Settings merchant={merchant} shop={shop} actionData={actionData} />;
}
