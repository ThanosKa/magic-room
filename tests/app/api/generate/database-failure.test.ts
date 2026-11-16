// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/generate/route";
import * as supabaseLib from "@/lib/supabase";
import * as redisLib from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
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
vi.mock("next/server", () => ({ after: vi.fn() }));
vi.mock("@/lib/redis", async () => {
  const actual = await vi.importActual("@/lib/redis");
  return { ...actual, checkRateLimit: vi.fn() };
});
vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual("@/lib/supabase");
  return {
    ...actual,
    deductCreditsWithUsage: vi.fn(),
    createTransaction: vi.fn(),
    addCredits: vi.fn(),
  };
});
vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

type AuthResult = Awaited<ReturnType<typeof auth>>;

const BASE64_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

describe("Generate route during a database failure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
    vi.mocked(auth).mockResolvedValue({
      userId: TEST_USER.clerk_user_id,
    } as AuthResult);
    vi.mocked(redisLib.checkRateLimit).mockResolvedValue({
      success: true,
      remaining: 99,
      resetAt: Date.now() + 3600000,
    });
  });

  it("answers 500 and charges nothing when the User lookup fails", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "08006", message: "connection failure" },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "standard",
        }),
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Internal server error" });
    expect(supabaseLib.deductCreditsWithUsage).not.toHaveBeenCalled();
    expect(supabaseLib.createTransaction).not.toHaveBeenCalled();
  });
});
