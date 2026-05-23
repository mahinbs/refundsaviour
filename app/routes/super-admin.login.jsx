import { json } from "@remix-run/node";
import { useActionData, Form, useSearchParams } from "@remix-run/react";
import { verifyAdminCredentials, createAdminSession } from "../admin-auth.server";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const returnTo = formData.get("returnTo") || "/super-admin";

  if (!email || !password) {
    return json({ error: "Email and password are required." }, { status: 400 });
  }

  const admin = await verifyAdminCredentials(email, password);
  if (!admin) {
    return json({ error: "Invalid email or password." }, { status: 401 });
  }

  return createAdminSession(request, admin, returnTo);
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
          <p className="text-sm text-slate-400">Sign in to access the admin panel</p>
        </div>

        <Form method="post" className="space-y-4">
          <input type="hidden" name="returnTo" value={returnTo} />

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Email</label>
            <input
              type="email"
              name="email"
              autoFocus
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
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
            Sign In
          </button>
        </Form>
      </div>
    </div>
  );
}
