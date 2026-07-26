import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Short-lived signed tokens for guide downloads.
 *
 * The guide files sit outside public/, so a download is only reachable with a
 * token minted by /api/guides/unlock once a name and email have been captured.
 * The token is deliberately short-lived and bound to a single guide id.
 */

/** How long an unlock link stays valid. */
export const GUIDE_TOKEN_TTL_MS = 30 * 60 * 1000;

function getSecret() {
  const secret =
    process.env.GUIDE_DOWNLOAD_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!secret) {
    throw new Error(
      "Guide downloads need a signing secret. Set GUIDE_DOWNLOAD_SECRET.",
    );
  }

  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createGuideToken(guideId: string, expiresAt: number) {
  return sign(`${guideId}.${expiresAt}`);
}

export function verifyGuideToken(
  guideId: string,
  expiresAt: number,
  token: string,
) {
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  const expected = Buffer.from(createGuideToken(guideId, expiresAt));
  const provided = Buffer.from(token);

  // timingSafeEqual throws on length mismatch, so guard first.
  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
}

/** Build the download URL handed back to the browser after a successful unlock. */
export function buildGuideDownloadPath(guideId: string) {
  const expiresAt = Date.now() + GUIDE_TOKEN_TTL_MS;
  const token = createGuideToken(guideId, expiresAt);
  const params = new URLSearchParams({
    guide: guideId,
    expires: String(expiresAt),
    token,
  });

  return `/api/guides/download?${params.toString()}`;
}
