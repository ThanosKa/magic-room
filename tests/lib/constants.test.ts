import { describe, expect, it } from "vitest";
import { isRoomType, isTheme, ROOM_TYPE_IDS, ROOM_TYPES, THEME_IDS, THEMES } from "@/lib/constants";

describe("room type and theme ids", () => {
  it("lists every room type and theme once, in display order", () => {
    expect([...ROOM_TYPE_IDS]).toEqual(Object.keys(ROOM_TYPES));
    expect([...THEME_IDS]).toEqual(Object.keys(THEMES));
  });

  it("accepts a real room type and rejects anything else", () => {
    expect(isRoomType("living-room")).toBe(true);
    expect(isRoomType("garage")).toBe(false);
    expect(isRoomType("")).toBe(false);
    expect(isRoomType("toString")).toBe(false);
    expect(isRoomType("__proto__")).toBe(false);
  });

  it("accepts a real theme and rejects anything else", () => {
    expect(isTheme("art-deco")).toBe(true);
    expect(isTheme("steampunk")).toBe(false);
    expect(isTheme("constructor")).toBe(false);
  });
});
