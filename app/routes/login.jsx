import { redirect } from "@remix-run/node";

// Merchants authenticate via Shopify OAuth — no separate email/password account
export const loader = () => redirect("/auth/login");
export const action = () => redirect("/auth/login");
