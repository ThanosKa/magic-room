import { Resend } from "resend";
import { logger } from "@/lib/logger";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { CREDIT_PACKAGES, QUALITY_OPTIONS, THEME_IDS } from "@/lib/constants";

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
// Logo URL (absolute so it works in email clients). A small copy of the icon:
// the 1024px original is too heavy to load quickly in an inbox.
// ---------------------------------------------------------------------------

const LOGO_URL = `${SITE_URL}/email-logo.png`;

// ---------------------------------------------------------------------------
// Design tokens. Email clients cannot read the CSS variables in
// app/globals.css, so these are its values as solid colours. Keep them in step
// with that file. Purple stays on small dots only, as on the site.
// ---------------------------------------------------------------------------

const PAPER = "#f4f0e9";
const PAPER_2 = "#ebe5da";
const INK = "#17140f";
const INK_2 = "#5e5a55";
const LINE = "#dad6cf";
const LINE_ON_PAPER_2 = "#d6d0c5";
const CREAM = "#efe8dc";
const ACCENT = "#7c3aed";

// Many clients (Gmail included) drop web fonts, so the fallbacks must read well too.
const SANS = "'Geist','Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "'Instrument Serif',Georgia,'Times New Roman',serif";

// ---------------------------------------------------------------------------
// Shared email layout helpers (inline-style, table-based, email-safe HTML)
// ---------------------------------------------------------------------------

