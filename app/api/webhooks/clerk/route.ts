import { Webhook } from "svix";
import { headers } from "next/headers";
import {
  createUser,
  getUserByClerkId,
  updateUser,
  deleteUser,
} from "@/lib/supabase";
import { checkAndMarkWebhookProcessed } from "@/lib/redis";
import { logger } from "@/lib/logger";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    email_addresses?: Array<{ email_address?: string }>;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
}

interface ClerkUserUpdatedEvent {
  type: "user.updated";
  data: {
    id: string;
    email_addresses?: Array<{ email_address?: string }>;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
}

interface ClerkUserDeletedEvent {
  type: "user.deleted";
  data: {
    id: string;
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

function isClerkUserUpdatedEvent(
  value: unknown
): value is ClerkUserUpdatedEvent {
  if (!isRecord(value)) return false;
  if (value["type"] !== "user.updated") return false;
  const data = value["data"];
  if (!isRecord(data)) return false;
  return typeof data["id"] === "string";
}

function isClerkUserDeletedEvent(
  value: unknown
): value is ClerkUserDeletedEvent {
  if (!isRecord(value)) return false;
  if (value["type"] !== "user.deleted") return false;
  const data = value["data"];
  if (!isRecord(data)) return false;
  return typeof data["id"] === "string";
}

function buildFullName(
  firstName?: string | null,
  lastName?: string | null
): string | undefined {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export async function POST(request: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    logger.warn("Missing svix headers in Clerk webhook");
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
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address || "";

    if (!primaryEmail) {
      logger.warn({ clerkUserId: id }, "No email found in Clerk webhook");
      return new Response("No email found", { status: 400 });
    }

    try {
      const existingUser = await getUserByClerkId(id);

      if (existingUser) {
        logger.info(
          { clerkUserId: id, email: primaryEmail },
          "User already exists, skipping creation"
        );
        // Mark as processed since this is duplicate
        await checkAndMarkWebhookProcessed("clerk", svixId);
        return new Response("User already exists", { status: 200 });
      }

      const fullName = buildFullName(first_name, last_name);
      const newUser = await createUser(id, primaryEmail, 1);

      if (!newUser) {
        logger.error(
          { clerkUserId: id, email: primaryEmail },
          "Failed to create user in Supabase"
        );
        return new Response("Error creating user", { status: 500 });
      }

      // Update with additional metadata if available
      if (fullName || image_url) {
        await updateUser(id, {
          name: fullName,
          profileImageUrl: image_url || undefined,
        });
      }

      // Mark as processed AFTER successful database operations
      await checkAndMarkWebhookProcessed("clerk", svixId);

      logger.info(
        { clerkUserId: id, email: primaryEmail, userId: newUser.id },
        "User created successfully via webhook"
      );
      return new Response("User created successfully", { status: 200 });
    } catch (error) {
      logger.error(
        { err: error, clerkUserId: id },
        "Error creating user in Supabase"
      );
      return new Response("Error creating user", { status: 500 });
    }
  }

  // Handle user.updated event
  if (isClerkUserUpdatedEvent(evt)) {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      const existingUser = await getUserByClerkId(id);

      if (!existingUser) {
        logger.warn(
          { clerkUserId: id },
          "User not found for update in Supabase"
        );
        return new Response("User not found", { status: 404 });
      }

      const primaryEmail = email_addresses?.[0]?.email_address;
      const fullName = buildFullName(first_name, last_name);

      const updates = {
        ...(primaryEmail && { email: primaryEmail }),
        ...(fullName && { name: fullName }),
        ...(image_url && { profileImageUrl: image_url }),
      };

      if (Object.keys(updates).length > 0) {
        const updatedUser = await updateUser(id, updates);

        if (!updatedUser) {
          logger.error(
            { clerkUserId: id, updates, err: "updateUser returned null" },
            "Failed to update user in Supabase"
          );
          return new Response("Error updating user", { status: 500 });
        }

        logger.info(
          { clerkUserId: id, updates },
          "User updated successfully via webhook"
        );
      } else {
        logger.info(
          { clerkUserId: id },
          "User update event with no changes to sync"
        );
      }

      // Mark as processed AFTER successful database operations
      await checkAndMarkWebhookProcessed("clerk", svixId);

      return new Response("User updated successfully", { status: 200 });
    } catch (error) {
      logger.error(
        { err: error, clerkUserId: id },
        "Error updating user in Supabase"
      );
      return new Response("Error updating user", { status: 500 });
    }
  }

  // Handle user.deleted event
  if (isClerkUserDeletedEvent(evt)) {
    const { id } = evt.data;

    try {
      const existingUser = await getUserByClerkId(id);

      if (!existingUser) {
        logger.info(
          { clerkUserId: id },
          "User already deleted or never created in Supabase"
        );
        // Mark as processed since this is idempotent
        await checkAndMarkWebhookProcessed("clerk", svixId);
        return new Response("User already deleted", { status: 200 });
      }

      const deleted = await deleteUser(id);

      if (!deleted) {
        logger.error({ clerkUserId: id }, "Failed to delete user in Supabase");
        return new Response("Error deleting user", { status: 500 });
      }

      // Mark as processed AFTER successful database operations
      await checkAndMarkWebhookProcessed("clerk", svixId);

      logger.info({ clerkUserId: id }, "User deleted successfully via webhook");
      return new Response("User deleted successfully", { status: 200 });
    } catch (error) {
      logger.error(
        { err: error, clerkUserId: id },
        "Error deleting user in Supabase"
      );
      return new Response("Error deleting user", { status: 500 });
    }
  }

  // Unknown event type - return 200 to prevent retry
  logger.info(
    { eventType: isRecord(evt) ? evt["type"] : "unknown" },
    "Unknown Clerk webhook event type, ignoring"
  );
  return new Response("Event processed", { status: 200 });
}
