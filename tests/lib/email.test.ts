import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildPurchaseEmailHtml,
  buildWelcomeEmailHtml,
  sendPurchaseEmail,
  sendWelcomeEmail,
} from "@/lib/email";

const resendSend = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendSend };
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

describe("welcome email", () => {
  it("greets by first name", () => {
    expect(buildWelcomeEmailHtml({ firstName: "Maria" })).toContain("<em>Maria.</em>");
  });

  it("greets generically without a name", () => {
    expect(buildWelcomeEmailHtml({})).toContain("Welcome to <em>Magic Room.</em>");
  });

  it("escapes a name that contains HTML", () => {
    const html = buildWelcomeEmailHtml({ firstName: "<script>" });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("promises one redesign and the real wait for each tier", () => {
    const html = buildWelcomeEmailHtml({});
    expect(html).toContain(
      "You get one redesign of your room. Quick and Pro take 30 to 60 seconds, Ultra about 2 minutes."
    );
  });

  it("says what the free credit buys and the lowest pack price", () => {
    const html = buildWelcomeEmailHtml({});
    expect(html).toContain("1 free credit, enough for one Quick design");
    expect(html).toContain("&euro;9.99 for 20");
  });
});

describe("purchase email", () => {
  it("names the pack and the credits", () => {
    const html = buildPurchaseEmailHtml({ packageName: "Starter", credits: 20 });
    expect(html).toContain("Starter");
    expect(html).toContain("20 credits");
  });

  it("states what each tier costs", () => {
    const html = buildPurchaseEmailHtml({ packageName: "Starter", credits: 20 });
    expect(html).toContain("A Quick design uses 1 credit, Pro 2 and Ultra 3.");
  });

  it("leaves out the price, which a promotion code could make wrong", () => {
    const html = buildPurchaseEmailHtml({ packageName: "Starter", credits: 20 });
    expect(html).not.toContain("&euro;");
  });
});

// The webhook route sends these after answering, inside the ~30 s waitUntil
// window on Workers: a hung Resend must end as a logged failure, not vanish.
describe("sending", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ["purchase", () => sendPurchaseEmail({ to: "a@example.com", packageName: "Starter", credits: 20 })],
    ["welcome", () => sendWelcomeEmail({ to: "a@example.com" })],
  ])("gives up on a %s email Resend has not answered after 10 seconds", async (_kind, send) => {
    vi.useFakeTimers();
    resendSend.mockImplementationOnce(() => new Promise(() => {}));

    const outcome = send().then(
      () => "sent",
      (error: Error) => error.message
    );
    await vi.advanceTimersByTimeAsync(10_000);

    expect(await outcome).toMatch(/did not answer within 10 s/);
  });
});
