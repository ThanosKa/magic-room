// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/checkout/route";
import * as stripeLib from "@/lib/stripe";
import { TEST_USER } from "@/lib/test-utils";

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
vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/stripe", async () => {
  const actual = await vi.importActual("@/lib/stripe");
  return { ...actual, createCheckoutSession: vi.fn() };
});
vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

const { auth } = await import("@clerk/nextjs/server");
type AuthResult = Awaited<ReturnType<typeof auth>>;

describe("Checkout route during a database failure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
    vi.mocked(auth).mockResolvedValue({
      userId: TEST_USER.clerk_user_id,
    } as AuthResult);
  });

  it("answers 500 and opens no Stripe session when the User lookup fails", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "08006", message: "connection failure" },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: "starter" }),
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Internal server error" });
    expect(stripeLib.createCheckoutSession).not.toHaveBeenCalled();
  });
});
