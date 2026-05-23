-- Migration: Add Paddle billing columns to merchants table
-- Run this in Supabase SQL Editor if you already have an existing database.
-- New installs can skip this — the base supabase-schema.sql will include these columns.

ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS paddle_customer_id     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS paddle_subscription_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS subscription_status    VARCHAR(50) DEFAULT 'free'
    CHECK (subscription_status IN ('free', 'trialing', 'active', 'past_due', 'cancelled', 'paused')),
  ADD COLUMN IF NOT EXISTS subscription_plan      VARCHAR(50) DEFAULT 'free'
    CHECK (subscription_plan IN ('free', 'starter', 'pro')),
  ADD COLUMN IF NOT EXISTS subscription_ends_at   TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_merchants_paddle_customer    ON merchants(paddle_customer_id);
CREATE INDEX IF NOT EXISTS idx_merchants_paddle_subscription ON merchants(paddle_subscription_id);
