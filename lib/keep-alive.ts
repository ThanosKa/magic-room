import { after } from "next/server";
import { logger } from "@/lib/logger";

export function keepAliveUntilSettled(work: Promise<unknown>): void {
  try {
    after(work.then(
      () => undefined,
      () => undefined
    ));
  } catch (err) {
    logger.warn({ err }, "[KeepAlive] No request scope to keep alive");
  }
}
