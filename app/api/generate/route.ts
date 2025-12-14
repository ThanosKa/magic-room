import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { IGenerateRequest, IGenerateResponse } from "@/types";
import {
  ensureUserExists,
  deductCredits,
  createGeneration,
  createTransaction,
} from "@/lib/supabase";
import { checkRateLimit } from "@/lib/redis";
import { createPrediction, buildDesignPrompt } from "@/lib/replicate";
import { logger } from "@/lib/logger";

const GenerateSchema = z.object({
  imageUrl: z.string().url(),
  roomType: z.enum([
    "living-room",
    "bedroom",
    "kitchen",
    "bathroom",
    "dining-room",
    "office",
    "gaming-room",
  ]),
  theme: z.enum([
    "modern",
    "minimalist",
    "scandinavian",
    "industrial",
    "tropical",
    "bohemian",
    "vintage",
    "luxury",
  ]),
  customPrompt: z.string().optional(),
  imagePath: z.string(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    // 1. Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Parse and validate input
    const body = await request.json();
    const parsed = GenerateSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", issues: parsed.error.issues }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { imageUrl, roomType, theme, customPrompt, imagePath } = parsed.data;

    // 3. Get user and check credits
    const user = await ensureUserExists(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.credits < 1) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Check rate limiting
    const rateLimitResult = await checkRateLimit(user.id, user.credits > 30);
    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.resetAt,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 5. Build prompt and create Replicate prediction
    const prompt = buildDesignPrompt(roomType, theme, customPrompt);

    let prediction;
    try {
      prediction = await createPrediction(imageUrl, prompt);
    } catch (error) {
      logger.error(
        { err: error, userId, roomType, theme },
        "Replicate prediction error"
      );
      return new Response(
        JSON.stringify({ error: "Failed to create prediction" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 6. Deduct credit and create generation record
    const creditDeducted = await deductCredits(user.id, 1);
    if (!creditDeducted) {
      return new Response(
        JSON.stringify({ error: "Failed to deduct credits" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create transaction record
    await createTransaction(user.id, "usage", 1);

    // Create generation record
    await createGeneration(user.id, prediction.id, imagePath);

    const response: IGenerateResponse = {
      success: true,
      predictionId: prediction.id,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error({ err: error }, "Generate route error");
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
