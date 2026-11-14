// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/webhooks/stripe/route";
import * as supabaseLib from "@/lib/supabase";
import * as stripeLib from "@/lib/stripe";
import * as redisLib from "@/lib/redis";
import { sendPurchaseEmail } from "@/lib/email";
import { createMockCheckoutSession, TEST_USER } from "@/lib/test-utils";
import type Stripe from "stripe";

const { mockSingle } = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-key";
  return { mockSingle: vi.fn() };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({ select: () => ({ eq: () => ({ single: mockSingle }) }) }),
  }),
}));
vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual("@/lib/supabase");
  return { ...actual, grantPurchaseCredits: vi.fn() };
});
vi.mock("@/lib/stripe", async () => {
  const actual = await vi.importActual("@/lib/stripe");
  return { ...actual, parseWebhookEvent: vi.fn() };
});
vi.mock("@/lib/redis", async () => {
  const actual = await vi.importActual("@/lib/redis");
  return {
    ...actual,
    isWebhookProcessed: vi.fn(),
    markWebhookProcessed: vi.fn(),
  };
});
vi.mock("next/server", () => ({ after: vi.fn() }));
vi.mock("@/lib/email", () => ({
  sendPurchaseEmail: vi.fn(() => Promise.resolve()),
}));
vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

function checkoutEvent(userId: string): Stripe.Event {
  return {
    id: "evt_outage",
    object: "event",
    api_version: "2024-06-20",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: createMockCheckoutSession({
        payment_status: "paid",
        payment_intent: "pi_outage",
        metadata: { userId, packageId: "starter" },
      }),
      previous_attributes: {},
    },
    livemode: true,
    pending_webhooks: 1,
    request: { id: "req_test", idempotency_key: null },
    type: "checkout.session.completed",
  } as Stripe.Event;
}

describe("Stripe webhook during a database failure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "08006", message: "connection failure" },
    });
    vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);
  });

  it.each([
    ["a Supabase id", TEST_USER.id],
    ["a Clerk id", TEST_USER.clerk_user_id],
  ])(
    "answers 500, grants nothing and leaves the event unprocessed for %s",
    async (_label, userId) => {
      vi.mocked(stripeLib.parseWebhookEvent).mockResolvedValue(
        checkoutEvent(userId)
      );

      const response = await POST(
        new Request("http://localhost:3000/api/webhooks/stripe", {
          method: "POST",
          headers: { "stripe-signature": "test_signature" },
          body: "{}",
        })
      );

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Webhook error");
      expect(supabaseLib.grantPurchaseCredits).not.toHaveBeenCalled();
      expect(sendPurchaseEmail).not.toHaveBeenCalled();
      expect(redisLib.markWebhookProcessed).not.toHaveBeenCalled();
    }
  );
});
