import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { db } from "../supabase.server";
import Analytics from "../../src/pages/Analytics";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const merchant = await db.getMerchantByShop(session.shop);
  
  if (!merchant) {
    throw new Response("Merchant not found", { status: 404 });
  }

  // Get analytics for last 30 days
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  
  const analyticsData = await db.getAnalytics(merchant.id, startDate, endDate);
  
  // Get all interceptions for detailed breakdown
  const allInterceptions = await db.getInterceptions(merchant.id, 1000);

  return json({
    merchant,
    analytics: analyticsData,
    interceptions: allInterceptions,
    shop: session.shop,
  });
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
