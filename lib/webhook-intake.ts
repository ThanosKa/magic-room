import { Webhook } from "svix";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { z } from "zod";
import { parseWebhookEvent } from "@/lib/stripe";
import { logger } from "@/lib/logger";

/*
 * Webhook intake: the one place that reads a webhook's raw body, verifies its
 * signature and returns either a verified, typed event or a ready rejection.
 *
 * It unifies verification only. The duplicate rules stay in each route because
 * they really differ (Stripe marks after the grant, Clerk marks per event
 * outcome). One shared webhook flow was rejected because the two providers'
 * handling shares nothing past verification; a generic
 * `verifyWebhook(provider, ...)` was rejected because the providers differ in
 * where headers come from, which library checks them and which statuses they
 * answer, so one signature would only hide those differences behind a switch.
 */

export type Intake<E> =
  | { ok: true; event: E; deliveryId: string }
  | { ok: false; response: Response };

const clerkUserDataSchema = z.object({
  id: z.string(),
  email_addresses: z
    .array(z.object({ email_address: z.string().optional().catch(undefined) }))
    .optional()
    .catch(undefined),
  first_name: z.string().nullable().optional().catch(undefined),
  last_name: z.string().nullable().optional().catch(undefined),
  image_url: z.string().nullable().optional().catch(undefined),
});

export type ClerkUserData = z.infer<typeof clerkUserDataSchema>;

export type ClerkEvent =
  | { type: "user.created"; data: ClerkUserData }
  | { type: "user.updated"; data: ClerkUserData }
  | { type: "user.deleted"; data: { id: string } }
  | { type: "other"; rawType: unknown };

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || "";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toClerkEvent(value: unknown): ClerkEvent {
  if (isRecord(value)) {
    const type = value["type"];
    const data = clerkUserDataSchema.safeParse(value["data"]);
    if (
      data.success &&
      (type === "user.created" || type === "user.updated" || type === "user.deleted")
    ) {
      if (type === "user.deleted") {
        return { type, data: { id: data.data.id } };
      }
      return { type, data: data.data };
    }
  }
  return { type: "other", rawType: isRecord(value) ? value["type"] : "unknown" };
}

export async function receiveStripeEvent(
  request: Request
): Promise<Intake<Stripe.Event>> {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    logger.warn("Missing Stripe signature");
    return {
      ok: false,
      response: new Response("Missing signature", { status: 401 }),
    };
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

  try {
    const event = await parseWebhookEvent({ body, signature, secret });
    return { ok: true, event, deliveryId: event.id };
  } catch (error) {
    logger.warn({ err: error }, "Stripe webhook signature verification failed");
    return {
      ok: false,
      response: new Response("Invalid signature", { status: 401 }),
    };
  }
}

export async function receiveClerkEvent(
  request: Request
): Promise<Intake<ClerkEvent>> {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    logger.warn("Missing svix headers in Clerk webhook");
    return {
      ok: false,
      response: new Response("Missing svix headers", { status: 400 }),
    };
  }

  const body = await request.text();
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let verified: unknown;
  try {
    verified = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    logger.warn({ err }, "Clerk webhook verification failed");
    return {
      ok: false,
      response: new Response("Webhook verification failed", { status: 400 }),
    };
  }

  return { ok: true, event: toClerkEvent(verified), deliveryId: svixId };
}
