import Stripe from "stripe";
import { logger } from "@/lib/logger";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing Stripe secret key");
}

export const stripe = new Stripe(stripeSecretKey);

export async function createCheckoutSession(
  userId: string,
  packageId: string,
  stripePriceId: string,
  successUrl: string,
  cancelUrl: string,
  customerEmail?: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      customer_email: customerEmail,
      metadata: {
        userId,
        packageId,
      },
    });

    return session;
  } catch (error) {
    logger.error({ err: error }, "Error creating checkout session");
    throw error;
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    logger.error({ err: error }, "Error retrieving checkout session");
    throw error;
  }
}

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    stripe.webhooks.constructEvent(body, signature, secret);
    return true;
  } catch (error) {
    logger.warn({ err: error }, "Webhook signature verification failed");
    return false;
  }
}

export function parseWebhookEvent(
  body: string,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(body, signature, secret);
}

