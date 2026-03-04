import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import {
  Cog, Database, Zap, Save, Lock, Link2, Unplug, KeyRound,
  ChevronDown, ChevronRight, ShieldCheck, AlertTriangle, ExternalLink, Loader2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { Form } from "@remix-run/react";

const PLATFORMS = {
  shopify:      { label: "Shopify",      color: "#95BF47", initial: "S" },
  woocommerce:  { label: "WooCommerce",  color: "#96588A", initial: "W" },
  bigcommerce:  { label: "BigCommerce",  color: "#34313F", initial: "B" },
  magento:      { label: "Magento",      color: "#F26322", initial: "M" },
  custom:       { label: "Custom Store", color: "#6366f1", initial: "C" },
};

function platformMeta(key) {
  return PLATFORMS[key] || PLATFORMS.custom;
}

export default function Settings({ merchant, shop, actionData }) {
  const isConnected = merchant?.is_active && merchant?.access_token;
  const authMethod = merchant?.auth_method || null;
  const platform = merchant?.platform || "shopify";
  const pm = platformMeta(platform);

  const [isEditing, setIsEditing] = useState(false);
  const [multiplier, setMultiplier] = useState(merchant?.multiplier || 1.10);
  const [aiTone, setAiTone] = useState(merchant?.ai_tone || "friendly");

  const [showManual, setShowManual] = useState(false);
  const [manualDomain, setManualDomain] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [manualPlatform, setManualPlatform] = useState("shopify");
  const [manualLoading, setManualLoading] = useState(false);

  React.useEffect(() => {
    if (actionData?.success) {
      toast.success("System parameters updated successfully");
      setIsEditing(false);
    } else if (actionData?.error) {
      toast.error(`Update failed: ${actionData.error}`);
    }
  }, [actionData]);

  const handleManualConnect = async () => {
    if (!manualDomain.trim() || !manualToken.trim()) {
      toast.error("Please fill in both Store Domain and Access Token.");
      return;
    }
    setManualLoading(true);
    try {
      const res = await fetch("/api/connect-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopDomain: manualDomain.trim(),
          accessToken: manualToken.trim(),
          platform: manualPlatform,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Connected to ${data.shopInfo?.name || manualDomain}!`);
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error(data.error || "Connection failed.");
      }
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setManualLoading(false);
    }
  };

  const manualPm = platformMeta(manualPlatform);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
          <Cog className="h-6 w-6 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">System Configuration</h2>
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  STORE CONNECTION CARD                                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <Card className={isConnected ? "border-success/30" : "border-destructive/30"}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className={`h-5 w-5 ${isConnected ? "text-success" : "text-destructive"}`} />
            <CardTitle>Store Connection</CardTitle>
          </div>
          <CardDescription>
            {isConnected
              ? "Your store is connected and ready to intercept returns."
              : "Connect your e-commerce store to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* ── Active connection banner ──────────────────────────────── */}
          {isConnected && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-success/20 bg-success/5">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: pm.color }}
              >
                {pm.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {merchant?.store_name || shop || merchant?.shop_domain}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {merchant?.shop_domain} &middot; {pm.label} &middot;{" "}
                  {authMethod === "manual" || authMethod === "api_key" ? "API key" : "OAuth"}
                </p>
              </div>
              <Badge variant="success" className="animate-pulse shrink-0">
                <ShieldCheck className="h-3 w-3 mr-1" /> Live
              </Badge>
            </div>
          )}

          {/* ── Inactive / revoked token warning ─────────────────────── */}
          {merchant && !merchant.is_active && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-destructive">Connection Lost</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your access token was revoked or expired. Please reconnect using
                  one of the options below.
                </p>
              </div>
            </div>
          )}

          {/* ── PATH A — Shopify OAuth (primary) ─────────────────────── */}
          {!isConnected && (
            <div className="space-y-4">
              <a
                href="/auth"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#95BF47] px-6 py-3 text-base font-bold text-black transition-all hover:bg-[#7ea93a] hover:shadow-[0_0_20px_rgba(149,191,71,0.3)]"
              >
                <Link2 className="h-5 w-5" />
                Connect Shopify Store (One-Click)
              </a>
              <p className="text-xs text-center text-muted-foreground">
                Recommended for Shopify &middot; Uses Shopify's secure OAuth &middot; Takes 10 seconds
              </p>
            </div>
          )}

          {/* ── PATH B — Manual / Multi-platform Setup ───────────────── */}
          {!isConnected && (
            <div>
              <button
                onClick={() => setShowManual(!showManual)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors w-full"
              >
                {showManual ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <KeyRound className="h-4 w-4" />
                Advanced: Connect Any Store via API Key
              </button>

              {showManual && (
                <div className="mt-4 space-y-4 pl-2 border-l-2 border-white/10 ml-2">
                  {/* Platform selector */}
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Platform</label>
                    <select
                      value={manualPlatform}
                      onChange={(e) => setManualPlatform(e.target.value)}
                      className="w-full bg-black/40 border border-primary/20 text-white rounded-lg px-3 py-2 font-mono"
                    >
                      {Object.entries(PLATFORMS).map(([key, p]) => (
                        <option key={key} value={key}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Platform-specific instructions */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                    {manualPlatform === "shopify" && <ShopifyInstructions />}
                    {manualPlatform === "woocommerce" && <WooCommerceInstructions />}
                    {(manualPlatform !== "shopify" && manualPlatform !== "woocommerce") && (
                      <GenericInstructions platform={manualPm.label} />
                    )}
                  </div>

                  {/* Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Store Domain</label>
                      <Input
                        placeholder={manualPlatform === "shopify" ? "my-store.myshopify.com" : "www.your-store.com"}
                        value={manualDomain}
                        onChange={(e) => setManualDomain(e.target.value)}
                        className="bg-black/40 border-primary/20 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">
                        {manualPlatform === "woocommerce" ? "REST API Consumer Key" : "Admin API Access Token"}
                      </label>
                      <Input
                        type="password"
                        placeholder={
                          manualPlatform === "shopify"
                            ? "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            : manualPlatform === "woocommerce"
                              ? "ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              : "your-api-token"
                        }
                        value={manualToken}
                        onChange={(e) => setManualToken(e.target.value)}
                        className="bg-black/40 border-primary/20 font-mono"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleManualConnect}
                      disabled={manualLoading}
                      className="w-full bg-primary text-black hover:bg-primary/90"
                    >
                      {manualLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 mr-2" />
                      )}
                      {manualLoading ? "Validating…" : "Validate & Connect"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      We'll make a test API call to verify credentials before saving.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Disconnect button ────────────────────────────────────── */}
          {isConnected && (
            <Form method="post">
              <input type="hidden" name="_action" value="disconnect" />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Unplug className="h-4 w-4 mr-2" /> Disconnect Store
              </Button>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  WIDGET / OFFER STRATEGY SETTINGS (only when connected)           */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {isConnected && (
        <Card className="border-primary/30 shadow-neon-blue">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-primary">Widget Logic Matrix</CardTitle>
            </div>
            <CardDescription>Control AI interception behaviors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 animate-pulse-slow"></div>
              <div className="space-y-1 relative z-10">
                <label className="text-sm font-bold text-white">Interception Module</label>
                <p className="text-xs text-primary/80">Widget triggers on return initiation.</p>
              </div>
              <Badge variant="default" className="relative z-10">System Online</Badge>
            </div>

            <Form method="post">
              <input type="hidden" name="_action" value="update_settings" />
              <div className="border-t border-white/10 pt-6">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Database className="h-4 w-4 text-secondary" /> Offer Strategy Variables
                </h4>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-300">Store Credit Multiplier</label>
                    <Input
                      type="number"
                      name="multiplier"
                      step="0.01"
                      min="1.00"
                      max="2.00"
                      value={multiplier}
                      onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                      disabled={!isEditing}
                      className="bg-black/40 border-primary/20 text-secondary font-mono font-bold"
                    />
                    <p className="text-xs text-muted-foreground">e.g., 1.10 = 10% bonus on store credit</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-300">AI Tone</label>
                    <select
                      name="ai_tone"
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      disabled={!isEditing}
                      className="bg-black/40 border border-primary/20 text-white rounded-lg px-3 py-2 font-mono"
                    >
                      <option value="friendly">Friendly</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="widget_enabled"
                      value="on"
                      defaultChecked={merchant?.widget_enabled !== false}
                      disabled={!isEditing}
                      className="rounded"
                    />
                    <label className="text-sm text-slate-300">Widget Enabled</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 gap-3">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setMultiplier(merchant?.multiplier || 1.10);
                      setAiTone(merchant?.ai_tone || "friendly");
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type={isEditing ? "submit" : "button"}
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => !isEditing && setIsEditing(true)}
                  className={isEditing ? "bg-primary text-black hover:bg-primary/90" : ""}
                >
                  {isEditing ? (
                    <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                  ) : (
                    <><Lock className="mr-2 h-4 w-4" /> Modify Parameters (Admin Lock)</>
                  )}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Platform instruction components ──────────────────────────────────────────

function ShopifyInstructions() {
  return (
    <>
      <p className="text-sm font-medium text-white">How to get your Shopify Admin API Access Token:</p>
      <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
        <li>Go to <strong className="text-white">Shopify Admin</strong> &rarr; <strong className="text-white">Settings</strong> &rarr; <strong className="text-white">Apps and sales channels</strong></li>
        <li>Click <strong className="text-white">Develop apps</strong> &rarr; <strong className="text-white">Create an app</strong></li>
        <li>Name it <strong className="text-white">RefundSavior</strong>, then open <strong className="text-white">Configure Admin API scopes</strong></li>
        <li>Enable: <code className="text-primary">write_orders</code>, <code className="text-primary">read_orders</code>, <code className="text-primary">write_customers</code>, <code className="text-primary">write_discounts</code>, <code className="text-primary">write_draft_orders</code></li>
        <li>Click <strong className="text-white">Install app</strong>, then copy the <strong className="text-white">Admin API access token</strong> (shown only once!)</li>
      </ol>
      <a
        href="https://help.shopify.com/en/manual/apps/app-types/custom-apps"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        Shopify docs <ExternalLink className="h-3 w-3" />
      </a>
    </>
  );
}

function WooCommerceInstructions() {
  return (
    <>
      <p className="text-sm font-medium text-white">How to get your WooCommerce REST API Key:</p>
      <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
        <li>Go to <strong className="text-white">WordPress Admin</strong> &rarr; <strong className="text-white">WooCommerce</strong> &rarr; <strong className="text-white">Settings</strong> &rarr; <strong className="text-white">Advanced</strong> &rarr; <strong className="text-white">REST API</strong></li>
        <li>Click <strong className="text-white">Add key</strong>. Set permissions to <strong className="text-white">Read/Write</strong>.</li>
        <li>Copy the <strong className="text-white">Consumer Key</strong> (starts with <code className="text-primary">ck_</code>).</li>
        <li>Also note the <strong className="text-white">Consumer Secret</strong> — you'll need it for platform config later.</li>
      </ol>
      <a
        href="https://woocommerce.com/document/woocommerce-rest-api/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        WooCommerce docs <ExternalLink className="h-3 w-3" />
      </a>
    </>
  );
}

function GenericInstructions({ platform }) {
  return (
    <>
      <p className="text-sm font-medium text-white">Connect your {platform}:</p>
      <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
        <li>Enter the public domain of your store (e.g. <code className="text-primary">www.your-store.com</code>)</li>
        <li>Provide an API token with <strong className="text-white">read/write access to orders and customers</strong></li>
        <li>We'll validate the connection with a test call before saving</li>
      </ol>
      <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400/80">
        <Globe className="h-3.5 w-3.5" />
        <span>Support for {platform} is coming soon. Credentials will be stored securely.</span>
      </div>
    </>
  );
}
