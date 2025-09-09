-- Initialize secure code editor database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by better-auth)
-- This will be created automatically by better-auth migrations

-- Pastes table
CREATE TABLE IF NOT EXISTS pastes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL CHECK (length(content) <= 100000),
    language VARCHAR(50) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    user_id TEXT, -- Changed from UUID to TEXT to match Better Auth
    view_count INTEGER NOT NULL DEFAULT 0,
    short_url VARCHAR(10) NOT NULL UNIQUE, -- Added for unique URLs
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Add constraints
    CONSTRAINT pastes_title_length CHECK (length(title) > 0 AND length(title) <= 100),
    CONSTRAINT pastes_language_valid CHECK (language ~ '^[a-z]+$'),
    CONSTRAINT pastes_view_count_positive CHECK (view_count >= 0),
    CONSTRAINT pastes_short_url_format CHECK (short_url ~ '^[A-Za-z0-9]{6}$')
);

-- Paste views table for analytics
CREATE TABLE IF NOT EXISTS paste_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paste_id UUID NOT NULL REFERENCES pastes(id) ON DELETE CASCADE,
    viewer_ip INET,
    viewer_user_id TEXT, -- Changed from UUID to TEXT to match Better Auth
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pastes_user_id ON pastes(user_id);
CREATE INDEX IF NOT EXISTS idx_pastes_is_public ON pastes(is_public);
CREATE INDEX IF NOT EXISTS idx_pastes_created_at ON pastes(created_at);
CREATE INDEX IF NOT EXISTS idx_pastes_language ON pastes(language);
CREATE INDEX IF NOT EXISTS idx_pastes_expires_at ON pastes(expires_at) WHERE expires_at IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_pastes_short_url ON pastes(short_url);

CREATE INDEX IF NOT EXISTS idx_paste_views_paste_id ON paste_views(paste_id);
CREATE INDEX IF NOT EXISTS idx_paste_views_created_at ON paste_views(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_pastes_updated_at 
    BEFORE UPDATE ON pastes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_paste_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pastes SET view_count = view_count + 1 WHERE id = NEW.paste_id;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger to increment view count when a view is recorded
CREATE TRIGGER increment_view_count_trigger
    AFTER INSERT ON paste_views
    FOR EACH ROW
    EXECUTE FUNCTION increment_paste_view_count();

-- Function to clean up expired pastes
CREATE OR REPLACE FUNCTION cleanup_expired_pastes()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM pastes 
    WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE 'plpgsql';

-- Grant permissions (adjust user as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
