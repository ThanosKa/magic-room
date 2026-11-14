import { after } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Keeps the runtime working on `work` until it settles, even if the client
 * disconnects first. On Workers a disconnect cancels everything the request
 * started; `after` with a promise hands it to `waitUntil` (vinext's shim),
 * which gives it about 30 s more.
 */
export function keepAliveUntilSettled(work: Promise<unknown>): void {
  try {
    after(work.then(
      () => undefined,
      () => undefined
    ));
  } catch (err) {
    // Only outside a request scope (scripts, tests): nothing to keep alive.
    logger.warn({ err }, "[KeepAlive] No request scope to keep alive");
  }
}
