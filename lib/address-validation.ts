import { US_STATE_SET } from "./us-states";

// ---------------------------------------------------------------------------
// Server-side US address validation.
//
// This is the floor, not the ceiling. It rejects malformed and obviously junk
// input; it CANNOT tell you whether a well-formed address actually exists.
// "123 Fake St, Springfield, IL 62704" passes everything here. Confirming a
// real, deliverable address needs a verification API (USPS, Smarty, Lob).
//
// It has to live on the server because the client's `required` and `pattern`
// attributes are advisory -- a direct POST to the route skips all of them.
//
// Tuned to reject junk without ever rejecting a real address, so the odd
// shapes US mail actually uses are allowed on purpose: PO boxes, rural routes
// ("RR 2 Box 152"), highway contracts ("HC 1 Box 5"), General Delivery, and
// spelled-out street numbers ("One Microsoft Way"). When in doubt it accepts.
// ---------------------------------------------------------------------------

export type UsAddressInput = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
};

export type AddressField = "address1" | "address2" | "city" | "state" | "zip";
export type AddressIssue = { field: AddressField; message: string };

const MAX_LINE = 100;
const MAX_CITY = 60;

// Whole-value placeholders. Matched against the entire trimmed, lowercased
// field, never as a substring -- "Nathan Ln" must not trip the "na" entry.
const PLACEHOLDERS = new Set([
  "n/a", "na", "none", "nil", "null", "undefined", "test", "testing",
  "asdf", "asdfasdf", "qwerty", "abc", "xxx", "xx", "tbd", "same",
  "unknown", "no", "nope", "-", ".", "..", "...", "0",
]);

// Street numbers are occasionally spelled out on real addresses.
const NUMBER_WORDS = /^(one|two|three|four|five|six|seven|eight|nine|ten)\b/i;

// USPS counter pickup: a legitimate line with no number at all.
const NO_NUMBER_OK = /^general\s+delivery$/i;

const letterCount = (value: string) => (value.match(/\p{L}/gu) || []).length;

const isPlaceholder = (value: string) => PLACEHOLDERS.has(value.trim().toLowerCase());

// "xxxxxx", "....", "aaaa" -- one character repeated is never an address.
const isSingleRepeatedChar = (value: string) => {
  const squashed = value.replace(/\s/g, "");
  return squashed.length > 1 && new Set(squashed).size === 1;
};

export function validateUsAddress(input: UsAddressInput): AddressIssue[] {
  const issues: AddressIssue[] = [];

  const address1 = input.address1.trim();
  const address2 = (input.address2 || "").trim();
  const city = input.city.trim();
  const state = input.state.trim().toUpperCase();
  const zip = input.zip.trim();

  // --- street line ---------------------------------------------------------
  if (address1.length < 4) {
    issues.push({ field: "address1", message: "Enter your full street address." });
  } else if (address1.length > MAX_LINE) {
    issues.push({ field: "address1", message: "That street address is too long." });
  } else if (isPlaceholder(address1) || isSingleRepeatedChar(address1)) {
    issues.push({ field: "address1", message: "Enter your full street address." });
  } else if (letterCount(address1) < 2) {
    issues.push({ field: "address1", message: "Enter a street name, not just numbers." });
  } else if (!/\d/.test(address1) && !NUMBER_WORDS.test(address1) && !NO_NUMBER_OK.test(address1)) {
    issues.push({ field: "address1", message: "Include the street or box number." });
  }

  // --- apt / suite (optional) ---------------------------------------------
  if (address2.length > MAX_LINE) {
    issues.push({ field: "address2", message: "That apartment or suite line is too long." });
  }

  // --- city ----------------------------------------------------------------
  if (city.length < 2) {
    issues.push({ field: "city", message: "Enter your city." });
  } else if (city.length > MAX_CITY) {
    issues.push({ field: "city", message: "That city name is too long." });
  } else if (isPlaceholder(city) || isSingleRepeatedChar(city) || letterCount(city) < 2) {
    issues.push({ field: "city", message: "Enter your city." });
  } else if (/\d/.test(city)) {
    // No US city name contains a digit.
    issues.push({ field: "city", message: "City names do not contain numbers." });
  }

  // --- state ---------------------------------------------------------------
  if (!US_STATE_SET.has(state)) {
    issues.push({ field: "state", message: "Choose a state from the list." });
  }

  // --- ZIP -----------------------------------------------------------------
  if (!/^\d{5}(-\d{4})?$/.test(zip)) {
    issues.push({ field: "zip", message: "Enter a 5-digit ZIP code." });
  } else if (/^0{5}/.test(zip)) {
    issues.push({ field: "zip", message: "Enter a valid ZIP code." });
  }

  return issues;
}

// Normalized values to store, so the database does not collect the same
// address in five different casings and spacings.
export function normalizeUsAddress(input: UsAddressInput) {
  const collapse = (value: string) => value.trim().replace(/\s+/g, " ");
  return {
    address1: collapse(input.address1),
    address2: collapse(input.address2 || "") || null,
    city: collapse(input.city),
    state: input.state.trim().toUpperCase(),
    zip: input.zip.trim(),
  };
}
