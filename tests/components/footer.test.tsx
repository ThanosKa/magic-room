import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { Footer } from "@/components/footer";

vi.mock("@clerk/nextjs", () => ({
  useClerk: () => ({ openSignIn: vi.fn() }),
  useUser: () => ({ isSignedIn: false }),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

function renderFooter(): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToString(<Footer />);
  return host;
}

describe("Footer", () => {
  it("links to the status page in a new tab", () => {
    const status = [...renderFooter().querySelectorAll("a")].find((a) => a.textContent === "Status");

    expect(status?.getAttribute("href")).toBe("https://thanoska.betteruptime.com");
    expect(status?.getAttribute("target")).toBe("_blank");
    expect(status?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("keeps the other links in the same tab", () => {
    const github = [...renderFooter().querySelectorAll("a")].find((a) => a.textContent === "GitHub");

    expect(github?.hasAttribute("target")).toBe(false);
  });
});
