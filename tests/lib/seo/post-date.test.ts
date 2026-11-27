import { afterEach, describe, expect, it } from "vitest";
import { formatPostDate } from "@/lib/seo/post-date";

const originalTimezone = process.env.TZ;
afterEach(() => {
    process.env.TZ = originalTimezone;
});

describe("formatPostDate", () => {
    it.each(["UTC", "America/Los_Angeles", "Pacific/Pago_Pago", "Europe/Athens", "Pacific/Kiritimati"])(
        "shows the calendar date written in the post data when the machine runs in %s",
        (timezone) => {
            process.env.TZ = timezone;

            expect(formatPostDate("2026-01-26")).toBe("26 January 2026");
            expect(formatPostDate("2026-12-31")).toBe("31 December 2026");
        },
    );
});
