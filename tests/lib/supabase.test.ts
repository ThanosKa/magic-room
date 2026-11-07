import { beforeEach, describe, expect, it, vi } from "vitest";
import { addCredits, deductCredits } from "@/lib/supabase";

const { mockRpc } = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-key";
  return { mockRpc: vi.fn() };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ rpc: mockRpc }),
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
