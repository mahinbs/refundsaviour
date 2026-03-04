/**
 * Shopify adapter — implements the CommerceAdapter interface for Shopify stores.
 *
 * Uses the @shopify/shopify-api REST client under the hood.
 * Both OAuth-installed and manual-key merchants land here identically.
 */

import { shopifyApi, ApiVersion, LogSeverity } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import { CommerceAdapter } from "./base.server";

let _shopifyApiInstance = null;

function getApiInstance() {
  if (!_shopifyApiInstance) {
    _shopifyApiInstance = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY || "",
      apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
      scopes: (process.env.SCOPES || "").split(",").filter(Boolean),
      hostName: new URL(
        process.env.SHOPIFY_APP_URL || "http://localhost:3000"
      ).hostname,
      apiVersion: ApiVersion.October24,
      isEmbeddedApp: true,
      logger: { level: LogSeverity.Warning },
    });
  }
  return _shopifyApiInstance;
}

export class ShopifyAdapter extends CommerceAdapter {
  #client = null;

  get platformName() {
    return "Shopify";
  }

  /** Lazily build & cache the REST client for this merchant. */
  get client() {
    if (!this.#client) {
      const api = getApiInstance();
      const session = {
        id: `offline_${this.merchant.shop_domain}`,
        shop: this.merchant.shop_domain,
        state: "",
        isOnline: false,
        accessToken: this.merchant.access_token,
      };
      this.#client = new api.clients.Rest({ session });
    }
    return this.#client;
  }

  // ── Interface methods ────────────────────────────────────────────────────

  async validateConnection() {
    const api = getApiInstance();
    const session = {
      id: `validate_${this.merchant.shop_domain}`,
      shop: this.merchant.shop_domain,
      state: "",
      isOnline: false,
      accessToken: this.merchant.access_token,
    };
    const client = new api.clients.Rest({ session });

    try {
      const response = await client.get({ path: "shop" });
      const shop = response.body.shop;
      return {
        name: shop.name,
        email: shop.email,
        domain: shop.domain,
        plan: shop.plan_display_name,
      };
    } catch (error) {
      const status = error?.response?.code ?? error?.code;
      if (status === 401 || status === 403) {
        const err = new Error(
          "Invalid or expired Shopify access token. Double-check the token in your Shopify admin."
        );
        err.code = "INVALID_TOKEN";
        throw err;
      }
      if (status === 404) {
        const err = new Error(
          `Could not reach ${this.merchant.shop_domain}. Verify the shop domain.`
        );
        err.code = "SHOP_NOT_FOUND";
        throw err;
      }
      throw error;
    }
  }

  async createGiftCard({ value, customerId, note }) {
    const response = await this.client.post({
      path: "gift_cards",
      data: {
        gift_card: {
          initial_value: value.toFixed(2),
          customer_id: customerId || undefined,
          note: note || "RefundSavior store credit",
        },
      },
    });

    const gc = response.body.gift_card;
    return {
      id: String(gc.id),
      code: gc.code,
      amount: gc.initial_value,
    };
  }

  async createDiscountCode({ title, valueType, value, customerId }) {
    const priceRuleResponse = await this.client.post({
      path: "price_rules",
      data: {
        price_rule: {
          title,
          target_type: "shipping_line",
          target_selection: "all",
          allocation_method: "each",
          value_type: valueType || "percentage",
          value: value || "-100.0",
          customer_selection: customerId ? "prerequisite" : "all",
          ...(customerId && { prerequisite_customer_ids: [customerId] }),
          starts_at: new Date().toISOString(),
          usage_limit: 1,
        },
      },
    });

    const priceRuleId = priceRuleResponse.body.price_rule.id;
    const code = `RS-${Date.now()}`;

    await this.client.post({
      path: `price_rules/${priceRuleId}/discount_codes`,
      data: { discount_code: { code } },
    });

    return { code, priceRuleId: String(priceRuleId) };
  }

  async tagOrder(orderId, tags) {
    await this.client.put({
      path: `orders/${orderId}`,
      data: { order: { tags: tags.join(",") } },
    });
  }

  async getShopInfo() {
    const response = await this.client.get({ path: "shop" });
    return response.body.shop;
  }
}
