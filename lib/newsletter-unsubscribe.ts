import "server-only";
import {
  decodeEmailParam,
  encodeEmailParam,
  normalizeSubscriberEmail,
  signEmail,
  verifyEmailToken,
} from "@/lib/newsletter-unsubscribe-token";

export { decodeEmailParam, encodeEmailParam, normalizeSubscriberEmail };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yotravelholic.com";

/**
 * Unsubscribe links are signed.
 *
 * Without a signature the link is just `?email=someone@example.com`, and
 * anyone who can guess an address can unsubscribe that person -- or walk a
 * list and unsubscribe everybody. The token is an HMAC of the address, so a
 * link only works for the address it was issued for and cannot be forged
 * without the key.
 *
 * The key falls back to the service-role key when no dedicated secret is set.
 * That is deliberate: this site has already shipped one automation that was
 * silently dead because an env var was never added (CRON_SECRET), and an
 * unsubscribe link that cannot be generated is a compliance problem, not an
 * inconvenience. The service-role key is present wherever the newsletter works
 * at all, so links always verify. Only the HMAC output is ever sent; the key
 * itself never leaves the server.
 *
 * Setting NEWSLETTER_UNSUBSCRIBE_SECRET later is supported and preferable, but
 * it invalidates tokens in already-delivered email: those recipients land on
 * the "link expired" branch, which offers a route that still works rather than
 * a dead end.
 */
function signingKey(): string | null {
  return process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function createUnsubscribeToken(email: string): string | null {
  const key = signingKey();
  return key ? signEmail(key, email) : null;
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const key = signingKey();
  return key ? verifyEmailToken(key, email, token) : false;
}

export function buildUnsubscribeUrl(email: string): string | null {
  const token = createUnsubscribeToken(email);
  if (!token) return null;
  return `${SITE_URL}/unsubscribe?e=${encodeEmailParam(email)}&t=${token}`;
}

/**
 * Footer for list email. Every signup form on this site promises "I understand
 * I can unsubscribe anytime" -- this is the half of that promise that lives in
 * the message.
 */
export function unsubscribeFooterHtml(email: string): string {
  const url = buildUnsubscribeUrl(email);
  if (!url) return "";
  return `
      <hr style="border:none;border-top:1px solid #e5e0d8;margin:28px 0 16px" />
      <p style="font-size:14px;line-height:20px;color:#6b6b6b;margin:0">
        You are receiving this because you joined the Travelholics Cruise Life list.
        <a href="${url}" style="color:#6b6b6b">Unsubscribe</a>.
      </p>
  `;
}

/**
 * RFC 2369 / RFC 8058 headers. Gmail and Outlook surface a native
 * "Unsubscribe" control from these, which keeps recipients off the "mark as
 * spam" button -- that button is what damages sending reputation.
 * List-Unsubscribe-Post lets the mail client do it in one click without
 * opening the page.
 */
export function unsubscribeHeaders(email: string): Record<string, string> {
  const url = buildUnsubscribeUrl(email);
  if (!url) return {};
  return {
    "List-Unsubscribe": `<${url}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
