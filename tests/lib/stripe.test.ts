// @vitest-environment node
import { beforeAll, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";

vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake");

const SECRET = "whsec_fake_for_this_test";
const BODY = JSON.stringify({ id: "evt_test", object: "event", type: "customer.updated", data: { object: {} } });

// A real Stripe instance instead of vi.mock on purpose: it makes no network
// call, and the real signature check is exactly what these tests prove.
let parseWebhookEvent: typeof import("@/lib/stripe").parseWebhookEvent;

beforeAll(async () => {
  ({ parseWebhookEvent } = await import("@/lib/stripe"));
});

// On Workers the sync constructEvent throws, so every real paid event would be
// rejected and the customer would get no credits. Only a promise proves the async path.
describe("parseWebhookEvent", () => {
  it("resolves a correctly signed event through a promise", async () => {
    const header = new Stripe("sk_test_fake").webhooks.generateTestHeaderString({ payload: BODY, secret: SECRET });

    const result = parseWebhookEvent(BODY, header, SECRET);

    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toMatchObject({ id: "evt_test", type: "customer.updated" });
  });

  it("rejects a bad signature", async () => {
    await expect(parseWebhookEvent(BODY, "t=1,v1=bad", SECRET)).rejects.toThrow();
  });
});
