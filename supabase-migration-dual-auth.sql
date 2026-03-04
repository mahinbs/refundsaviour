-- Migration: Add dual-auth columns to merchants table
-- Run this ONLY if you already deployed the original supabase-schema.sql.
-- New installs can skip this — the base schema already includes these columns.

-- 1. Add auth_method column
ALTER TABLE merchants
    ADD COLUMN IF NOT EXISTS auth_method VARCHAR(10) DEFAULT 'oauth' NOT NULL
        CHECK (auth_method IN ('oauth', 'manual'));

-- 2. Add is_active flag
ALTER TABLE merchants
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- 3. Index for quick lookup of inactive merchants
CREATE INDEX IF NOT EXISTS idx_merchants_is_active ON merchants(is_active);
