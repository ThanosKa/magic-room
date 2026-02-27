import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: ["/api/", "/generate"] },
            { userAgent: "GPTBot", allow: "/" },
            { userAgent: "ChatGPT-User", allow: "/" },
            { userAgent: "PerplexityBot", allow: "/" },
            { userAgent: "ClaudeBot", allow: "/" },
            { userAgent: "anthropic-ai", allow: "/" },
            { userAgent: "Google-Extended", allow: "/" },
            { userAgent: "Bingbot", allow: "/" },
            { userAgent: "Applebot", allow: "/" },
            { userAgent: "Bytespider", allow: "/" },
            { userAgent: "CCBot", allow: "/" },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
