import { json } from "@remix-run/node";
import { db } from "../supabase.server";
import { getCommerceClient, CommerceClientError } from "../commerce-client.server";

export async function action({ request }) {
  try {
    const body = await request.json();
    const {
      interceptionId,
      offerType,
      shopDomain,
      orderId,
      customerId,
      itemPrice,
      quantity = 1,
    } = body;

    if (!shopDomain || !offerType || !interceptionId) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    let client;
    try {
      client = await getCommerceClient(shopDomain);
    } catch (error) {
      if (error instanceof CommerceClientError) {
        return json({ error: error.message, code: error.code }, { status: 403 });
      }
      throw error;
    }

    const merchant = await db.getMerchantByShop(shopDomain);
    let result = {};
    let outcome = offerType;
    let retentionValue = 0;

    switch (offerType) {
      case "store_credit": {
        const multiplier = parseFloat(merchant.multiplier) || 1.10;
        const creditValue = parseFloat(itemPrice || 0) * multiplier * quantity;
        retentionValue = creditValue;

        try {
          const gc = await client.createGiftCard({
            value: creditValue,
            customerId: customerId || undefined,
            note: `RefundSavior retention - Order #${orderId}`,
          });

          result = {
            giftCardId: gc.id,
            giftCardCode: gc.code,
            amount: gc.amount,
          };

          await db.updateInterception(interceptionId, {
            outcome: "store_credit",
            offer_type: "store_credit",
            offer_value: creditValue,
            offer_multiplier: multiplier,
            gift_card_id: gc.id,
            gift_card_code: gc.code,
            retention_value: retentionValue,
            retained: true,
            completed_at: new Date().toISOString(),
          });

          if (orderId && orderId !== "unknown") {
            try {
              await client.tagOrder(orderId, ["RefundSavior-Retained", "StoreCredit"]);
            } catch {
              console.warn("Could not tag order:", orderId);
            }
          }
        } catch (error) {
          if (error instanceof CommerceClientError) {
            return json({ error: error.message, code: error.code }, { status: 403 });
          }
          console.error("Error creating gift card:", error);
          return json({ error: "Failed to create store credit" }, { status: 500 });
        }
        break;
      }

      case "exchange": {
        retentionValue = parseFloat(itemPrice || 0) * quantity;

        try {
          const discount = await client.createDiscountCode({
            title: `RefundSavior Exchange - Order ${orderId}`,
            valueType: "percentage",
            value: "-100.0",
            customerId: customerId || undefined,
          });

          result = { discountCode: discount.code, message: "Free exchange shipping code created" };

          await db.updateInterception(interceptionId, {
            outcome: "exchange",
            offer_type: "exchange",
            offer_value: retentionValue,
            discount_code: discount.code,
            retention_value: retentionValue,
            retained: true,
            completed_at: new Date().toISOString(),
          });

          if (orderId && orderId !== "unknown") {
            try {
              await client.tagOrder(orderId, ["RefundSavior-Retained", "Exchange"]);
            } catch {
              console.warn("Could not tag order:", orderId);
            }
          }
        } catch (error) {
          if (error instanceof CommerceClientError) {
            return json({ error: error.message, code: error.code }, { status: 403 });
          }
          console.error("Error creating exchange discount:", error);
          return json({ error: "Failed to create exchange offer" }, { status: 500 });
        }
        break;
      }

      case "refund": {
        await db.updateInterception(interceptionId, {
          outcome: "refund",
          retained: false,
          completed_at: new Date().toISOString(),
        });

        result = { message: "Customer chose refund", redirectToShopifyRefund: true };
        break;
      }

      default:
        return json({ error: "Invalid offer type" }, { status: 400 });
    }

    return json({ success: true, outcome, result, interceptionId });
  } catch (error) {
    console.error("Accept offer error:", error);
    return json(
      { error: "Failed to process offer", details: error.message },
      { status: 500 }
    );
  }
}
