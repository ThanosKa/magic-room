import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

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

export async function getUserByClerkId(clerkUserId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) {
    // PGRST116 = no rows returned, expected when user doesn't exist yet
    if (error.code === "PGRST116") {
      return null;
    }
    logger.error({ err: error, clerkUserId }, "Error fetching user");
    return null;
  }

  return data;
}

export async function createUser(
  clerkUserId: string,
  email: string,
  initialCredits: number = 1
) {
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
    logger.error({ err: error, clerkUserId, email }, "Error creating user");
    return null;
  }

  return data;
}

export async function ensureUserExists(clerkUserId: string) {
  const user = await getUserByClerkId(clerkUserId);

  if (user) {
    return user;
  }

  if (process.env.NODE_ENV !== "development") {
    logger.warn(
      { clerkUserId },
      "User not found in production - webhook may have failed"
    );
    return null;
  }

  logger.info(
    { clerkUserId },
    "User not found in dev mode, creating from Clerk API"
  );

  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      logger.error(
        { clerkUserId },
        "No email found for Clerk user - cannot create user"
      );
      return null;
    }

    logger.info({ clerkUserId, email }, "Creating user in dev mode");

    const newUser = await createUser(clerkUserId, email, 1);

    if (newUser) {
      logger.info(
        { clerkUserId, email, userId: newUser.id },
        "User created successfully in dev mode"
      );
    }

    return newUser;
  } catch (error) {
    logger.error({ err: error, clerkUserId }, "Dev mode user creation failed");
    return null;
  }
}

export async function updateUserCredits(userId: string, credits: number) {
  const { data, error } = await supabase
    .from("users")
    .update({ credits })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    logger.error({ err: error, userId, credits }, "Error updating credits");
    return null;
  }

  return data;
}

export async function updateUser(
  clerkUserId: string,
  updates: {
    email?: string;
    name?: string;
    profileImageUrl?: string;
  }
) {
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
      { err: error, clerkUserId, updates },
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

export async function deductCredits(userId: string, amount: number) {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();

  if (fetchError || !user) {
    logger.error({ err: fetchError, userId }, "Error fetching user credits");
    return false;
  }

  if (user.credits < amount) {
    return false;
  }

  const { error } = await supabase
    .from("users")
    .update({ credits: user.credits - amount })
    .eq("id", userId);

  if (error) {
    logger.error({ err: error, userId, amount }, "Error deducting credits");
    return false;
  }

  return true;
}

export async function createTransaction(
  userId: string,
  type: "purchase" | "usage" | "bonus" | "refund",
  amount: number,
  stripePaymentId?: string,
  metadata?: Record<string, unknown>
) {
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

export async function hasRefundForPrediction(
  userId: string,
  predictionId: string
) {
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


export async function deleteImageFromStorage(bucketName: string, path: string) {
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
