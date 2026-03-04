-- RefundSavior Database Schema for Supabase/PostgreSQL
-- Platform-agnostic: supports Shopify, WooCommerce, custom stores, and future platforms.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════════
-- Merchants table
-- One row per store.  `shop_domain` is the canonical identifier across platforms.
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- ── Identity ─────────────────────────────────────────────────────────────
    shop_domain VARCHAR(255) UNIQUE NOT NULL,       -- e.g. my-store.myshopify.com  OR  shoes.example.com
    store_name VARCHAR(255),
    email VARCHAR(255),

    -- ── Platform & Auth ──────────────────────────────────────────────────────
    -- `platform` identifies the e-commerce backend this merchant runs on.
    -- Today: 'shopify'.  Tomorrow: 'woocommerce', 'bigcommerce', 'magento', 'custom', etc.
    platform VARCHAR(30) DEFAULT 'shopify' NOT NULL
        CHECK (platform IN ('shopify', 'woocommerce', 'bigcommerce', 'magento', 'custom')),

    -- How the merchant connected (OAuth install, pasted API key, or webhook/API key for non-Shopify)
    auth_method VARCHAR(20) DEFAULT 'oauth' NOT NULL
        CHECK (auth_method IN ('oauth', 'manual', 'api_key', 'webhook')),

    -- Platform-specific credentials (Admin API token for Shopify, REST key for Woo, etc.)
    access_token TEXT NOT NULL,

    -- Optional platform-native IDs (Shopify numeric shop ID, Woo site_id, etc.)
    platform_shop_id VARCHAR(255),

    -- Platform-specific extra config (API version, consumer_secret for Woo, etc.)
    platform_config JSONB DEFAULT '{}'::jsonb,

    -- is_active goes FALSE when we detect an auth failure (401 / revoked key)
    is_active BOOLEAN DEFAULT true NOT NULL,

    -- ── RefundSavior Settings (platform-independent) ─────────────────────────
    multiplier DECIMAL(3, 2) DEFAULT 1.10 NOT NULL,
    incentive_type VARCHAR(50) DEFAULT 'store_credit'
        CHECK (incentive_type IN ('store_credit', 'discount', 'exchange')),
    widget_enabled BOOLEAN DEFAULT true,
    widget_trigger VARCHAR(50) DEFAULT 'return_page'
        CHECK (widget_trigger IN ('return_page', 'order_history', 'all')),

    -- ── AI Configuration ─────────────────────────────────────────────────────
    ai_enabled BOOLEAN DEFAULT true,
    ai_tone VARCHAR(50) DEFAULT 'friendly'
        CHECK (ai_tone IN ('friendly', 'professional', 'casual')),
    custom_prompt TEXT,

    -- ── Branding ─────────────────────────────────────────────────────────────
    primary_color VARCHAR(7) DEFAULT '#6366f1',
    widget_position VARCHAR(20) DEFAULT 'bottom-right',

    -- ── Timestamps ───────────────────────────────────────────────────────────
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uninstalled_at TIMESTAMP WITH TIME ZONE,

    -- ── Plan / Metadata ──────────────────────────────────────────────────────
    plan VARCHAR(50) DEFAULT 'free',
    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT multiplier_range CHECK (multiplier >= 1.0 AND multiplier <= 2.0)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Interceptions table
