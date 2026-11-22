import {
  addCredits,
  createTransaction,
  deductCreditsWithUsage,
  grantPurchaseCredits,
} from "@/lib/supabase";
import { logger } from "@/lib/logger";

export type Work<T, F> = () => Promise<{ ok: true; value: T } | { ok: false; failure: F }>;

export interface Threw {
  kind: "threw";
  error: unknown;
}

export type Spend<T, F> =
  | { kind: "not-charged" }
  | { kind: "delivered"; value: T }
  | { kind: "refunded"; failure: F | Threw }
  | { kind: "refund-failed"; failure: F | Threw };

export interface Charge {
  userId: string;
  amount: number;
  generationId: string;
}

/**
 * Charges the User and writes the `usage` row in one step (both or neither),
 * then runs the work. Every failure after the Charge (a failed result, or an
 * exception from the work) gets exactly one Refund attempt. An exception from
 * the Charge itself is not caught: nothing was charged, so the caller handles it.
 */
export async function spendCredits<T, F>({
  charge,
  work,
}: {
  charge: Charge;
  work: Work<T, F>;
}): Promise<Spend<T, F>> {
  const charged = await deductCreditsWithUsage({ userId: charge.userId, amount: charge.amount });
  if (!charged) {
    logger.error({ userId: charge.userId }, "[Generate] Failed to deduct credits");
    return { kind: "not-charged" };
  }
  logger.info({ creditCost: charge.amount }, "[Generate] Credits deducted");
  logger.info({}, "[Generate] Transaction recorded");

  let failure: F | Threw;
  try {
    const result = await work();
    if (result.ok) {
      return { kind: "delivered", value: result.value };
    }
    failure = result.failure;
  } catch (error) {
    failure = { kind: "threw", error };
  }

  try {
    await refundCredits({ userId: charge.userId, amount: charge.amount, generationId: charge.generationId });
  } catch {
    return { kind: "refund-failed", failure };
  }
  return { kind: "refunded", failure };
}

export interface PurchaseGrant {
  userId: string;
  paymentId: string;
  credits: number;
  metadata: Record<string, unknown>;
}

/**
 * Adds a purchase's credits and writes its `purchase` row, at most once per
 * payment id (`grant_purchase_credits`, migration 004).
 */
export async function grantPurchase(
  purchase: PurchaseGrant
): Promise<"granted" | "already-granted" | "failed"> {
  const result = await grantPurchaseCredits({
    userId: purchase.userId,
    stripePaymentId: purchase.paymentId,
    credits: purchase.credits,
    metadata: purchase.metadata,
  });
  if (!result) return "failed";
  return result.granted ? "granted" : "already-granted";
}

async function refundCredits({
  userId,
  amount,
  generationId,
}: {
  userId: string;
  amount: number;
  generationId: string | null;
}): Promise<void> {
  const refunded = await addCredits({ userId, amount });
  if (!refunded) {
    throw new Error("Credit refund failed");
  }
  await createTransaction({ userId, type: "refund", amount, metadata: { generationId } });
}
