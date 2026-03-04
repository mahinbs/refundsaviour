-- Migration: Make RefundSavior multi-platform ready.
-- Run this ONLY if you already have a deployed database.
-- New installs can skip this — the base supabase-schema.sql includes everything.

BEGIN;

-- ── 1. Add platform column ──────────────────────────────────────────────────
ALTER TABLE merchants
    ADD COLUMN IF NOT EXISTS platform VARCHAR(30) DEFAULT 'shopify' NOT NULL;

-- Add CHECK constraint (wrapped in DO block so it's idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'merchants_platform_check'
    ) THEN
        ALTER TABLE merchants
            ADD CONSTRAINT merchants_platform_check
            CHECK (platform IN ('shopify', 'woocommerce', 'bigcommerce', 'magento', 'custom'));
    END IF;
END$$;

-- ── 2. Widen auth_method to support more connection types ───────────────────
-- Drop old CHECK constraint if it exists, then create the wider one
DO $$
BEGIN
    -- Drop the old auto-named constraint
    ALTER TABLE merchants DROP CONSTRAINT IF EXISTS merchants_auth_method_check;
EXCEPTION WHEN undefined_object THEN NULL;
END$$;

ALTER TABLE merchants
    ALTER COLUMN auth_method TYPE VARCHAR(20);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'merchants_auth_method_check_v2'
    ) THEN
        ALTER TABLE merchants
            ADD CONSTRAINT merchants_auth_method_check_v2
            CHECK (auth_method IN ('oauth', 'manual', 'api_key', 'webhook'));
    END IF;
END$$;

-- ── 3. Rename shopify_shop_id → platform_shop_id ────────────────────────────
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'merchants' AND column_name = 'shopify_shop_id'
    ) THEN
        ALTER TABLE merchants RENAME COLUMN shopify_shop_id TO platform_shop_id;
    END IF;
END$$;

-- Ensure the column exists regardless
ALTER TABLE merchants
    ADD COLUMN IF NOT EXISTS platform_shop_id VARCHAR(255);

-- ── 4. Add platform_config JSONB for adapter-specific settings ──────────────
ALTER TABLE merchants
    ADD COLUMN IF NOT EXISTS platform_config JSONB DEFAULT '{}'::jsonb;

-- ── 5. Rename shopify_order_id → external_order_id in interceptions ─────────
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'interceptions' AND column_name = 'shopify_order_id'
    ) THEN
        ALTER TABLE interceptions RENAME COLUMN shopify_order_id TO external_order_id;
    END IF;
END$$;

ALTER TABLE interceptions
    ADD COLUMN IF NOT EXISTS external_order_id VARCHAR(255);

-- ── 6. Indexes ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_merchants_platform ON merchants(platform);
CREATE INDEX IF NOT EXISTS idx_merchants_is_active ON merchants(is_active);

-- Update index on interceptions to match new column name
DROP INDEX IF EXISTS idx_interceptions_shopify_order_id;
CREATE INDEX IF NOT EXISTS idx_interceptions_external_order_id ON interceptions(external_order_id);

COMMIT;
