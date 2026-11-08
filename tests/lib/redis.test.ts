import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "@/lib/redis";

const incr = vi.hoisted(() => vi.fn());

vi.mock("@upstash/redis", () => ({
  Redis: class {
    incr = incr;
    expire = vi.fn();
    ttl = vi.fn().mockResolvedValue(3600);
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

describe("checkRateLimit", () => {
  beforeEach(() => {
    incr.mockReset();
  });

  it("allows a user under the limit", async () => {
    incr.mockResolvedValue(1);

    await expect(checkRateLimit("user_1")).resolves.toMatchObject({ success: true });
  });

  // Fails closed: during a Redis outage the generate route must not run
  // without its limit. The route answers 500 before charging anything.
  it("throws when Redis cannot be reached instead of letting the request through", async () => {
    incr.mockRejectedValue(new Error("Upstash unreachable"));

    await expect(checkRateLimit("user_1")).rejects.toThrow("Upstash unreachable");
  });
});
