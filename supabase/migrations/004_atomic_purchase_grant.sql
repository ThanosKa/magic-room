-- Migration: Atomic purchase grant
-- Description: Records a Stripe purchase and adds its credits in one transaction,
-- at most once per payment. Run this BEFORE deploying the webhook that calls it.
--
-- If the unique index below fails, the same payment is already recorded twice.
-- Find those rows, and settle them by hand, with:
--   SELECT stripe_payment_id, COUNT(*) FROM transactions
--   WHERE type = 'purchase' GROUP BY stripe_payment_id HAVING COUNT(*) > 1;

-- One payment can be recorded as a purchase only once.
CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_purchase_payment_unique
ON transactions (stripe_payment_id)
WHERE type = 'purchase';

-- Returns TRUE when credits were added, FALSE when this payment was already granted.
CREATE OR REPLACE FUNCTION grant_purchase_credits(
  p_user_id UUID,
  p_stripe_payment_id TEXT,
  p_credits INTEGER,
  p_metadata JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  INSERT INTO transactions (user_id, type, amount, stripe_payment_id, metadata)
  VALUES (p_user_id, 'purchase', p_credits, p_stripe_payment_id, p_metadata)
  ON CONFLICT (stripe_payment_id) WHERE type = 'purchase' DO NOTHING
  RETURNING id INTO v_transaction_id;

  IF v_transaction_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE users SET credits = credits + p_credits WHERE id = p_user_id;

  RETURN TRUE;
END;
$$;

-- This function hands out credits and runs with its owner's rights, so only the
-- server may call it. Postgres lets everyone execute a new function by default,
-- and the anon key can reach public functions through the Data API.
REVOKE ALL ON FUNCTION grant_purchase_credits(UUID, TEXT, INTEGER, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION grant_purchase_credits(UUID, TEXT, INTEGER, JSONB) TO service_role;
