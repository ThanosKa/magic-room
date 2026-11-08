import pino, { type DestinationStream, type LoggerOptions } from "pino";

const isDev = process.env.NODE_ENV !== "production";
const isWorkerRuntime =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";
// Production always writes through the console, so a missed runtime match
// cannot bring back the destination that throws on Workers.
const useConsoleDestination = isWorkerRuntime || !isDev;

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  // pino-pretty runs in a worker thread, which the Workers runtime does not offer.
  ...(isDev &&
    !isWorkerRuntime && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    }),
  redact: {
    paths: [
      "password",
      "token",
      "apiKey",
      "secret",
      "authorization",
      "cookie",
      "req.headers.authorization",
      "req.headers.cookie",
      "headers.authorization",
      "headers.cookie",
      // One and two levels down, e.g. an SDK error's request config.
      "*.password",
      "*.token",
      "*.apiKey",
      "*.secret",
      "*.authorization",
      "*.Authorization",
      "*.cookie",
      "*.headers.authorization",
      "*.headers.Authorization",
      "*.headers.cookie",
      "*.*.headers.authorization",
      "*.*.headers.Authorization",
      "*.*.headers.cookie",
    ],
    censor: "[REDACTED]",
  },
};

/**
 * Sends pino's JSON lines to the console. pino's default destination calls
 * fs.writeSync in a form the Workers runtime rejects, so every log call throws there.
 */
const consoleDestination: DestinationStream = {
  write(line) {
    // eslint-disable-next-line no-console -- the one place server logs reach the console
    console.log(line.trimEnd());
  },
};

export const logger = useConsoleDestination
  ? pino(options, consoleDestination)
  : pino(options);

export default logger;
