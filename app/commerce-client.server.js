/**
 * Platform-agnostic commerce client.
 *
 * getCommerceClient(shopDomain) reads the merchant's `platform` column from
 * Supabase and returns the right adapter.  All adapters expose the same
 * interface so every caller (accept-offer, negotiate, etc.) works identically
 * regardless of whether the store runs Shopify, WooCommerce, or a custom API.
 *
 * ┌──────────────────────────────────────┐
 * │  caller (api.accept-offer, etc.)     │
 * │       ↓ getCommerceClient()          │
 * │  ┌──────────────────────────────┐    │
 * │  │  CommerceAdapter interface   │    │
 * │  │    .createGiftCard()         │    │
 * │  │    .createDiscountCode()     │    │
 * │  │    .tagOrder()               │    │
 * │  │    .getShopInfo()            │    │
 * │  └──────┬──────────┬───────────┘    │
 * │    Shopify   WooCommerce  Custom    │
 * └──────────────────────────────────────┘
 */

import { db, supabase } from "./supabase.server";

// ── Platform adapters (lazy-loaded) ──────────────────────────────────────────
import { ShopifyAdapter } from "./adapters/shopify.server";

const ADAPTER_MAP = {
  shopify: ShopifyAdapter,
  // Future:
  // woocommerce: () => import("./adapters/woocommerce.server").then(m => m.WooCommerceAdapter),
  // bigcommerce: () => import("./adapters/bigcommerce.server").then(m => m.BigCommerceAdapter),
  // magento:     () => import("./adapters/magento.server").then(m => m.MagentoAdapter),
  // custom:      () => import("./adapters/custom.server").then(m => m.CustomAdapter),
};

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns a platform adapter for the given shop.
 * The adapter exposes a normalised interface (see adapters/base.server.js).
 *
 * @param {string} shopDomain
 * @returns {Promise<import("./adapters/base.server").CommerceAdapter>}
 */
export async function getCommerceClient(shopDomain) {
  const merchant = await db.getMerchantByShop(shopDomain);

  if (!merchant) {
    throw new CommerceClientError("Merchant not found", "NOT_FOUND");
  }
  if (!merchant.is_active) {
    throw new CommerceClientError(
      "Store connection is inactive. Please reconnect your store.",
      "INACTIVE"
    );
  }
  if (!merchant.access_token) {
    throw new CommerceClientError(
      "No access token on file. Please connect your store.",
      "NO_TOKEN"
    );
  }

  const platform = merchant.platform || "shopify";
  const AdapterClass = ADAPTER_MAP[platform];

  if (!AdapterClass) {
    throw new CommerceClientError(
      `Unsupported platform: "${platform}". Contact support.`,
      "UNSUPPORTED_PLATFORM"
    );
  }

  const adapter = new AdapterClass(merchant);
  return wrapWith401Handler(adapter, shopDomain);
}

/**
 * Validate credentials for a given platform before saving them.
 * Returns platform-specific shop info on success, throws on failure.
 */
export async function validateCredentials(shopDomain, accessToken, platform = "shopify") {
  const AdapterClass = ADAPTER_MAP[platform];
  if (!AdapterClass) {
    throw new CommerceClientError(
      `Unsupported platform: "${platform}".`,
      "UNSUPPORTED_PLATFORM"
    );
  }

  const tempMerchant = {
    shop_domain: shopDomain,
    access_token: accessToken,
    platform,
    platform_config: {},
  };

  const adapter = new AdapterClass(tempMerchant);
  return adapter.validateConnection();
}

// ── Error class ──────────────────────────────────────────────────────────────

export class CommerceClientError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "CommerceClientError";
    this.code = code;
  }
}

// ── 401 auto-deactivation proxy ──────────────────────────────────────────────

function wrapWith401Handler(adapter, shopDomain) {
  const handler = {
    get(target, prop) {
      const value = target[prop];
      if (typeof value !== "function") return value;

      return async function (...args) {
        try {
          return await value.apply(target, args);
        } catch (error) {
          if (isAuthError(error)) {
            console.error(
              `[CommerceClient] Auth failure for ${shopDomain} (${target.platformName}) — marking inactive`
            );
            await supabase
              .from("merchants")
              .update({ is_active: false })
              .eq("shop_domain", shopDomain);

            throw new CommerceClientError(
              "Your store access token has been revoked or expired. Please reconnect your store.",
              "TOKEN_REVOKED"
            );
          }
          throw error;
        }
      };
    },
  };

  return new Proxy(adapter, handler);
}

function isAuthError(error) {
  const status = error?.response?.code ?? error?.status ?? error?.code;
  return status === 401 || status === "401";
}
