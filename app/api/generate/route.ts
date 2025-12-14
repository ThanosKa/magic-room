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
  const startTime = Date.now();
  try {
    logger.info({}, "[Generate] POST request received");

    // 1. Verify authentication
    const { userId } = await auth();
    if (!userId) {
      logger.warn({}, "[Generate] Unauthorized - no userId");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    logger.info({ userId }, "[Generate] User authenticated");

    // 2. Parse and validate input
    const body = await request.json();
    const parsed = GenerateSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn(
        { issues: parsed.error.issues },
        "[Generate] Validation failed"
      );
      return new Response(
        JSON.stringify({ error: "Invalid input", issues: parsed.error.issues }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { imageUrl, roomType, theme, customPrompt, imagePath } = parsed.data;
    logger.info(
      { roomType, theme, hasCustomPrompt: !!customPrompt },
      "[Generate] Request validated"
    );

    // 3. Get user and check credits
    const user = await ensureUserExists(userId);
    if (!user) {
      logger.error({ userId }, "[Generate] User not found");
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    logger.info({ credits: user.credits }, "[Generate] User loaded");

    if (user.credits < 1) {
      logger.warn({ credits: user.credits }, "[Generate] Insufficient credits");
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Check rate limiting (simple abuse prevention)
    const rateLimitResult = await checkRateLimit(user.id);
    if (!rateLimitResult.success) {
      logger.warn(
        { remaining: rateLimitResult.remaining },
        "[Generate] Rate limit exceeded"
      );
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: "You're making requests too quickly. Please wait a moment.",
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.resetAt,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    logger.info({}, "[Generate] Rate limit check passed");

    // 5. Build prompt and create Replicate prediction
    const prompt = buildDesignPrompt(roomType, theme, customPrompt);
    logger.info({ promptLength: prompt.length }, "[Generate] Prompt built");

    let prediction;
    try {
      const predictionStartTime = Date.now();
      prediction = await createPrediction(imageUrl, prompt);
      const predictionDuration = Date.now() - predictionStartTime;
      logger.info(
        { predictionId: prediction.id, duration: predictionDuration },
        "[Generate] Prediction created"
      );
    } catch (error) {
      logger.error(
        { err: error, userId, roomType, theme },
        "[Generate] Replicate prediction error"
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
      logger.error({ userId }, "[Generate] Failed to deduct credits");
      return new Response(
        JSON.stringify({ error: "Failed to deduct credits" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    logger.info({}, "[Generate] Credit deducted");

    // Create transaction record
    await createTransaction(user.id, "usage", 1);
    logger.info({}, "[Generate] Transaction recorded");

    // Create generation record
    await createGeneration(user.id, prediction.id, imagePath);
    logger.info(
      { generationId: prediction.id },
      "[Generate] Generation record created"
    );

    const totalDuration = Date.now() - startTime;
    logger.info(
      { predictionId: prediction.id, totalDuration },
      "[Generate] Request complete"
    );

    const response: IGenerateResponse = {
      success: true,
      predictionId: prediction.id,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    logger.error({ err: error, totalDuration }, "[Generate] Route error");
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
