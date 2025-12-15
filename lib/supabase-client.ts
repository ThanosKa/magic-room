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

/**
 * Convert a File to base64 data URL for direct use with OpenRouter API.
 * This eliminates the need for bucket storage uploads.
 * 
 * @param file - The image file to convert
 * @param onProgress - Optional progress callback (0-100)
 * @returns Promise resolving to base64 data URL
 */
export async function fileToBase64(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadstart = () => {
      onProgress?.(0);
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress?.(progress);
      }
    };

    reader.onload = () => {
      onProgress?.(100);
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as base64"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * @deprecated Use fileToBase64 instead - bucket upload is no longer needed with OpenRouter
 * 
 * Upload image via server API endpoint (avoids RLS issues)
 */
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
