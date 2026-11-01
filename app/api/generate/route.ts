import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { IGenerateResponse } from "@/types";
import {
  ensureUserExists,
  deductCredits,
  createTransaction,
  updateUserCredits,
} from "@/lib/supabase";
import { checkRateLimit } from "@/lib/redis";
import { generateDesign, buildDesignPrompt } from "@/lib/openrouter";
import { logger } from "@/lib/logger";
import { NOTE_MAX_LENGTH, QUALITY_IDS, QUALITY_OPTIONS, ROOM_TYPE_IDS, THEME_IDS } from "@/lib/constants";

// Ultra (GPT-5.4 Image 2) takes about 2 minutes; give a design up to 5 before the platform cuts it off.
export const maxDuration = 300;

const GenerateSchema = z.object({
  base64Image: z.string().min(1, "Image is required"),
  roomType: z.enum(ROOM_TYPE_IDS),
  theme: z.enum(THEME_IDS),
  quality: z.enum(QUALITY_IDS).default("standard"),
  customPrompt: z.string().max(NOTE_MAX_LENGTH).optional(),
});

/** Gives back credits taken for a generation that produced nothing. */
async function refundCredits(
  userId: string,
  clerkUserId: string,
  amount: number,
  generationId: string | null
): Promise<void> {
  await createTransaction(userId, "refund", amount, undefined, { generationId });
  const latestUser = await ensureUserExists(clerkUserId);
  if (latestUser) {
    await updateUserCredits(latestUser.id, latestUser.credits + amount);
  }
}

export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now();
  let generationId: string | null = null;
  // Set once credits are taken, so any later failure gives them back.
  let charge: { userId: string; clerkUserId: string; amount: number } | null = null;

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
    const creditCost = QUALITY_OPTIONS[quality].credits;
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
    charge = { userId: user.id, clerkUserId, amount: creditCost };
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
      charge = null;
      await refundCredits(user.id, clerkUserId, creditCost, generationId);

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

    // `success: false` tells the screen the credits were given back.
    if (charge) {
      try {
        await refundCredits(charge.userId, charge.clerkUserId, charge.amount, generationId);
        logger.warn({ generationId, creditCost: charge.amount }, "[Generate] Route error - credits refunded");
        return new Response(
          JSON.stringify({ error: "Failed to generate images", success: false }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      } catch (refundError) {
        logger.error({ err: refundError, generationId }, "[Generate] Refund failed");
      }
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
