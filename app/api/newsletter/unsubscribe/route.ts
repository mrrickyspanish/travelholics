import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  decodeEmailParam,
  normalizeSubscriberEmail,
  verifyUnsubscribeToken,
} from "@/lib/newsletter-unsubscribe";

type UnsubscribeOutcome =
  | { status: "unsubscribed" }
  | { status: "already" }
  | { status: "not_found" }
  | { status: "error"; message: string };

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // The service role is required, not optional: the table's RLS grants anon
  // INSERT only, so an anon client cannot flip consent_status and the
  // unsubscribe would silently no-op.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function unsubscribe(email: string): Promise<UnsubscribeOutcome> {
  const supabase = supabaseAdmin();
  if (!supabase) return { status: "error", message: "Newsletter is not configured." };

  const { data: existing, error: lookupError } = await supabase
    .from("newsletter_subscribers")
    .select("id, consent_status")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    console.error("Unsubscribe lookup failed:", lookupError);
    return { status: "error", message: "Unable to update your preferences." };
  }

  // Not on the list is a success from the recipient's point of view -- they
  // asked not to be emailed and they will not be. Saying "not found" invites
  // them to try again or complain instead.
  if (!existing) return { status: "not_found" };
  if (existing.consent_status === "unsubscribed") return { status: "already" };

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ consent_status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("id", existing.id);

  if (error) {
    console.error("Unsubscribe update failed:", error);
    return { status: "error", message: "Unable to update your preferences." };
  }

  return { status: "unsubscribed" };
}

/**
 * Accepts three shapes:
 *   - JSON  { email, token }            from the confirmation page
 *   - form  e=<encoded>&t=<token>       from a no-JS form post
 *   - RFC 8058 one-click: the mail client posts `List-Unsubscribe=One-Click`
 *     with no body, so the address and token come from the query string.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  let email: string | null = null;
  let token = "";

  const contentType = request.headers.get("content-type") || "";
  let oneClick = false;

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as { email?: string; token?: string };
    email = body.email ? normalizeSubscriberEmail(body.email) : null;
    token = body.token || "";
  } else if (contentType.includes("form")) {
    const form = await request.formData().catch(() => null);
    const rawEmail = form?.get("e");
    const rawToken = form?.get("t");
    if (typeof rawEmail === "string") email = decodeEmailParam(rawEmail);
    if (typeof rawToken === "string") token = rawToken;
    // A mail client doing RFC 8058 one-click posts exactly this field and
    // nothing else. It shares a content type with the page's no-JS form, so
    // the body is what tells them apart -- and they need different replies:
    // the mail client wants a plain 200, the browser wants a page.
    oneClick = form?.get("List-Unsubscribe") === "One-Click";
  }

  // One-click and form posts both carry the pair on the URL; fall back to it
  // whenever the body did not supply one.
  if (!email) {
    const queryEmail = url.searchParams.get("e");
    if (queryEmail) email = decodeEmailParam(queryEmail);
  }
  if (!token) token = url.searchParams.get("t") || "";

  // A browser form post (no JavaScript) should land on a page, not on JSON.
  // Fetch from the confirmation form sends Accept: */*, one-click sends no
  // HTML preference either, so only a real navigation takes this branch.
  const wantsHtml = !oneClick && (request.headers.get("accept") || "").includes("text/html");
  const encodedEmail = url.searchParams.get("e") || "";

  if (!email || !verifyUnsubscribeToken(email, token)) {
    if (wantsHtml) {
      return NextResponse.redirect(new URL("/unsubscribe?invalid=1", url), 303);
    }
    return NextResponse.json({ error: "This unsubscribe link is not valid." }, { status: 400 });
  }

  const outcome = await unsubscribe(email);

  if (outcome.status === "error") {
    if (wantsHtml) {
      return NextResponse.redirect(new URL("/unsubscribe?invalid=1", url), 303);
    }
    return NextResponse.json({ error: outcome.message }, { status: 500 });
  }

  if (wantsHtml) {
    return NextResponse.redirect(new URL(`/unsubscribe?e=${encodedEmail}&done=1`, url), 303);
  }

  return NextResponse.json({ success: true, status: outcome.status });
}
