import { parseWebhookEvent } from "@/lib/stripe";
import { CREDIT_PACKAGES } from "@/lib/constants";
import {
  updateUserCredits,
  getUserByClerkId,
  createTransaction,
} from "@/lib/supabase";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature");
      return new Response("Missing signature", { status: 401 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    let event;
    try {
      event = parseWebhookEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return new Response("Invalid signature", { status: 401 });
    }

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.client_reference_id;
      const packageId = session.metadata?.packageId;

      if (!userId || !packageId) {
        console.error("Missing userId or packageId in metadata");
        return new Response("Invalid session metadata", { status: 400 });
      }

      // Find the package to get credits
      const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
      if (!pkg) {
        console.error("Package not found:", packageId);
        return new Response("Package not found", { status: 404 });
      }

      // Get user and update credits
      const user = await getUserByClerkId(userId);
      if (!user) {
        console.error("User not found:", userId);
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
        session.payment_intent,
        {
          packageId,
          packageName: pkg.name,
          stripePriceId: session.line_items?.data?.[0]?.price?.id,
        }
      );

      console.log(`Credits added for user ${userId}: +${pkg.credits}`);
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return new Response("Webhook error", { status: 500 });
  }
}
