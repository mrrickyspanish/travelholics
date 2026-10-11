#!/usr/bin/env node
/**
 * Address validator checks.
 *
 * The validator's job is to reject junk WITHOUT ever rejecting a real address,
 * so the "must pass" table matters more than the "must fail" one: a false
 * rejection means a real winner cannot claim their magnet.
 *
 * Usage:  npm run check:address
 */
import { validateUsAddress, type UsAddressInput } from "../lib/address-validation";

type Case = [label: string, input: UsAddressInput];

// Real shapes US mail actually uses. Every one of these MUST pass.
const MUST_PASS: Case[] = [
  ["plain street", { address1: "123 Main St", city: "Springfield", address2: "", state: "IL", zip: "62704" }],
  ["ZIP+4", { address1: "123 N 1st St", address2: "Apt 4B", city: "St. Louis", state: "MO", zip: "63101-1234" }],
  ["PO box", { address1: "PO Box 1234", address2: "", city: "Charlotte Amalie", state: "VI", zip: "00802" }],
  ["rural route", { address1: "RR 2 Box 152", address2: "", city: "Hico", state: "WV", zip: "25854" }],
  ["highway contract", { address1: "HC 1 Box 5", address2: "", city: "Tok", state: "AK", zip: "99780" }],
  ["general delivery", { address1: "General Delivery", address2: "", city: "Juneau", state: "AK", zip: "99801" }],
  ["spelled-out number", { address1: "One Microsoft Way", address2: "", city: "Redmond", state: "WA", zip: "98052" }],
  ["military APO", { address1: "Unit 8734 Box 2050", address2: "", city: "APO", state: "AE", zip: "09501" }],
  ["Guam", { address1: "123 Marine Corps Dr", address2: "", city: "Tamuning", state: "GU", zip: "96913" }],
  ["apostrophe city", { address1: "45 Oak Ave", address2: "", city: "Coeur d'Alene", state: "ID", zip: "83814" }],
  ["hyphen city", { address1: "900 Elm St", address2: "", city: "Winston-Salem", state: "NC", zip: "27101" }],
  ["lowercase state", { address1: "1600 Pennsylvania Ave NW", address2: "", city: "Washington", state: "dc", zip: "20500" }],
  ["street named Nathan", { address1: "12 Nathan Ln", address2: "", city: "Nashua", state: "NH", zip: "03060" }],
];

// Junk. Every one of these MUST be rejected.
const MUST_FAIL: Case[] = [
  ["empty", { address1: "", address2: "", city: "", state: "", zip: "" }],
  ["keyboard mash", { address1: "asdf", address2: "", city: "asdf", state: "XX", zip: "1" }],
  ["numbers only street", { address1: "123", address2: "", city: "Springfield", state: "IL", zip: "62704" }],
  ["no street number", { address1: "Main Street", address2: "", city: "Springfield", state: "IL", zip: "62704" }],
  ["n/a", { address1: "n/a", address2: "", city: "n/a", state: "IL", zip: "62704" }],
  ["repeated char", { address1: "xxxxxxx", address2: "", city: "xxxx", state: "IL", zip: "62704" }],
  ["short zip", { address1: "123 Main St", address2: "", city: "Springfield", state: "IL", zip: "1234" }],
  ["long zip", { address1: "123 Main St", address2: "", city: "Springfield", state: "IL", zip: "123456" }],
  ["alpha zip", { address1: "123 Main St", address2: "", city: "Springfield", state: "IL", zip: "abcde" }],
  ["all-zero zip", { address1: "123 Main St", address2: "", city: "Springfield", state: "IL", zip: "00000" }],
  ["unknown state", { address1: "123 Main St", address2: "", city: "Springfield", state: "ZZ", zip: "62704" }],
  ["spelled-out state", { address1: "123 Main St", address2: "", city: "Springfield", state: "Illinois", zip: "62704" }],
  ["punctuation street", { address1: ".....", address2: "", city: "Springfield", state: "IL", zip: "62704" }],
  ["digit in city", { address1: "123 Main St", address2: "", city: "Spr1ngfield", state: "IL", zip: "62704" }],
  ["overlong street", { address1: "1 " + "a".repeat(120), address2: "", city: "Springfield", state: "IL", zip: "62704" }],
];

let failed = 0;

for (const [label, input] of MUST_PASS) {
  const issues = validateUsAddress(input);
  if (issues.length) {
    failed++;
    console.log(`✗ FALSE REJECTION  ${label} — ${issues.map((i) => `${i.field}: ${i.message}`).join("; ")}`);
  }
}
for (const [label, input] of MUST_FAIL) {
  if (validateUsAddress(input).length === 0) {
    failed++;
    console.log(`✗ JUNK ACCEPTED    ${label}`);
  }
}

console.log(
  failed === 0
    ? `✓ address validation clean — ${MUST_PASS.length} real addresses accepted, ${MUST_FAIL.length} junk inputs rejected`
    : `\n${failed} failure(s).`,
);
process.exit(failed === 0 ? 0 : 1);
