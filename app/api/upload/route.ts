import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables in upload API");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucketName = (formData.get("bucket") as string) || "room-images";

    if (!file) {
      logger.error({ bucketName }, "No file provided in upload request");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomStr}-${file.name}`;

    logger.info(
      { fileName, bucketName, fileSize: file.size, fileType: file.type },
      "Starting file upload to Supabase"
    );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || 'image/jpeg',
      });

    if (error) {
      logger.error(
        {
          error: error.message,
          bucketName,
          fileName,
          fileSize: file.size,
          fileType: file.type,
        },
        "Supabase upload failed"
      );
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    logger.info(
      {
        bucketName,
        fileName,
        path: data.path,
        fileSize: file.size,
      },
      "File uploaded successfully to Supabase"
    );

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "Unexpected error during file upload"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
