import { RoomType, Theme, ICreditPackage } from "@/types";

export const ROOM_TYPES: Record<RoomType, string> = {
  "living-room": "Living Room",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  "dining-room": "Dining Room",
  office: "Office",
  "gaming-room": "Gaming Room",
  nursery: "Nursery",
  "laundry-room": "Laundry Room",
  basement: "Basement",
  sunroom: "Sunroom",
  "home-theater": "Home Theater",
  mudroom: "Mudroom",
  "walk-in-closet": "Walk-in Closet",
};

export const THEMES: Record<Theme, string> = {
  modern: "Modern",
  minimalist: "Minimalist",
  scandinavian: "Scandinavian",
  industrial: "Industrial",
  tropical: "Tropical",
  bohemian: "Bohemian",
  vintage: "Vintage",
  luxury: "Luxury",
  japandi: "Japandi",
  "art-deco": "Art Deco",
  coastal: "Coastal",
  farmhouse: "Farmhouse",
  mediterranean: "Mediterranean",
  transitional: "Transitional",
};

export const ROOM_TYPE_IDS = [
  "living-room",
  "bedroom",
  "kitchen",
  "bathroom",
  "dining-room",
  "office",
  "gaming-room",
  "nursery",
  "laundry-room",
  "basement",
  "sunroom",
  "home-theater",
  "mudroom",
  "walk-in-closet",
] as const satisfies readonly [RoomType, ...RoomType[]];
export const THEME_IDS = [
  "modern",
  "minimalist",
  "scandinavian",
  "industrial",
  "tropical",
  "bohemian",
  "vintage",
  "luxury",
  "japandi",
  "art-deco",
  "coastal",
  "farmhouse",
  "mediterranean",
  "transitional",
] as const satisfies readonly [Theme, ...Theme[]];

export function isRoomType(value: string): value is RoomType {
  return Object.hasOwn(ROOM_TYPES, value);
}

export function isTheme(value: string): value is Theme {
  return Object.hasOwn(THEMES, value);
}

/** Longest optional note ("customPrompt") the tool and the generate API accept. */
export const NOTE_MAX_LENGTH = 500;

/**
 * The three quality tiers: what each costs in credits and which OpenRouter
 * model makes the image. Ids stay "standard" / "premium" for old data; the
 * names people see are Quick / Pro / Ultra.
 */
export const QUALITY_OPTIONS = {
  standard: {
    id: "standard" as const,
    name: "Quick",
    description: "Fast ideas for your room",
    credits: 1,
    /** How long a design usually takes: sets the wait screen's pace and its note. */
    waitSeconds: 60,
    waitText: "30 to 60 seconds",
    model: "google/gemini-nano-banana-2.1"
  },
  premium: {
    id: "premium" as const,
    name: "Pro",
    description: "A bolder, magazine-style makeover",
    credits: 2,
    waitSeconds: 60,
    waitText: "30 to 60 seconds",
    model: "google/gemini-3-pro-image"
  },
  ultra: {
    id: "ultra" as const,
    name: "Ultra",
    description: "Keeps your room's layout and looks the most real",
    credits: 3,
    waitSeconds: 120,
    waitText: "about 2 minutes",
    model: "openai/gpt-5.4-image-2"
  }
} as const;

export const QUALITY_IDS = ["standard", "premium", "ultra"] as const;

export const CREDIT_PACKAGES: ICreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 20,
    priceCents: 999,
    stripePriceId: process.env.STRIPE_PRICE_STARTER || "",
    active: true,
  },
  {
    id: "growth",
    name: "Growth",
    credits: 60,
    priceCents: 1999,
    stripePriceId: process.env.STRIPE_PRICE_GROWTH || "",
    active: true,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 120,
    priceCents: 2999,
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM || "",
    active: true,
  },
];

/** Credits a new User gets at sign-up (the Free credit), whichever path creates the row. */
export const FREE_SIGNUP_CREDITS = 1;

export const RATE_LIMIT = 100;
export const RATE_LIMIT_WINDOW = 3600;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];

export const API_ENDPOINTS = {
  GENERATE: "/api/generate",
  STATUS: "/api/generate/[id]",
  CHECKOUT: "/api/checkout",
  WEBHOOKS: {
    CLERK: "/api/webhooks/clerk",
    STRIPE: "/api/webhooks/stripe",
  },
} as const;
