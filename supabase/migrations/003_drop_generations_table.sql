-- Migration: Remove Generations Table
-- Description: Drops generations table as API is fully synchronous and doesn't require async job tracking

-- Drop the generations table (cascades to all dependent objects)
DROP TABLE IF EXISTS generations CASCADE;


