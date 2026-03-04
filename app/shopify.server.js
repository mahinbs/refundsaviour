import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  DeliveryMethod,
} from "@shopify/shopify-app-remix/server";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-10";
import { SupabaseSessionStorage } from "./session-storage.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(",") || [],
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new SupabaseSessionStorage(),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/api/webhooks/app-uninstalled",
      callback: async (topic, shop, body, webhookId) => {
        console.log("App uninstalled from shop:", shop);
        const { supabase } = await import("./supabase.server");
        const { error } = await supabase
          .from("merchants")
          .update({
            uninstalled_at: new Date().toISOString(),
            is_active: false,
          })
          .eq("shop_domain", shop);

        if (error) {
          console.error("Error marking merchant as uninstalled:", error);
        }
      },
    },
    ORDERS_FULFILLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/api/webhooks/orders-fulfilled",
      callback: async (topic, shop, body, webhookId) => {
        console.log("Order fulfilled webhook received:", shop);
        const orderData = JSON.parse(body);
        // Store order data for return eligibility tracking
        // You can extend this to track which items are eligible for returns
        console.log("Order ID:", orderData.id, "Items:", orderData.line_items?.length);
      },
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });

      const { db: dbHelper } = await import("./supabase.server");

      try {
        await dbHelper.upsertMerchant({
          shopDomain: session.shop,
          accessToken: session.accessToken,
          authMethod: "oauth",
          platform: "shopify",
        });
      } catch (error) {
        console.error("Error upserting merchant after OAuth:", error);
      }
    },
  },
  future: {},
  ...(process.env.SHOP_CUSTOM_DOMAIN && {
    customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN],
  }),
});

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
