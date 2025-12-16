import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { IGenerateResponse } from "@/types";
import {
  ensureUserExists,
  deductCredits,
  createTransaction,
} from "@/lib/supabase";
import { checkRateLimit } from "@/lib/redis";
import { generateDesign, buildDesignPrompt } from "@/lib/openrouter";
import { logger } from "@/lib/logger";

const GenerateSchema = z.object({
  base64Image: z.string().min(1, "Image is required"),
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
  quality: z.enum(["standard", "premium"]).default("standard"),
  customPrompt: z.string().optional(),
});

export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now();
  let generationId: string | null = null;

  try {
    logger.info({}, "[Generate] POST request received");

    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn({}, "[Generate] Unauthorized - no userId");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    logger.info({ userId: clerkUserId }, "[Generate] User authenticated");

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

    const { base64Image, roomType, theme, quality, customPrompt } = parsed.data;
    const creditCost = quality === "premium" ? 2 : 1;
    logger.info(
      { roomType, theme, quality, creditCost, hasCustomPrompt: !!customPrompt },
      "[Generate] Request validated"
    );

    const user = await ensureUserExists(clerkUserId);
    if (!user) {
      logger.error({ userId: clerkUserId }, "[Generate] User not found");
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    logger.info({ credits: user.credits, required: creditCost }, "[Generate] User loaded");

    if (user.credits < creditCost) {
      logger.warn({ credits: user.credits, required: creditCost }, "[Generate] Insufficient credits");
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const creditDeducted = await deductCredits(user.id, creditCost);
    if (!creditDeducted) {
      logger.error({ userId: user.id }, "[Generate] Failed to deduct credits");
      return new Response(
        JSON.stringify({ error: "Failed to deduct credits" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    logger.info({ creditCost }, "[Generate] Credits deducted");

    await createTransaction(user.id, "usage", creditCost);
    logger.info({}, "[Generate] Transaction recorded");

    generationId = `gen_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const prompt = buildDesignPrompt(roomType, theme, quality, customPrompt);
    logger.info({ promptLength: prompt.length }, "[Generate] Prompt built");

    const generationStartTime = Date.now();
    const result = await generateDesign(base64Image, prompt, quality);
    const generationDuration = Date.now() - generationStartTime;

    logger.info(
      {
        generationId,
        duration: generationDuration,
        imagesCount: result.images.length,
        success: result.success
      },
      "[Generate] OpenRouter generation complete"
    );

    if (!result.success || result.images.length === 0) {
      await createTransaction(user.id, "refund", creditCost, undefined, { generationId });
      const latestUser = await ensureUserExists(clerkUserId);
      if (latestUser) {
        const { updateUserCredits } = await import("@/lib/supabase");
        await updateUserCredits(latestUser.id, latestUser.credits + creditCost);
      }

      logger.warn({ generationId, error: result.error, creditCost }, "[Generate] Generation failed - credits refunded");

      return new Response(
        JSON.stringify({
          error: result.error || "Failed to generate images",
          success: false
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const totalDuration = Date.now() - startTime;
    logger.info(
      { generationId, totalDuration, imagesCount: result.images.length },
      "[Generate] Request complete"
    );

    const response: IGenerateResponse & { outputUrls?: string[] } = {
      success: true,
      predictionId: generationId,
      outputUrls: result.images,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    logger.error({ err: error, totalDuration, generationId }, "[Generate] Route error");

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
