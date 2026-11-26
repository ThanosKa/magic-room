import { describe, expect, it } from "vitest";
import type { ErrorEvent } from "@sentry/core";
import { ERROR_TRACKING_DSN, errorTrackingSettings, redact, scrubBreadcrumb, scrubEvent } from "@/lib/error-tracking";

describe("errorTrackingSettings", () => {
  it("stays off when the environment flag is unset, as in local dev", () => {
    expect(errorTrackingSettings({ environment: undefined, release: undefined })).toEqual({ enabled: false });
  });

  it("stays off for an unknown environment", () => {
    expect(errorTrackingSettings({ environment: "staging", release: "abc" })).toEqual({ enabled: false });
  });

  it("sends errors only, tagged with the environment and release, without personal data", () => {
    const settings = errorTrackingSettings({ environment: "production", release: "abc123" });

    expect(settings).toMatchObject({
      enabled: true,
      dsn: ERROR_TRACKING_DSN,
      environment: "production",
      release: "abc123",
      tracesSampleRate: 0,
      dataCollection: { userInfo: false, cookies: false, httpBodies: [], urlQueryParams: false },
    });
  });

  it("leaves the release unset when the build has none", () => {
    expect(errorTrackingSettings({ environment: "development", release: "" })).toMatchObject({
      enabled: true,
      release: undefined,
    });
  });
});

describe("redact", () => {
  it("removes emails, tokens and image data", () => {
    expect(
      redact("user a.b+c@example.com sent Bearer abc.def sk_live_12345678abc data:image/png;base64,iVBORw0KGgo=")
    ).toBe("user [email] sent Bearer [token] [token] data:[redacted]");
  });
});

describe("scrubBreadcrumb", () => {
  it("drops breadcrumbs for data URLs", () => {
    expect(scrubBreadcrumb({ category: "fetch", data: { url: "data:image/png;base64,AAAA" } })).toBeNull();
  });

  it("strips query strings from request URLs", () => {
    expect(scrubBreadcrumb({ category: "fetch", data: { url: "/api/x?session_id=cs_1#y", method: "GET" } })).toEqual({
      category: "fetch",
      data: { url: "/api/x", method: "GET" },
    });
  });
});

describe("scrubEvent", () => {
  it("keeps the error and path but drops the user, cookies, headers, body and query string", () => {
    const event: ErrorEvent = {
      type: undefined,
      user: { id: "u1", email: "a@b.co" },
      request: {
        method: "POST",
        url: "https://magic-room.dev/api/generate?token=x",
        cookies: { __session: "jwt" },
        headers: { cookie: "x", "user-agent": "ua" },
        data: { image: "data:image/png;base64,AAAA" },
        query_string: "token=x",
      },
      exception: { values: [{ type: "Error", value: "failed for a@b.co" }] },
    };

    expect(scrubEvent(event)).toEqual({
      type: undefined,
      user: undefined,
      request: { method: "POST", url: "https://magic-room.dev/api/generate" },
      exception: { values: [{ type: "Error", value: "failed for [email]" }] },
    });
  });
});
