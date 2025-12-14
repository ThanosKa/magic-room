import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

// Server-side client with service role permissions
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper functions for common operations
export async function getUserByClerkId(clerkUserId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
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
    console.error("Error creating user:", error);
    return null;
  }

  return data;
}

export async function updateUserCredits(userId: string, credits: number) {
  const { data, error } = await supabase
    .from("users")
    .update({ credits })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating credits:", error);
    return null;
  }

  return data;
}

export async function deductCredits(userId: string, amount: number) {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();

  if (fetchError || !user) {
    console.error("Error fetching user credits:", fetchError);
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
    console.error("Error deducting credits:", error);
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
    console.error("Error creating transaction:", error);
    return null;
  }

  return data;
}

export async function createGeneration(
  userId: string,
  predictionId: string,
  imagePath: string
) {
  const { data, error } = await supabase
    .from("generations")
    .insert([
      {
        id: predictionId,
        user_id: userId,
        status: "starting",
        image_path: imagePath,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating generation record:", error);
    return null;
  }

  return data;
}

export async function updateGenerationStatus(
  predictionId: string,
  status: string,
  outputUrls?: string[],
  error?: string
) {
  const updateData: Record<string, unknown> = {
    status,
  };

  if (outputUrls) {
    updateData.output_urls = outputUrls;
  }

  if (error) {
    updateData.error = error;
  }

  if (status === "succeeded" || status === "failed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error: updateError } = await supabase
    .from("generations")
    .update(updateData)
    .eq("id", predictionId)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating generation status:", updateError);
    return null;
  }

  return data;
}

export async function getGenerationStatus(predictionId: string) {
  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("id", predictionId)
    .single();

  if (error) {
    console.error("Error fetching generation status:", error);
    return null;
  }

  return data;
}

export async function deleteImageFromStorage(bucketName: string, path: string) {
  const { error } = await supabase.storage.from(bucketName).remove([path]);

  if (error) {
    console.error("Error deleting image from storage:", error);
    return false;
  }

  return true;
}

