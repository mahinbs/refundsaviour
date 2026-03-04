import { json } from "@remix-run/node";
import { db } from "../supabase.server";
import { generateAIResponse, generateOfferMessage } from "../openai.server";

export async function action({ request }) {
  try {
    const body = await request.json();
    const {
      shopDomain,
      orderId,
      customerId,
      customerEmail,
      returnReason,
      returnDetails,
      productId,
      productName,
      variantId,
      itemPrice,
      messages = [],
      interceptionId,
    } = body;

    // Get merchant settings — works for both OAuth and manual merchants
    const merchant = await db.getMerchantByShop(shopDomain);
    if (!merchant) {
      return json({ error: "Merchant not found" }, { status: 404 });
    }
    if (!merchant.is_active) {
      return json(
        { error: "Store connection is inactive. The merchant needs to reconnect." },
        { status: 403 }
      );
    }

    // Create or update interception record
    let interception;
    if (interceptionId) {
      interception = await db.updateInterception(interceptionId, {
        chat_messages_count: messages.length,
      });
    } else {
      interception = await db.createInterception({
        merchant_id: merchant.id,
        customer_id: customerId,
        customer_email: customerEmail,
        external_order_id: orderId,
        product_id: productId,
        product_name: productName,
        variant_id: variantId,
        item_price: itemPrice,
        return_reason: returnReason,
        return_reason_detail: returnDetails,
        outcome: "pending",
      });
    }

    // If this is the first message, generate initial offer
    if (messages.length === 0) {
      const initialOffer = await generateOfferMessage(
        merchant,
        { itemPrice, productName, details: returnDetails },
        returnReason
      );

      // Save initial AI message to conversation
      await db.addConversationMessage({
        interception_id: interception.id,
        role: "assistant",
        content: initialOffer.message,
        model: "gpt-4o-mini",
      });

      return json({
        interceptionId: interception.id,
        response: initialOffer.message,
        offers: initialOffer.offers,
        analysis: initialOffer.analysis,
      });
    }

    // Generate AI response for ongoing conversation
    const aiResponse = await generateAIResponse({
      messages,
      returnReason,
      merchantSettings: merchant,
      orderInfo: {
        itemPrice,
        productName,
        orderId,
      },
    });

    // Save user message and AI response to conversation
    const userMessage = messages[messages.length - 1];
    await db.addConversationMessage({
      interception_id: interception.id,
      role: "user",
      content: userMessage.content,
    });

    await db.addConversationMessage({
      interception_id: interception.id,
      role: "assistant",
      content: aiResponse.content,
      model: aiResponse.model,
      tokens_used: aiResponse.tokensUsed,
    });

    return json({
      interceptionId: interception.id,
      response: aiResponse.content,
      tokensUsed: aiResponse.tokensUsed,
    });
  } catch (error) {
    console.error("Negotiate API error:", error);
    return json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}
