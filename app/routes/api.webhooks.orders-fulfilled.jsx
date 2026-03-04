import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

    console.log(`Webhook received: ${topic} from ${shop}`);

    if (topic === "ORDERS_FULFILLED") {
      const order = payload;
      
      console.log(`Order fulfilled: ${order.id}`);
      console.log(`Order name: ${order.name}`);
      console.log(`Line items: ${order.line_items?.length || 0}`);
      
      // You can store this information to track which orders are eligible for returns
      // For example, items become eligible for return 30 days after fulfillment
      // This data can be used to show/hide the widget on customer's order page
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
};
