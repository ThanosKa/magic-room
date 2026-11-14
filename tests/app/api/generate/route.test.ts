// @vitest-environment node
// Server code: a jsdom AbortSignal is not accepted by Node's Request.
import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/generate/route";
import * as supabaseLib from "@/lib/supabase";
import * as redisLib from "@/lib/redis";
import * as openrouterLib from "@/lib/openrouter";
import { auth } from "@clerk/nextjs/server";
import { after } from "next/server";

type AuthResult = Awaited<ReturnType<typeof auth>>;
type Transaction = Awaited<ReturnType<typeof supabaseLib.createTransaction>>;

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// `after` hands a promise to the platform's waitUntil (vinext on Workers).
vi.mock("next/server", () => ({
  after: vi.fn(),
}));

vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual("@/lib/supabase");
  return {
    ...actual,
    ensureUserExists: vi.fn(),
    deductCredits: vi.fn(),
    createTransaction: vi.fn(),
    addCredits: vi.fn(),
  };
});

vi.mock("@/lib/redis", async () => {
  const actual = await vi.importActual("@/lib/redis");
  return {
    ...actual,
    checkRateLimit: vi.fn(),
  };
});

vi.mock("@/lib/openrouter", async () => {
  const actual = await vi.importActual("@/lib/openrouter");
  return {
    ...actual,
    generateDesign: vi.fn(),
    buildDesignPrompt: vi.fn(),
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

describe("Generate Route - Quality Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ userId: TEST_USER.clerkUserId } as AuthResult);
    vi.mocked(redisLib.checkRateLimit).mockResolvedValue({
      success: true,
      remaining: 99,
      resetAt: Date.now() + 3600000,
    });
  });

  describe("Standard Quality (1 credit)", () => {
    it("should deduct 1 credit for standard quality generation", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
        success: true,
        images: ["data:image/png;base64,result"],
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "standard",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(supabaseLib.deductCredits).toHaveBeenCalledWith(TEST_USER.id, 1);
      expect(supabaseLib.createTransaction).toHaveBeenCalledWith(TEST_USER.id, "usage", 1);
    });

    it("should use gemini-3.1-flash-image model for standard quality", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
        success: true,
        images: ["data:image/png;base64,result"],
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "standard",
        }),
      });

      await POST(request);

      expect(openrouterLib.generateDesign).toHaveBeenCalledWith(
        TEST_BASE64_IMAGE,
        "test prompt",
        "standard",
        { signal: expect.any(AbortSignal) }
      );
    });

    it("should default to standard quality if not specified", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
        success: true,
        images: ["data:image/png;base64,result"],
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(supabaseLib.deductCredits).toHaveBeenCalledWith(TEST_USER.id, 1);
    });
  });

  describe("Premium Quality (2 credits)", () => {
    it("should deduct 2 credits for premium quality generation", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
        success: true,
        images: ["data:image/png;base64,result"],
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "premium",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(supabaseLib.deductCredits).toHaveBeenCalledWith(TEST_USER.id, 2);
      expect(supabaseLib.createTransaction).toHaveBeenCalledWith(TEST_USER.id, "usage", 2);
    });

    it("should use gemini-3-pro-image model for premium quality", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
        success: true,
        images: ["data:image/png;base64,result"],
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "premium",
        }),
      });

      await POST(request);

      expect(openrouterLib.generateDesign).toHaveBeenCalledWith(
        TEST_BASE64_IMAGE,
        "test prompt",
        "premium",
        { signal: expect.any(AbortSignal) }
      );
    });

    it("should reject premium quality when user has only 1 credit", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue({
        ...TEST_USER,
        credits: 1,
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "premium",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(402);
      expect(data.error).toBe("Insufficient credits");
      expect(supabaseLib.deductCredits).not.toHaveBeenCalled();
    });
  });

  describe("Credit Refunds", () => {
    it("should refund 1 credit when standard quality generation fails", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(supabaseLib.addCredits).mockResolvedValue(true);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
        success: false,
        images: [],
        error: "Generation failed",
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "standard",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(supabaseLib.addCredits).toHaveBeenCalledWith(TEST_USER.id, 1);
      expect(supabaseLib.createTransaction).toHaveBeenCalledWith(
        TEST_USER.id,
        "refund",
        1,
        undefined,
        expect.any(Object)
      );
    });

    it("should refund 2 credits when premium quality generation fails", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(supabaseLib.addCredits).mockResolvedValue(true);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
        success: false,
        images: [],
        error: "Generation failed",
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "premium",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(supabaseLib.addCredits).toHaveBeenCalledWith(TEST_USER.id, 2);
      expect(supabaseLib.createTransaction).toHaveBeenCalledWith(
        TEST_USER.id,
        "refund",
        2,
        undefined,
        expect.any(Object)
      );
    });

    // The screen tells the user "your credits were refunded" on this answer,
    // so it must also hold when the AI call throws (network, API error).
    it("refunds the credits and says so when the AI call throws", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(supabaseLib.addCredits).mockResolvedValue(true);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockRejectedValue(new Error("OpenRouter API error: 502"));

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "premium",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(await response.json()).toMatchObject({ success: false });
      expect(supabaseLib.addCredits).toHaveBeenCalledWith(TEST_USER.id, 2);
      expect(supabaseLib.createTransaction).toHaveBeenCalledWith(
        TEST_USER.id,
        "refund",
        2,
        undefined,
        expect.any(Object)
      );
    });

    it.each([
      ["the AI reports a failure", () => vi.mocked(openrouterLib.generateDesign).mockResolvedValue({ success: false, images: [], error: "Generation failed" })],
      ["the AI call throws", () => vi.mocked(openrouterLib.generateDesign).mockRejectedValue(new Error("OpenRouter API error: 502"))],
    ])("does not claim a refund that failed when %s", async (_name, failGeneration) => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(supabaseLib.addCredits).mockResolvedValue(false);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      failGeneration();

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "Internal server error" });
      expect(supabaseLib.createTransaction).not.toHaveBeenCalledWith(
        TEST_USER.id,
        "refund",
        expect.anything(),
        undefined,
        expect.anything()
      );
    });

    it("does not refund or claim a refund when it fails before charging", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(redisLib.checkRateLimit).mockRejectedValue(new Error("Redis down"));

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(await response.json()).not.toHaveProperty("success");
      expect(supabaseLib.deductCredits).not.toHaveBeenCalled();
      expect(supabaseLib.addCredits).not.toHaveBeenCalled();
    });
  });

  describe("Validation", () => {
    it("should reject invalid quality value", async () => {
      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "deluxe",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid input");
    });

    it("should reject when user has 0 credits", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue({
        ...TEST_USER,
        credits: 0,
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "standard",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(402);
      expect(data.error).toBe("Insufficient credits");
    });

    it("should reject unauthorized requests", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: null } as AuthResult);

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "standard",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Rate Limiting", () => {
    it("should reject requests when rate limit is exceeded", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(redisLib.checkRateLimit).mockResolvedValue({
        success: false,
        remaining: 0,
        resetAt: Date.now() + 3600000,
      });

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "standard",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe("Rate limit exceeded");
      expect(supabaseLib.deductCredits).not.toHaveBeenCalled();
    });
  });

  describe("Ultra Quality (3 credits)", () => {
    const ultraRequest = () =>
      new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "ultra",
        }),
      });

    it("charges 3 credits and asks for an ultra design", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      vi.mocked(openrouterLib.generateDesign).mockResolvedValue({
        success: true,
        images: ["data:image/png;base64,result"],
      });

      const response = await POST(ultraRequest());

      expect(response.status).toBe(200);
      expect(supabaseLib.deductCredits).toHaveBeenCalledWith(TEST_USER.id, 3);
      expect(openrouterLib.generateDesign).toHaveBeenCalledWith(TEST_BASE64_IMAGE, "test prompt", "ultra", {
        signal: expect.any(AbortSignal),
      });
    });

    it("refuses an ultra design with only 2 credits", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue({ ...TEST_USER, credits: 2 });

      const response = await POST(ultraRequest());

      expect(response.status).toBe(402);
      expect(supabaseLib.deductCredits).not.toHaveBeenCalled();
    });
  });

  // On Workers a client disconnect cancels the request's work unless it was
  // handed to waitUntil, which then gets about 30 s more. The tab closing must
  // stop the AI call and give the credits back inside that window.
  describe("Browser disconnects mid-generation", () => {
    it("stops the AI call, refunds the credits and keeps the request alive until the refund is written", async () => {
      vi.mocked(supabaseLib.ensureUserExists).mockResolvedValue(TEST_USER);
      vi.mocked(supabaseLib.deductCredits).mockResolvedValue(true);
      vi.mocked(supabaseLib.createTransaction).mockResolvedValue({} as Transaction);
      vi.mocked(supabaseLib.addCredits).mockResolvedValue(true);
      vi.mocked(openrouterLib.buildDesignPrompt).mockReturnValue("test prompt");
      // Like fetch: never answers on its own, rejects once its signal aborts.
      vi.mocked(openrouterLib.generateDesign).mockImplementation(
        (_image, _prompt, _quality, options) =>
          new Promise((_resolve, reject) => {
            options?.signal?.addEventListener("abort", () => reject(options.signal?.reason));
          })
      );

      const browser = new AbortController();
      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: TEST_BASE64_IMAGE,
          roomType: "living-room",
          theme: "modern",
          quality: "premium",
        }),
        signal: browser.signal,
      });

      // Nobody reads the answer: the tab is gone.
      void POST(request);
      await vi.waitFor(() => expect(openrouterLib.generateDesign).toHaveBeenCalled());
      expect(supabaseLib.addCredits).not.toHaveBeenCalled();

      browser.abort();
      const keptAlive = vi.mocked(after).mock.calls[0]?.[0];
      expect(keptAlive).toBeInstanceOf(Promise);
      await keptAlive;

      expect(supabaseLib.addCredits).toHaveBeenCalledWith(TEST_USER.id, 2);
      expect(supabaseLib.createTransaction).toHaveBeenCalledWith(
        TEST_USER.id,
        "refund",
        2,
        undefined,
        expect.any(Object)
      );
    });
  });
});
