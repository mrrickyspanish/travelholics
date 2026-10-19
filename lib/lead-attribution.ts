const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORAGE_KEY = "travelholics-campaign-v1";
type Campaign = Partial<Record<(typeof CAMPAIGN_KEYS)[number], string>>;

export function sanitizeCampaign(input: Record<string, unknown>): Campaign {
  const result: Campaign = {};
  for (const key of CAMPAIGN_KEYS) {
    if (typeof input[key] !== "string") continue;
    const value = input[key].replace(/[^a-zA-Z0-9 ._:-]/g, "").trim().slice(0, 80);
    if (value) result[key] = value;
  }
  return result;
}

/** Retain campaign tags for this tab's first attributed visit, without URLs or personal IDs. */
export function captureLeadAttribution(): Campaign {
  if (typeof window === "undefined") return {};
  let incoming: Campaign = {};
  try {
    const params = new URLSearchParams(window.location.search);
    incoming = sanitizeCampaign(Object.fromEntries(CAMPAIGN_KEYS.map((key) => [key, params.get(key)])));
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}");
    const existing = stored && typeof stored === "object" ? sanitizeCampaign(stored) : {};
    if (Object.keys(existing).length) return existing;
    if (Object.keys(incoming).length) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
  } catch {
    // Disabled storage must never prevent a traveler from making an inquiry.
  }
  return incoming;
}

export function appendLeadAttribution(message: string): string {
  const campaign = captureLeadAttribution();
  const tags = Object.entries(campaign).map(([key, value]) => `${key}=${value}`).join("; ");
  return tags ? `${message}\n\nReferral: ${tags}` : message;
}