-- Logs every return/refund attempt.  All IDs are stored as platform-agnostic
-- strings so Shopify numeric IDs, WooCommerce slugs, and custom UUIDs all fit.
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS interceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,

    -- ── Customer info ────────────────────────────────────────────────────────
    customer_id VARCHAR(255),
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),

    -- ── Order info (platform-agnostic) ───────────────────────────────────────
    external_order_id VARCHAR(255) NOT NULL,     -- was `shopify_order_id`
    order_number VARCHAR(100),
    order_total DECIMAL(10, 2),

    -- ── Product info ─────────────────────────────────────────────────────────
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    variant_id VARCHAR(255),
    variant_name VARCHAR(255),
    item_price DECIMAL(10, 2),
    quantity INTEGER DEFAULT 1,

    -- ── Return details ───────────────────────────────────────────────────────
    return_reason VARCHAR(100),
    return_reason_detail TEXT,

    -- ── Decision ─────────────────────────────────────────────────────────────
    outcome VARCHAR(50)
        CHECK (outcome IN ('refund', 'store_credit', 'exchange', 'abandoned', 'pending')),
    offer_type VARCHAR(50),
    offer_value DECIMAL(10, 2),
    offer_multiplier DECIMAL(3, 2),

    -- ── Fulfillment results (platform-agnostic) ─────────────────────────────
    discount_code VARCHAR(100),
    gift_card_id VARCHAR(255),
    gift_card_code VARCHAR(100),
    exchange_order_id VARCHAR(255),

    -- ── Analytics ────────────────────────────────────────────────────────────
    retention_value DECIMAL(10, 2) DEFAULT 0,
    retained BOOLEAN DEFAULT false,
    chat_messages_count INTEGER DEFAULT 0,
    session_duration INTEGER,

    -- ── Timestamps ───────────────────────────────────────────────────────────
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- ── Metadata ─────────────────────────────────────────────────────────────
    user_agent TEXT,
    ip_address INET,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Conversations table  (AI chat history — already platform-independent)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interception_id UUID NOT NULL REFERENCES interceptions(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL CHECK (role IN ('system', 'user', 'assistant', 'function')),
    content TEXT NOT NULL,

    model VARCHAR(100),
    tokens_used INTEGER,
    latency_ms INTEGER,

    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    sentiment_score DECIMAL(3, 2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Analytics aggregation (pre-computed daily rollups)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    date DATE NOT NULL,

    total_interceptions INTEGER DEFAULT 0,
    total_retained INTEGER DEFAULT 0,
    total_refunds INTEGER DEFAULT 0,
    total_store_credits INTEGER DEFAULT 0,
    total_exchanges INTEGER DEFAULT 0,
    total_abandoned INTEGER DEFAULT 0,

    total_retention_value DECIMAL(12, 2) DEFAULT 0,
    total_potential_loss DECIMAL(12, 2) DEFAULT 0,

    reason_size INTEGER DEFAULT 0,
    reason_damaged INTEGER DEFAULT 0,
    reason_changed_mind INTEGER DEFAULT 0,
    reason_other INTEGER DEFAULT 0,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(merchant_id, date)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE INDEX idx_merchants_shop_domain ON merchants(shop_domain);
CREATE INDEX idx_merchants_platform ON merchants(platform);
CREATE INDEX idx_merchants_is_active ON merchants(is_active);
CREATE INDEX idx_interceptions_merchant_id ON interceptions(merchant_id);
CREATE INDEX idx_interceptions_created_at ON interceptions(created_at);
CREATE INDEX idx_interceptions_outcome ON interceptions(outcome);
CREATE INDEX idx_interceptions_external_order_id ON interceptions(external_order_id);
CREATE INDEX idx_conversations_interception_id ON conversations(interception_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_analytics_daily_merchant_date ON analytics_daily(merchant_id, date);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Functions & Triggers
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_analytics_daily()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO analytics_daily (
        merchant_id, date,
        total_interceptions, total_retained, total_refunds,
        total_store_credits, total_exchanges, total_abandoned,
        total_retention_value, total_potential_loss
    ) VALUES (
        NEW.merchant_id, DATE(NEW.created_at),
        1,
        CASE WHEN NEW.retained THEN 1 ELSE 0 END,
        CASE WHEN NEW.outcome = 'refund' THEN 1 ELSE 0 END,
        CASE WHEN NEW.outcome = 'store_credit' THEN 1 ELSE 0 END,
        CASE WHEN NEW.outcome = 'exchange' THEN 1 ELSE 0 END,
        CASE WHEN NEW.outcome = 'abandoned' THEN 1 ELSE 0 END,
        COALESCE(NEW.retention_value, 0),
        COALESCE(NEW.item_price, 0)
    )
    ON CONFLICT (merchant_id, date)
    DO UPDATE SET
        total_interceptions   = analytics_daily.total_interceptions   + 1,
        total_retained        = analytics_daily.total_retained        + CASE WHEN NEW.retained THEN 1 ELSE 0 END,
        total_refunds         = analytics_daily.total_refunds         + CASE WHEN NEW.outcome = 'refund' THEN 1 ELSE 0 END,
        total_store_credits   = analytics_daily.total_store_credits   + CASE WHEN NEW.outcome = 'store_credit' THEN 1 ELSE 0 END,
        total_exchanges       = analytics_daily.total_exchanges       + CASE WHEN NEW.outcome = 'exchange' THEN 1 ELSE 0 END,
        total_abandoned       = analytics_daily.total_abandoned       + CASE WHEN NEW.outcome = 'abandoned' THEN 1 ELSE 0 END,
        total_retention_value = analytics_daily.total_retention_value + COALESCE(NEW.retention_value, 0),
        total_potential_loss  = analytics_daily.total_potential_loss  + COALESCE(NEW.item_price, 0),
        updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_analytics_on_interception
    AFTER INSERT ON interceptions
    FOR EACH ROW EXECUTE FUNCTION update_analytics_daily();

-- ═══════════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE interceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on merchants"       ON merchants       FOR ALL USING (true);
CREATE POLICY "Service role full access on interceptions"   ON interceptions   FOR ALL USING (true);
CREATE POLICY "Service role full access on conversations"   ON conversations   FOR ALL USING (true);
CREATE POLICY "Service role full access on analytics_daily" ON analytics_daily FOR ALL USING (true);
