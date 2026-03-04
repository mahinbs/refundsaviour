import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

// Server-side Supabase client with service role key
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database helper functions
export const db = {
  // ── Merchants ──────────────────────────────────────────────────────────────

  async getMerchantByShop(shopDomain) {
    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .eq("shop_domain", shopDomain)
      .single();

    // PGRST116 = "no rows found" — not a real error, just null
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  /**
   * Upsert a merchant record.  Works for any platform + auth method combo.
   * The `shop_domain` column is UNIQUE, so this is safe to call repeatedly.
   */
  async upsertMerchant({
    shopDomain,
    accessToken,
    authMethod,
    platform = "shopify",
    storeName,
    email,
    platformShopId,
    platformConfig,
  }) {
    const { data, error } = await supabase
      .from("merchants")
      .upsert(
        {
          shop_domain: shopDomain,
          access_token: accessToken,
          auth_method: authMethod,
          platform,
          is_active: true,
          uninstalled_at: null,
          ...(storeName && { store_name: storeName }),
          ...(email && { email }),
          ...(platformShopId && { platform_shop_id: platformShopId }),
          ...(platformConfig && { platform_config: platformConfig }),
        },
        { onConflict: "shop_domain" }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMerchantSettings(shopDomain, settings) {
    const { data, error } = await supabase
      .from("merchants")
      .update(settings)
      .eq("shop_domain", shopDomain)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deactivateMerchant(shopDomain) {
    const { error } = await supabase
      .from("merchants")
      .update({ is_active: false })
      .eq("shop_domain", shopDomain);
    if (error) throw error;
  },

  async disconnectMerchant(shopDomain) {
    const { error } = await supabase
      .from("merchants")
      .update({ access_token: "", is_active: false })
      .eq("shop_domain", shopDomain);
    if (error) throw error;
  },

  // Interceptions
  async createInterception(interceptionData) {
    const { data, error } = await supabase
      .from("interceptions")
      .insert(interceptionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateInterception(interceptionId, updates) {
    const { data, error } = await supabase
      .from("interceptions")
      .update(updates)
      .eq("id", interceptionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getInterceptions(merchantId, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from("interceptions")
      .select("*")
      .eq("merchant_id", merchantId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Conversations
  async addConversationMessage(messageData) {
    const { data, error } = await supabase
      .from("conversations")
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getConversation(interceptionId) {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("interception_id", interceptionId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Analytics
  async getAnalytics(merchantId, startDate, endDate) {
    const { data, error } = await supabase
      .from("analytics_daily")
      .select("*")
      .eq("merchant_id", merchantId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // ── Super Admin ──────────────────────────────────────────────────────────

  async getAllMerchants() {
    const { data, error } = await supabase
      .from("merchants")
      .select("id, shop_domain, store_name, email, platform, auth_method, is_active, plan, installed_at, updated_at, uninstalled_at, widget_enabled")
      .order("installed_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMerchantLifetimeStats(merchantId) {
    const { data, error } = await supabase
      .from("interceptions")
      .select("outcome, retention_value, item_price")
      .eq("merchant_id", merchantId);

    if (error) throw error;

    const interceptions = data || [];
    const totalInterceptions = interceptions.length;
    const retained = interceptions.filter(i => i.outcome === "store_credit" || i.outcome === "exchange");
    const refunded = interceptions.filter(i => i.outcome === "refund");
    const totalRetentionValue = interceptions.reduce((s, i) => s + (parseFloat(i.retention_value) || 0), 0);
    const totalPotentialLoss = interceptions.reduce((s, i) => s + (parseFloat(i.item_price) || 0), 0);

    return {
      totalInterceptions,
      totalRetained: retained.length,
      totalRefunded: refunded.length,
      totalRetentionValue,
      totalPotentialLoss,
      retentionRate: totalInterceptions > 0 ? (retained.length / totalInterceptions) * 100 : 0,
    };
  },

  async getPlatformOverview() {
    const { data: merchants, error: mErr } = await supabase
      .from("merchants")
      .select("id, platform, is_active, installed_at");
    if (mErr) throw mErr;

    const { data: interceptions, error: iErr } = await supabase
      .from("interceptions")
      .select("merchant_id, outcome, retention_value, item_price");
    if (iErr) throw iErr;

    const totalMerchants = merchants.length;
    const activeMerchants = merchants.filter(m => m.is_active).length;
    const byPlatform = {};
    for (const m of merchants) {
      byPlatform[m.platform] = (byPlatform[m.platform] || 0) + 1;
    }

    const totalInterceptions = interceptions.length;
    const totalRetained = interceptions.filter(i => i.outcome === "store_credit" || i.outcome === "exchange").length;
    const totalRetentionValue = interceptions.reduce((s, i) => s + (parseFloat(i.retention_value) || 0), 0);
    const totalPotentialLoss = interceptions.reduce((s, i) => s + (parseFloat(i.item_price) || 0), 0);

    return {
      totalMerchants,
      activeMerchants,
      inactiveMerchants: totalMerchants - activeMerchants,
      byPlatform,
      totalInterceptions,
      totalRetained,
      totalRetentionValue,
      totalPotentialLoss,
      globalRetentionRate: totalInterceptions > 0 ? (totalRetained / totalInterceptions) * 100 : 0,
    };
  },

  async getDashboardStats(merchantId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from("interceptions")
      .select("outcome, retention_value, item_price, created_at")
      .eq("merchant_id", merchantId)
      .gte("created_at", startDate.toISOString());
    
    if (error) throw error;
    
    // Calculate stats
    const stats = {
      totalInterceptions: data.length,
      totalRetained: data.filter(i => i.outcome === "store_credit" || i.outcome === "exchange").length,
      totalRefunds: data.filter(i => i.outcome === "refund").length,
      totalRetentionValue: data.reduce((sum, i) => sum + (parseFloat(i.retention_value) || 0), 0),
      retentionRate: 0,
    };
    
    stats.retentionRate = stats.totalInterceptions > 0 
      ? (stats.totalRetained / stats.totalInterceptions) * 100 
      : 0;
    
    return stats;
  },
};
