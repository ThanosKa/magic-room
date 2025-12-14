import { Redis } from "@upstash/redis";
import {
  RATE_LIMIT_FREE,
  RATE_LIMIT_PAID,
  RATE_LIMIT_WINDOW,
} from "@/lib/constants";

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

// Check rate limit for a user
export async function checkRateLimit(
  userId: string,
  isPaid: boolean = false
): Promise<RateLimitResult> {
  try {
    const key = `rate-limit:${userId}`;
    const limit = isPaid ? RATE_LIMIT_PAID : RATE_LIMIT_FREE;

    // Get current count
    const current = await redis.incr(key);

    // Set expiration on first request
    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    // Get TTL for reset time
    const ttl = await redis.ttl(key);

    if (current > limit) {
      const resetAt = Date.now() + ttl * 1000;
      return {
        success: false,
        remaining: 0,
        resetAt,
      };
    }

    return {
      success: true,
      remaining: limit - current,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Allow on error to prevent blocking
    return {
      success: true,
      remaining: -1,
    };
  }
}

// Check rate limit by IP (fallback for unauthenticated requests)
export async function checkRateLimitByIp(ip: string): Promise<RateLimitResult> {
  try {
    const key = `rate-limit-ip:${ip}`;
    const limit = RATE_LIMIT_FREE; // IP-based is always free tier

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    const ttl = await redis.ttl(key);

    if (current > limit) {
      const resetAt = Date.now() + ttl * 1000;
      return {
        success: false,
        remaining: 0,
        resetAt,
      };
    }

    return {
      success: true,
      remaining: limit - current,
    };
  } catch (error) {
    console.error("IP rate limit check error:", error);
    return {
      success: true,
      remaining: -1,
    };
  }
}

// Reset rate limit for a user (useful for admin operations)
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

// Get current rate limit status
export async function getRateLimitStatus(
  userId: string,
  isPaid: boolean = false
) {
  try {
    const key = `rate-limit:${userId}`;
    const current = await redis.get<number>(key);
    const ttl = await redis.ttl(key);
    const limit = isPaid ? RATE_LIMIT_PAID : RATE_LIMIT_FREE;

    return {
      current: current || 0,
      limit,
      remaining: Math.max(0, limit - (current || 0)),
      resetsIn: ttl > 0 ? ttl : 0,
    };
  } catch (error) {
    console.error("Error getting rate limit status:", error);
    return null;
  }
}

