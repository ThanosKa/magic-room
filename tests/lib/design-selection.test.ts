import { describe, it, expect } from "vitest";
import { generateHref, readDesignSelection } from "@/lib/design-selection";

/**
 * The deep link into the tool: design pages build it, the tool reads it back
 * to preselect a style and room type.
 */

function selectionFrom(href: string) {
  return readDesignSelection(new URL(href, "https://magic-room.test").searchParams);
}

describe("generateHref", () => {
  it("names the style and the room type", () => {
    expect(generateHref({ theme: "japandi", roomType: "bedroom" })).toBe(
      "/generate?style=japandi&room=bedroom"
    );
  });

  it("names only the style when no room type is given", () => {
    expect(generateHref({ theme: "art-deco" })).toBe("/generate?style=art-deco");
  });

  it("leaves out a value the tool does not offer", () => {
    expect(generateHref({ theme: "gothic", roomType: "bedroom" })).toBe("/generate?room=bedroom");
  });

  it("is the plain tool URL when nothing is given", () => {
    expect(generateHref({})).toBe("/generate");
  });
});

describe("readDesignSelection", () => {
  it("reads back a style and room type from a design page link", () => {
    expect(selectionFrom("/generate?style=japandi&room=walk-in-closet")).toEqual({
      theme: "japandi",
      roomType: "walk-in-closet",
    });
  });

  it("reads an existing style and room type", () => {
    expect(selectionFrom("/generate?style=modern&room=living-room")).toEqual({
      theme: "modern",
      roomType: "living-room",
    });
  });

  it("ignores an unknown style but keeps a valid room type", () => {
    expect(selectionFrom("/generate?style=gothic&room=bedroom")).toEqual({
      roomType: "bedroom",
    });
  });

  it("ignores an unknown room type but keeps a valid style", () => {
    expect(selectionFrom("/generate?style=coastal&room=garage")).toEqual({
      theme: "coastal",
    });
  });

  it("ignores values that only differ in case or spacing", () => {
    expect(selectionFrom("/generate?style=Japandi&room=%20bedroom")).toEqual({});
  });

  it("ignores inherited object keys", () => {
    expect(selectionFrom("/generate?style=constructor&room=toString")).toEqual({});
  });

  it("is empty with no query", () => {
    expect(selectionFrom("/generate")).toEqual({});
  });
});
