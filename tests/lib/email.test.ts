import { describe, expect, it } from "vitest";
import { buildPurchaseEmailHtml, buildWelcomeEmailHtml } from "@/lib/email";
import { QUALITY_OPTIONS, THEME_IDS } from "@/lib/constants";

describe("email templates", () => {
  it("greets by first name, or generically without one", () => {
    expect(buildWelcomeEmailHtml({ firstName: "Maria" })).toContain("<em>Maria.</em>");
    expect(buildWelcomeEmailHtml({})).toContain("Welcome to <em>Magic Room.</em>");
  });

  it("escapes names before they reach the HTML", () => {
    const html = buildWelcomeEmailHtml({ firstName: "<script>" });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("states the product facts from the constants", () => {
    const html = buildWelcomeEmailHtml({ firstName: "Maria" });
    expect(html).toContain("You get one redesign of your room.");
    expect(html).toContain(`${THEME_IDS.length} design themes`);
    expect(html).toContain(QUALITY_OPTIONS.ultra.waitText);
    expect(html).not.toContain("variations");
  });

  it("gives each tier's credit cost and never prices the purchase", () => {
    const html = buildPurchaseEmailHtml({ packageName: "Starter", credits: 20 });
    const { standard, premium, ultra } = QUALITY_OPTIONS;
    expect(html).toContain(
      `A ${standard.name} design uses ${standard.credits} credit, ${premium.name} ${premium.credits} and ${ultra.name} ${ultra.credits}.`
    );
    expect(html).toContain("Starter");
    expect(html).toContain("20 credits");
    expect(html).not.toContain("&euro;");
  });

  it("keeps purple off buttons and headers", () => {
    const html = buildWelcomeEmailHtml({ firstName: "Maria" }).toLowerCase();
    expect(html).not.toContain("background-color:#7c3aed");
    expect(html).not.toContain("linear-gradient");
    expect(html).not.toContain("#8b5cf6");
  });
});
