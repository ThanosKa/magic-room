import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/generate/route";
import * as supabaseLib from "@/lib/supabase";
import * as redisLib from "@/lib/redis";
import * as openrouterLib from "@/lib/openrouter";
import { auth } from "@clerk/nextjs/server";

/**
 * The optional note ("customPrompt") is capped at 500 characters. The tool's
 * note field enforces the same limit; this checks the API refuses a longer
 * note before any credit is spent or the model is called.
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

function generateRequest(customPrompt: string): Request {
  return new Request("http://localhost:3000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      base64Image: TEST_BASE64_IMAGE,
      roomType: "bedroom",
      theme: "japandi",
      customPrompt,
    }),
  });
}

describe("Generate Route - note length limit", () => {
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

  it("accepts a 500-character note and sends it to the model", async () => {
    const note = "green sofa ".repeat(50).slice(0, 500);

    const response = await POST(generateRequest(note));

    expect(response.status).toBe(200);
    expect(vi.mocked(openrouterLib.generateDesign).mock.calls[0][1]).toContain(note);
  });

  it("rejects a 501-character note without charging or calling the model", async () => {
    const response = await POST(generateRequest("x".repeat(501)));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(supabaseLib.deductCredits).not.toHaveBeenCalled();
    expect(openrouterLib.generateDesign).not.toHaveBeenCalled();
  });
});
