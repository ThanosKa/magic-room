const POST_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
});

export function formatPostDate(isoDate: string): string {
    return POST_DATE_FORMAT.format(new Date(isoDate));
}
