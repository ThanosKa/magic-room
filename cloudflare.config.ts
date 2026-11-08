import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "magic-room",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-07",
    // enable_request_signal: request.signal aborts when the client disconnects,
    // which /api/generate uses to stop the AI call and refund the credits.
    compatibilityFlags: ["nodejs_compat", "enable_request_signal"],
    observability: { enabled: true },
    domains: ["magic-room.dev"],
    // Declaring a domain would otherwise switch workers.dev off.
    workersDev: true,
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      // Only declared names reach the Worker's process.env. Values come from
      // .env.<mode>.local locally and from Worker secrets once deployed.
      CLERK_SECRET_KEY: bindings.secret(),
      CLERK_WEBHOOK_SECRET: bindings.secret(),
      LOG_LEVEL: bindings.secret(),
      OPENROUTER_API_KEY: bindings.secret(),
      RESEND_API_KEY: bindings.secret(),
      STRIPE_PRICE_GROWTH: bindings.secret(),
      STRIPE_PRICE_PREMIUM: bindings.secret(),
      STRIPE_PRICE_STARTER: bindings.secret(),
      STRIPE_SECRET_KEY: bindings.secret(),
      STRIPE_WEBHOOK_SECRET: bindings.secret(),
      SUPABASE_SERVICE_ROLE_KEY: bindings.secret(),
      UPSTASH_REDIS_REST_TOKEN: bindings.secret(),
      UPSTASH_REDIS_REST_URL: bindings.secret(),
    },
  }),
});
