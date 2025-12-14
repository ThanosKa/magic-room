import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser } from "@/lib/supabase";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

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

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as any;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  // Handle user.created event
  if (evt.type === "user.created") {
    const { id, email_addresses } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address || "";

    if (!primaryEmail) {
      return new Response("No email found", { status: 400 });
    }

    try {
      await createUser(id, primaryEmail, 1); // 1 free credit
      return new Response("User created successfully", { status: 200 });
    } catch (error) {
      console.error("Error creating user in Supabase:", error);
      return new Response("Error creating user", { status: 500 });
    }
  }

  return new Response("Event processed", { status: 200 });
}
