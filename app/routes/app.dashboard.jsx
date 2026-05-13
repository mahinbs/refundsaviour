import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { db } from "../supabase.server";
import Dashboard from "../../src/pages/Dashboard";

export async function loader({ request }) {
  // Try Shopify OAuth session first
  let shopDomain = null;
  try {
    const { session } = await authenticate.admin(request);
    shopDomain = session.shop;
  } catch {
    // No Shopify session — could be manual-key merchant or direct browser visit
  }

  if (!shopDomain) {
    // Return empty dashboard state — merchant needs to connect first
    return json({
      merchant: null,
      stats: { totalInterceptions: 0, totalRetained: 0, totalRefunds: 0, totalRetentionValue: 0, retentionRate: 0 },
      recentInterceptions: [],
      shop: null,
    });
  }

  const merchant = await db.getMerchantByShop(shopDomain);
  if (!merchant) {
    return json({
      merchant: null,
      stats: { totalInterceptions: 0, totalRetained: 0, totalRefunds: 0, totalRetentionValue: 0, retentionRate: 0 },
      recentInterceptions: [],
      shop: shopDomain,
    });
  }

  const [stats, recentInterceptions] = await Promise.all([
    db.getDashboardStats(merchant.id),
    db.getInterceptions(merchant.id, 10),
  ]);

  return json({ merchant, stats, recentInterceptions, shop: shopDomain });
}

export default function DashboardRoute() {
  const { stats, recentInterceptions } = useLoaderData();
  
  // Transform data for the Dashboard component
  const dashboardData = {
    kpis: [
      {
        title: "Refunds Intercepted",
        value: stats.totalInterceptions,
        change: "+12%",
        trend: "up",
      },
      {
        title: "Retention Rate",
        value: `${stats.retentionRate.toFixed(1)}%`,
        change: "+8%",
        trend: "up",
      },
      {
        title: "Revenue Saved",
        value: `$${stats.totalRetentionValue.toFixed(2)}`,
        change: "+23%",
        trend: "up",
      },
      {
        title: "Active Offers",
        value: stats.totalRetained,
        change: "+5",
        trend: "up",
      },
    ],
    recentActivity: recentInterceptions.map((int) => ({
      id: int.id,
      customer: int.customer_email || "Anonymous",
      type: int.outcome,
      amount: `$${int.item_price}`,
      status: int.outcome === "refund" ? "declined" : "accepted",
      time: new Date(int.created_at).toLocaleString(),
    })),
  };

  return <Dashboard data={dashboardData} />;
}
