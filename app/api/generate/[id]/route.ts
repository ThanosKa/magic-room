import { auth } from "@clerk/nextjs/server";
import {
  createTransaction,
  deleteImageFromStorage,
  getGenerationStatus,
  ensureUserExists,
  hasRefundForPrediction,
  updateGenerationStatus,
  updateUserCredits,
} from "@/lib/supabase";
import { getPredictionStatus } from "@/lib/replicate";
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

function isTerminal(status: IStatusCheckResponse["status"]): boolean {
  return status === "succeeded" || status === "failed" || status === "canceled";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const startTime = Date.now();
  try {
    logger.info({}, "[StatusCheck] GET request received");

    // Verify authentication
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

    // Try to get status from database first
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

    // Ownership check (service role bypasses RLS)
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
      // Avoid leaking that the generation exists
      return new Response(JSON.stringify({ error: "Generation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If status is still processing, optionally fetch from Replicate for real-time updates
    if (
      generation.status === "starting" ||
      generation.status === "processing"
    ) {
      try {
        logger.info(
          { generationId, dbStatus: generation.status },
          "[StatusCheck] Fetching from Replicate"
        );
        const predictionStartTime = Date.now();
        const prediction = await getPredictionStatus(generationId);
        const predictionDuration = Date.now() - predictionStartTime;

        if (prediction) {
          const nextStatus = coerceStatus(prediction.status);
          // Handle both single string output and array of strings
          const nextOutputUrls = prediction.output
            ? Array.isArray(prediction.output)
              ? (prediction.output as string[])
              : [prediction.output as string]
            : undefined;
          const nextError =
            typeof prediction.error === "string"
              ? prediction.error
              : prediction.error
              ? JSON.stringify(prediction.error)
              : undefined;

          logger.info(
            {
              generationId,
              currentStatus: generation.status,
              newStatus: nextStatus,
              outputs: nextOutputUrls?.length || 0,
              duration: predictionDuration,
            },
            "[StatusCheck] Replicate status received"
          );

          const transitionedToTerminal =
            !isTerminal(generation.status) && isTerminal(nextStatus);

          // Persist status/output/error so results survive refresh and side effects can be gated.
          const updated = await updateGenerationStatus(
            generationId,
            nextStatus,
            nextOutputUrls,
            nextError
          );

          // Run side effects on first transition to terminal state.
          if (transitionedToTerminal) {
            if (nextStatus === "succeeded" && generation.image_path) {
              try {
                await deleteImageFromStorage(
                  "room-images",
                  generation.image_path
                );
              } catch (err) {
                logger.warn(
                  { err, generationId, imagePath: generation.image_path },
                  "Failed to delete uploaded image from storage"
                );
              }
            }

            if (nextStatus === "failed") {
              const alreadyRefunded = await hasRefundForPrediction(
                user.id,
                generationId
              );

              if (!alreadyRefunded) {
                const refundAmount = 1;
                const latestUser = await ensureUserExists(userId);
                if (latestUser) {
                  await updateUserCredits(
                    latestUser.id,
                    latestUser.credits + refundAmount
                  );
                  await createTransaction(
                    latestUser.id,
                    "refund",
                    refundAmount,
                    undefined,
                    { predictionId: generationId }
                  );
                }
              }
            }
          }

          const response: IStatusCheckResponse = {
            id: generation.id,
            status: updated?.status ? coerceStatus(updated.status) : nextStatus,
            outputUrls:
              (updated?.output_urls as string[] | undefined) ?? nextOutputUrls,
            error: (updated?.error as string | undefined) ?? nextError,
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
        }
      } catch (error) {
        logger.warn(
          { err: error, generationId },
          "[StatusCheck] Error fetching from Replicate"
        );
        // Fall back to database status
      }
    }

    const response: IStatusCheckResponse = {
      id: generation.id,
      status: generation.status,
      outputUrls: generation.output_urls as string[] | undefined,
      error: generation.error as string | undefined,
    };

    logger.info(
      {
        generationId,
        status: response.status,
        totalDuration: Date.now() - startTime,
      },
      "[StatusCheck] Response sent (cached)"
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
