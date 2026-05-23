import { Links, Meta, Outlet, Scripts, ScrollRestoration, Link, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import "./index.css";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const title = is404 ? "Page Not Found" : "Something Went Wrong";
  const message = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : "An unexpected error occurred. Please try again.";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${status} — RefundSaviour`}</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-[#080810] text-white" style={{ margin: 0, fontFamily: "Inter, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
          {/* Background glows */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: "50%", top: "30%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "rgba(6,182,212,0.08)", filter: "blur(120px)" }} />
            <div style={{ position: "absolute", right: "-10%", bottom: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(139,92,246,0.08)", filter: "blur(100px)" }} />
          </div>

          <div style={{ position: "relative", textAlign: "center", maxWidth: 520 }}>
            {/* Status code */}
            <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8, letterSpacing: "-4px" }}>
              {status}
            </div>

            {/* Icon */}
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 16, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", marginBottom: 24 }}>
              {is404 ? (
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="rgba(6,182,212,0.9)" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="rgba(6,182,212,0.9)" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              )}
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-0.5px" }}>
              {title}
            </h1>
            <p style={{ fontSize: 15, color: "rgb(148,163,184)", lineHeight: 1.6, marginBottom: 36 }}>
              {message}
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="/"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgb(6,182,212)", color: "black", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 0 24px rgba(6,182,212,0.35)" }}
              >
                ← Back to Home
              </a>
              <a
                href="/auth/login"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontWeight: 500, fontSize: 14, textDecoration: "none" }}
              >
                Sign In
              </a>
            </div>

            <p style={{ marginTop: 40, fontSize: 12, color: "rgb(71,85,105)" }}>
              RefundSaviour · Need help?{" "}
              <a href="mailto:support@refundsaviour.com" style={{ color: "rgb(100,116,139)", textDecoration: "underline" }}>
                support@refundsaviour.com
              </a>
            </p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
