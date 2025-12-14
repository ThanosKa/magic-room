import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Client-side Supabase client with limited permissions
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Upload image to Supabase Storage
export async function uploadImage(
  file: File,
  bucketName: string = "room-images"
): Promise<{ url: string; path: string } | null> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomStr}-${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseClient.storage.from(bucketName).getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Unexpected error uploading image:", error);
    return null;
  }
}

// Get public URL for an uploaded file
export function getPublicUrl(
  path: string,
  bucketName: string = "room-images"
): string {
  const {
    data: { publicUrl },
  } = supabaseClient.storage.from(bucketName).getPublicUrl(path);

  return publicUrl;
}
