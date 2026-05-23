import { redirect } from "@remix-run/node";

// Installing via Shopify OAuth IS the signup — no separate account needed
export const loader = () => redirect("/auth/login");
export const action = () => redirect("/auth/login");
