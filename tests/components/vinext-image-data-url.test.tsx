// Tests the vinext dependency patch (patches/vinext@1.4.4.patch), not a file
// in this repo, so it has no source path to mirror. Keep it while the patch is.
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import Image from "vinext/shims/image";

const DATA_URL = "data:image/jpeg;base64,AAAA";

function renderedImg(props: { fill?: boolean; width?: number; height?: number }) {
  const host = document.createElement("div");
  host.innerHTML = renderToString(<Image src={DATA_URL} alt="Your room" {...props} />);
  return host.querySelector("img");
}

// The room photo and the redesign are data URLs that must stay in the browser.
// patches/vinext@1.4.4.patch keeps them away from /_next/image, as Next does.
describe("vinext next/image with a data URL", () => {
  it("shows the data URL directly when given a size", () => {
    const img = renderedImg({ width: 100, height: 100 });

    expect(img?.getAttribute("src")).toBe(DATA_URL);
    expect(img?.hasAttribute("srcset")).toBe(false);
  });

  it("shows the data URL directly with fill", () => {
    const img = renderedImg({ fill: true });

    expect(img?.getAttribute("src")).toBe(DATA_URL);
    expect(img?.hasAttribute("srcset")).toBe(false);
  });
});
