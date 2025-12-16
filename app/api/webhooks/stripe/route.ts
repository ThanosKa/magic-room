import { parseWebhookEvent } from "@/lib/stripe";
import { CREDIT_PACKAGES } from "@/lib/constants";
import {
  updateUserCredits,
  ensureUserExists,
  createTransaction,
} from "@/lib/supabase";
import { checkAndMarkWebhookProcessed } from "@/lib/redis";
import { logger } from "@/lib/logger";
import type Stripe from "stripe";

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

    // Check for duplicate webhook processing
    const dedupResult = await checkAndMarkWebhookProcessed("stripe", event.id);
    if (dedupResult.isProcessed) {
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

      const userId = session.client_reference_id ?? undefined;
      const packageId = session.metadata?.packageId ?? undefined;

      if (!userId || !packageId) {
        logger.warn(
          { userId, packageId, sessionId: session.id },
          "Missing userId or packageId in Stripe session metadata"
        );
        return new Response("Invalid session metadata", { status: 400 });
      }

      const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
      if (!pkg) {
        logger.warn({ packageId, sessionId: session.id }, "Stripe package not found");
        return new Response("Package not found", { status: 404 });
      }

      const user = await ensureUserExists(userId);
      if (!user) {
        logger.error(
          { userId, sessionId: session.id },
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

      const transactionResult = await createTransaction(
        user.id,
        "purchase",
        pkg.credits,
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined,
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
      }

      logger.info(
        { userId: user.id, packageId, creditsAdded: pkg.credits, sessionId: session.id },
        "Credits added from Stripe checkout"
      );
    }

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
