export type CheckoutReturn = "success" | "cancelled";

export function readCheckoutReturn(params: URLSearchParams): CheckoutReturn | null {
  const value = params.get("success");
  if (value === "true") return "success";
  if (value === "false") return "cancelled";
  return null;
}

interface WaitOptions {
  readCredits: () => Promise<number>;
  delaysMs?: number[];
  sleep?: (ms: number) => Promise<void>;
  signal?: AbortSignal;
}

const sleepFor = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * After a paid return, the Stripe webhook may add the credits a few seconds
 * after the buyer lands. Reads the balance now, then again after each delay,
 * and stops as soon as it grows. Resolves with the last balance read.
 */
export async function waitForPurchasedCredits({
  readCredits,
  delaysMs = [1500, 3000, 5000, 8000],
  sleep = sleepFor,
  signal,
}: WaitOptions): Promise<number> {
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
