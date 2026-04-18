-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create designs table
CREATE TABLE IF NOT EXISTS designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public designs are viewable by everyone"
ON designs FOR SELECT
USING (is_published = true);

CREATE POLICY "Authenticated users can insert designs"
ON designs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update designs"
ON designs FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete designs"
ON designs FOR DELETE
USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_designs_slug ON designs(slug);
CREATE INDEX idx_designs_category ON designs(category);
CREATE INDEX idx_designs_is_published ON designs(is_published);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_designs_updated_at
BEFORE UPDATE ON designs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Admin users table (for simple admin auth)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only service role can manage admin_users (for auth checks)
CREATE POLICY "Service role can manage admin_users"
ON admin_users FOR ALL
USING (false)
WITH CHECK (auth.role() = 'service_role');
