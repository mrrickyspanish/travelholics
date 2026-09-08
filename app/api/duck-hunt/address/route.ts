import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ------------------------------------------------------------------
// Duck Hunt address capture
//
// The first ~30 QR registrants were captured before the claim form
// collected a mailing address — those rows have a name and email and
// nothing to ship to. This route backfills them: it matches the
// submitter to their EXISTING duck_hunt_leads row by email and updates
// it in place, so the address lands on the same record the rest of the
// campaign (scan attribution, newsletter link, duck number) hangs off.
//
// A brand-new email is never dropped on the floor — it gets its own
// lead row flagged with the address-form source, so an address is
// captured either way and the response says which path was taken.
//
// Deliberately no schema change: shipping_* / last_name / status all
// already exist (20260819000000_add_duck_hunt_shipping_address.sql),
// so this ships without a migration step.
// ------------------------------------------------------------------

const ADDRESS_FORM_SOURCE = "duck-hunt-address-form";

type DuckHuntAddressRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  shippingAddress1?: string;
  shippingAddress2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type LeadRow = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
};

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // RLS only grants anon INSERT on duck_hunt_leads — updating an existing
  // registrant's row requires the service role, so there's no anon-key
  // fallback here the way the claim route has one.
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Database not configured." }, { status: 500 });
  }

  const body = (await request.json()) as DuckHuntAddressRequest;

  const rawEmail = body.email?.trim() || "";
  const email = normalizeEmail(rawEmail);
  const firstName = body.firstName?.trim() || "";
  const lastName = body.lastName?.trim() || "";
  const shippingAddress1 = body.shippingAddress1?.trim() || "";
  const shippingAddress2 = body.shippingAddress2?.trim() || "";
  const shippingCity = body.shippingCity?.trim() || "";
  const shippingState = body.shippingState?.trim() || "";
  const shippingZip = body.shippingZip?.trim() || "";

  if (!rawEmail || !isValidEmail(rawEmail)) {
    return NextResponse.json(
      { error: "Enter the email address you registered with." },
      { status: 400 },
    );
  }

  if (!shippingAddress1 || !shippingCity || !shippingState || !shippingZip) {
    return NextResponse.json(
      { error: "A full mailing address is required so we can send your magnet." },
      { status: 400 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // The early registrations predate email normalization, so match
  // case-insensitively. ilike's `_` is a single-char wildcard, which a real
  // email can legitimately contain — so the pattern match is only a
  // shortlist, and the exact comparison happens below in JS.
  const { data: candidates, error: lookupError } = await supabase
    .from("duck_hunt_leads")
    .select("id, email, first_name, last_name, created_at")
    .ilike("email", email)
    .order("created_at", { ascending: false });

  if (lookupError) {
    console.error("Duck Hunt address lookup failed:", lookupError);
    return NextResponse.json({ error: "Unable to look up your registration." }, { status: 500 });
  }

  const matches = ((candidates as LeadRow[] | null) || []).filter(
    (row) => normalizeEmail(row.email || "") === email,
  );

  const addressPayload = {
    shipping_address1: shippingAddress1,
    shipping_address2: shippingAddress2 || null,
    shipping_city: shippingCity,
    shipping_state: shippingState,
    shipping_zip: shippingZip,
    status: "claimed",
  };

  if (matches.length > 0) {
    // Same person, same address — if they registered against more than one
    // duck, every one of their rows should be shippable.
    const { error: updateError } = await supabase
      .from("duck_hunt_leads")
      .update({
        ...addressPayload,
        // Only fill names in; never blank out what the registration captured.
        ...(firstName ? { first_name: firstName } : {}),
        ...(lastName ? { last_name: lastName } : {}),
      })
      .in(
        "id",
        matches.map((row) => row.id),
      );

    if (updateError) {
      console.error("Duck Hunt address update failed:", updateError);
      return NextResponse.json({ error: "Unable to save your mailing address." }, { status: 500 });
    }

    const primary = matches[0];

    return NextResponse.json({
      success: true,
      matched: true,
      updated: matches.length,
      leadId: primary.id,
      firstName: firstName || primary.first_name || "",
    });
  }

  // No prior registration for this email. Capturing it as a new lead beats
  // rejecting a cruiser who typo'd their signup email or used an alias —
  // the source tag makes these obvious to reconcile by hand later.
  if (!firstName) {
    return NextResponse.json(
      { error: "We couldn't find that email. Add your first name and we'll set you up." },
      { status: 400 },
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from("duck_hunt_leads")
    .insert({
      first_name: firstName,
      last_name: lastName || null,
      email,
      source: ADDRESS_FORM_SOURCE,
      ...addressPayload,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Duck Hunt address insert failed:", insertError);
    return NextResponse.json({ error: "Unable to save your mailing address." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    matched: false,
    updated: 1,
    leadId: inserted?.id,
    firstName,
  });
}
