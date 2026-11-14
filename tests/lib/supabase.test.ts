import { beforeEach, describe, expect, it, vi } from "vitest";
import { addCredits, deductCredits, getUserByClerkId } from "@/lib/supabase";

const { mockRpc, mockSingle, mockEq, mockSelect, mockFrom } = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-key";
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  return { mockRpc: vi.fn(), mockSingle, mockEq, mockSelect, mockFrom };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ rpc: mockRpc, from: mockFrom }),
}));

const USER_ID = "33333333-3333-3333-3333-333333333333";

describe("balance writes", () => {
  beforeEach(() => {
    mockRpc.mockReset();
  });

  describe("deductCredits", () => {
    it("asks the database to take the amount", async () => {
      mockRpc.mockResolvedValue({ data: true, error: null });

      expect(await deductCredits(USER_ID, 2)).toBe(true);
      expect(mockRpc).toHaveBeenCalledWith("deduct_credits", {
        p_user_id: USER_ID,
        p_amount: 2,
      });
    });

    it("reports false when the balance is too low", async () => {
      mockRpc.mockResolvedValue({ data: false, error: null });

      expect(await deductCredits(USER_ID, 2)).toBe(false);
    });

    it("reports false when the database call fails", async () => {
      mockRpc.mockResolvedValue({ data: null, error: { message: "down" } });

      expect(await deductCredits(USER_ID, 2)).toBe(false);
    });
  });

  describe("addCredits", () => {
    it("asks the database to add the amount", async () => {
      mockRpc.mockResolvedValue({ data: true, error: null });

      expect(await addCredits(USER_ID, 3)).toBe(true);
      expect(mockRpc).toHaveBeenCalledWith("add_credits", {
        p_user_id: USER_ID,
        p_amount: 3,
      });
    });

    it("reports false when the user does not exist", async () => {
      mockRpc.mockResolvedValue({ data: false, error: null });

      expect(await addCredits(USER_ID, 3)).toBe(false);
    });

    it("reports false when the database call fails", async () => {
      mockRpc.mockResolvedValue({ data: null, error: { message: "down" } });

      expect(await addCredits(USER_ID, 3)).toBe(false);
    });
  });
});

describe("getUserByClerkId", () => {
  beforeEach(() => {
    mockSingle.mockReset();
  });

  it("returns the row when the user is found", async () => {
    const row = { id: USER_ID, clerk_user_id: "user_abc", credits: 1 };
    mockSingle.mockResolvedValue({ data: row, error: null });

    expect(await getUserByClerkId("user_abc")).toEqual(row);
    expect(mockFrom).toHaveBeenCalledWith("users");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("clerk_user_id", "user_abc");
  });

  it("returns null when no row matches (PGRST116)", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116", message: "no rows" },
    });

    expect(await getUserByClerkId("user_abc")).toBeNull();
  });

  it("returns null on any other database error (today's behaviour, known bug)", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "08006", message: "connection failure" },
    });

    expect(await getUserByClerkId("user_abc")).toBeNull();
  });
});
