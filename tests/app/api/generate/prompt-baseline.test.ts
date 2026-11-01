import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/generate/route";
import * as supabaseLib from "@/lib/supabase";
import * as redisLib from "@/lib/redis";
import * as openrouterLib from "@/lib/openrouter";
import { auth } from "@clerk/nextjs/server";
import baseline from "./__fixtures__/prompt-baseline.json";

/**
 * Prompt baseline: locks the exact prompt the generate route sends to the
 * model for every existing style x room type x quality, with and without a
 * custom note.
 *
 * The fixture was recorded once from the prompt builder as it was before the
 * app redesign (commit d3d80fb). Never regenerate it to make this test pass:
 * a failure here means generation output for an existing option changed.
 */

type AuthResult = Awaited<ReturnType<typeof auth>>;
type Transaction = Awaited<ReturnType<typeof supabaseLib.createTransaction>>;

interface BaselineEntry {
  theme: string;
  roomType: string;
  quality: "standard" | "premium";
  customPrompt: string | null;
  prompt: string;
}

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

const EXISTING_THEMES = [
  "modern",
  "minimalist",
  "scandinavian",
  "industrial",
  "tropical",
  "bohemian",
  "vintage",
  "luxury",
];

const EXISTING_ROOM_TYPES = [
  "living-room",
  "bedroom",
  "kitchen",
  "bathroom",
  "dining-room",
  "office",
  "gaming-room",
];

const QUALITIES = ["standard", "premium"];

const entries = baseline as BaselineEntry[];

function label(entry: BaselineEntry): string {
  const note = entry.customPrompt === null ? "no note" : "with note";
  return `${entry.theme} / ${entry.roomType} / ${entry.quality} / ${note}`;
}

describe("Generate Route - Prompt Baseline", () => {
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

  it("covers every existing style x room type x quality, with and without a note", () => {
    const expectedKeys = EXISTING_THEMES.flatMap((theme) =>
      EXISTING_ROOM_TYPES.flatMap((roomType) =>
        QUALITIES.flatMap((quality) => [
          `${theme}|${roomType}|${quality}|no-note`,
          `${theme}|${roomType}|${quality}|note`,
        ])
      )
    ).sort();

    const actualKeys = entries
      .map(
        (e) =>
          `${e.theme}|${e.roomType}|${e.quality}|${e.customPrompt === null ? "no-note" : "note"}`
      )
      .sort();

    expect(actualKeys).toEqual(expectedKeys);
    expect(actualKeys).toHaveLength(8 * 7 * 2 * 2);
  });

  it.each(entries.map((entry) => [label(entry), entry] as const))(
    "sends the recorded prompt to the model for %s",
    async (_label, entry) => {
      const body: Record<string, string> = {
        base64Image: TEST_BASE64_IMAGE,
        roomType: entry.roomType,
        theme: entry.theme,
        quality: entry.quality,
      };
      if (entry.customPrompt !== null) {
        body.customPrompt = entry.customPrompt;
      }

      const request = new Request("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(openrouterLib.generateDesign).toHaveBeenCalledTimes(1);
      const [, sentPrompt, sentQuality] = vi.mocked(openrouterLib.generateDesign).mock.calls[0];
      expect(sentPrompt).toBe(entry.prompt);
      expect(sentQuality).toBe(entry.quality);
    }
  );
});
