import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// System prompts for different scenarios
const SYSTEM_PROMPTS = {
  friendly: `You are a helpful and friendly customer retention agent for an online store. Your goal is to help customers find alternatives to refunds that work better for them, while always respecting their final decision.

Guidelines:
- Be empathetic and understanding
- Listen to their concerns carefully
- Offer personalized solutions based on their issue
- Never be pushy or manipulative
- Always offer the "escape hatch" - they can get a refund anytime
- Use a warm, conversational tone

Common scenarios:
- Size issues → Suggest exchange for correct size
- Damaged items → Offer replacement or store credit with bonus
- Changed mind → Offer store credit with multiplier incentive
- Quality concerns → Acknowledge and offer premium alternatives

Remember: A happy customer who gets store credit is better than a refund, but an unhappy customer forced to keep something is the worst outcome.`,

  professional: `You are a professional customer service representative focused on customer retention. Approach each interaction with courtesy and efficiency.

Your objectives:
- Understand the customer's concern thoroughly
- Present value-adding alternatives to refunds
- Maintain professional composure
- Respect customer autonomy

Available solutions:
1. Exchange for different size/variant
2. Store credit with value multiplier
3. Partial refund + store credit
4. Full refund (if customer insists)

Keep responses concise and solution-oriented.`,

  casual: `Hey there! You're a cool, laid-back retention specialist who helps customers work out the best solution when they're not happy with their purchase.

Your vibe:
- Chill and conversational
- Genuinely want to help
- Not salesy or corporate
- Real talk, no BS

What you can offer:
- Swap for a different size/style
- Store credit with a little extra thrown in
- Sometimes both partial refund + credit works
- And yeah, refunds are totally fine if that's what they need

Keep it real, keep it helpful!`,
};

export async function generateAIResponse({
  messages,
  returnReason,
  merchantSettings,
  orderInfo,
}) {
  try {
    const tone = merchantSettings.ai_tone || "friendly";
    const multiplier = merchantSettings.multiplier || 1.10;
    const systemPrompt = merchantSettings.custom_prompt || SYSTEM_PROMPTS[tone];

    // Enhance system prompt with merchant-specific details
    const enhancedSystemPrompt = `${systemPrompt}

Current Context:
- Store Credit Multiplier: ${multiplier}x (e.g., $100 refund → $${(100 * multiplier).toFixed(2)} store credit)
- Order Value: $${orderInfo.itemPrice || 0}
- Return Reason: ${returnReason}
- Product: ${orderInfo.productName || "Unknown"}

Available incentives:
1. Store Credit at ${multiplier}x value
2. Free exchange (if size/fit issue)
3. Discount on next purchase
`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: enhancedSystemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return {
      content: completion.choices[0].message.content,
      model: completion.model,
      tokensUsed: completion.usage.total_tokens,
      finishReason: completion.choices[0].finish_reason,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function analyzeReturnReason(reason, details) {
  try {
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: `You are analyzing customer return reasons. Categorize the reason and suggest the best retention strategy.
          
Categories: size_issue, damaged, quality_issue, changed_mind, wrong_item, shipping_delay, other

Return a JSON object with:
{
  "category": "category_name",
  "sentiment": "positive|neutral|negative",
  "retentionPotential": "high|medium|low",
  "suggestedOffer": "exchange|store_credit|discount|refund",
  "reasoning": "brief explanation"
}`,
        },
        {
          role: "user",
          content: `Reason: ${reason}\nDetails: ${details || "None provided"}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing return reason:", error);
    return {
      category: "other",
      sentiment: "neutral",
      retentionPotential: "medium",
      suggestedOffer: "store_credit",
      reasoning: "Unable to analyze",
    };
  }
}

export async function generateOfferMessage(merchantSettings, orderInfo, returnReason) {
  const multiplier = merchantSettings.multiplier || 1.10;
  const itemPrice = parseFloat(orderInfo.itemPrice || 0);
  const storeCreditValue = (itemPrice * multiplier).toFixed(2);

  const analysis = await analyzeReturnReason(returnReason, orderInfo.details);

  let offerMessage = "";

  switch (analysis.suggestedOffer) {
    case "exchange":
      offerMessage = `I'd love to help you get the right fit! Would you like to exchange this for a different size? We'll cover the shipping both ways. 📦`;
      break;
    
    case "store_credit":
      offerMessage = `I understand your concern. How about we offer you $${storeCreditValue} in store credit instead of the $${itemPrice.toFixed(2)} refund? That's ${((multiplier - 1) * 100).toFixed(0)}% extra to use on anything you'd like! 🎁`;
      break;
    
    case "discount":
      offerMessage = `I'm sorry this didn't work out. Would a 20% discount on your next purchase help make it right? Plus, you can still exchange this item if you'd prefer. 💫`;
      break;
    
    default:
      offerMessage = `I want to make sure you're happy with your purchase. Let me see what options we have to make this right for you.`;
  }

  return {
    message: offerMessage,
    analysis,
    offers: generateOffers(merchantSettings, orderInfo),
  };
}

function generateOffers(merchantSettings, orderInfo) {
  const multiplier = merchantSettings.multiplier || 1.10;
  const itemPrice = parseFloat(orderInfo.itemPrice || 0);
  
  return [
    {
      type: "store_credit",
      title: "Store Credit Bonus",
      description: `Get ${((multiplier - 1) * 100).toFixed(0)}% extra value`,
      value: (itemPrice * multiplier).toFixed(2),
      badge: "Most Popular",
    },
    {
      type: "exchange",
      title: "Free Exchange",
      description: "Try a different size or style",
      value: itemPrice.toFixed(2),
      badge: "Free Shipping",
    },
    {
      type: "refund",
      title: "Full Refund",
      description: "Money back to original payment",
      value: itemPrice.toFixed(2),
      badge: null,
    },
  ];
}
