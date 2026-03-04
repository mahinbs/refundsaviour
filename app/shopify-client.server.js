/**
 * DEPRECATED — kept for backwards compatibility.
 *
 * New code should import from `commerce-client.server.js` instead.
 * This file re-exports the platform-agnostic client under the old names
 * so that any straggling imports continue to work.
 */

export {
  getCommerceClient as getShopifyClient,
  validateCredentials as validateToken,
  CommerceClientError as ShopifyClientError,
} from "./commerce-client.server";
