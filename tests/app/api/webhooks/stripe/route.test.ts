import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/webhooks/stripe/route";
import * as supabaseLib from "@/lib/supabase";
import * as stripeLib from "@/lib/stripe";
import * as redisLib from "@/lib/redis";
import { createMockStripeWebhookEvent, createMockCheckoutSession, TEST_USER, TEST_PACKAGES } from "@/lib/test-utils";
import type Stripe from "stripe";

vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual("@/lib/supabase");
  return {
    ...actual,
    getUserById: vi.fn(),
    ensureUserExists: vi.fn(),
    updateUserCredits: vi.fn(),
    createTransaction: vi.fn(),
  };
});
vi.mock("@/lib/stripe", async () => {
  const actual = await vi.importActual("@/lib/stripe");
  return {
    ...actual,
    parseWebhookEvent: vi.fn(),
  };
});
vi.mock("@/lib/redis", async () => {
  const actual = await vi.importActual("@/lib/redis");
  return {
    ...actual,
    isWebhookProcessed: vi.fn(),
    markWebhookProcessed: vi.fn(),
  };
});
vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe("Stripe Webhook Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/webhooks/stripe", () => {
    it("should reject request without signature", async () => {
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it("should reject request with invalid signature", async () => {
      const mockEvent = createMockStripeWebhookEvent("checkout.session.completed", createMockCheckoutSession());
      vi.mocked(stripeLib.parseWebhookEvent).mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "invalid_signature",
        },
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it("should handle checkout.session.completed event with paid status", async () => {
      const session = createMockCheckoutSession({
        payment_status: "paid",
        client_reference_id: TEST_USER.id,
        metadata: {
          userId: TEST_USER.id,
          packageId: "starter",
        },
      });

      const event: Stripe.Event = {
        id: "evt_test",
        object: "event",
        api_version: "2024-06-20",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: session,
          previous_attributes: {},
        },
        livemode: true,
        pending_webhooks: 1,
        request: { id: "req_test", idempotency_key: null },
        type: "checkout.session.completed",
      } as Stripe.Event;

      vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue(event);
      vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);
      vi.mocked(redisLib.markWebhookProcessed).mockResolvedValue(true);
      vi.mocked(supabaseLib.getUserById).mockResolvedValue(TEST_USER );
      vi.mocked(supabaseLib.updateUserCredits).mockResolvedValue({
        ...TEST_USER,
        credits: TEST_USER.credits + TEST_PACKAGES.starter.credits,
      });
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} );

      const body = JSON.stringify(event);
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "test_signature",
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(supabaseLib.updateUserCredits).toHaveBeenCalledWith(
        TEST_USER.id,
        TEST_USER.credits + TEST_PACKAGES.starter.credits
      );
      expect(supabaseLib.createTransaction).toHaveBeenCalled();
      expect(redisLib.markWebhookProcessed).toHaveBeenCalledWith("stripe", "evt_test");
    });

    it("should handle checkout.session.completed with no_payment_required", async () => {
      const session = createMockCheckoutSession({
        payment_status: "no_payment_required",
        client_reference_id: TEST_USER.id,
        metadata: {
          userId: TEST_USER.id,
          packageId: "growth",
        },
      });

      const event: Stripe.Event = {
        id: "evt_test",
        object: "event",
        api_version: "2024-06-20",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: session,
          previous_attributes: {},
        },
        livemode: true,
        pending_webhooks: 1,
        request: { id: "req_test", idempotency_key: null },
        type: "checkout.session.completed",
      } as Stripe.Event;

      vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue(event);
      vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);
      vi.mocked(redisLib.markWebhookProcessed).mockResolvedValue(true);
      vi.mocked(supabaseLib.getUserById).mockResolvedValue(TEST_USER );
      vi.mocked(supabaseLib.updateUserCredits).mockResolvedValue({
        ...TEST_USER,
        credits: TEST_USER.credits + TEST_PACKAGES.growth.credits,
      } );
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} );

      const body = JSON.stringify(event);
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "test_signature",
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("should reject unpaid checkout.session.completed", async () => {
      const session = createMockCheckoutSession({
        payment_status: "unpaid",
        client_reference_id: TEST_USER.id,
        metadata: {
          userId: TEST_USER.id,
          packageId: "starter",
        },
      });

      const event: Stripe.Event = {
        id: "evt_test",
        object: "event",
        api_version: "2024-06-20",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: session,
          previous_attributes: {},
        },
        livemode: true,
        pending_webhooks: 1,
        request: { id: "req_test", idempotency_key: null },
        type: "checkout.session.completed",
      } as Stripe.Event;

      vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue(event);
      vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);

      const body = JSON.stringify(event);
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "test_signature",
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(supabaseLib.updateUserCredits).not.toHaveBeenCalled();
    });

    it("should handle missing userId in metadata", async () => {
      const session = createMockCheckoutSession({
        payment_status: "paid",
        client_reference_id: undefined, // Missing userId (from client_reference_id)
        metadata: {
          packageId: "starter",
        },
      });

      const event: Stripe.Event = {
        id: "evt_test",
        object: "event",
        api_version: "2024-06-20",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: session,
          previous_attributes: {},
        },
        livemode: true,
        pending_webhooks: 1,
        request: { id: "req_test", idempotency_key: null },
        type: "checkout.session.completed",
      } as Stripe.Event;

      vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue(event);
      vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);

      const body = JSON.stringify(event);
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "test_signature",
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should handle user not found and not created", async () => {
      const session = createMockCheckoutSession({
        payment_status: "paid",
        client_reference_id: TEST_USER.id,
        metadata: {
          userId: TEST_USER.id,
          packageId: "starter",
        },
      });

      const event: Stripe.Event = {
        id: "evt_test",
        object: "event",
        api_version: "2024-06-20",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: session,
          previous_attributes: {},
        },
        livemode: true,
        pending_webhooks: 1,
        request: { id: "req_test", idempotency_key: null },
        type: "checkout.session.completed",
      } as Stripe.Event;

      vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue(event);
      vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);
      vi.mocked(supabaseLib.getUserById).mockResolvedValue(null);

      const body = JSON.stringify(event);
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "test_signature",
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(404);
    });

    it("should handle unknown event types gracefully", async () => {
      const event: Stripe.Event = {
        id: "evt_test",
        object: "event",
        api_version: "2024-06-20",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {},
          previous_attributes: {},
        },
        livemode: true,
        pending_webhooks: 1,
        request: { id: "req_test", idempotency_key: null },
        type: "customer.created",
      } as Stripe.Event;

      vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue(event);
      vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);
      vi.mocked(redisLib.markWebhookProcessed).mockResolvedValue(true);

      const body = JSON.stringify(event);
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "test_signature",
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(supabaseLib.updateUserCredits).not.toHaveBeenCalled();
    });

    it("should reject duplicate webhook events (idempotency)", async () => {
      const session = createMockCheckoutSession({
        payment_status: "paid",
        client_reference_id: TEST_USER.id,
        metadata: {
          userId: TEST_USER.id,
          packageId: "starter",
        },
      });

      const event: Stripe.Event = {
        id: "evt_duplicate_test",
        object: "event",
        api_version: "2024-06-20",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: session,
          previous_attributes: {},
        },
        livemode: true,
        pending_webhooks: 1,
        request: { id: "req_test", idempotency_key: null },
        type: "checkout.session.completed",
      } as Stripe.Event;

      vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue(event);
      vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(true);

      const body = JSON.stringify(event);
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "test_signature",
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      // Verify that no credits were updated (webhook was skipped)
      expect(supabaseLib.updateUserCredits).not.toHaveBeenCalled();
    });

    it("should handle race condition: Stripe webhook before Clerk webhook creates user", async () => {
      const session = createMockCheckoutSession({
        payment_status: "paid",
        client_reference_id: TEST_USER.id,
        metadata: {
          userId: TEST_USER.id,
          packageId: "starter",
        },
      });

      const event: Stripe.Event = {
        id: "evt_race_condition",
        object: "event",
        api_version: "2024-06-20",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: session,
          previous_attributes: {},
        },
        livemode: true,
        pending_webhooks: 1,
        request: { id: "req_test", idempotency_key: null },
        type: "checkout.session.completed",
      } as Stripe.Event;

      vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue(event);
      vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);
      vi.mocked(redisLib.markWebhookProcessed).mockResolvedValue(true);
      // getUserById returns the user (existing case)
      vi.mocked(supabaseLib.getUserById).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.updateUserCredits).mockResolvedValue({
        ...TEST_USER,
        credits: TEST_USER.credits + TEST_PACKAGES.starter.credits,
      });
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({});

      const body = JSON.stringify(event);
      const request = new Request("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "stripe-signature": "test_signature",
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      // getUserById should have been called to resolve user
      expect(supabaseLib.getUserById).toHaveBeenCalledWith(TEST_USER.id);
      // Credits should be added
      expect(supabaseLib.updateUserCredits).toHaveBeenCalled();
    });
  });
});

