import { describe, it, expect } from "vitest";
import { readCheckoutReturn, waitForPurchasedCredits } from "@/lib/checkout-return";

/**
 * Stripe sends the buyer back to /pricing?success=true (paid) or
 * /pricing?success=false (cancelled), see app/api/checkout/route.ts.
 */

function returnFrom(href: string) {
  return readCheckoutReturn(new URL(href, "https://magic-room.test").searchParams);
}

describe("readCheckoutReturn", () => {
  it("reads a paid checkout", () => {
    expect(returnFrom("/pricing?success=true")).toBe("success");
  });

  it("reads a cancelled checkout", () => {
    expect(returnFrom("/pricing?success=false")).toBe("cancelled");
  });

  it("shows nothing on a plain visit or an unknown value", () => {
    expect(returnFrom("/pricing")).toBeNull();
    expect(returnFrom("/pricing?success=maybe")).toBeNull();
    expect(returnFrom("/pricing?utm_source=newsletter")).toBeNull();
  });
});

/**
 * Credits are added by the Stripe webhook, which can land a few seconds after
 * the buyer is back on /pricing. The page re-reads the balance until it grows.
 */
describe("waitForPurchasedCredits", () => {
  const noWait = async () => {};

  function balances(...values: number[]) {
    const calls: number[] = [];
    const read = async () => {
      const value = values[Math.min(calls.length, values.length - 1)];
      calls.push(value);
      return value;
    };
    return { read, calls };
  }

  it("keeps reading until the webhook has added the credits", async () => {
    const { read, calls } = balances(50, 50, 140, 140);
    const result = await waitForPurchasedCredits(read, { delaysMs: [1, 1, 1, 1, 1], sleep: noWait });
    expect(result).toBe(140);
    expect(calls).toEqual([50, 50, 140]);
  });

  it("gives up after its last re-read when the balance never grows", async () => {
    const { read, calls } = balances(50);
    const result = await waitForPurchasedCredits(read, { delaysMs: [1, 1, 1], sleep: noWait });
    expect(result).toBe(50);
    expect(calls).toHaveLength(4);
  });

  it("stops reading once the buyer leaves the page", async () => {
    const { read, calls } = balances(50);
    const leave = new AbortController();
    const sleep = async () => leave.abort();
    await waitForPurchasedCredits(read, { delaysMs: [1, 1, 1], sleep, signal: leave.signal });
    expect(calls).toHaveLength(1);
  });
});
