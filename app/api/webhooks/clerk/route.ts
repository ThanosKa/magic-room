import {
  createUser,
  getUserByClerkId,
  updateUser,
  deleteUser,
} from "@/lib/supabase";
import { markWebhookProcessed } from "@/lib/redis";
import { logger } from "@/lib/logger";
import { sendWelcomeEmail } from "@/lib/email";
import { keepAliveUntilSettled } from "@/lib/keep-alive";
import { receiveClerkEvent } from "@/lib/webhook-intake";

function buildFullName(
  firstName?: string | null,
  lastName?: string | null
): string | undefined {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export async function POST(request: Request) {
  const intake = await receiveClerkEvent(request);
  if (!intake.ok) return intake.response;
  const { event: evt, deliveryId: svixId } = intake;

  // Handle user.created event
  if (evt.type === "user.created") {
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
          { clerkUserId: id },
          "User already exists, skipping creation"
        );
        // Mark as processed since this is duplicate
        await markWebhookProcessed("clerk", svixId);
        return new Response("User already exists", { status: 200 });
      }

      const fullName = buildFullName(first_name, last_name);
      const newUser = await createUser(id, primaryEmail, 1);

      if (!newUser) {
        logger.error(
          { clerkUserId: id },
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
      await markWebhookProcessed("clerk", svixId);

      // Sent after the answer (waitUntil on Workers), so a slow Resend cannot
      // delay Clerk's 200. A failed email is only logged: it must not fail the webhook.
      keepAliveUntilSettled(
        sendWelcomeEmail({
          to: primaryEmail,
          firstName: first_name,
          lastName: last_name,
        }).catch((err) => {
          logger.error({ err, userId: newUser.id }, "Failed to send welcome email");
        })
      );

      logger.info(
        { clerkUserId: id, userId: newUser.id },
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
  if (evt.type === "user.updated") {
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
            { clerkUserId: id, fields: Object.keys(updates), err: "updateUser returned null" },
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
      await markWebhookProcessed("clerk", svixId);

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
  if (evt.type === "user.deleted") {
    const { id } = evt.data;

    try {
      const existingUser = await getUserByClerkId(id);

      if (!existingUser) {
        logger.info(
          { clerkUserId: id },
          "User already deleted or never created in Supabase"
        );
        // Mark as processed since this is idempotent
        await markWebhookProcessed("clerk", svixId);
        return new Response("User already deleted", { status: 200 });
      }

      const deleted = await deleteUser(id);

      if (!deleted) {
        logger.error({ clerkUserId: id }, "Failed to delete user in Supabase");
        return new Response("Error deleting user", { status: 500 });
      }

      // Mark as processed AFTER successful database operations
      await markWebhookProcessed("clerk", svixId);

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
    { eventType: evt.rawType },
    "Unknown Clerk webhook event type, ignoring"
  );
  return new Response("Event processed", { status: 200 });
}
