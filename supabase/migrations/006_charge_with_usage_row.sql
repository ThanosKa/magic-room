-- Migration: Charge with its usage row
-- Description: Takes a Charge and records its `usage` row in one transaction, so a
-- balance can never drop without its row. The rule is both or nothing: if the
-- insert fails, the subtraction is undone with it.
-- Additive: deduct_credits, add_credits and grant_purchase_credits stay as they are.
-- Nothing calls this function yet; ticket 28 switches the generate route to it.
-- Run this BEFORE deploying the code that calls it.

-- Returns TRUE when the amount was taken and the usage row written, FALSE (and
-- nothing changed) when the balance is too low or the user does not exist.
CREATE OR REPLACE FUNCTION deduct_credits_with_usage(p_user_id UUID, p_amount INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE users SET credits = credits - p_amount
  WHERE id = p_user_id AND credits >= p_amount;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Same values the generate route writes today: no payment id, no metadata.
  INSERT INTO transactions (user_id, type, amount, stripe_payment_id, metadata)
  VALUES (p_user_id, 'usage', p_amount, NULL, NULL);

  RETURN TRUE;
END;
$$;

-- This function changes balances and runs with its owner's rights, so only the
-- server may call it. Postgres lets everyone execute a new function by default,
-- and the anon key can reach public functions through the Data API.
REVOKE ALL ON FUNCTION deduct_credits_with_usage(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION deduct_credits_with_usage(UUID, INTEGER) TO service_role;
