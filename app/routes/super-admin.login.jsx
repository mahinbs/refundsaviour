import { json, redirect } from "@remix-run/node";
import { useActionData, Form, useSearchParams } from "@remix-run/react";
import { createAdminSession, getAdminSecret } from "../admin-auth.server";

export async function action({ request }) {
  const formData = await request.formData();
  const secret = formData.get("secret");
  const returnTo = formData.get("returnTo") || "/super-admin";

  try {
    const adminSecret = getAdminSecret();
    if (secret !== adminSecret) {
      return json({ error: "Invalid admin secret." }, { status: 401 });
    }
    return await createAdminSession(request, returnTo);
  } catch (e) {
    return json({ error: e.message }, { status: 500 });
  }
}

export default function SuperAdminLogin() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/super-admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <span className="text-2xl font-black text-primary">R</span>
          </div>
          <h1 className="text-xl font-bold text-white">Super Admin</h1>
          <p className="text-sm text-slate-400">Enter your admin secret to continue</p>
        </div>

        <Form method="post" className="space-y-4">
          <input type="hidden" name="returnTo" value={returnTo} />

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Admin Secret</label>
            <input
              type="password"
              name="secret"
              autoFocus
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white font-mono placeholder:text-slate-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="••••••••••••••••"
            />
          </div>

          {actionData?.error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {actionData.error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-black transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            Access Admin Panel
          </button>
        </Form>

        <p className="text-center text-xs text-slate-500">
          Set SUPER_ADMIN_SECRET in your .env to enable admin access.
        </p>
      </div>
    </div>
  );
}
