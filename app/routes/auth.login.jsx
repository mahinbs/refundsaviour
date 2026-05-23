import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { login } from "../shopify.server";
import { ShieldCheck, ArrowRight, Store } from "lucide-react";

export async function loader({ request }) {
  const url = new URL(request.url);
  // If ?shop= is present, hand off to Shopify OAuth
  if (url.searchParams.get("shop")) {
    return login(request);
  }
  return json({ showForm: true });
}

export async function action({ request }) {
  const formData = await request.formData();
  let shop = (formData.get("shop") || "").trim().toLowerCase();

  if (!shop) {
    return json({ error: "Please enter your Shopify store URL." });
  }

  // Normalise: strip https://, trailing slashes, ensure .myshopify.com
  shop = shop.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!shop.includes(".myshopify.com")) {
    shop = `${shop}.myshopify.com`;
  }

  // Delegate to Shopify login with the normalised shop
  const url = new URL(request.url);
  url.searchParams.set("shop", shop);
  return login(new Request(url.toString(), request));
}

export default function AuthLogin() {
  const actionData = useActionData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080810] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <ShieldCheck className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">RefundSaviour</h1>
          <p className="text-slate-400 text-sm">Connect your Shopify store to get started</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Enter your store URL</h2>
            <p className="text-xs text-slate-400">We'll redirect you to Shopify to authorise the app</p>
          </div>

          <Form method="post" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Shopify Store URL
              </label>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="shop"
                  autoFocus
                  required
                  placeholder="your-store.myshopify.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-sm"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Enter just the subdomain (e.g. <span className="text-slate-400">mystore</span>) or the full URL
              </p>
            </div>

            {actionData?.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {actionData.error}
              </div>
            )}

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-black hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              Connect with Shopify
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Form>

          <div className="border-t border-white/5 pt-4 text-center text-xs text-slate-500">
            By connecting, you agree to our{" "}
            <a href="/legal/terms" className="text-slate-400 hover:text-white transition-colors underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/legal/privacy" className="text-slate-400 hover:text-white transition-colors underline">
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
