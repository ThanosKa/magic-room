// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import Stripe from "stripe";
import { Webhook } from "svix";

vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake");
vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_fake_for_intake");
const CLERK_SECRET = `whsec_${Buffer.from("clerk-intake-test-secret").toString("base64")}`;
vi.stubEnv("CLERK_WEBHOOK_SECRET", CLERK_SECRET);

// next/headers needs a Next request scope; feed it the test request's headers.
let currentHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => currentHeaders }));
vi.mock("@/lib/logger", () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

const STRIPE_SECRET = "whsec_fake_for_intake";
const STRIPE_BODY = JSON.stringify({
  id: "evt_intake",
  object: "event",
  type: "customer.updated",
  data: { object: {} },
});

let receiveStripeEvent: typeof import("@/lib/webhook-intake").receiveStripeEvent;
let receiveClerkEvent: typeof import("@/lib/webhook-intake").receiveClerkEvent;
let parseSpy: MockInstance<typeof import("@/lib/stripe").parseWebhookEvent>;

beforeAll(async () => {
  const stripeLib = await import("@/lib/stripe");
  parseSpy = vi.spyOn(stripeLib, "parseWebhookEvent");
  ({ receiveStripeEvent, receiveClerkEvent } = await import("@/lib/webhook-intake"));
});

function stripeRequest(signature?: string): Request {
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body: STRIPE_BODY,
    headers: signature ? { "stripe-signature": signature } : {},
  });
}

describe("receiveStripeEvent", () => {
  it("returns the typed event and its id for a real signature, through a promise", async () => {
    const header = new Stripe("sk_test_fake").webhooks.generateTestHeaderString({
      payload: STRIPE_BODY,
      secret: STRIPE_SECRET,
    });

    const result = await receiveStripeEvent(stripeRequest(header));

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.event).toMatchObject({ id: "evt_intake", type: "customer.updated" });
    expect(result.deliveryId).toBe("evt_intake");
    const call = parseSpy.mock.results[parseSpy.mock.results.length - 1];
    expect(call?.value).toBeInstanceOf(Promise);
  });

  it("rejects a bad signature with 401 Invalid signature", async () => {
    const result = await receiveStripeEvent(stripeRequest("t=1,v1=bad"));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(401);
    expect(await result.response.text()).toBe("Invalid signature");
  });

  it("rejects a missing signature with 401 Missing signature", async () => {
    const result = await receiveStripeEvent(stripeRequest());

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(401);
    expect(await result.response.text()).toBe("Missing signature");
  });
});

describe("receiveClerkEvent", () => {
  const wh = new Webhook(CLERK_SECRET);

  function signed(payload: unknown, id = "msg_1"): { request: Request; headers: Headers } {
    const body = JSON.stringify(payload);
    const timestamp = new Date();
    const h = new Headers({
      "svix-id": id,
      "svix-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
      "svix-signature": wh.sign(id, timestamp, body),
    });
    return { request: new Request("http://localhost/api/webhooks/clerk", { method: "POST", body }), headers: h };
  }

  beforeEach(() => {
    currentHeaders = new Headers();
  });

  it("returns a typed event and the svix id for a real signature", async () => {
    const { request, headers } = signed({ type: "user.created", data: { id: "user_1", first_name: "Ada" } });
    currentHeaders = headers;

    const result = await receiveClerkEvent(request);

    expect(result).toEqual({
      ok: true,
      event: { type: "user.created", data: { id: "user_1", first_name: "Ada" } },
      deliveryId: "msg_1",
    });
  });

  it("keeps a user event whose optional fields have the wrong type, dropping those fields", async () => {
    const { request, headers } = signed({
      type: "user.updated",
      data: { id: "user_3", first_name: 7, last_name: "Lovelace", email_addresses: "none", image_url: null, extra: "x" },
    });
    currentHeaders = headers;

    const result = await receiveClerkEvent(request);

    expect(result.ok && result.event).toEqual({
      type: "user.updated",
      data: { id: "user_3", last_name: "Lovelace", image_url: null },
    });
  });

  it("returns user.deleted with only the id", async () => {
    const { request, headers } = signed({ type: "user.deleted", data: { id: "user_2", deleted: true } });
    currentHeaders = headers;

    const result = await receiveClerkEvent(request);

    expect(result.ok && result.event).toEqual({ type: "user.deleted", data: { id: "user_2" } });
  });

  it("gives other for an unknown type, carrying the raw type", async () => {
    const { request, headers } = signed({ type: "session.created", data: { id: "s_1" } });
    currentHeaders = headers;

    const result = await receiveClerkEvent(request);

    expect(result.ok && result.event).toEqual({ type: "other", rawType: "session.created" });
  });

  it("gives other when a known type has no string data.id", async () => {
    const { request, headers } = signed({ type: "user.created", data: { id: 5 } });
    currentHeaders = headers;

    const result = await receiveClerkEvent(request);

    expect(result.ok && result.event).toEqual({ type: "other", rawType: "user.created" });
  });

  it("rejects a bad signature with 400 Webhook verification failed", async () => {
    const { request, headers } = signed({ type: "user.created", data: { id: "user_1" } });
    headers.set("svix-signature", "v1,AAAA");
    currentHeaders = headers;

    const result = await receiveClerkEvent(request);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
    expect(await result.response.text()).toBe("Webhook verification failed");
  });

  it("rejects missing svix headers with 400 before reading the body", async () => {
    const { request } = signed({ type: "user.created", data: { id: "user_1" } });

    const result = await receiveClerkEvent(request);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
    expect(await result.response.text()).toBe("Missing svix headers");
    expect(request.bodyUsed).toBe(false);
  });
});
