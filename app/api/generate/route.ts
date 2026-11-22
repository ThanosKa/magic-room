import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { IGenerateResponse } from "@/types";
import { ensureUserExists } from "@/lib/supabase";
import { spendCredits } from "@/lib/credit-ledger";
import { checkRateLimit } from "@/lib/redis";
import { designRoom } from "@/lib/room-designer";
import { keepAliveUntilSettled } from "@/lib/keep-alive";
import { logger } from "@/lib/logger";
import { NOTE_MAX_LENGTH, QUALITY_IDS, QUALITY_OPTIONS, ROOM_TYPE_IDS, THEME_IDS } from "@/lib/constants";

interface NoImage {
  kind: "no-image";
  message?: string;
}

const GenerateSchema = z.object({
  base64Image: z.string().min(1, "Image is required"),
  roomType: z.enum(ROOM_TYPE_IDS),
  theme: z.enum(THEME_IDS),
  quality: z.enum(QUALITY_IDS).default("standard"),
  customPrompt: z.string().max(NOTE_MAX_LENGTH).optional(),
});

export async function POST(request: Request): Promise<Response> {
  const handled = handleGenerate(request);
  keepAliveUntilSettled(handled);
  return handled;
}

async function handleGenerate(request: Request): Promise<Response> {
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

    const designId = `gen_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    generationId = designId;

    const spend = await spendCredits<string[], NoImage>({
      charge: { userId: user.id, amount: creditCost, generationId: designId },
      work: async () => {
        const design = await designRoom({
          req: { photo: base64Image, roomType, theme, quality, note: customPrompt },
          signal: request.signal,
        });
        if (design.ok) return { ok: true, value: design.images };
        if (design.failure.kind === "provider-error") throw design.failure.cause;
        return { ok: false, failure: design.failure };
      },
    });

    switch (spend.kind) {
      case "not-charged":
        return new Response(
          JSON.stringify({ error: "Failed to deduct credits" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );

      case "delivered": {
        const totalDuration = Date.now() - startTime;
        logger.info(
          { generationId: designId, totalDuration, imagesCount: spend.value.length },
          "[Generate] Request complete"
        );

        const response: IGenerateResponse = {
          success: true,
          predictionId: designId,
          outputUrls: spend.value,
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "refunded": {
        const { failure } = spend;
        if (failure.kind === "threw") {
          logRouteError({ startTime, generationId: designId, err: failure.error });
          logger.warn({ generationId: designId, creditCost }, "[Generate] Route error - credits refunded");
          return new Response(
            JSON.stringify({ error: "Failed to generate images", success: false }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        logger.warn(
          { generationId: designId, error: failure.message, creditCost },
          "[Generate] Generation failed - credits refunded"
        );
        return new Response(
          JSON.stringify({
            error: failure.message || "Failed to generate images",
            success: false
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      case "refund-failed": {
        const { failure } = spend;
        if (failure.kind === "threw") {
          logRouteError({ startTime, generationId: designId, err: failure.error });
          logger.error({ generationId: designId }, "[Generate] Refund failed");
        } else {
          logRouteError({ startTime, generationId: designId });
        }
        return internalServerError();
      }
    }
  } catch (error) {
    logRouteError({ startTime, generationId, err: error });
    return internalServerError();
  }
}

function logRouteError({
  startTime,
  generationId,
  err,
}: {
  startTime: number;
  generationId: string | null;
  err?: unknown;
}): void {
  const totalDuration = Date.now() - startTime;
  logger.error({ err, totalDuration, generationId }, "[Generate] Route error");
}

function internalServerError(): Response {
  return new Response(JSON.stringify({ error: "Internal server error" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
