import Replicate from "replicate";
import {
  REPLICATE_MODEL,
  POSITIVE_PROMPT,
  NEGATIVE_PROMPT,
} from "@/lib/constants";

const replicateToken = process.env.REPLICATE_API_TOKEN;

if (!replicateToken) {
  throw new Error("Missing Replicate API token");
}

export const replicate = new Replicate({
  auth: replicateToken,
});

interface PredictionInput {
  image: string;
  prompt: string;
  negative_prompt?: string;
  guidance_scale?: number;
  num_outputs?: number;
  num_inference_steps?: number;
}

export async function createPrediction(
  imageUrl: string,
  prompt: string,
  webhookUrl: string,
  options?: {
    negativePrompt?: string;
    guidanceScale?: number;
    numOutputs?: number;
    numInferenceSteps?: number;
  }
) {
  try {
    const input: PredictionInput = {
      image: imageUrl,
      prompt: prompt,
      negative_prompt: options?.negativePrompt || NEGATIVE_PROMPT,
      guidance_scale: options?.guidanceScale || 7.5,
      num_outputs: options?.numOutputs || 4,
      num_inference_steps: options?.numInferenceSteps || 50,
    };

    const prediction = await replicate.predictions.create({
      version: "b1f5a229d5d9a4de53b8e2a1d4e8e8e8", // lightning model version
      input,
      webhook: webhookUrl,
      webhook_events_filter: ["start", "completed"],
    });

    return prediction;
  } catch (error) {
    console.error("Error creating prediction:", error);
    throw error;
  }
}

export async function getPredictionStatus(predictionId: string) {
  try {
    const prediction = await replicate.predictions.get(predictionId);
    return prediction;
  } catch (error) {
    console.error("Error fetching prediction status:", error);
    throw error;
  }
}

export async function cancelPrediction(predictionId: string) {
  try {
    const prediction = await replicate.predictions.cancel(predictionId);
    return prediction;
  } catch (error) {
    console.error("Error canceling prediction:", error);
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

