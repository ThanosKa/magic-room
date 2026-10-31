import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/generate/route";
import * as supabaseLib from "@/lib/supabase";
import * as redisLib from "@/lib/redis";
import * as openrouterLib from "@/lib/openrouter";
import { auth } from "@clerk/nextjs/server";

/**
 * The tool offers all 14 styles and 14 room types promised on the homepage and
 * the /design pages. The 8 styles and 7 room types that existed before are
 * locked by prompt-baseline.test.ts; this file covers the 6 styles and 7 room
 * types added on top, and the rejection of anything outside the two lists.
 */

type AuthResult = Awaited<ReturnType<typeof auth>>;
type Transaction = Awaited<ReturnType<typeof supabaseLib.createTransaction>>;

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual("@/lib/supabase");
  return {
    ...actual,
    ensureUserExists: vi.fn(),
    deductCredits: vi.fn(),
    createTransaction: vi.fn(),
    updateUserCredits: vi.fn(),
  };
});

vi.mock("@/lib/redis", async () => {
  const actual = await vi.importActual("@/lib/redis");
  return {
    ...actual,
    checkRateLimit: vi.fn(),
  };
});

// Only the network call to OpenRouter is mocked; the real prompt builder runs.
vi.mock("@/lib/openrouter", async () => {
  const actual = await vi.importActual("@/lib/openrouter");
  return {
    ...actual,
    generateDesign: vi.fn(),
  };
});

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

const TEST_USER = {
  id: "user_test_123",
  clerkUserId: "clerk_user_123",
  email: "test@example.com",
  credits: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const TEST_BASE64_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const NEW_THEMES = [
  "japandi",
  "art-deco",
  "coastal",
  "farmhouse",
  "mediterranean",
  "transitional",
];

const NEW_ROOM_TYPES = [
  "nursery",
  "laundry-room",
  "basement",
  "sunroom",
  "home-theater",
  "mudroom",
  "walk-in-closet",
];

function generateRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64Image: TEST_BASE64_IMAGE, ...body }),
  });
}

function sentPrompt(): string {
  expect(openrouterLib.generateDesign).toHaveBeenCalledTimes(1);
  return vi.mocked(openrouterLib.generateDesign).mock.calls[0][1];
}

describe("Generate Route - all 14 styles and 14 room types", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as AuthResult);
    vi.mocked(redisLib.checkRateLimit).mockResolvedValue({
      success: true,
      remaining: 99,
      resetAt: Date.now() + 3600000,
    });
    vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
    vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
    vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
    vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
      success: true,
      images: ["data:image/png;base64,result"],
    });
  });

  it.each(NEW_THEMES)("accepts the %s style and describes it in the prompt", async (theme) => {
    const response = await POST(generateRequest({ roomType: "living-room", theme }));

    expect(response.status).toBe(200);
    // Without a modifier the builder falls back to the raw slug ("with art-deco style").
    expect(sentPrompt()).not.toContain(`with ${theme} style`);
  });

  it.each(NEW_ROOM_TYPES)("accepts the %s room type and describes it in the prompt", async (roomType) => {
    const response = await POST(generateRequest({ roomType, theme: "modern" }));

    expect(response.status).toBe(200);
    // Without a description the builder falls back to the raw slug ("into walk-in-closet with").
    expect(sentPrompt()).not.toContain(`into ${roomType} with`);
  });

  it("accepts a new style combined with a new room type", async () => {
    const response = await POST(
      generateRequest({ roomType: "nursery", theme: "japandi", quality: "premium" })
    );

    expect(response.status).toBe(200);
    expect(vi.mocked(openrouterLib.generateDesign).mock.calls[0][2]).toBe("premium");
  });

  it.each(["gothic", "Japandi", "", "japandi "])("rejects the unknown style %j", async (theme) => {
    const response = await POST(generateRequest({ roomType: "bedroom", theme }));

    expect(response.status).toBe(400);
    expect(openrouterLib.generateDesign).not.toHaveBeenCalled();
    expect(supabaseLib.deductCredits).not.toHaveBeenCalled();
  });

  it.each(["garage", "Bedroom", "", "walk_in_closet"])("rejects the unknown room type %j", async (roomType) => {
    const response = await POST(generateRequest({ roomType, theme: "japandi" }));

    expect(response.status).toBe(400);
    expect(openrouterLib.generateDesign).not.toHaveBeenCalled();
    expect(supabaseLib.deductCredits).not.toHaveBeenCalled();
  });
});
