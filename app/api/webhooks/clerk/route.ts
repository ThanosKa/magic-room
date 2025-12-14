import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser } from "@/lib/supabase";
import { logger } from "@/lib/logger";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    email_addresses?: Array<{ email_address?: string }>;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isClerkUserCreatedEvent(
  value: unknown
): value is ClerkUserCreatedEvent {
  if (!isRecord(value)) return false;
  if (value["type"] !== "user.created") return false;
  const data = value["data"];
  if (!isRecord(data)) return false;
  return typeof data["id"] === "string";
}

export async function POST(request: Request) {
  // Verify webhook signature
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await request.text();
  const wh = new Webhook(webhookSecret);

  let evt: unknown;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    logger.warn({ err }, "Clerk webhook verification failed");
    return new Response("Webhook verification failed", { status: 400 });
  }

  // Handle user.created event
  if (isClerkUserCreatedEvent(evt)) {
    const { id, email_addresses } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address || "";

    if (!primaryEmail) {
      return new Response("No email found", { status: 400 });
    }

    try {
      await createUser(id, primaryEmail, 1); // 1 free credit
      return new Response("User created successfully", { status: 200 });
    } catch (error) {
      logger.error(
        { err: error, clerkUserId: id },
        "Error creating user in Supabase"
      );
      return new Response("Error creating user", { status: 500 });
    }
  }

  return new Response("Event processed", { status: 200 });
}
