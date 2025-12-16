import { parseWebhookEvent } from "@/lib/stripe";
import { CREDIT_PACKAGES } from "@/lib/constants";
import {
  updateUserCredits,
  ensureUserExists,
  getUserById,
  createTransaction,
} from "@/lib/supabase";
import { isWebhookProcessed, markWebhookProcessed } from "@/lib/redis";
import { logger } from "@/lib/logger";
import type Stripe from "stripe";

// Helper to check if a string looks like a UUID
function looksLikeUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Helper to resolve user by identifier (UUID or Clerk ID)
async function resolveUser(identifier: string | undefined) {
  if (!identifier) {
    return null;
  }

  if (looksLikeUuid(identifier)) {
    // Try to fetch by Supabase UUID first
    const user = await getUserById(identifier);
    if (user) {
      return user;
    }
  }

  // Fallback: treat as Clerk ID
  return ensureUserExists(identifier);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      logger.warn("Missing Stripe signature");
      return new Response("Missing signature", { status: 401 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    let event: Stripe.Event;
    try {
      event = parseWebhookEvent(body, signature, webhookSecret);
    } catch (error) {
      logger.warn(
        { err: error },
        "Stripe webhook signature verification failed"
      );
      return new Response("Invalid signature", { status: 401 });
    }

    // Check for duplicate webhook processing (but don't mark yet)
    const isProcessed = await isWebhookProcessed("stripe", event.id);
    if (isProcessed) {
      logger.info({ eventId: event.id, eventType: event.type }, "Duplicate Stripe webhook, skipping");
      return new Response("Webhook already processed", { status: 200 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentStatus = session.payment_status ?? "unpaid";
      const isFreeCheckout = paymentStatus === "no_payment_required";
      const isPaid = paymentStatus === "paid";
      if (!isPaid && !isFreeCheckout) {
        logger.warn(
          { paymentStatus, sessionId: session.id },
          "Checkout session completed but not paid; skipping credit grant"
        );
        return new Response("Session not paid", { status: 200 });
      }

      // Resolve user by looking at metadata.userId or client_reference_id (should be Supabase UUID)
      const rawUserId = session.metadata?.userId ?? session.client_reference_id ?? undefined;
      const packageId = session.metadata?.packageId ?? undefined;

      if (!rawUserId || !packageId) {
        logger.warn(
          { rawUserId, packageId, sessionId: session.id },
          "Missing userId or packageId in Stripe session metadata"
        );
        return new Response("Invalid session metadata", { status: 400 });
      }

      const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
      if (!pkg) {
        logger.warn({ packageId, sessionId: session.id }, "Stripe package not found");
        return new Response("Package not found", { status: 404 });
      }

      // Resolve user: try UUID first, then fallback to Clerk ID
      const user = await resolveUser(rawUserId);
      if (!user) {
        logger.error(
          { rawUserId, sessionId: session.id },
          "Stripe webhook: user not found and could not be created"
        );
        return new Response("User not found", { status: 404 });
      }

      const newCredits = user.credits + pkg.credits;
      const creditsUpdateResult = await updateUserCredits(user.id, newCredits);

      if (!creditsUpdateResult) {
        logger.error(
          { userId: user.id, newCredits, sessionId: session.id },
          "Failed to update user credits"
        );
        return new Response("Failed to update credits", { status: 500 });
      }

      // Use payment_intent if available, else use session.id as the stable idempotency key
      const stripePaymentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.id;

      const transactionResult = await createTransaction(
        user.id,
        "purchase",
        pkg.credits,
        stripePaymentId,
        {
          packageId,
          packageName: pkg.name,
          stripePriceId: undefined,
        }
      );

      if (!transactionResult) {
        logger.warn(
          { userId: user.id, packageId, sessionId: session.id },
          "Failed to record transaction (credits still added)"
        );
        return new Response("Failed to record transaction", { status: 500 });
      }

      // Only mark as processed after credits and transaction are successfully recorded
      await markWebhookProcessed("stripe", event.id);

      logger.info(
        { userId: user.id, packageId, creditsAdded: pkg.credits, sessionId: session.id },
        "Credits added from Stripe checkout"
      );
    }

    // Mark non-checkout events as processed as well (to prevent retries)
    await markWebhookProcessed("stripe", event.id);

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    logger.error(
      {
        err: error,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
      "Stripe webhook error"
    );
    return new Response("Webhook error", { status: 500 });
  }
}
