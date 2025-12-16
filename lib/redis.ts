import { Redis } from "@upstash/redis";
import { RATE_LIMIT, RATE_LIMIT_WINDOW } from "@/lib/constants";
import { logger } from "./logger";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error("Missing Upstash Redis environment variables");
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt?: number;
}

export async function checkRateLimit(
  userId: string
): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === "development") {
    return { success: true, remaining: RATE_LIMIT };
  }

  try {
    const key = `rate_limit:${userId}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    const ttl = await redis.ttl(key);
    const resetAt = Date.now() + ttl * 1000;

    if (current > RATE_LIMIT) {
      return {
        success: false,
        remaining: 0,
        resetAt,
      };
    }

    return {
      success: true,
      remaining: RATE_LIMIT - current,
      resetAt,
    };
  } catch (error) {
    console.error("Redis error:", error);
    return {
      success: true,
      remaining: RATE_LIMIT,
    };
  }
}

export async function checkRateLimitByIp(ip: string): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === "development") {
    return { success: true, remaining: -1 };
  }

  try {
    const key = `rate-limit-ip:${ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    const ttl = await redis.ttl(key);

    if (current > RATE_LIMIT) {
      const resetAt = Date.now() + ttl * 1000;
      return {
        success: false,
        remaining: 0,
        resetAt,
      };
    }

    return {
      success: true,
      remaining: RATE_LIMIT - current,
    };
  } catch (error) {
    console.error("IP rate limit check error:", error);
    return {
      success: true,
      remaining: -1,
    };
  }
}

export async function resetRateLimit(userId: string): Promise<boolean> {
  try {
    const key = `rate-limit:${userId}`;
    await redis.del(key);
    return true;
  } catch (error) {
    console.error("Error resetting rate limit:", error);
    return false;
  }
}

export async function getRateLimitStatus(userId: string) {
  try {
    const key = `rate-limit:${userId}`;
    const current = await redis.get<number>(key);
    const ttl = await redis.ttl(key);

    return {
      current: current || 0,
      limit: RATE_LIMIT,
      remaining: Math.max(0, RATE_LIMIT - (current || 0)),
      resetsIn: ttl > 0 ? ttl : 0,
    };
  } catch (error) {
    console.error("Error getting rate limit status:", error);
    return null;
  }
}

// Webhook deduplication (24-hour TTL for webhook event IDs)
const WEBHOOK_DEDUP_TTL = 24 * 60 * 60;

interface WebhookDeduplicationResult {
  isProcessed: boolean;
  message: string;
}

export async function isWebhookProcessed(
  webhookType: "stripe" | "clerk",
  eventId: string
): Promise<boolean> {
  try {
    const key = `webhook:${webhookType}:${eventId}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    logger.warn(
      { err: error, webhookType, eventId },
      "Redis error checking webhook status; allowing processing"
    );
    // On Redis error, allow processing (fail open for webhook safety)
    return false;
  }
}

export async function markWebhookProcessed(
  webhookType: "stripe" | "clerk",
  eventId: string
): Promise<boolean> {
  try {
    const key = `webhook:${webhookType}:${eventId}`;
    await redis.setex(key, WEBHOOK_DEDUP_TTL, "1");
    return true;
  } catch (error) {
    logger.error(
      { err: error, webhookType, eventId },
      "Redis error marking webhook as processed"
    );
    return false;
  }
}

export async function checkAndMarkWebhookProcessed(
  webhookType: "stripe" | "clerk",
  eventId: string
): Promise<WebhookDeduplicationResult> {
  try {
    const key = `webhook:${webhookType}:${eventId}`;

    // Check if already processed
    const exists = await redis.exists(key);
    if (exists) {
      return {
        isProcessed: true,
        message: `Webhook ${webhookType}:${eventId} already processed`,
      };
    }

    // Mark as processed with TTL
    await redis.setex(key, WEBHOOK_DEDUP_TTL, "1");

    return {
      isProcessed: false,
      message: `Webhook ${webhookType}:${eventId} marked for processing`,
    };
  } catch (error) {
    logger.warn(
      { err: error, webhookType, eventId },
      "Redis error checking webhook deduplication; allowing processing"
    );
    // On Redis error, allow processing (fail open for webhook safety)
    return {
      isProcessed: false,
      message: "Redis error, allowing webhook processing",
    };
  }
}