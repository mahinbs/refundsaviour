import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { db } from "../supabase.server";
import Analytics from "../../src/pages/Analytics";

export async function loader({ request }) {
  let shopDomain = null;
  try {
    const { session } = await authenticate.admin(request);
    shopDomain = session.shop;
  } catch {
    // No Shopify session — direct browser visit or manual merchant
  }

  if (!shopDomain) {
    return json({ merchant: null, analytics: [], interceptions: [], shop: null });
  }

  const merchant = await db.getMerchantByShop(shopDomain);
  if (!merchant) {
    return json({ merchant: null, analytics: [], interceptions: [], shop: shopDomain });
  }

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [analyticsData, allInterceptions] = await Promise.all([
    db.getAnalytics(merchant.id, startDate, endDate),
    db.getInterceptions(merchant.id, 1000),
  ]);

  return json({ merchant, analytics: analyticsData, interceptions: allInterceptions, shop: shopDomain });
}

export default function AnalyticsRoute() {
  const { analytics, interceptions } = useLoaderData();
  
  // Calculate reason distribution
  const reasonCounts = interceptions.reduce((acc, int) => {
    const reason = int.return_reason || "other";
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});

  const analyticsData = {
    reasonDistribution: Object.entries(reasonCounts).map(([reason, count]) => ({
      reason,
      count,
      percentage: ((count / interceptions.length) * 100).toFixed(1),
    })),
    dailyStats: analytics,
    totalInterceptions: interceptions.length,
  };

  return <Analytics data={analyticsData} />;
}
