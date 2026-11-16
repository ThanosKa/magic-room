import {
  addCredits,
  createTransaction,
  deductCreditsWithUsage,
  grantPurchaseCredits,
} from "@/lib/supabase";
import { logger } from "@/lib/logger";

/** Paid work. A failure it expects is a result, not an exception. */
export type Work<T, F> = () => Promise<{ ok: true; value: T } | { ok: false; failure: F }>;

/** The work threw instead of returning a result. */
export interface Threw {
  kind: "threw";
  error: unknown;
}

export type Spend<T, F> =
  /** Nothing was charged and no `usage` row written: the Balance was too low, or the database failed. */
  | { kind: "not-charged" }
  /** The work succeeded and the Charge stands. */
  | { kind: "delivered"; value: T }
  /** The work failed, the credits were added back and a `refund` row was written. */
  | { kind: "refunded"; failure: F | Threw }
  /** The work failed and so did the Refund: the caller must never say "refunded". */
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
export async function spendCredits<T, F>(
  charge: Charge,
  work: Work<T, F>
): Promise<Spend<T, F>> {
  const charged = await deductCreditsWithUsage(charge.userId, charge.amount);
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
    await refundCredits(charge.userId, charge.amount, charge.generationId);
  } catch {
    // Not logged here: the caller logs a failed Refund, because the generate
    // route logs it differently after a failed result and after a throw.
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
  const result = await grantPurchaseCredits(
    purchase.userId,
    purchase.paymentId,
    purchase.credits,
    purchase.metadata
  );
  if (!result) return "failed";
  return result.granted ? "granted" : "already-granted";
}

/** Gives back credits taken for a generation that produced nothing. Throws if it could not. */
async function refundCredits(
  userId: string,
  amount: number,
  generationId: string | null
): Promise<void> {
  const refunded = await addCredits(userId, amount);
  if (!refunded) {
    throw new Error("Credit refund failed");
  }
  await createTransaction(userId, "refund", amount, undefined, { generationId });
}
