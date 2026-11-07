import { describe, expect, it } from "vitest";
import { buildPurchaseEmailHtml, buildWelcomeEmailHtml } from "@/lib/email";

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
