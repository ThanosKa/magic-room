import { parseWebhookEvent } from "@/lib/stripe";
import { CREDIT_PACKAGES } from "@/lib/constants";
import {
  updateUserCredits,
  getUserByClerkId,
  createTransaction,
} from "@/lib/supabase";
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

    // Handle checkout.session.completed event
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
          { userId, packageId },
          "Missing userId or packageId in Stripe session metadata"
        );
        return new Response("Invalid session metadata", { status: 400 });
      }

      // Find the package to get credits
      const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
      if (!pkg) {
        logger.warn({ packageId }, "Stripe package not found");
        return new Response("Package not found", { status: 404 });
      }

      // Get user and update credits
      const user = await getUserByClerkId(userId);
      if (!user) {
        logger.warn({ userId }, "Stripe webhook user not found");
        return new Response("User not found", { status: 404 });
      }

      // Add credits to user
      const newCredits = user.credits + pkg.credits;
      await updateUserCredits(user.id, newCredits);

      // Create transaction record
      await createTransaction(
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

      logger.info(
        { userId, packageId, creditsAdded: pkg.credits },
        "Credits added from Stripe checkout"
      );
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Stripe webhook error");
    return new Response("Webhook error", { status: 500 });
  }
}
