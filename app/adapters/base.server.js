/**
 * Base commerce adapter — the contract every platform adapter must fulfill.
 *
 * When adding a new platform (WooCommerce, BigCommerce, custom, etc.)
 * create a file like `woocommerce.server.js` in this folder, extend
 * CommerceAdapter, and implement every method.  Then register the class
 * in ADAPTER_MAP inside `commerce-client.server.js`.
 */
export class CommerceAdapter {
  /**
   * @param {object} merchant - The full merchant row from Supabase
   */
  constructor(merchant) {
    this.merchant = merchant;
  }

  /** Human-readable platform label (e.g. "Shopify", "WooCommerce") */
  get platformName() {
    throw new Error("platformName not implemented");
  }

  /**
   * Verify the stored credentials are still valid.
   * @returns {Promise<{ name: string, email: string, domain?: string, plan?: string }>}
   */
  async validateConnection() {
    throw new Error("validateConnection() not implemented");
  }

  /**
   * Issue a gift card / store credit to a customer.
   * @param {{ value: number, customerId?: string, note?: string }} params
   * @returns {Promise<{ id: string, code: string, amount: string }>}
   */
  async createGiftCard(_params) {
    throw new Error("createGiftCard() not implemented");
  }

  /**
   * Create a single-use discount code (e.g. for exchanges).
   * @param {{ title: string, valueType: string, value: string, customerId?: string }} params
   * @returns {Promise<{ code: string, priceRuleId?: string }>}
   */
  async createDiscountCode(_params) {
    throw new Error("createDiscountCode() not implemented");
  }

  /**
   * Tag / annotate an order (e.g. "RefundSavior-Retained").
   * @param {string} orderId
   * @param {string[]} tags
   * @returns {Promise<void>}
   */
  async tagOrder(_orderId, _tags) {
    throw new Error("tagOrder() not implemented");
  }

  /**
   * Fetch basic shop / store info.
   * @returns {Promise<object>}
   */
  async getShopInfo() {
    throw new Error("getShopInfo() not implemented");
  }
}
