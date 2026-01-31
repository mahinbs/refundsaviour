export const KPI_DATA = {
    totalInterceptions: 1248,
    revenueRetained: 45250, // in dollars
    conversionRate: 32.5, // percent
    refundsLost: 89400, // in dollars
};

export const RECENT_INTERCEPTIONS = [
    { id: "#ORD-7829", date: "2023-10-25", customer: "Alice Freeman", decision: "Exchange", outcome: "retained", value: 120 },
    { id: "#ORD-7830", date: "2023-10-25", customer: "Bob Smith", decision: "Refund", outcome: "lost", value: 85 },
    { id: "#ORD-7831", date: "2023-10-24", customer: "Charlie Davis", decision: "Store Credit", outcome: "retained", value: 210 },
    { id: "#ORD-7832", date: "2023-10-24", customer: "Diana Prince", decision: "Refund", outcome: "lost", value: 45 },
    { id: "#ORD-7833", date: "2023-10-23", customer: "Evan Wright", decision: "Discount Keep", outcome: "retained", value: 95 },
];

export const REFUND_REASONS = [
    { reason: "Size / Fit Issue", count: 450, percentage: 42 },
    { reason: "Changed Mind", count: 320, percentage: 30 },
    { reason: "Item Damaged", count: 150, percentage: 14 },
    { reason: "Shipping Delay", count: 100, percentage: 9 },
    { reason: "Other", count: 50, percentage: 5 },
];

export const WIDGET_CONFIG = {
    questions: [
        { id: "q1", text: "Why are you returning this item?", options: ["Didn't fit", "Changed my mind", "Item damaged", "Found better price"] },
    ],
    offers: [
        {
            id: "offer-credit",
            title: "Get 110% Store Credit",
            description: "Receive $132.00 instantly to shop for something else.",
            value: 132,
            type: "credit",
            recommended: true
        },
        {
            id: "offer-exchange",
            title: "Exchange for Another Size",
            description: "We'll ship the new size immediately. No return fee.",
            value: 120,
            type: "exchange",
            recommended: false
        },
        {
            id: "offer-refund",
            title: "Continue to Refund",
            description: "Refund to original payment method. 3-5 days processing.",
            value: 120,
            type: "refund",
            recommended: false
        }
    ]
};
