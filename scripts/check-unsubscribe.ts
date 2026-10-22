import {
  decodeEmailParam,
  encodeEmailParam,
  normalizeSubscriberEmail,
  signEmail,
  verifyEmailToken,
} from "../lib/newsletter-unsubscribe-token";

const KEY = "test-signing-key-not-a-real-secret";
const OTHER_KEY = "a-different-signing-key";

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) {
    failures += 1;
    console.error(`  ✗ ${label}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
  return ok;
}

const EMAIL = "Rider@Example.COM";
const token = signEmail(KEY, EMAIL);

// --- the link works for the address it was issued for -------------------
check("valid token verifies", verifyEmailToken(KEY, EMAIL, token), true);
check("case/whitespace normalized", verifyEmailToken(KEY, "  rider@example.com ", token), true);

// --- forgery and tampering ----------------------------------------------
// The whole point of signing: a token must not unsubscribe a different person.
check("token does not work for another address", verifyEmailToken(KEY, "someone@else.com", token), false);
check("token minted with another key is rejected", verifyEmailToken(KEY, EMAIL, signEmail(OTHER_KEY, EMAIL)), false);
check("empty token rejected", verifyEmailToken(KEY, EMAIL, ""), false);
check("missing key rejected", verifyEmailToken("", EMAIL, token), false);
check("truncated token rejected", verifyEmailToken(KEY, EMAIL, token.slice(0, -1)), false);
check("padded token rejected", verifyEmailToken(KEY, EMAIL, `${token}x`), false);
check("flipped character rejected", verifyEmailToken(KEY, EMAIL, `${token.slice(0, -1)}${token.at(-1) === "A" ? "B" : "A"}`), false);
check("garbage token rejected", verifyEmailToken(KEY, EMAIL, "not-a-token"), false);

// A length mismatch must return false, not throw -- timingSafeEqual throws
// on unequal lengths, and an exception here would 500 the unsubscribe route.
try {
  verifyEmailToken(KEY, EMAIL, "short");
} catch (error) {
  failures += 1;
  console.error(`  ✗ length mismatch threw instead of returning false: ${String(error)}`);
}

// --- address round trip ---------------------------------------------------
check("round trips through a URL param", decodeEmailParam(encodeEmailParam(EMAIL)), "rider@example.com");
check("plus-addressing survives", decodeEmailParam(encodeEmailParam("a+b@example.com")), "a+b@example.com");
check("non-base64 input rejected", decodeEmailParam("!!!!"), null);
check("decoded non-address rejected", decodeEmailParam(Buffer.from("not an email").toString("base64url")), null);
check("empty param rejected", decodeEmailParam(""), null);
check("normalization is idempotent", normalizeSubscriberEmail(normalizeSubscriberEmail(EMAIL)), "rider@example.com");

// --- determinism ----------------------------------------------------------
// Links are regenerated per send rather than stored, so the same address must
// always produce the same token or older email would stop working.
check("signing is deterministic", signEmail(KEY, EMAIL), token);

if (failures > 0) {
  console.error(`\n✗ unsubscribe token checks failed: ${failures}`);
  process.exit(1);
}

console.log("✓ unsubscribe tokens clean — signed links verify, forged and tampered links rejected");
