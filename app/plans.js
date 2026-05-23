// Shared plan definitions — no server dependencies, safe to import on client or server
export const PLANS = {
  free: {
    name: "Free",
    price: "$0",
    priceId: null,
    interceptionLimit: 10,
    features: [
      "10 interceptions / month",
      "Basic AI responses",
      "Store credit offers",
      "Email support",
    ],
  },
  starter: {
    name: "Starter",
    price: "$29/mo",
    priceId: null, // set at runtime from env in paddle.server.js
    interceptionLimit: 200,
    features: [
      "200 interceptions / month",
      "Full AI negotiation",
      "Store credit & exchanges",
      "Dashboard & analytics",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    price: "$79/mo",
    priceId: null,
    interceptionLimit: null,
    features: [
      "Unlimited interceptions",
      "Advanced AI tones",
      "Custom AI prompts",
      "Priority support",
      "Advanced analytics",
      "Multi-store support",
    ],
  },
};
