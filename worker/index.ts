import { withSentry } from "@sentry/cloudflare";
import vinext from "vinext/server/fetch-handler";
import { ERROR_TRACKING } from "@/lib/error-tracking";

export * from "vinext/server/fetch-handler";

const { enabled, ...options } = ERROR_TRACKING;

export default enabled ? withSentry(() => options, vinext) : vinext;
