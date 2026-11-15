import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addCredits,
  deductCredits,
  ensureUserExists,
  getUserByClerkId,
  getUserById,
} from "@/lib/supabase";

const { mockRpc, mockSingle, mockEq, mockSelect, mockFrom, mockInsert } = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-key";
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockInsert = vi.fn(() => ({
    select: () => ({ single: mockSingle }),
  }));
  const mockFrom = vi.fn(() => ({ select: mockSelect, insert: mockInsert }));
  return { mockRpc: vi.fn(), mockSingle, mockEq, mockSelect, mockFrom, mockInsert };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ rpc: mockRpc, from: mockFrom }),
}));

const { mockGetClerkUser } = vi.hoisted(() => ({ mockGetClerkUser: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: async () => ({ users: { getUser: mockGetClerkUser } }),
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
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

  it("throws on any other database error", async () => {
    const dbError = { code: "08006", message: "connection failure" };
    mockSingle.mockResolvedValue({ data: null, error: dbError });

    await expect(getUserByClerkId("user_abc")).rejects.toBe(dbError);
  });
});

describe("getUserById", () => {
  beforeEach(() => {
    mockSingle.mockReset();
  });

  it("returns the row when the user is found", async () => {
    const row = { id: USER_ID, clerk_user_id: "user_abc", credits: 1 };
    mockSingle.mockResolvedValue({ data: row, error: null });

    expect(await getUserById(USER_ID)).toEqual(row);
    expect(mockEq).toHaveBeenCalledWith("id", USER_ID);
  });

  it("returns null when no row matches (PGRST116)", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116", message: "no rows" },
    });

    expect(await getUserById(USER_ID)).toBeNull();
  });

  it("throws on any other database error", async () => {
    const dbError = { code: "08006", message: "connection failure" };
    mockSingle.mockResolvedValue({ data: null, error: dbError });

    await expect(getUserById(USER_ID)).rejects.toBe(dbError);
  });
});

describe("ensureUserExists", () => {
  beforeEach(() => {
    mockSingle.mockReset();
    mockInsert.mockClear();
    mockGetClerkUser.mockReset();
  });

  it("returns the row when the user exists", async () => {
    const row = { id: USER_ID, clerk_user_id: "user_abc", credits: 1 };
    mockSingle.mockResolvedValue({ data: row, error: null });

    expect(await ensureUserExists("user_abc")).toEqual(row);
    expect(mockGetClerkUser).not.toHaveBeenCalled();
  });

  it("throws on a database failure, without calling Clerk or creating a user", async () => {
    const dbError = { code: "08006", message: "connection failure" };
    mockSingle.mockResolvedValue({ data: null, error: dbError });

    await expect(ensureUserExists("user_abc")).rejects.toBe(dbError);
    expect(mockGetClerkUser).not.toHaveBeenCalled();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("creates the user from Clerk when the row is missing", async () => {
    const created = { id: USER_ID, clerk_user_id: "user_abc", credits: 1 };
    mockSingle
      .mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116", message: "no rows" },
      })
      .mockResolvedValueOnce({ data: created, error: null });
    mockGetClerkUser.mockResolvedValue({
      primaryEmailAddress: { emailAddress: "a@example.com" },
      emailAddresses: [],
    });

    expect(await ensureUserExists("user_abc")).toEqual(created);
    expect(mockInsert).toHaveBeenCalledTimes(1);
  });

  it("returns null when the Clerk API fails in the fallback, as today", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116", message: "no rows" },
    });
    mockGetClerkUser.mockRejectedValue(new Error("clerk down"));

    expect(await ensureUserExists("user_abc")).toBeNull();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("throws when the database fails on the lookup after a lost creation race", async () => {
    const dbError = { code: "08006", message: "connection failure" };
    mockSingle
      .mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116", message: "no rows" },
      })
      .mockResolvedValueOnce({
        data: null,
        error: { code: "23505", message: "duplicate key" },
      })
      .mockResolvedValueOnce({ data: null, error: dbError });
    mockGetClerkUser.mockResolvedValue({
      primaryEmailAddress: { emailAddress: "a@example.com" },
      emailAddresses: [],
    });

    await expect(ensureUserExists("user_abc")).rejects.toBe(dbError);
  });
});
