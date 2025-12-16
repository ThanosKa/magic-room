import { auth } from "@clerk/nextjs/server";
import {
  getGenerationStatus,
  ensureUserExists,
} from "@/lib/supabase";
import { IStatusCheckResponse } from "@/types";
import { logger } from "@/lib/logger";

const VALID_STATUSES = new Set<IStatusCheckResponse["status"]>([
  "starting",
  "processing",
  "succeeded",
  "failed",
  "canceled",
]);

function coerceStatus(value: unknown): IStatusCheckResponse["status"] {
  if (typeof value !== "string") return "processing";
  if (VALID_STATUSES.has(value as IStatusCheckResponse["status"])) {
    return value as IStatusCheckResponse["status"];
  }
  return "processing";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const startTime = Date.now();
  try {
    logger.info({}, "[StatusCheck] GET request received");

    const { userId } = await auth();
    if (!userId) {
      logger.warn({}, "[StatusCheck] Unauthorized");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id: generationId } = await params;
    logger.info({ generationId }, "[StatusCheck] Checking status");

    const generation = await getGenerationStatus(generationId);
    logger.info(
      { generationId, status: generation?.status },
      "[StatusCheck] DB lookup complete"
    );

    if (!generation) {
      logger.warn({ generationId }, "[StatusCheck] Generation not found in DB");
      return new Response(JSON.stringify({ error: "Generation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await ensureUserExists(userId);
    if (!user) {
      logger.error({ userId }, "[StatusCheck] User not found");
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (generation.user_id !== user.id) {
      logger.warn({ generationId, userId }, "[StatusCheck] Ownership mismatch");
      return new Response(JSON.stringify({ error: "Generation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response: IStatusCheckResponse = {
      id: generation.id,
      status: coerceStatus(generation.status),
      outputUrls: generation.output_urls as string[] | undefined,
      error: generation.error as string | undefined,
    };

    logger.info(
      {
        generationId,
        status: response.status,
        totalDuration: Date.now() - startTime,
      },
      "[StatusCheck] Response sent"
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    logger.error({ err: error, totalDuration }, "[StatusCheck] Route error");
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
