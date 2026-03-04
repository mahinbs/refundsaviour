/**
 * Super-admin authentication.
 *
 * Uses a shared secret from the SUPER_ADMIN_SECRET env var.
 * The admin passes it via a `?secret=` query param or a session cookie.
 *
 * In production you'd swap this for a proper admin login + JWT,
 * but a secret is perfectly fine for a single-admin internal tool.
 */

import { redirect, createCookieSessionStorage } from "@remix-run/node";

const SESSION_SECRET = process.env.SESSION_SECRET || "refundsavior-session-fallback-key";

const adminSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__rs_admin",
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

function getAdminSecret() {
  const secret = process.env.SUPER_ADMIN_SECRET;
  if (!secret) {
    throw new Error("SUPER_ADMIN_SECRET env var is not set. Super admin panel is disabled.");
  }
  return secret;
}

/**
 * Call at the top of any super-admin loader/action.
 * Returns the admin session if authenticated.
 * Redirects to the admin login page if not.
 */
export async function requireAdmin(request) {
  const url = new URL(request.url);
  const session = await adminSessionStorage.getSession(request.headers.get("Cookie"));
  const adminSecret = getAdminSecret();

  const querySecret = url.searchParams.get("secret");
  if (querySecret === adminSecret) {
    session.set("admin", true);
    const cleanUrl = new URL(url);
    cleanUrl.searchParams.delete("secret");
    throw redirect(cleanUrl.pathname + cleanUrl.search, {
      headers: {
        "Set-Cookie": await adminSessionStorage.commitSession(session),
      },
    });
  }

  if (session.get("admin") === true) {
    return session;
  }

  throw redirect(`/super-admin/login?returnTo=${encodeURIComponent(url.pathname)}`);
}

export async function createAdminSession(request, redirectTo) {
  const session = await adminSessionStorage.getSession(request.headers.get("Cookie"));
  session.set("admin", true);
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

export { getAdminSecret };
