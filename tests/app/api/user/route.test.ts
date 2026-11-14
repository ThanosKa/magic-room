// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "@/app/api/user/route";
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
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));
vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

const { auth } = await import("@clerk/nextjs/server");
type AuthResult = Awaited<ReturnType<typeof auth>>;

describe("User route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
    vi.mocked(auth).mockResolvedValue({
      userId: TEST_USER.clerk_user_id,
    } as AuthResult);
  });

  it("answers with the user when the row exists", async () => {
    mockSingle.mockResolvedValue({ data: TEST_USER, error: null });

    const response = await GET();

    expect(response.status).toBe(200);
    expect((await response.json()).user.id).toBe(TEST_USER.id);
  });

  it("answers 500 when the database fails", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "08006", message: "connection failure" },
    });

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Internal server error" });
  });
});
