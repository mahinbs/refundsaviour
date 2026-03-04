import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAdmin } from "../admin-auth.server";
import { db, supabase } from "../supabase.server";

export async function loader({ request, params }) {
  await requireAdmin(request);

  const { id } = params;

  const { data: merchant, error } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !merchant) {
    throw new Response("Merchant not found", { status: 404 });
  }

  const [stats, recentInterceptions] = await Promise.all([
    db.getMerchantLifetimeStats(id),
    db.getInterceptions(id, 20, 0),
  ]);

  return json({ merchant, stats, recentInterceptions });
}

const PLATFORM_META = {
  shopify:     { label: "Shopify",     color: "#95BF47" },
  woocommerce: { label: "WooCommerce", color: "#96588A" },
  bigcommerce: { label: "BigCommerce", color: "#6C63FF" },
  magento:     { label: "Magento",     color: "#F26322" },
  custom:      { label: "Custom",      color: "#6366f1" },
};

const AUTH_LABELS = {
  oauth:   "OAuth Install",
  manual:  "Manual API Key",
  api_key: "API Key",
  webhook: "Webhook",
};

function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
}

function pct(n) {
  return `${(n || 0).toFixed(1)}%`;
}

export default function MerchantDetail() {
  const { merchant, stats, recentInterceptions } = useLoaderData();
  const pm = PLATFORM_META[merchant.platform] || PLATFORM_META.custom;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/5 bg-black/60 px-6 backdrop-blur-lg">
        <Link to="/super-admin" className="text-sm text-slate-400 hover:text-white transition-colors">
          &larr; All Merchants
        </Link>
        <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
          SUPER ADMIN
        </span>
      </header>

      <div className="mx-auto max-w-5xl p-6 space-y-8">
        {/* ── Merchant header ────────────────────────────────────────── */}
        <div className="flex items-start gap-4">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: pm.color }}
          >
            {(merchant.store_name || merchant.shop_domain)?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">
              {merchant.store_name || merchant.shop_domain}
            </h1>
            <p className="text-sm text-slate-400 font-mono truncate">{merchant.shop_domain}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border border-white/5"
                style={{ backgroundColor: `${pm.color}15`, color: pm.color }}
              >
                {pm.label}
              </span>
              <span className="rounded-md bg-white/5 border border-white/5 px-2 py-1 text-xs text-slate-400">
                {AUTH_LABELS[merchant.auth_method] || merchant.auth_method}
              </span>
              {merchant.is_active ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Inactive
                </span>
              )}
              <span className="rounded-md bg-white/5 border border-white/5 px-2 py-1 text-xs text-slate-400">
                Plan: {merchant.plan}
              </span>
            </div>
          </div>
        </div>

        {/* ── Info grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard label="Email" value={merchant.email || "—"} />
          <InfoCard label="Joined" value={merchant.installed_at ? new Date(merchant.installed_at).toLocaleDateString() : "—"} />
          <InfoCard label="Last Updated" value={merchant.updated_at ? new Date(merchant.updated_at).toLocaleDateString() : "—"} />
          <InfoCard label="Multiplier" value={`${merchant.multiplier}x`} />
          <InfoCard label="AI Tone" value={merchant.ai_tone || "—"} />
          <InfoCard label="Widget" value={merchant.widget_enabled ? "Enabled" : "Disabled"} />
        </div>

        {/* ── Lifetime stats ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Lifetime Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Interceptions" value={stats.totalInterceptions} />
            <StatCard label="Retained" value={stats.totalRetained} accent="text-emerald-400" />
            <StatCard label="Refunded" value={stats.totalRefunded} accent="text-red-400" />
            <StatCard label="$ Saved" value={fmt(stats.totalRetentionValue)} accent="text-primary" />
            <StatCard label="$ At Risk" value={fmt(stats.totalPotentialLoss)} />
            <StatCard label="Retention Rate" value={pct(stats.retentionRate)} accent="text-secondary" />
          </div>
        </section>

        {/* ── Recent interceptions ───────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Recent Interceptions</h2>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Reason</th>
                    <th className="px-4 py-3 font-medium">Outcome</th>
                    <th className="px-4 py-3 font-medium text-right">Value</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentInterceptions.map((i) => (
                    <tr key={i.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">
                        #{i.external_order_id || i.order_number || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 truncate max-w-[160px]">
                        {i.customer_email || i.customer_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {i.return_reason || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <OutcomeBadge outcome={i.outcome} />
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-300">
                        {i.retention_value ? fmt(i.retention_value) : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                  {recentInterceptions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No interceptions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-white truncate">{value}</p>
    </div>
  );
}

function StatCard({ label, value, accent = "text-white" }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function OutcomeBadge({ outcome }) {
  const styles = {
    store_credit: "bg-emerald-500/10 text-emerald-400",
    exchange:     "bg-blue-500/10 text-blue-400",
    refund:       "bg-red-500/10 text-red-400",
    abandoned:    "bg-slate-500/10 text-slate-400",
    pending:      "bg-amber-500/10 text-amber-400",
  };
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${styles[outcome] || styles.pending}`}>
      {outcome || "pending"}
    </span>
  );
}
