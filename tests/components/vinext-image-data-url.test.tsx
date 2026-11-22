import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import Image from "vinext/shims/image";

const DATA_URL = "data:image/jpeg;base64,AAAA";

function renderedImg(props: { fill?: boolean; width?: number; height?: number }) {
  const host = document.createElement("div");
  host.innerHTML = renderToString(<Image src={DATA_URL} alt="Your room" {...props} />);
  return host.querySelector("img");
}

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
