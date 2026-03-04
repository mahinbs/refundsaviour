import { authenticate } from "../shopify.server";
import { db } from "../supabase.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

    console.log(`Webhook received: ${topic} from ${shop}`);

    if (topic === "APP_UNINSTALLED") {
      // Mark merchant as uninstalled in database
      await db.updateMerchantSettings(shop, {
        uninstalled_at: new Date().toISOString(),
        widget_enabled: false,
      });

      console.log(`App uninstalled for shop: ${shop}`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
};
