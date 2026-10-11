import type { UsAddressInput } from "./address-validation";

// ---------------------------------------------------------------------------
// USPS Addresses API v3 (apis.usps.com).
//
// The legacy Web Tools XML API was retired in January 2026; this is the
// OAuth2 REST replacement. Credentials come from developer.usps.com and are
// read from USPS_CLIENT_ID / USPS_CLIENT_SECRET.
//
// FAIL-OPEN, DELIBERATELY. Every failure path -- not configured, token
// refused, USPS down, request timed out, response unparseable -- returns
// "unchecked" rather than throwing. Nobody is ever stopped from claiming a
// prize because a third-party API had a bad afternoon. The caller records the
// status so unverified addresses can be eyeballed before postage is paid.
//
// Endpoints and field names are per USPS's own examples:
//   https://github.com/USPS/api-examples
// ---------------------------------------------------------------------------

const DEFAULT_BASE = "https://apis.usps.com";
const TIMEOUT_MS = 4000;

export type UspsStatus =
  // USPS confirms it delivers there (DPVConfirmation = Y).
  | "verified"
  // USPS answered, but will not confirm delivery to this exact address.
  | "unconfirmed"
  // The check did not run. Never a reason to block.
  | "unchecked";

export type UspsResult = {
  status: UspsStatus;
  /** Why, in plain words — shown to the entrant when status is unconfirmed. */
  reason?: string;
  /** USPS's standardized form. Only ever populated when status is "verified". */
  standardized?: UsAddressInput;
  /** Raw DPV code, for the record. */
  dpv?: string;
};

type UspsAddressResponse = {
  address?: {
    streetAddress?: string | null;
    secondaryAddress?: string | null;
    city?: string | null;
    state?: string | null;
    ZIPCode?: string | null;
    ZIPPlus4?: string | null;
  };
  additionalInfo?: { DPVConfirmation?: string | null };
};

// DPVConfirmation, per USPS. Only "Y" means "mail gets delivered here".
const DPV_REASONS: Record<string, string> = {
  D: "USPS knows this building but needs the apartment or suite number.",
  S: "USPS knows this building but does not recognise that apartment or suite number.",
  N: "USPS does not recognise this as a delivery point.",
};

let cachedToken: { value: string; expiresAt: number } | null = null;

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function getToken(base: string, id: string, secret: string): Promise<string | null> {
  // Reuse until a minute before expiry, so a burst of claims is one token.
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const response = await fetchWithTimeout(`${base}/oauth2/v3/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: id, client_secret: secret, grant_type: "client_credentials" }),
  });
  if (!response.ok) return null;

  const body = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) return null;

  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

export async function verifyUsAddress(input: UsAddressInput): Promise<UspsResult> {
  const clientId = process.env.USPS_CLIENT_ID;
  const clientSecret = process.env.USPS_CLIENT_SECRET;
  const base = process.env.USPS_API_BASE || DEFAULT_BASE;

  if (!clientId || !clientSecret) {
    return { status: "unchecked", reason: "Address verification is not configured." };
  }

  try {
    const token = await getToken(base, clientId, clientSecret);
    if (!token) return { status: "unchecked", reason: "Could not reach address verification." };

    const query = new URLSearchParams({
      streetAddress: input.address1,
      city: input.city,
      state: input.state,
      ZIPCode: input.zip.slice(0, 5),
    });
    if (input.address2) query.set("secondaryAddress", input.address2);

    const response = await fetchWithTimeout(`${base}/addresses/v3/address?${query}`, {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    });

    // 400 means USPS parsed the request and could not match the address --
    // that is an answer, not an outage.
    if (response.status === 400) {
      return { status: "unconfirmed", reason: "USPS could not find this address." };
    }
    if (!response.ok) {
      return { status: "unchecked", reason: "Could not reach address verification." };
    }

    const body = (await response.json()) as UspsAddressResponse;
    const dpv = body.additionalInfo?.DPVConfirmation || undefined;

    if (dpv !== "Y") {
      return {
        status: "unconfirmed",
        dpv,
        reason: (dpv && DPV_REASONS[dpv]) || "USPS could not confirm delivery to this address.",
      };
    }

    const a = body.address || {};
    return {
      status: "verified",
      dpv,
      standardized: {
        address1: a.streetAddress || input.address1,
        address2: a.secondaryAddress || input.address2 || "",
        city: a.city || input.city,
        state: a.state || input.state,
        zip: a.ZIPPlus4 ? `${a.ZIPCode}-${a.ZIPPlus4}` : a.ZIPCode || input.zip,
      },
    };
  } catch {
    // Aborted, offline, malformed JSON -- all the same answer: do not block.
    return { status: "unchecked", reason: "Could not reach address verification." };
  }
}

/** Test seam: the token cache is module state and would leak between cases. */
export function __resetUspsTokenCache() {
  cachedToken = null;
}
