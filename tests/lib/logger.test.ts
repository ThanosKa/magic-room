import { afterEach, describe, expect, it, vi } from "vitest";

async function loadLoggerOnWorkers() {
  vi.stubGlobal("navigator", { userAgent: "Cloudflare-Workers" });
  vi.resetModules();
  const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
  const { logger } = await import("@/lib/logger");
  return { logger, consoleLog };
}

function loggedLine(consoleLog: { mock: { calls: unknown[][] } }) {
  expect(consoleLog.mock.calls).toHaveLength(1);
  return JSON.parse(String(consoleLog.mock.calls[0][0]));
}

describe("logger on the Workers runtime", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("writes each log call to the console as one JSON line", async () => {
    const { logger, consoleLog } = await loadLoggerOnWorkers();

    logger.info({ route: "/api/generate" }, "generation started");

    expect(loggedLine(consoleLog)).toMatchObject({
      level: 30,
      route: "/api/generate",
      msg: "generation started",
    });
  });

  it("redacts secrets, including inside request headers", async () => {
    const { logger, consoleLog } = await loadLoggerOnWorkers();

    logger.info(
      {
        token: "fake-token",
        apiKey: "fake-api-key",
        headers: { authorization: "Bearer fake", cookie: "session=fake" },
        imageBytes: 1024,
      },
      "request"
    );

    const line = consoleLog.mock.calls[0][0];
    expect(line).not.toContain("fake");
    expect(loggedLine(consoleLog)).toMatchObject({
      token: "[REDACTED]",
      apiKey: "[REDACTED]",
      headers: { authorization: "[REDACTED]", cookie: "[REDACTED]" },
      imageBytes: 1024,
    });
  });

  // Logs are kept in Workers Logs. An SDK error can carry the request it
  // made, with the API key in its headers, several levels down.
  it("redacts secrets nested inside an error or a sub-object", async () => {
    const { logger, consoleLog } = await loadLoggerOnWorkers();

    logger.error(
      {
        err: { message: "boom", config: { headers: { Authorization: "Bearer fake-key" } } },
        provider: { apiKey: "fake-api-key", token: "fake-token" },
        request: { headers: { authorization: "Bearer fake", cookie: "session=fake" } },
      },
      "provider failed"
    );

    expect(consoleLog.mock.calls[0][0]).not.toContain("fake");
  });

  it("includes the error message and stack when logging a failure", async () => {
    const { logger, consoleLog } = await loadLoggerOnWorkers();

    logger.error({ err: new Error("OpenRouter timed out") }, "generation failed");

    expect(loggedLine(consoleLog)).toMatchObject({
      level: 50,
      msg: "generation failed",
      err: {
        type: "Error",
        message: "OpenRouter timed out",
        stack: expect.stringContaining("OpenRouter timed out"),
      },
    });
  });
});

describe("logger in production outside Workers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // Runtime detection is a user-agent match. If it ever misses on Workers,
  // pino's default destination throws on every log call, so production must
  // not depend on it.
  it("still writes through the console when the runtime is not recognised", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubGlobal("navigator", { userAgent: "Cloudflare-Workers/2027" });
    vi.resetModules();
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    const { logger } = await import("@/lib/logger");

    logger.info({ route: "/api/generate" }, "generation started");

    expect(loggedLine(consoleLog)).toMatchObject({ msg: "generation started" });
  });
});
