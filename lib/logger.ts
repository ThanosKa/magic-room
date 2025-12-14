import pino, { type Logger, type LoggerOptions } from "pino";

const DEFAULT_LOG_LEVEL = "info";

function buildLogger(): Logger {
  const level = process.env.LOG_LEVEL ?? DEFAULT_LOG_LEVEL;
  const isProd = process.env.NODE_ENV === "production";

  const options: LoggerOptions = {
    level,
    base: {
      service: "magic-room",
      env: process.env.NODE_ENV ?? "development",
    },
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "headers.authorization",
        "headers.cookie",
      ],
      remove: true,
    },
  };

  if (isProd) {
    return pino(options);
  }

  return pino({
    ...options,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  });
}

export const logger = buildLogger();
