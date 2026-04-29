import { Resend } from "resend";
import { logger } from "@/lib/logger";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { COLORS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Resend client (lazy-initialised so tests that import this module don't
// crash when RESEND_API_KEY is not set)
// ---------------------------------------------------------------------------

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = "Magic Room <hello@notifications.app-whisper.com>";

// ---------------------------------------------------------------------------
// Logo URL (absolute so it works in email clients)
// ---------------------------------------------------------------------------

const LOGO_URL = `${SITE_URL}/icon.png`;

// ---------------------------------------------------------------------------
// Shared email layout helpers (inline-style, table-based, email-safe HTML)
// ---------------------------------------------------------------------------

function emailWrapper(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${SITE_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!-- Header bar -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:8px 8px 0 0;overflow:hidden;">
          <tr>
            <td align="center" style="background:linear-gradient(135deg,${COLORS.dark},${COLORS.primary});padding:28px 24px;">
              <img src="${LOGO_URL}" alt="${SITE_NAME}" width="56" height="56" style="display:block;border:0;border-radius:12px;" />
              <p style="margin:12px 0 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">${SITE_NAME}</p>
            </td>
          </tr>
        </table>
        <!-- Body card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-left:1px solid #e8e5e3;border-right:1px solid #e8e5e3;">
          <tr>
            <td style="padding:32px 36px;">
              ${bodyHtml}
            </td>
          </tr>
        </table>
        <!-- Footer -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#fafafa;border-radius:0 0 8px 8px;border:1px solid #e8e5e3;border-top:none;">
          <tr>
            <td align="center" style="padding:20px 24px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:18px;">
                &copy; ${new Date().getFullYear()} ${SITE_NAME} &middot;
                <a href="${SITE_URL}/terms" style="color:#9ca3af;text-decoration:underline;">Terms</a> &middot;
                <a href="${SITE_URL}/privacy" style="color:#9ca3af;text-decoration:underline;">Privacy</a>
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#c0c0c0;">
                You received this email because you have an account at ${SITE_NAME}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Step row helper (used in welcome email)
// ---------------------------------------------------------------------------

function stepRow(number: string, title: string, description: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
  <tr>
    <td width="44" valign="top">
      <div style="width:36px;height:36px;border-radius:50%;background-color:${COLORS.primary};color:#ffffff;font-size:16px;font-weight:700;text-align:center;line-height:36px;">${number}</div>
    </td>
    <td valign="top" style="padding-left:12px;">
      <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#1f2937;">${title}</p>
      <p style="margin:0;font-size:14px;color:#6b7280;line-height:20px;">${description}</p>
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// Welcome email HTML
// ---------------------------------------------------------------------------

export function buildWelcomeEmailHtml(params: {
  firstName?: string | null;
  lastName?: string | null;
}): string {
  const nameParts = [params.firstName, params.lastName].filter(Boolean);
  const greeting =
    nameParts.length > 0
      ? `Welcome to ${SITE_NAME}, ${nameParts.join(" ")}!`
      : `Welcome to ${SITE_NAME}!`;

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1f2937;">${greeting}</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:22px;">
      ${SITE_NAME} is an AI interior design tool that transforms any room from a single photo. Here's how it works:
    </p>

    ${stepRow("1", "Upload a photo", "Take a picture of any room you want to redesign and upload it.")}
    ${stepRow("2", "Choose a style", "Pick from 14 design themes — Modern, Scandinavian, Bohemian, and more.")}
    ${stepRow("3", "Get your redesign", "The AI generates professionally redesigned variations in 30-60 seconds.")}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;background-color:#f9f5ff;border-radius:8px;border:1px solid #ede9fe;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;font-size:14px;color:#7c3aed;font-weight:600;">Your free credit is ready</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;line-height:19px;">
            Every new account gets 1 free credit so you can try the AI before purchasing. Additional credits start at just &euro;9.99 for 30 credits.
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td align="center" style="border-radius:6px;background-color:${COLORS.primary};">
          <a href="${SITE_URL}/generate" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
            Start designing
          </a>
        </td>
      </tr>
    </table>
  `;

  return emailWrapper(body);
}

// ---------------------------------------------------------------------------
// Purchase confirmation email HTML
// ---------------------------------------------------------------------------

export function buildPurchaseEmailHtml(params: {
  packageName: string;
  credits: number;
  amountCents: number;
}): string {
  const formattedAmount = `€${(params.amountCents / 100).toFixed(2)}`;

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1f2937;">Payment confirmed</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:22px;">
      Thank you for your purchase! Your credits have been added to your account and are ready to use.
    </p>

    <!-- Receipt card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="background-color:#fafafa;padding:12px 20px;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0;font-size:13px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Receipt</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#6b7280;">Plan</td>
              <td align="right" style="padding:6px 0;font-size:14px;font-weight:600;color:#1f2937;">${params.packageName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#6b7280;">Credits added</td>
              <td align="right" style="padding:6px 0;font-size:14px;font-weight:600;color:#1f2937;">${params.credits} credits</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 0 0;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td>
            </tr>
            <tr>
              <td style="padding:8px 0 0;font-size:15px;font-weight:600;color:#1f2937;">Total</td>
              <td align="right" style="padding:8px 0 0;font-size:15px;font-weight:700;color:${COLORS.primary};">${formattedAmount}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:20px;">
      Credits never expire, so you can use them at your own pace. Each credit generates one AI room redesign.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td align="center" style="border-radius:6px;background-color:${COLORS.primary};">
          <a href="${SITE_URL}/generate" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
            Use your credits
          </a>
        </td>
      </tr>
    </table>
  `;

  return emailWrapper(body);
}

// ---------------------------------------------------------------------------
// Send helpers (fire-and-forget friendly)
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(params: {
  to: string;
  firstName?: string | null;
  lastName?: string | null;
}): Promise<void> {
  const nameParts = [params.firstName, params.lastName].filter(Boolean);
  const subject =
    nameParts.length > 0
      ? `Welcome to ${SITE_NAME}, ${nameParts.join(" ")}!`
      : `Welcome to ${SITE_NAME}!`;

  const html = buildWelcomeEmailHtml({
    firstName: params.firstName,
    lastName: params.lastName,
  });

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject,
    html,
  });

  if (error) {
    logger.error({ err: error, to: params.to }, "Failed to send welcome email");
    throw error;
  }

  logger.info({ to: params.to }, "Welcome email sent");
}

export async function sendPurchaseEmail(params: {
  to: string;
  packageName: string;
  credits: number;
  amountCents: number;
}): Promise<void> {
  const html = buildPurchaseEmailHtml({
    packageName: params.packageName,
    credits: params.credits,
    amountCents: params.amountCents,
  });

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `${SITE_NAME} — Payment confirmed (${params.packageName})`,
    html,
  });

  if (error) {
    logger.error(
      { err: error, to: params.to, packageName: params.packageName },
      "Failed to send purchase email"
    );
    throw error;
  }

  logger.info(
    { to: params.to, packageName: params.packageName },
    "Purchase confirmation email sent"
  );
}
