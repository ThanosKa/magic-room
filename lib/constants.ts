import { RoomType, Theme, ICreditPackage } from "@/types";

// Room types
export const ROOM_TYPES: Record<RoomType, string> = {
  "living-room": "Living Room",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  "dining-room": "Dining Room",
  office: "Office",
  "gaming-room": "Gaming Room",
};

// Design themes
export const THEMES: Record<Theme, string> = {
  modern: "Modern",
  minimalist: "Minimalist",
  scandinavian: "Scandinavian",
  industrial: "Industrial",
  tropical: "Tropical",
  bohemian: "Bohemian",
  vintage: "Vintage",
  luxury: "Luxury",
};

// Credit packages (insert into Supabase after creating Stripe products)
export const CREDIT_PACKAGES: ICreditPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 30,
    priceCents: 999,
    stripePriceId: "price_starter_placeholder",
    active: true,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 150,
    priceCents: 1999,
    stripePriceId: "price_pro_placeholder",
    active: true,
  },
  {
    id: "ultimate",
    name: "Ultimate Pack",
    credits: 300,
    priceCents: 2999,
    stripePriceId: "price_ultimate_placeholder",
    active: true,
  },
];

// Prompt engineering constants
export const POSITIVE_PROMPT = `beautiful interior design, professional photography, well-lit, 
detailed textures, high quality, realistic, modern aesthetic, clean composition`;

export const NEGATIVE_PROMPT = `blurry, distorted, ugly, deformed, low quality, poorly lit, 
cluttered, amateur, watermark, text`;

// Generation settings
export const REPLICATE_MODEL = "rocketdigitalai/interior-design-sdxl-lightning";
export const REPLICATE_MODEL_VERSION = "b1f5a229d5d9a4de53b8e2a1d4e8e8e8";

// Rate limiting
export const RATE_LIMIT_FREE = 5; // requests per hour
export const RATE_LIMIT_PAID = 50; // requests per hour
export const RATE_LIMIT_WINDOW = 3600; // seconds

// File upload settings
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const ACCEPTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];

// UI Colors (purple theme)
export const COLORS = {
  primary: "#8B5CF6",
  light: "#A855F7",
  dark: "#7C3AED",
  white: "#FFFFFF",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  GENERATE: "/api/generate",
  STATUS: "/api/generate/[id]",
  CHECKOUT: "/api/checkout",
  WEBHOOKS: {
    CLERK: "/api/webhooks/clerk",
    STRIPE: "/api/webhooks/stripe",
    REPLICATE: "/api/webhooks/replicate",
  },
} as const;

