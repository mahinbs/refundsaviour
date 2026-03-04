-- Additional table for Shopify session storage
-- Run this in addition to the main supabase-schema.sql

CREATE TABLE IF NOT EXISTS shopify_sessions (
    id VARCHAR(255) PRIMARY KEY,
    shop VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    is_online BOOLEAN DEFAULT false,
    scope TEXT,
    expires TIMESTAMP WITH TIME ZONE,
    access_token TEXT,
    user_id BIGINT,
    user_first_name VARCHAR(255),
    user_last_name VARCHAR(255),
    user_email VARCHAR(255),
    user_email_verified BOOLEAN,
    account_owner BOOLEAN,
    locale VARCHAR(10),
    collaborator BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_shopify_sessions_shop ON shopify_sessions(shop);
CREATE INDEX idx_shopify_sessions_expires ON shopify_sessions(expires);

-- Enable RLS
ALTER TABLE shopify_sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage sessions
CREATE POLICY "Service role can manage sessions" ON shopify_sessions
    FOR ALL USING (true);

-- Auto-update updated_at
CREATE TRIGGER update_shopify_sessions_updated_at 
    BEFORE UPDATE ON shopify_sessions
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Clean up expired sessions periodically (run as a cron job)
-- You can set this up in Supabase Dashboard -> Database -> Cron
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule(
--     'cleanup-expired-sessions',
--     '0 0 * * *',  -- Run daily at midnight
--     $$DELETE FROM shopify_sessions WHERE expires IS NOT NULL AND expires < NOW()$$
-- );
