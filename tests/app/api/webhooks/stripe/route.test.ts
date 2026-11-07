import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/webhooks/stripe/route";
import * as supabaseLib from "@/lib/supabase";
import * as stripeLib from "@/lib/stripe";
import * as redisLib from "@/lib/redis";
import { sendPurchaseEmail } from "@/lib/email";
import { createMockStripeWebhookEvent, createMockCheckoutSession, TEST_USER, TEST_PACKAGES } from "@/lib/test-utils";
import type Stripe from "stripe";

vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual("@/lib/supabase");
  return {
    ...actual,
    getUserById: vi.fn(),
    ensureUserExists: vi.fn(),
    grantPurchaseCredits: vi.fn(),
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
vi.mock("@/lib/email", () => ({
  sendPurchaseEmail: vi.fn(() => Promise.resolve()),
}));
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
        payment_intent: "pi_paid_test",
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
      vi.mocked(supabaseLib.grantPurchaseCredits).mockResolvedValue({ granted: true });

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
      expect(supabaseLib.grantPurchaseCredits).toHaveBeenCalledWith(
        TEST_USER.id,
        "pi_paid_test",
        TEST_PACKAGES.starter.credits,
        { packageId: "starter", packageName: TEST_PACKAGES.starter.name }
      );
      expect(sendPurchaseEmail).toHaveBeenCalledTimes(1);
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
      vi.mocked(supabaseLib.grantPurchaseCredits).mockResolvedValue({ granted: true });

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
      expect(supabaseLib.grantPurchaseCredits).not.toHaveBeenCalled();
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
      expect(supabaseLib.grantPurchaseCredits).not.toHaveBeenCalled();
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
      // Verify that no credits were granted (webhook was skipped)
      expect(supabaseLib.grantPurchaseCredits).not.toHaveBeenCalled();
    });

    describe("when the grant cannot complete", () => {
      function deliverPaidSession() {
        const session = createMockCheckoutSession({
          payment_status: "paid",
          metadata: { userId: TEST_USER.id, packageId: "starter" },
        });

        vi.mocked(stripeLib.parseWebhookEvent).mockReturnValue({
          id: "evt_grant",
          type: "checkout.session.completed",
          data: { object: session },
        } as unknown as Stripe.Event);
        vi.mocked(redisLib.isWebhookProcessed).mockResolvedValue(false);
        vi.mocked(redisLib.markWebhookProcessed).mockResolvedValue(true);
        vi.mocked(supabaseLib.getUserById).mockResolvedValue(TEST_USER);

        return POST(
          new Request("http://localhost:3000/api/webhooks/stripe", {
            method: "POST",
            headers: { "stripe-signature": "test_signature" },
            body: "{}",
          })
        );
      }

      it("answers 500 and stays unprocessed when the grant fails, so Stripe redelivers", async () => {
        vi.mocked(supabaseLib.grantPurchaseCredits).mockResolvedValue(null);

        const response = await deliverPaidSession();

        expect(response.status).toBe(500);
        expect(redisLib.markWebhookProcessed).not.toHaveBeenCalled();
        expect(sendPurchaseEmail).not.toHaveBeenCalled();
      });

      it("answers 200 without a second email when the payment was already granted", async () => {
        vi.mocked(supabaseLib.grantPurchaseCredits).mockResolvedValue({ granted: false });

        const response = await deliverPaidSession();

        expect(response.status).toBe(200);
        expect(redisLib.markWebhookProcessed).toHaveBeenCalledWith("stripe", "evt_grant");
        expect(sendPurchaseEmail).not.toHaveBeenCalled();
      });
    });
  });
});

