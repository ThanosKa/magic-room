-- Migration: Add User Metadata Columns
-- Created: 2025-01-15
-- Description: Adds name and profile_image_url columns to users table for Clerk sync

-- Add name column
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;

-- Add profile_image_url column
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Update updated_at timestamp to current time for all existing rows
UPDATE users SET updated_at = NOW() WHERE updated_at IS NOT NULL;

