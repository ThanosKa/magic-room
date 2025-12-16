import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/generate/route";
import * as supabaseLib from "@/lib/supabase";
import * as redisLib from "@/lib/redis";
import * as openrouterLib from "@/lib/openrouter";
import { auth } from "@clerk/nextjs/server";

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

    it("should use gemini-2.5-flash-image model for standard quality", async () => {
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
        "standard"
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

    it("should use gemini-3-pro-image-preview model for premium quality", async () => {
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
        "premium"
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
      vi.mocked(supabaseLib.updateUserCredits).mockResolvedValue(TEST_USER);
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
      expect(supabaseLib.updateUserCredits).toHaveBeenCalledWith(
        TEST_USER.id,
        TEST_USER.credits + 1
      );
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
      vi.mocked(supabaseLib.updateUserCredits).mockResolvedValue(TEST_USER);
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
      expect(supabaseLib.updateUserCredits).toHaveBeenCalledWith(
        TEST_USER.id,
        TEST_USER.credits + 2
      );
      expect(supabaseLib.createTransaction).toHaveBeenCalledWith(
        TEST_USER.id,
        "refund",
        2,
        undefined,
        expect.any(Object)
      );
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
          quality: "ultra",
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
});