/** Names come from the sign-up form, so escape them before they reach the HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function emailWrapper(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${SITE_NAME}</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
</head>
<body bgcolor="${PAPER}" style="margin:0;padding:0;background-color:${PAPER};font-family:${SANS};color:${INK};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${PAPER}" style="background-color:${PAPER};">
    <tr>
      <td align="center" style="padding:32px 20px 40px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
          <tr>
            <td style="padding:0 0 22px;border-bottom:1px solid ${LINE};">
              <img src="${LOGO_URL}" alt="" width="28" height="28" style="display:inline-block;vertical-align:middle;border:0;border-radius:7px;" />
              <span style="margin-left:8px;font-size:16px;font-weight:500;line-height:28px;letter-spacing:-0.01em;color:${INK};vertical-align:middle;">${SITE_NAME}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:44px 0;">${bodyHtml}</td>
          </tr>
          <tr>
            <td style="padding:22px 0 0;border-top:1px solid ${LINE};font-size:12px;line-height:19px;color:${INK_2};">
              &copy; ${new Date().getFullYear()} ${SITE_NAME} &middot;
              <a href="${SITE_URL}/terms" style="color:${INK_2};text-decoration:underline;">Terms</a> &middot;
              <a href="${SITE_URL}/privacy" style="color:${INK_2};text-decoration:underline;">Privacy</a><br />
              You received this email because you have an account at ${SITE_NAME}.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function label(text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
  <tr>
    <td bgcolor="${PAPER_2}" style="background-color:${PAPER_2};border-radius:999px;padding:5px 12px;font-size:12px;line-height:16px;color:${INK_2};"><span style="color:${ACCENT};">&#9679;</span>&nbsp;&nbsp;${text}</td>
  </tr>
</table>`;
}

function heading(html: string): string {
  return `<h1 style="margin:0 0 20px;font-family:${SERIF};font-size:46px;font-weight:400;line-height:48px;letter-spacing:-0.02em;color:${INK};">${html}</h1>`;
}

function paragraph(html: string): string {
  return `<p style="margin:0 0 28px;font-size:15px;line-height:24px;color:${INK_2};">${html}</p>`;
}

function button(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;">
  <tr>
    <td bgcolor="${INK}" style="background-color:${INK};border-radius:999px;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:15px;font-weight:500;line-height:20px;color:${CREAM};text-decoration:none;">${text}&nbsp;&rarr;</a>
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// Step row helper (used in welcome email)
// ---------------------------------------------------------------------------

function stepRow(number: string, title: string, description: string): string {
  return `<tr>
    <td width="44" valign="top" style="padding:16px 0;border-top:1px solid ${LINE};font-family:${SERIF};font-size:24px;line-height:24px;color:${INK_2};">${number}</td>
    <td valign="top" style="padding:16px 0;border-top:1px solid ${LINE};">
      <p style="margin:0 0 3px;font-size:15px;font-weight:500;line-height:22px;color:${INK};">${title}</p>
      <p style="margin:0;font-size:14px;line-height:21px;color:${INK_2};">${description}</p>
    </td>
  </tr>`;
}

// ---------------------------------------------------------------------------
// Welcome email HTML
// ---------------------------------------------------------------------------

export function buildWelcomeEmailHtml(params: {
  firstName?: string | null;
}): string {
  const title = params.firstName
    ? `Welcome to ${SITE_NAME}, <em>${escapeHtml(params.firstName)}.</em>`
    : `Welcome to <em>${SITE_NAME}.</em>`;

  const { standard: quick, premium: pro, ultra } = QUALITY_OPTIONS;
  const starter = CREDIT_PACKAGES[0];
  const starterPrice = (starter.priceCents / 100).toFixed(2);

  const body = `
    ${label("AI interior design")}
    ${heading(title)}
    ${paragraph(`${SITE_NAME} is an AI interior design tool that transforms any room from a single photo. Here's how it works:`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-bottom:1px solid ${LINE};">
      ${stepRow("1", "Upload a photo", "Take a picture of any room you want to redesign and upload it.")}
      ${stepRow("2", "Choose a style", `Pick from ${THEME_IDS.length} design themes: Modern, Scandinavian, Bohemian and more.`)}
      ${stepRow("3", "Get your redesign", `You get one redesign of your room. ${quick.name} and ${pro.name} take ${quick.waitText}, ${ultra.name} ${ultra.waitText}.`)}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${PAPER_2}" style="margin:0 0 28px;background-color:${PAPER_2};border-radius:14px;">
      <tr>
        <td style="padding:18px 22px;">
          <p style="margin:0 0 4px;font-size:14px;font-weight:500;line-height:20px;color:${INK};"><span style="color:${ACCENT};">&#9679;</span>&nbsp;&nbsp;Your free credit is ready</p>
          <p style="margin:0;font-size:14px;line-height:21px;color:${INK_2};">Every new account gets 1 free credit, enough for one ${quick.name} design. More credits start at &euro;${starterPrice} for ${starter.credits}.</p>
        </td>
      </tr>
    </table>
    ${button("Start designing", `${SITE_URL}/generate`)}
  `;

  return emailWrapper(body);
}

// ---------------------------------------------------------------------------
// Purchase confirmation email HTML
// ---------------------------------------------------------------------------

function receiptRow(name: string, value: string, isLast: boolean): string {
  const border = isLast ? "" : `border-bottom:1px solid ${LINE_ON_PAPER_2};`;
  return `<tr>
    <td style="padding:12px 0;${border}font-size:14px;line-height:20px;color:${INK_2};">${name}</td>
    <td align="right" style="padding:12px 0;${border}font-size:14px;font-weight:500;line-height:20px;color:${INK};">${value}</td>
  </tr>`;
}

export function buildPurchaseEmailHtml(params: {
  packageName: string;
  credits: number;
}): string {
  const { standard: quick, premium: pro, ultra } = QUALITY_OPTIONS;

  const body = `
    ${label("Receipt")}
    ${heading("Payment <em>confirmed.</em>")}
    ${paragraph("Thank you for your purchase! Your credits have been added to your account and are ready to use.")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${PAPER_2}" style="margin:0 0 28px;background-color:${PAPER_2};border-radius:14px;">
      <tr>
        <td style="padding:10px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${receiptRow("Pack", escapeHtml(params.packageName), false)}
            ${receiptRow("Credits added", `${params.credits} credits`, true)}
          </table>
        </td>
      </tr>
    </table>
    ${paragraph(`Credits never expire, so you can use them at your own pace. A ${quick.name} design uses ${quick.credits} credit, ${pro.name} ${pro.credits} and ${ultra.name} ${ultra.credits}.`)}
    ${button("Use your credits", `${SITE_URL}/generate`)}
  `;

  return emailWrapper(body);
}

// ---------------------------------------------------------------------------
// Send helpers (they throw on failure: callers await them and catch)
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

  const html = buildWelcomeEmailHtml({ firstName: params.firstName });

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
}): Promise<void> {
  const html = buildPurchaseEmailHtml({
    packageName: params.packageName,
    credits: params.credits,
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
