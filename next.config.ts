import type { NextConfig } from "next";
import { PRUNED_NOINDEX_PATHS, PRUNED_REDIRECTS } from "./lib/seo/pruned";

const nextConfig: NextConfig = {
  // Keeps generateMetadata output in the initial <head>; vinext otherwise
  // streams it into the body.
  htmlLimitedBots: /.*/,
  // One quality only. vinext otherwise accepts any q from 1 to 100 on
  // /_next/image, and each new value is a paid Cloudflare Images transformation.
  images: { qualities: [75] },
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "thread-stream",
    "sonic-boom",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Reversible pruning (lib/seo/pruned.ts): one header rule per noindex path.
      ...PRUNED_NOINDEX_PATHS.map((path) => ({
        source: path,
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      })),
    ];
  },
  async redirects() {
    // permanent: true => HTTP 308.
    return PRUNED_REDIRECTS.map((entry) => ({
      source: entry.path,
      destination: entry.target,
      permanent: true,
    }));
  },
};

export default nextConfig;
