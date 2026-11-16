// @vitest-environment node
// Server code: the ledger runs only in API routes.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { grantPurchase, spendCredits } from "@/lib/credit-ledger";
import { inMemoryLedger } from "./__fixtures__/in-memory-ledger";

vi.mock("@/lib/supabase", async () => {
  const { inMemoryLedger } = await import("./__fixtures__/in-memory-ledger");
  return inMemoryLedger.supabaseFunctions;
});

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

const USER_ID = "33333333-3333-3333-3333-333333333333";
const GENERATION_ID = "gen_test_1";
const CHARGE = { userId: USER_ID, amount: 2, generationId: GENERATION_ID };

describe("credit ledger", () => {
  beforeEach(() => {
    inMemoryLedger.reset();
    inMemoryLedger.setBalance(USER_ID, 5);
  });

  describe("spendCredits", () => {
    it("keeps the Charge and writes a usage row when the work succeeds", async () => {
      const result = await spendCredits(CHARGE, async () => ({
        ok: true,
        value: "design",
      }));

      expect(result).toEqual({ kind: "delivered", value: "design" });
      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(3);
      expect(inMemoryLedger.rowsOf(USER_ID)).toEqual([
        expect.objectContaining({ type: "usage", amount: 2 }),
      ]);
    });

    it("gives the credits back and writes a refund row when the work fails", async () => {
      const result = await spendCredits(CHARGE, async () => ({
        ok: false,
        failure: "no-image",
      }));

      expect(result).toEqual({ kind: "refunded", failure: "no-image" });
      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(5);
      expect(inMemoryLedger.rowsOf(USER_ID)).toEqual([
        expect.objectContaining({ type: "usage", amount: 2 }),
        expect.objectContaining({
          type: "refund",
          amount: 2,
          metadata: { generationId: GENERATION_ID },
        }),
      ]);
    });

    it("gives the credits back when the work throws", async () => {
      const error = new Error("OpenRouter timed out");

      const result = await spendCredits(CHARGE, async () => {
        throw error;
      });

      expect(result).toEqual({ kind: "refunded", failure: { kind: "threw", error } });
      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(5);
      expect(inMemoryLedger.rowsOf(USER_ID, "refund")).toEqual([
        expect.objectContaining({ amount: 2, metadata: { generationId: GENERATION_ID } }),
      ]);
    });

    const OUTAGE = new Error("OpenRouter API error: 502");
    it.each([
      [
        "the work fails",
        async () => ({ ok: false as const, failure: "no-image" }),
        "no-image",
      ],
      [
        "the work throws",
        async () => {
          throw OUTAGE;
        },
        { kind: "threw", error: OUTAGE },
      ],
    ])("never says refunded when the Refund fails after %s", async (_name, work, failure) => {
      inMemoryLedger.failNext("addCredits");

      const result = await spendCredits(CHARGE, work);

      expect(result).toEqual({ kind: "refund-failed", failure });
      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(3);
      expect(inMemoryLedger.rowsOf(USER_ID, "refund")).toEqual([]);
    });

    it("gives the credits back when the usage write throws, without running the work", async () => {
      inMemoryLedger.failNext("createTransaction", "throws");
      const work = vi.fn(async () => ({ ok: true as const, value: "design" }));

      const result = await spendCredits(CHARGE, work);

      expect(result).toMatchObject({ kind: "refunded", failure: { kind: "threw" } });
      expect(work).not.toHaveBeenCalled();
      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(5);
      expect(inMemoryLedger.rowsOf(USER_ID)).toEqual([
        expect.objectContaining({ type: "refund", amount: 2 }),
      ]);
    });

    it("does not charge, write a row or run the work when the usage row cannot be written", async () => {
      inMemoryLedger.refuseNextUsageRow();
      const work = vi.fn(async () => ({ ok: true as const, value: "design" }));

      const result = await spendCredits(CHARGE, work);

      expect(result).toEqual({ kind: "not-charged" });
      expect(work).not.toHaveBeenCalled();
      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(5);
      expect(inMemoryLedger.rowsOf(USER_ID)).toEqual([]);
    });

    it("does not charge, write a row or run the work when the Balance is too low", async () => {
      inMemoryLedger.setBalance(USER_ID, 1);
      const work = vi.fn(async () => ({ ok: true as const, value: "design" }));

      const result = await spendCredits(CHARGE, work);

      expect(result).toEqual({ kind: "not-charged" });
      expect(work).not.toHaveBeenCalled();
      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(1);
      expect(inMemoryLedger.rowsOf(USER_ID)).toEqual([]);
    });

    it("charges only one of two Designs started at once on a Balance of 1", async () => {
      inMemoryLedger.setBalance(USER_ID, 1);
      const charge = { ...CHARGE, amount: 1 };
      const work = async () => ({ ok: true as const, value: "design" });

      const results = await Promise.all([
        spendCredits({ ...charge, generationId: "gen_a" }, work),
        spendCredits({ ...charge, generationId: "gen_b" }, work),
      ]);

      expect(results.map((result) => result.kind).sort()).toEqual(["delivered", "not-charged"]);
      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(0);
      expect(inMemoryLedger.rowsOf(USER_ID, "usage")).toHaveLength(1);
    });
  });

  describe("grantPurchase", () => {
    const PURCHASE = {
      userId: USER_ID,
      paymentId: "pi_test_1",
      credits: 30,
      metadata: { packageId: "growth" },
    };

    it("adds the credits and writes a purchase row", async () => {
      expect(await grantPurchase(PURCHASE)).toBe("granted");

      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(35);
      expect(inMemoryLedger.rowsOf(USER_ID)).toEqual([
        expect.objectContaining({
          type: "purchase",
          amount: 30,
          stripePaymentId: "pi_test_1",
          metadata: { packageId: "growth" },
        }),
      ]);
    });

    it("adds the credits once when the same payment is granted twice", async () => {
      expect(await grantPurchase(PURCHASE)).toBe("granted");
      expect(await grantPurchase(PURCHASE)).toBe("already-granted");

      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(35);
      expect(inMemoryLedger.rowsOf(USER_ID, "purchase")).toHaveLength(1);
    });

    it("reports a failed grant without adding credits", async () => {
      inMemoryLedger.failNext("grantPurchaseCredits");

      expect(await grantPurchase(PURCHASE)).toBe("failed");

      expect(inMemoryLedger.balanceOf(USER_ID)).toBe(5);
      expect(inMemoryLedger.rowsOf(USER_ID)).toEqual([]);
    });
  });
});
