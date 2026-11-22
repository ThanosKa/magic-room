import pino, { type DestinationStream, type LoggerOptions } from "pino";

const isDev = process.env.NODE_ENV !== "production";
const isWorkerRuntime =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";
const useConsoleDestination = isWorkerRuntime || !isDev;

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  // https://getpino.io/#/docs/transports (pino-pretty runs in a worker thread, which the Workers runtime does not offer)
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

// https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/ (pino's default destination calls fs.writeSync, which throws on Workers)
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
