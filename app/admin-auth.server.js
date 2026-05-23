import { redirect, createCookieSessionStorage } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const SESSION_SECRET = process.env.SESSION_SECRET || "refundsavior-session-fallback-key";

const adminSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__rs_admin",
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

export async function verifyAdminCredentials(email, password) {
  const supabase = getSupabase();
  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("id, email, name, role, password_hash, is_active")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (error || !admin) return null;
  if (!admin.is_active) return null;

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return null;

  // Update last_login_at
  await supabase
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", admin.id);

  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}

export async function requireAdmin(request) {
  const url = new URL(request.url);
  const session = await adminSessionStorage.getSession(request.headers.get("Cookie"));

  const adminId = session.get("adminId");
  if (adminId) {
    return session;
  }

  throw redirect(`/super-admin/login?returnTo=${encodeURIComponent(url.pathname)}`);
}

export async function createAdminSession(request, admin, redirectTo) {
  const session = await adminSessionStorage.getSession(request.headers.get("Cookie"));
  session.set("adminId", admin.id);
  session.set("adminEmail", admin.email);
  session.set("adminName", admin.name);
  session.set("adminRole", admin.role);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await adminSessionStorage.commitSession(session),
    },
  });
}

export async function destroyAdminSession(request) {
  const session = await adminSessionStorage.getSession(request.headers.get("Cookie"));
  return redirect("/super-admin/login", {
    headers: {
      "Set-Cookie": await adminSessionStorage.destroySession(session),
    },
  });
}

export async function getAdminFromSession(request) {
  const session = await adminSessionStorage.getSession(request.headers.get("Cookie"));
  const adminId = session.get("adminId");
  if (!adminId) return null;
  return {
    id: adminId,
    email: session.get("adminEmail"),
    name: session.get("adminName"),
    role: session.get("adminRole"),
  };
}
