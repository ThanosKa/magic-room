-- Migration: Atomic credit writes
-- Description: Charges and refunds change the balance in one statement, so requests
-- and purchases landing at the same moment cannot overwrite each other.
-- Run this BEFORE deploying the code that calls these functions.

-- Returns TRUE when the amount was taken, FALSE when the balance is too low or the
-- user does not exist.
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE users SET credits = credits - p_amount
  WHERE id = p_user_id AND credits >= p_amount;

  RETURN FOUND;
END;
$$;

-- Returns TRUE when the amount was added, FALSE when the user does not exist.
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_amount INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE users SET credits = credits + p_amount WHERE id = p_user_id;

  RETURN FOUND;
END;
$$;

-- These functions change balances and run with their owner's rights, so only the
-- server may call them. Postgres lets everyone execute a new function by default,
-- and the anon key can reach public functions through the Data API.
REVOKE ALL ON FUNCTION deduct_credits(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION add_credits(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION deduct_credits(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION add_credits(UUID, INTEGER) TO service_role;
