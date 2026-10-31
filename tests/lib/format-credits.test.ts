import { describe, expect, it } from "vitest";
import { formatCredits } from "@/lib/utils";

describe("formatCredits", () => {
  it("uses the singular for exactly one", () => {
    expect(formatCredits(1)).toBe("1 credit");
  });
  it("uses the plural for zero and many", () => {
    expect(formatCredits(0)).toBe("0 credits");
    expect(formatCredits(2)).toBe("2 credits");
    expect(formatCredits(50)).toBe("50 credits");
  });
});
