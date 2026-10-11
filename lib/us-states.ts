// Single source of truth for the state dropdown and for server-side
// validation. These were two separate literals in app/duck-hunt/page.tsx and
// app/duck-hunt-address/page.tsx, which is how they drifted apart in
// formatting and how the server ended up not checking the value at all.
//
// Includes the territories and the military "states". Without AA/AE/AP a
// service member at an APO/FPO cannot complete the form, and without GU/AS/MP
// neither can anyone in Guam, American Samoa or the Northern Marianas.
export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY",
  // Territories
  "AS", "GU", "MP", "PR", "VI",
  // Military (APO / FPO / DPO)
  "AA", "AE", "AP",
] as const;

export type UsState = (typeof US_STATES)[number];

export const US_STATE_SET: ReadonlySet<string> = new Set(US_STATES);

// What the dropdown shows, so the territories and military codes are not just
// bare two-letter codes a visitor has to guess at.
export const US_STATE_LABELS: Record<string, string> = {
  AS: "AS — American Samoa",
  GU: "GU — Guam",
  MP: "MP — N. Mariana Is.",
  PR: "PR — Puerto Rico",
  VI: "VI — U.S. Virgin Islands",
  AA: "AA — Armed Forces Americas",
  AE: "AE — Armed Forces Europe",
  AP: "AP — Armed Forces Pacific",
};
