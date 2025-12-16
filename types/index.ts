export type RoomType =
  | "living-room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "dining-room"
  | "office"
  | "gaming-room";

export type Theme =
  | "modern"
  | "minimalist"
  | "scandinavian"
  | "industrial"
  | "tropical"
  | "bohemian"
  | "vintage"
  | "luxury";

export interface IDesignOptions {
  roomType: RoomType;
  theme: Theme;
  customPrompt?: string;
  imageUrl: string;
}

export interface IGenerationResult {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  outputUrls?: string[];
  error?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface IUser {
  id: string;
  clerkUserId: string;
  email: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITransaction {
  id: string;
  userId: string;
  type: "purchase" | "usage" | "bonus" | "refund";
  amount: number;
  stripePaymentId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ICreditPackage {
  id: string;
  name: string;
  credits: number;
  priceCents: number;
  stripePriceId: string;
  active: boolean;
}

export interface IGenerateRequest {
  imageUrl: string;
  roomType: RoomType;
  theme: Theme;
  customPrompt?: string;
}

export interface IGenerateResponse {
  success: boolean;
  predictionId?: string;
  error?: string;
}

export interface IStatusCheckResponse {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  outputUrls?: string[];
  error?: string;
}

export interface ICheckoutResponse {
  url?: string;
  sessionId?: string;
  error?: string;
}

export interface IStripeWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      customer: string;
      payment_intent: string;
      metadata?: Record<string, string>;
    };
  };
}
 
