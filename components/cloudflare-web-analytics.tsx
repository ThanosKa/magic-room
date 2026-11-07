// The beacon token is public: it ships in every page's HTML by design.
const BEACON_TOKEN = "ce2dbf53aee04662b4ae7b9b1cd5ba31";

/** Cloudflare Web Analytics beacon. It sets no cookies. */
export function CloudflareWebAnalytics() {
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: BEACON_TOKEN })}
    />
  );
}
