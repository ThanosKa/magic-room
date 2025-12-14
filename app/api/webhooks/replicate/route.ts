import crypto from "crypto";
import { IReplicateWebhookPayload } from "@/types";
import {
  updateGenerationStatus,
  getGenerationStatus,
  updateUserCredits,
  getUserByClerkId,
  createTransaction,
  deleteImageFromStorage,
} from "@/lib/supabase";

const webhookSecret = process.env.REPLICATE_WEBHOOK_SECRET || "";

function verifySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Verify webhook signature
    const signature = request.headers.get("x-replicate-signature");
    if (!signature) {
      console.error("Missing webhook signature");
      return new Response("Missing signature", { status: 401 });
    }

    const body = await request.text();

    if (!verifySignature(body, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const payload: IReplicateWebhookPayload = JSON.parse(body);
    const { id, status, output, error } = payload;

    // Get the generation record to find the user and image path
    const generation = await getGenerationStatus(id);
    if (!generation) {
      console.error("Generation not found:", id);
      return new Response("Generation not found", { status: 404 });
    }

    // Update generation status in database
    const outputUrls = Array.isArray(output) ? output : undefined;
    await updateGenerationStatus(id, status, outputUrls, error || undefined);

    // Handle success - delete the original image from storage
    if (status === "succeeded" && generation.image_path) {
      try {
        await deleteImageFromStorage("room-images", generation.image_path);
      } catch (err) {
        console.error("Error deleting image from storage:", err);
        // Continue anyway - deletion is not critical
      }
    }

    // Handle failure - refund credits
    if (status === "failed") {
      const refundAmount = 1;
      const user = await getUserByClerkId(generation.user_id);

      if (user) {
        // Add credits back
        await updateUserCredits(user.id, user.credits + refundAmount);

        // Create refund transaction
        await createTransaction(user.id, "refund", refundAmount);
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook error", { status: 500 });
  }
}
