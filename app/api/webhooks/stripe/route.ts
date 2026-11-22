import { receiveStripeEvent } from "@/lib/webhook-intake";
import { CREDIT_PACKAGES } from "@/lib/constants";
import { ensureUserExists, getUserById } from "@/lib/supabase";
import { grantPurchase } from "@/lib/credit-ledger";
import { isWebhookProcessed, markWebhookProcessed } from "@/lib/redis";
import { logger } from "@/lib/logger";
import { sendPurchaseEmail } from "@/lib/email";
import { keepAliveUntilSettled } from "@/lib/keep-alive";

function looksLikeUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

async function resolveUser(identifier: string | undefined) {
  if (!identifier) {
    return null;
  }

  if (looksLikeUuid(identifier)) {
    const user = await getUserById(identifier);
    if (user) {
      return user;
    }
  }

  return ensureUserExists(identifier);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const intake = await receiveStripeEvent(request);
    if (!intake.ok) {
      return intake.response;
    }
    const event = intake.event;

    const isProcessed = await isWebhookProcessed({ webhookType: "stripe", eventId: event.id });
    if (isProcessed) {
      logger.info({ eventId: event.id, eventType: event.type }, "Duplicate Stripe webhook, skipping");
      return new Response("Webhook already processed", { status: 200 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
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

      const user = await resolveUser(rawUserId);
      if (!user) {
        logger.error(
          { rawUserId, sessionId: session.id },
          "Stripe webhook: user not found and could not be created"
        );
        return new Response("User not found", { status: 404 });
      }

      const stripePaymentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.id;

      const grant = await grantPurchase({
        userId: user.id,
        paymentId: stripePaymentId,
        credits: pkg.credits,
        metadata: { packageId, packageName: pkg.name },
      });

      if (grant === "failed") {
        logger.error(
          { userId: user.id, packageId, sessionId: session.id },
          "Failed to grant purchased credits"
        );
        return new Response("Failed to grant credits", { status: 500 });
      }

      if (grant === "already-granted") {
        logger.info(
          { userId: user.id, stripePaymentId, sessionId: session.id },
          "Payment already granted, skipping"
        );
        await markWebhookProcessed({ webhookType: "stripe", eventId: event.id });
        return new Response("Payment already granted", { status: 200 });
      }

      const customerEmail =
        session.customer_details?.email ?? session.customer_email ?? user.email;
      if (customerEmail) {
        keepAliveUntilSettled(
          sendPurchaseEmail({
            to: customerEmail,
            packageName: pkg.name,
            credits: pkg.credits,
          }).catch((err) => {
            logger.error({ err, userId: user.id, packageId }, "Failed to send purchase email");
          })
        );
      }

      logger.info(
        { userId: user.id, packageId, creditsAdded: pkg.credits, sessionId: session.id },
        "Credits added from Stripe checkout"
      );
    }

    await markWebhookProcessed({ webhookType: "stripe", eventId: event.id });

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
