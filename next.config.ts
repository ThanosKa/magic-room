import type { NextConfig } from "next";
import { PRUNED_NOINDEX_PATHS, PRUNED_REDIRECTS } from "./lib/seo/pruned";

const nextConfig: NextConfig = {
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
