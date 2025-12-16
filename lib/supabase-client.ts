import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

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

export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void,
  bucketName: string = "room-images"
): Promise<{ url: string; path: string }> {
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

export function getPublicUrl(
  path: string,
  bucketName: string = "room-images"
): string {
  const {
    data: { publicUrl },
  } = supabaseClient.storage.from(bucketName).getPublicUrl(path);

  return publicUrl;
}
