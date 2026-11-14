import { addCredits, createTransaction } from "@/lib/supabase";

/** Gives back credits taken for a generation that produced nothing. Throws if it could not. */
export async function refundCredits(
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
