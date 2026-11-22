import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { FREE_SIGNUP_CREDITS } from "@/lib/constants";
import type { IUser } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function getUserByClerkId(
  clerkUserId: string
): Promise<IUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    logger.error({ err: error, clerkUserId }, "Error fetching user");
    throw error;
  }

  return data;
}

export async function getUserById(userId: string): Promise<IUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    logger.error({ err: error, userId }, "Error fetching user by id");
    throw error;
  }

  return data;
}

export async function createUser({
  clerkUserId,
  email,
  initialCredits = FREE_SIGNUP_CREDITS,
}: {
  clerkUserId: string;
  email: string;
  initialCredits?: number;
}): Promise<IUser | null> {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        clerk_user_id: clerkUserId,
        email,
        credits: initialCredits,
      },
    ])
    .select()
    .single();

  if (error) {
    logger.error(
      {
        err: error,
        errorCode: error.code,
        errorMessage: error.message,
        clerkUserId,
        email,
      },
      "Error creating user"
    );
    return null;
  }

  return data;
}

export async function ensureUserExists(
  clerkUserId: string
): Promise<IUser | null> {
  const user = await getUserByClerkId(clerkUserId);

  if (user) {
    return user;
  }

  logger.warn(
    { clerkUserId },
    "User missing in Supabase - webhook may have failed, creating from Clerk API"
  );

  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);
    const email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      logger.error(
        { clerkUserId },
        "No email found for Clerk user - cannot create user"
      );
      return null;
    }

    const newUser = await createUser({ clerkUserId, email, initialCredits: FREE_SIGNUP_CREDITS });

    if (newUser) {
      logger.info(
        { clerkUserId, userId: newUser.id },
        "User created from Clerk API fallback"
      );
      return newUser;
    }

  } catch (error) {
    logger.error({ err: error, clerkUserId }, "Fallback user creation failed");
    return null;
  }

  return getUserByClerkId(clerkUserId);
}

export async function updateUser({
  clerkUserId,
  updates,
}: {
  clerkUserId: string;
  updates: {
    email?: string;
    name?: string;
    profileImageUrl?: string;
  };
}): Promise<IUser | null> {
  const updateData: Record<string, unknown> = {};

  if (updates.email !== undefined) {
    updateData.email = updates.email;
  }
  if (updates.name !== undefined) {
    updateData.name = updates.name;
  }
  if (updates.profileImageUrl !== undefined) {
    updateData.profile_image_url = updates.profileImageUrl;
  }

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    logger.error(
      {
        err: error,
        errorCode: error.code,
        errorMessage: error.message,
        clerkUserId,
        updates,
      },
      "Error updating user"
    );
    return null;
  }

  return data;
}

export async function deleteUser(clerkUserId: string) {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("clerk_user_id", clerkUserId);

  if (error) {
    logger.error({ err: error, clerkUserId }, "Error deleting user");
    return false;
  }

  logger.info({ clerkUserId }, "User deleted successfully");
  return true;
}

export async function deductCreditsWithUsage({ userId, amount }: { userId: string; amount: number }) {
  const { data, error } = await supabase.rpc("deduct_credits_with_usage", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) {
    logger.error({ err: error, userId, amount }, "Error deducting credits with usage row");
    return false;
  }

  return data === true;
}

export async function addCredits({ userId, amount }: { userId: string; amount: number }) {
  const { data, error } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) {
    logger.error({ err: error, userId, amount }, "Error adding credits");
    return false;
  }

  return data === true;
}

export async function createTransaction({
  userId,
  type,
  amount,
  stripePaymentId,
  metadata,
}: {
  userId: string;
  type: "purchase" | "usage" | "bonus" | "refund";
  amount: number;
  stripePaymentId?: string;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        user_id: userId,
        type,
        amount,
        stripe_payment_id: stripePaymentId,
        metadata,
      },
    ])
    .select()
    .single();

  if (error) {
    logger.error(
      { err: error, userId, type, amount },
      "Error creating transaction"
    );
    return null;
  }

  return data;
}

export async function grantPurchaseCredits({
  userId,
  stripePaymentId,
  credits,
  metadata,
}: {
  userId: string;
  stripePaymentId: string;
  credits: number;
  metadata: Record<string, unknown>;
}) {
  const { data, error } = await supabase.rpc("grant_purchase_credits", {
    p_user_id: userId,
    p_stripe_payment_id: stripePaymentId,
    p_credits: credits,
    p_metadata: metadata,
  });

  if (error) {
    logger.error(
      { err: error, userId, stripePaymentId, credits },
      "Error granting purchased credits"
    );
    return null;
  }

  return { granted: data === true };
}

export async function hasRefundForPrediction({
  userId,
  predictionId,
}: {
  userId: string;
  predictionId: string;
}) {
  const { data, error } = await supabase
    .from("transactions")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "refund")
    .contains("metadata", { predictionId })
    .limit(1);

  if (error) {
    logger.error(
      { err: error, userId, predictionId },
      "Error checking refund transaction"
    );
    return false;
  }

  return Array.isArray(data) && data.length > 0;
}


export async function deleteImageFromStorage({ bucketName, path }: { bucketName: string; path: string }) {
  const { error } = await supabase.storage.from(bucketName).remove([path]);

  if (error) {
    logger.error(
      { err: error, bucketName, path },
      "Error deleting image from storage"
    );
    return false;
  }

  return true;
}
