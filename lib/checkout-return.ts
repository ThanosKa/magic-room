/**
 * What the buyer sees when Stripe sends them back to /pricing.
 * The return URLs are set in app/api/checkout/route.ts:
 * `?success=true` after payment, `?success=false` when they cancel.
 */
export type CheckoutReturn = "success" | "cancelled";

export function readCheckoutReturn(params: URLSearchParams): CheckoutReturn | null {
  const value = params.get("success");
  if (value === "true") return "success";
  if (value === "false") return "cancelled";
  return null;
}

interface WaitOptions {
  /** Pause before each re-read. The first read happens straight away. */
  delaysMs?: number[];
  sleep?: (ms: number) => Promise<void>;
  /** Abort when the page goes away, so no reads happen after unmount. */
  signal?: AbortSignal;
}

const sleepFor = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * After a paid return, the Stripe webhook may add the credits a few seconds
 * after the buyer lands. Read the balance now, then again after each delay,
 * and stop as soon as it grows. Resolves with the last balance read.
 */
export async function waitForPurchasedCredits(
  readCredits: () => Promise<number>,
  { delaysMs = [1500, 3000, 5000, 8000], sleep = sleepFor, signal }: WaitOptions = {},
): Promise<number> {
  const first = await readCredits();
  let latest = first;
  for (const delay of delaysMs) {
    await sleep(delay);
    if (signal?.aborted) break;
    latest = await readCredits();
    if (latest > first) break;
  }
  return latest;
}
