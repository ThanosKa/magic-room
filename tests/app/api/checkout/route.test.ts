import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/checkout/route";
import * as supabaseLib from "@/lib/supabase";
import * as stripeLib from "@/lib/stripe";
import { TEST_USER, TEST_PACKAGES } from "@/lib/test-utils";

// Mock the modules
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));
vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual("@/lib/supabase");
  return {
    ...actual,
    ensureUserExists: vi.fn(),
  };
});
vi.mock("@/lib/stripe", async () => {
  const actual = await vi.importActual("@/lib/stripe");
  return {
    ...actual,
    createCheckoutSession: vi.fn(),
  };
});
vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

const { auth } = await import("@clerk/nextjs/server");

describe("Checkout Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/checkout", () => {
    it("should return 401 when user is not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: null } as any);

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "starter" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it("should return 404 when user is not found in database", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as any);
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "starter" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid packageId", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as any);
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER as any);

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "invalid_package" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should create checkout session for valid starter package", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as any);
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER as any);
      vi.mocked(stripeLib.createCheckoutSession).mockResolvedValue({
        id: "cs_test_123",
        url: "https://checkout.stripe.com/...",
      } as any);

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "starter" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("url");
      expect(data).toHaveProperty("sessionId");
      expect(stripeLib.createCheckoutSession).toHaveBeenCalledWith(
        TEST_USER.id,
        "starter",
        TEST_PACKAGES.starter.stripePriceId,
        expect.stringContaining("pricing?success=true"),
        expect.stringContaining("pricing?success=false"),
        TEST_USER.email
      );
    });

    it("should create checkout session for valid growth package", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as any);
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER as any);
      vi.mocked(stripeLib.createCheckoutSession).mockResolvedValue({
        id: "cs_test_456",
        url: "https://checkout.stripe.com/...",
      } as any);

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "growth" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(stripeLib.createCheckoutSession).toHaveBeenCalledWith(
        TEST_USER.id,
        "growth",
        TEST_PACKAGES.growth.stripePriceId,
        expect.stringContaining("pricing?success=true"),
        expect.stringContaining("pricing?success=false"),
        TEST_USER.email
      );
    });

    it("should create checkout session for valid premium package", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as any);
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER as any);
      vi.mocked(stripeLib.createCheckoutSession).mockResolvedValue({
        id: "cs_test_789",
        url: "https://checkout.stripe.com/...",
      } as any);

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "premium" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(stripeLib.createCheckoutSession).toHaveBeenCalledWith(
        TEST_USER.id,
        "premium",
        TEST_PACKAGES.premium.stripePriceId,
        expect.stringContaining("pricing?success=true"),
        expect.stringContaining("pricing?success=false"),
        TEST_USER.email
      );
    });

    it("should handle Stripe session creation errors", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as any);
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER as any);
      vi.mocked(stripeLib.createCheckoutSession).mockRejectedValue(new Error("Stripe API error"));

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "starter" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data).toHaveProperty("error");
    });

    it("should handle missing Content-Type header", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as any);
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER as any);

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        body: JSON.stringify({ packageId: "starter" }),
      });

      // This should not throw
      const response = await POST(request);
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it("should reject old package IDs (pro, ultimate)", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as any);
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER as any);

      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "pro" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});

