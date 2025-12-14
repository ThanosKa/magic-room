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

// Upload image via server API endpoint (avoids RLS issues)
export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void,
  bucketName: string = "room-images"
): Promise<{ url: string; path: string }> {
  // Simulate progress updates during upload (client-side only)
  const progressInterval = setInterval(() => {
    if (onProgress) {
      const simulatedProgress = Math.min(90, Math.random() * 80 + 10);
      onProgress(simulatedProgress);
    }
  }, 200);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucketName);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    clearInterval(progressInterval);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    if (onProgress) {
      onProgress(100);
    }

    const data = await response.json();
    return { url: data.url, path: data.path };
  } catch (error) {
    clearInterval(progressInterval);
    console.error(
      "Upload error:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
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
