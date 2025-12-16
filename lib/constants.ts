import { RoomType, Theme, ICreditPackage } from "@/types";

export const ROOM_TYPES: Record<RoomType, string> = {
  "living-room": "Living Room",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  "dining-room": "Dining Room",
  office: "Office",
  "gaming-room": "Gaming Room",
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
};

export const QUALITY_OPTIONS = {
  standard: {
    id: "standard" as const,
    label: "Standard Quality",
    description: "Quick generation",
    credits: 1,
    model: "google/gemini-2.5-flash-image"
  },
  premium: {
    id: "premium" as const,
    label: "Premium Quality",
    description: "Higher quality redesign",
    credits: 2,
    model: "google/gemini-3-pro-image-preview"
  }
} as const;

export const CREDIT_PACKAGES: ICreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 30,
    priceCents: 999,
    stripePriceId: process.env.STRIPE_PRICE_STARTER || "",
    active: true,
  },
  {
    id: "growth",
    name: "Growth",
    credits: 150,
    priceCents: 1999,
    stripePriceId: process.env.STRIPE_PRICE_GROWTH || "",
    active: true,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 300,
    priceCents: 2999,
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM || "",
    active: true,
  },
];

export const RATE_LIMIT = 100;
export const RATE_LIMIT_WINDOW = 3600;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];

export const COLORS = {
  primary: "#8B5CF6",
  light: "#A855F7",
  dark: "#7C3AED",
  white: "#FFFFFF",
} as const;

export const API_ENDPOINTS = {
  GENERATE: "/api/generate",
  STATUS: "/api/generate/[id]",
  CHECKOUT: "/api/checkout",
  WEBHOOKS: {
    CLERK: "/api/webhooks/clerk",
    STRIPE: "/api/webhooks/stripe",
  },
} as const;
