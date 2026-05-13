import { redirect } from "@remix-run/node";

// Root path ("/") — do NOT force Shopify OAuth here.
// Just send people to the app shell. Individual /app/* routes
// handle Shopify sessions or manual-connect flows as needed.
export async function loader() {
  return redirect("/app/dashboard");
}
