import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { CloudflareWebAnalytics } from "@/components/cloudflare-web-analytics";

const BEACON_TOKEN = "ce2dbf53aee04662b4ae7b9b1cd5ba31";

describe("CloudflareWebAnalytics", () => {
  it("puts the deferred beacon with the site token in the server HTML", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToString(<CloudflareWebAnalytics />);
    const tag = host.querySelector("script");

    expect(tag?.getAttribute("src")).toBe("https://static.cloudflareinsights.com/beacon.min.js");
    expect(tag?.hasAttribute("defer")).toBe(true);
    expect(JSON.parse(tag?.getAttribute("data-cf-beacon") ?? "{}")).toEqual({ token: BEACON_TOKEN });
  });
});
