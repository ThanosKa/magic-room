import type { NextConfig } from "next";
import { PRUNED_NOINDEX_PATHS, PRUNED_REDIRECTS } from "./lib/seo/pruned";

const nextConfig: NextConfig = {
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots (generateMetadata output stays in the initial <head>)
  htmlLimitedBots: /.*/,
  // https://nextjs.org/docs/app/api-reference/components/image#qualities (one quality only: each new q on /_next/image is a paid Cloudflare Images transformation)
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
      ...PRUNED_NOINDEX_PATHS.map((path) => ({
        source: path,
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      })),
    ];
  },
  async redirects() {
    return PRUNED_REDIRECTS.map((entry) => ({
      source: entry.path,
      destination: entry.target,
      permanent: true,
    }));
  },
};

export default nextConfig;
