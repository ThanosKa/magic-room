import type Stripe from "stripe";

export function createMockStripeWebhookEvent(
  eventType: string,
  data: Stripe.Checkout.Session
): Stripe.Event {
  return {
    id: "evt_test_" + Math.random().toString(36).substring(7),
    object: "event",
    api_version: "2024-06-20",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: data,
      previous_attributes: {},
    },
    livemode: true,
    pending_webhooks: 1,
    request: {
      id: "req_test",
      idempotency_key: null,
    },
    type: eventType as Stripe.Event.Type,
  } as Stripe.Event;
}

export function createMockCheckoutSession(
  overrides?: Partial<Stripe.Checkout.Session>
): Stripe.Checkout.Session {
  return {
    id: "cs_test_" + Math.random().toString(36).substring(7),
    object: "checkout.session",
    after_expiration: null,
    allow_promotion_codes: true,
    automatic_tax: { enabled: false, status: null },
    billing_address_collection: null,
    cancel_url: "http://localhost:3000/pricing?success=false",
    client_reference_id: "user_test_123",
    consent: null,
    consent_collection: null,
    currency: "eur",
    customer: null,
    customer_creation: null,
    customer_email: "test@example.com",
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    livemode: true,
    locale: null,
    metadata: {
      userId: "user_test_123",
      packageId: "starter",
    },
    mode: "payment",
    payment_intent: "pi_test_" + Math.random().toString(36).substring(7),
    payment_link: null,
    payment_method_collection: null,
    payment_method_options: null,
    payment_method_types: ["card"],
    payment_status: "paid",
    phone_number_collection: { enabled: false },
    recovered_from: null,
    setup_intent: null,
    status: "complete",
    submit_type: null,
    subscription: null,
    success_url: "http://localhost:3000/pricing?success=true",
    total_details: {
      amount_discount: 0,
      amount_shipping: 0,
      amount_tax: 0,
    },
    url: "https://checkout.stripe.com/pay/...",
    ...overrides,
  } as Stripe.Checkout.Session;
}

export const TEST_USER = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  clerkUserId: "clerk_user_123",
  email: "test@example.com",
  credits: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const TEST_PACKAGES = {
  starter: {
    id: "starter",
    name: "Starter",
    credits: 30,
    priceCents: 999,
    stripePriceId: "price_test_starter",
    active: true,
  },
  growth: {
    id: "growth",
    name: "Growth",
    credits: 150,
    priceCents: 1999,
    stripePriceId: "price_test_growth",
    active: true,
  },
  premium: {
    id: "premium",
    name: "Premium",
    credits: 300,
    priceCents: 2999,
    stripePriceId: "price_test_premium",
    active: true,
  },
};

