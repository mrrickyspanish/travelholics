import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Pure token logic for unsubscribe links. No env access and no `server-only`,
 * so it can be exercised directly by `npm run check:unsubscribe` -- the
 * forgery cases are the part worth testing, and a module that reads its own
 * secret at import time cannot be tested without one.
 *
 * The signing key is always passed in. `lib/newsletter-unsubscribe.ts` is the
 * server-only wrapper that supplies it.
 */

export function normalizeSubscriberEmail(email: string): string {
  return email.trim().toLowerCase();
}

function base64url(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded + "=".repeat((4 - (padded.length % 4)) % 4), "base64");
}

/** HMAC-SHA256 of the normalized address, base64url encoded. */
export function signEmail(key: string, email: string): string {
  return base64url(createHmac("sha256", key).update(normalizeSubscriberEmail(email)).digest());
}

export function verifyEmailToken(key: string, email: string, token: string): boolean {
  if (!key || !token) return false;
  const a = Buffer.from(signEmail(key, email));
  const b = Buffer.from(token);
  // timingSafeEqual throws on a length mismatch, so the lengths are compared
  // first; only equal-length candidates reach the constant-time comparison.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Carries the address through a URL without needing a second parameter. */
export function encodeEmailParam(email: string): string {
  return base64url(Buffer.from(normalizeSubscriberEmail(email), "utf8"));
}

export function decodeEmailParam(value: string): string | null {
  try {
    const decoded = fromBase64url(value).toString("utf8");
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decoded) ? normalizeSubscriberEmail(decoded) : null;
  } catch {
    return null;
  }
}
