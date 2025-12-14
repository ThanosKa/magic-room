import Replicate from "replicate";
import {
  REPLICATE_MODEL,
  REPLICATE_MODEL_VERSION,
  POSITIVE_PROMPT,
  NEGATIVE_PROMPT,
} from "@/lib/constants";
import { logger } from "@/lib/logger";

const replicateToken = process.env.REPLICATE_API_TOKEN;

if (!replicateToken) {
  throw new Error("Missing Replicate API token");
}

export const replicate = new Replicate({
  auth: replicateToken,
});

logger.info(
  { model: REPLICATE_MODEL, version: REPLICATE_MODEL_VERSION },
  "[Replicate] Client initialized"
);

interface PredictionInput {
  image: string;
  prompt: string;
  negative_prompt?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  depth_strength?: number;
}

export async function createPrediction(
  imageUrl: string,
  prompt: string,
  options?: {
    negativePrompt?: string;
    guidanceScale?: number;
    numInferenceSteps?: number;
    depthStrength?: number;
  }
) {
  try {
    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/052f60a9-debd-4801-8b90-8fb2b8f2ca7d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "replicate.ts:44",
        message: "Function entry - Input parameters",
        data: {
          imageUrl: imageUrl,
          promptLength: prompt.length,
          promptPreview: prompt.substring(0, 200),
          options: options,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "B,C",
      }),
    }).catch(() => {});
    // #endregion

    // Model supports 4-8 inference steps (default 6). Clamp to valid range.
    const numInferenceSteps = Math.min(
      8,
      Math.max(4, options?.numInferenceSteps ?? 6)
    );

    const input: PredictionInput = {
      image: imageUrl,
      prompt: prompt,
      negative_prompt: options?.negativePrompt || NEGATIVE_PROMPT,
      guidance_scale: options?.guidanceScale || 7.5,
      num_inference_steps: numInferenceSteps,
      depth_strength: options?.depthStrength ?? 0.8,
    };

    logger.info(
      {
        promptLength: prompt.length,
        steps: numInferenceSteps,
        guidance: input.guidance_scale,
      },
      "[Replicate] Creating prediction"
    );

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/052f60a9-debd-4801-8b90-8fb2b8f2ca7d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "replicate.ts:69",
        message: "Before prediction create - Full input",
        data: {
          model: REPLICATE_MODEL,
          version: REPLICATE_MODEL_VERSION,
          input: input,
          imageUrlLength: imageUrl.length,
          imageUrlPrefix: imageUrl.substring(0, 100),
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "A,B,C,D",
      }),
    }).catch(() => {});
    // #endregion

    const startTime = Date.now();
    const prediction = await replicate.predictions.create({
      version: REPLICATE_MODEL_VERSION,
      input,
    });
    const duration = Date.now() - startTime;

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/052f60a9-debd-4801-8b90-8fb2b8f2ca7d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "replicate.ts:74",
        message: "After prediction create - Full response",
        data: {
          predictionId: prediction.id,
          status: prediction.status,
          urls: prediction.urls,
          logs: prediction.logs,
          error: prediction.error,
          metrics: prediction.metrics,
          version: prediction.version,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "A,B,C,E",
      }),
    }).catch(() => {});
    // #endregion

    logger.info(
      {
        predictionId: prediction.id,
        status: prediction.status,
        duration,
      },
      "[Replicate] Prediction created"
    );

    return prediction;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "[Replicate] Error creating prediction"
    );
    throw error;
  }
}

export async function getPredictionStatus(predictionId: string) {
  try {
    const startTime = Date.now();
    const prediction = await replicate.predictions.get(predictionId);
    const duration = Date.now() - startTime;

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/052f60a9-debd-4801-8b90-8fb2b8f2ca7d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "replicate.ts:102",
        message: "Get prediction status - Full response",
        data: {
          predictionId: predictionId,
          status: prediction.status,
          output: prediction.output,
          error: prediction.error,
          logs: prediction.logs,
          metrics: prediction.metrics,
          startedAt: prediction.started_at,
          completedAt: prediction.completed_at,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "A,B,C,D,E",
      }),
    }).catch(() => {});
    // #endregion

    logger.info(
      {
        predictionId,
        status: prediction.status,
        outputs: prediction.output
          ? Array.isArray(prediction.output)
            ? (prediction.output as string[]).length
            : 1
          : 0,
        duration,
      },
      "[Replicate] Status fetched"
    );

    return prediction;
  } catch (error) {
    logger.error(
      {
        predictionId,
        error: error instanceof Error ? error.message : String(error),
      },
      "[Replicate] Error fetching status"
    );
    throw error;
  }
}

export async function cancelPrediction(predictionId: string) {
  try {
    logger.info({ predictionId }, "[Replicate] Canceling prediction");
    const prediction = await replicate.predictions.cancel(predictionId);
    logger.info(
      { predictionId, status: prediction.status },
      "[Replicate] Prediction canceled"
    );
    return prediction;
  } catch (error) {
    logger.error(
      {
        predictionId,
        error: error instanceof Error ? error.message : String(error),
      },
      "[Replicate] Error canceling prediction"
    );
    throw error;
  }
}

// Build optimized prompt based on room type and theme
export function buildDesignPrompt(
  roomType: string,
  theme: string,
  customPrompt?: string
): string {
  const roomDescriptions: Record<string, string> = {
    "living-room": "a modern living room with comfortable seating",
    bedroom: "a relaxing bedroom with a stylish bed",
    kitchen: "a functional kitchen with modern appliances",
    bathroom: "a clean, bright bathroom",
    "dining-room": "an elegant dining room with a table",
    office: "a productive home office",
    "gaming-room": "a high-tech gaming setup",
  };

  const themeModifiers: Record<string, string> = {
    modern: "contemporary, sleek, minimalist, clean lines",
    minimalist: "minimalist, clutter-free, simple, elegant",
    scandinavian: "Scandinavian design, light wood, cozy, warm",
    industrial: "industrial style, exposed brick, metal, raw",
    tropical: "tropical, vibrant, plants, natural, bright",
    bohemian: "bohemian, eclectic, colorful, artistic",
    vintage: "vintage, retro, antique, nostalgic",
    luxury: "luxury, opulent, premium, sophisticated",
  };

  const roomDesc = roomDescriptions[roomType] || roomType;
  const themeDesc = themeModifiers[theme] || theme;

  let fullPrompt = `${roomDesc} in ${themeDesc} style. ${POSITIVE_PROMPT}`;

  if (customPrompt) {
    fullPrompt = `${roomDesc} in ${themeDesc} style. ${customPrompt}. ${POSITIVE_PROMPT}`;
  }

  return fullPrompt;
}
