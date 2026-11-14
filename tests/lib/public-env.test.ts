import { describe, expect, it } from "vitest";
import { findPublicEnvProblems } from "@/lib/public-env";

// NEXT_PUBLIC_* values are baked into the Worker build. A build made without
// them sends every API route to 500 and paying customers to localhost.
const COMPLETE = {
  NEXT_PUBLIC_APP_URL: "https://magic-room.dev",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_placeholder",
  NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
};

describe("findPublicEnvProblems", () => {
  it("accepts a complete set with an https app URL", () => {
    expect(findPublicEnvProblems(COMPLETE)).toEqual([]);
  });

  it("names every missing or empty value", () => {
    expect(
      findPublicEnvProblems({ NEXT_PUBLIC_APP_URL: "https://magic-room.dev", NEXT_PUBLIC_SUPABASE_URL: "" })
    ).toEqual([
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing",
      "NEXT_PUBLIC_SUPABASE_URL is missing",
    ]);
  });

  it("refuses an app URL that is not https, which Stripe would return customers to", () => {
    expect(findPublicEnvProblems({ ...COMPLETE, NEXT_PUBLIC_APP_URL: "http://localhost:3000" })).toEqual([
      "NEXT_PUBLIC_APP_URL must start with https:// (got http://localhost:3000)",
    ]);
  });
});
