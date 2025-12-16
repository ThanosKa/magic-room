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

// Credit packages (Stripe products created and linked)
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

// Rate limiting - simple abuse prevention for credit-based model
export const RATE_LIMIT = 100; // requests per hour (generous, prevents automation)
export const RATE_LIMIT_WINDOW = 3600; // 1 hour window in seconds

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
  },
} as const;
