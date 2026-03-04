import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAdmin } from "../admin-auth.server";
import { db } from "../supabase.server";

export async function loader({ request }) {
  await requireAdmin(request);

  const [merchants, overview] = await Promise.all([
    db.getAllMerchants(),
    db.getPlatformOverview(),
  ]);

  const merchantsWithStats = await Promise.all(
    merchants.map(async (m) => {
      const stats = await db.getMerchantLifetimeStats(m.id);
      return { ...m, stats };
    })
  );

  return json({ merchants: merchantsWithStats, overview });
}

const PLATFORM_META = {
  shopify:     { label: "Shopify",      color: "#95BF47", bg: "bg-[#95BF47]/10", text: "text-[#95BF47]" },
  woocommerce: { label: "WooCommerce",  color: "#96588A", bg: "bg-[#96588A]/10", text: "text-[#96588A]" },
  bigcommerce: { label: "BigCommerce",  color: "#34313F", bg: "bg-[#6C63FF]/10", text: "text-[#6C63FF]" },
  magento:     { label: "Magento",      color: "#F26322", bg: "bg-[#F26322]/10", text: "text-[#F26322]" },
  custom:      { label: "Custom",       color: "#6366f1", bg: "bg-[#6366f1]/10", text: "text-[#6366f1]" },
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

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function SuperAdminDashboard() {
  const { merchants, overview } = useLoaderData();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-black/60 px-6 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary font-black text-sm">R</div>
          <span className="font-bold text-white">RefundSavior</span>
          <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">SUPER ADMIN</span>
        </div>
        <form method="post" action="/super-admin/logout">
          <button type="submit" className="text-xs text-slate-400 hover:text-white transition-colors">
            Logout
          </button>
        </form>
      </header>

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* ── Overview stats ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Platform Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Merchants" value={overview.totalMerchants} />
            <StatCard label="Active" value={overview.activeMerchants} accent="text-emerald-400" />
            <StatCard label="Inactive" value={overview.inactiveMerchants} accent="text-red-400" />
            <StatCard label="Platforms" value={Object.keys(overview.byPlatform).length} />
            <StatCard label="Total Interceptions" value={overview.totalInterceptions} />
            <StatCard label="Total Retained" value={overview.totalRetained} accent="text-emerald-400" />
            <StatCard label="Total Saved" value={fmt(overview.totalRetentionValue)} accent="text-primary" />
            <StatCard label="Retention Rate" value={pct(overview.globalRetentionRate)} accent="text-secondary" />
          </div>
        </section>

        {/* ── Platform breakdown ──────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">By Platform</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(overview.byPlatform).map(([p, count]) => {
              const meta = PLATFORM_META[p] || PLATFORM_META.custom;
              return (
                <div
                  key={p}
                  className={`flex items-center gap-2 rounded-xl border border-white/5 ${meta.bg} px-4 py-2.5`}
                >
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span className={`text-sm font-bold ${meta.text}`}>{meta.label}</span>
                  <span className="text-xs text-slate-400">{count} store{count !== 1 ? "s" : ""}</span>
                </div>
              );
            })}
            {Object.keys(overview.byPlatform).length === 0 && (
              <p className="text-sm text-slate-500">No merchants yet.</p>
            )}
          </div>
        </section>

        {/* ── Merchant table ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">
            All Merchants
            <span className="ml-2 text-sm font-normal text-slate-400">({merchants.length})</span>
          </h2>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Store</th>
                    <th className="px-4 py-3 font-medium">Platform</th>
                    <th className="px-4 py-3 font-medium">Auth</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Interceptions</th>
                    <th className="px-4 py-3 font-medium text-right">Retained</th>
                    <th className="px-4 py-3 font-medium text-right">$ Saved</th>
                    <th className="px-4 py-3 font-medium text-right">Rate</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {merchants.map((m) => {
                    const pm = PLATFORM_META[m.platform] || PLATFORM_META.custom;
                    return (
                      <tr key={m.id} className="group hover:bg-white/[0.02] transition-colors">
                        {/* Store */}
                        <td className="px-4 py-3">
                          <Link to={`/super-admin/merchant/${m.id}`} className="flex items-center gap-3 min-w-[200px] group/link">
                            <div
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                              style={{ backgroundColor: pm.color }}
                            >
                              {(m.store_name || m.shop_domain)?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-white truncate group-hover/link:text-primary transition-colors">
                                {m.store_name || m.shop_domain}
                              </p>
                              <p className="text-xs text-slate-500 truncate font-mono">
                                {m.shop_domain}
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* Platform */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-md ${pm.bg} px-2 py-1 text-xs font-medium ${pm.text}`}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pm.color }} />
                            {pm.label}
                          </span>
                        </td>

                        {/* Auth method */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-400">
                            {AUTH_LABELS[m.auth_method] || m.auth_method}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {m.is_active ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Stats */}
                        <td className="px-4 py-3 text-right font-mono text-slate-300">
                          {m.stats.totalInterceptions}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-emerald-400">
                          {m.stats.totalRetained}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-primary font-medium">
                          {fmt(m.stats.totalRetentionValue)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-300">
                          {pct(m.stats.retentionRate)}
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {timeAgo(m.installed_at)}
                        </td>
                      </tr>
                    );
                  })}
                  {merchants.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                        No merchants registered yet.
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

function StatCard({ label, value, accent = "text-white" }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
