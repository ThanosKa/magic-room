import { Redis } from "@upstash/redis";
import { RATE_LIMIT, RATE_LIMIT_WINDOW } from "@/lib/constants";
import { logger } from "@/lib/logger";

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

/** Throws when Redis cannot be reached. Always allows when NODE_ENV is development. */
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
    logger.error({ err: error }, "Redis error, rate limit unavailable");
    throw error;
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
    logger.error({ err: error }, "IP rate limit check error");
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
    logger.error({ err: error }, "Error resetting rate limit");
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
    logger.error({ err: error }, "Error getting rate limit status");
    return null;
  }
}

const WEBHOOK_DEDUP_TTL = 24 * 60 * 60;

export async function isWebhookProcessed({
  webhookType,
  eventId,
}: {
  webhookType: "stripe" | "clerk";
  eventId: string;
}): Promise<boolean> {
  try {
    const key = `webhook:${webhookType}:${eventId}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    logger.warn(
      { err: error, webhookType, eventId },
      "Redis error checking webhook status; allowing processing"
    );
    return false;
  }
}

export async function markWebhookProcessed({
  webhookType,
  eventId,
}: {
  webhookType: "stripe" | "clerk";
  eventId: string;
}): Promise<boolean> {
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
