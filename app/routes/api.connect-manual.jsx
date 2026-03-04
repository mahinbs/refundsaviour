import { json } from "@remix-run/node";
import { db } from "../supabase.server";
import {
  validateCredentials,
  CommerceClientError,
} from "../commerce-client.server";

/**
 * POST /api/connect-manual
 *
 * Body: { shopDomain: string, accessToken: string, platform?: string }
 *
 * 1. Normalises the shop domain
 * 2. Validates credentials via the platform adapter
 * 3. Upserts into the merchants table with the right auth_method + platform
 * 4. Returns the shop info on success
 */
export async function action({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    let { shopDomain, accessToken, platform = "shopify" } = body;

    // ── Basic validation ────────────────────────────────────────────────────
    if (!shopDomain || !accessToken) {
      return json(
        { error: "Both Shop Domain and Access Token are required." },
        { status: 400 }
      );
    }

    shopDomain = normaliseDomain(shopDomain);
    accessToken = accessToken.trim();
    platform = platform.trim().toLowerCase();

    const SUPPORTED_PLATFORMS = ["shopify", "woocommerce", "bigcommerce", "magento", "custom"];
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
      return json(
        { error: `Unsupported platform "${platform}". Supported: ${SUPPORTED_PLATFORMS.join(", ")}` },
        { status: 400 }
      );
    }

    if (platform === "shopify" && !shopDomain.endsWith(".myshopify.com")) {
      return json(
        {
          error:
            'Shopify domains must end with .myshopify.com (e.g. "my-store.myshopify.com").',
        },
        { status: 400 }
      );
    }

    if (accessToken.length < 10) {
      return json(
        { error: "Access token looks too short. Please paste the full token." },
        { status: 400 }
      );
    }

    // ── Validate credentials via the platform adapter ────────────────────
    let shopInfo;
    try {
      shopInfo = await validateCredentials(shopDomain, accessToken, platform);
    } catch (error) {
      if (error instanceof CommerceClientError || error.code) {
        return json({ error: error.message, code: error.code }, { status: 400 });
      }
      console.error("Unexpected error validating credentials:", error);
      return json(
        { error: "Could not validate the credentials. Please try again." },
        { status: 500 }
      );
    }

    // ── Save to database ────────────────────────────────────────────────────
    const authMethod = platform === "shopify" ? "manual" : "api_key";

    const merchant = await db.upsertMerchant({
      shopDomain,
      accessToken,
      authMethod,
      platform,
      storeName: shopInfo.name,
      email: shopInfo.email,
    });

    return json({
      success: true,
      merchant: {
        id: merchant.id,
        shop_domain: merchant.shop_domain,
        store_name: merchant.store_name,
        platform: merchant.platform,
        auth_method: merchant.auth_method,
        is_active: merchant.is_active,
      },
      shopInfo: {
        name: shopInfo.name,
        email: shopInfo.email,
        domain: shopInfo.domain,
        plan: shopInfo.plan,
      },
    });
  } catch (error) {
    console.error("Manual connect error:", error);
    return json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Strip protocol, trailing slashes, leading/trailing whitespace, lowercase.
 */
function normaliseDomain(raw) {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.replace(/\/+$/, "");
  return d;
}
