-- Migration: Initial Schema Setup
-- Created: 2025-01-01
-- Description: Creates core tables for Magic Room application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for clerk_user_id lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),
  amount INTEGER NOT NULL,
  stripe_payment_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_id ON transactions(stripe_payment_id);

-- Credit packages table
CREATE TABLE IF NOT EXISTS credit_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  stripe_price_id TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generations table (for webhook tracking)
CREATE TABLE IF NOT EXISTS generations (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('starting', 'processing', 'succeeded', 'failed', 'canceled')),
  image_path TEXT NOT NULL,
  image_url TEXT,
  output_urls TEXT[] DEFAULT '{}',
  error TEXT,
  room_type TEXT,
  theme TEXT,
  custom_prompt TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Create indexes for generations
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

-- Users: authenticated users can read their own profile
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid()::text = clerk_user_id);

-- Transactions: users can read their own transactions
CREATE POLICY "Users can read their own transactions" ON transactions
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text));

-- Generations: users can read their own generations
CREATE POLICY "Users can read their own generations" ON generations
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text));

-- Generations: authenticated users can insert their own generations
CREATE POLICY "Users can create their own generations" ON generations
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text));

-- Credit packages: anyone can read (public)
CREATE POLICY "Anyone can read credit packages" ON credit_packages
  FOR SELECT USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update users.updated_at on modification
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to service role (used by API)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant read-only permissions to authenticated users
GRANT SELECT ON credit_packages TO authenticated;
