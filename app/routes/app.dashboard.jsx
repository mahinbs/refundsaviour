import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { db } from "../supabase.server";
import Dashboard from "../../src/pages/Dashboard";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const merchant = await db.getMerchantByShop(session.shop);
  
  if (!merchant) {
    throw new Response("Merchant not found", { status: 404 });
  }

  // Get dashboard stats
  const stats = await db.getDashboardStats(merchant.id);
  
  // Get recent interceptions
  const recentInterceptions = await db.getInterceptions(merchant.id, 10);

  return json({
    merchant,
    stats,
    recentInterceptions,
    shop: session.shop,
  });
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
