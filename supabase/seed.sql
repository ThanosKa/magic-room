-- Seed credit packages
-- Note: stripe_price_id values should be updated with actual Stripe price IDs

INSERT INTO credit_packages (id, name, credits, price_cents, stripe_price_id, active)
VALUES
  (
    'free_trial',
    'Free Trial',
    1,
    0,
    'free_trial',
    true
  ),
  (
    'starter',
    'Starter Pack',
    30,
    999,
    'price_starter_placeholder',
    true
  ),
  (
    'pro',
    'Pro Pack',
    150,
    1999,
    'price_pro_placeholder',
    true
  ),
  (
    'ultimate',
    'Ultimate Pack',
    300,
    2999,
    'price_ultimate_placeholder',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  credits = EXCLUDED.credits,
  price_cents = EXCLUDED.price_cents,
  stripe_price_id = EXCLUDED.stripe_price_id,
  active = EXCLUDED.active;
