import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { normalizeUsAddress, validateUsAddress } from "@/lib/address-validation";
import { verifyUsAddress } from "@/lib/usps-address";

const DUCK_HUNT_CONSENT_TEXT =
  "Yes, sign me up for the Travelholics Cruise Life list so I can receive cruise deals, shop drops, travel tips, and updates connected to my Duck Hunt reward. I understand I can unsubscribe anytime.";

const DUCK_HUNT_INTERESTS = ["newsletter", "duck_hunt", "shop_deals", "cruise_deals"];

type DuckHuntClaimRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  shipName?: string | null;
  travelReason?: string;
  duckNumber?: string | null;
  batch?: string | null;
  ship?: string | null;
  source?: string | null;
  cruise?: string | null;
  scanId?: string | null;
  shippingAddress1?: string;
  shippingAddress2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  /** Set by the client after the entrant chooses to use an unconfirmed address. */
  addressConfirmed?: boolean;
  newsletterOptIn?: boolean;
  consentText?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(value: string) {
  return UUID_PATTERN.test(value);
}

function uniqueInterests(interests: string[]) {
  return Array.from(new Set(interests.map((interest) => interest.trim()).filter(Boolean)));
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseKey = serviceRoleKey || anonKey;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Database not configured." }, { status: 500 });
  }

  const body = (await request.json()) as DuckHuntClaimRequest;
  const firstName = body.firstName?.trim() || "";
  const lastName = body.lastName?.trim() || "";
  const rawEmail = body.email?.trim() || "";
  const email = normalizeEmail(rawEmail);
  const consentText = body.consentText?.trim() || DUCK_HUNT_CONSENT_TEXT;
  const source = body.source?.trim() || "duck-hunt";
  const insertedShip = body.shipName?.trim() || body.ship?.trim() || null;
  const cruise = body.cruise?.trim() || null;
  const scanId = body.scanId?.trim() && isValidUuid(body.scanId.trim()) ? body.scanId.trim() : null;
  const shippingAddress1 = body.shippingAddress1?.trim() || "";
  const shippingCity = body.shippingCity?.trim() || "";
  const shippingState = body.shippingState?.trim() || "";
  const shippingZip = body.shippingZip?.trim() || "";

  if (!firstName || !rawEmail || !isValidEmail(rawEmail)) {
    return NextResponse.json({ error: "First name and a valid email are required." }, { status: 400 });
  }

  if (!lastName || !shippingAddress1 || !shippingCity || !shippingState || !shippingZip) {
    return NextResponse.json(
      { error: "A full shipping address is required so we can mail your magnet." },
      { status: 400 },
    );
  }

  // Same floor as the address form: the client's attributes do not survive a
  // direct POST, so junk is rejected here. See lib/address-validation.ts.
  const addressIssues = validateUsAddress({
    address1: shippingAddress1,
    address2: body.shippingAddress2?.trim() || "",
    city: shippingCity,
    state: shippingState,
    zip: shippingZip,
  });

  if (addressIssues.length > 0) {
    return NextResponse.json(
      { error: addressIssues[0].message, issues: addressIssues },
      { status: 400 },
    );
  }

  const address = normalizeUsAddress({
    address1: shippingAddress1,
    address2: body.shippingAddress2?.trim() || "",
    city: shippingCity,
    state: shippingState,
    zip: shippingZip,
  });

  // Advisory USPS check, same contract as the address route: unconfirmed is
  // offered back rather than refused, and any failure of the check itself
  // lets the claim through. See lib/usps-address.ts.
  const verification = await verifyUsAddress(address);

  if (verification.status === "unconfirmed" && !body.addressConfirmed) {
    return NextResponse.json(
      { error: verification.reason, needsConfirmation: true, address },
      { status: 409 },
    );
  }

  const addressToStore = verification.status === "verified" && verification.standardized
    ? normalizeUsAddress(verification.standardized)
    : address;

  const verificationStatus =
    verification.status === "verified"
      ? "verified"
      : verification.status === "unconfirmed"
        ? "unconfirmed_accepted"
        : "unchecked";

  // The verification columns are only written when the check actually ran.
  // That keeps this deploy independent of the migration: until USPS is
  // configured every result is "unchecked", the columns are left out of the
  // payload entirely, and the form works whether or not
  // 20261011120000_add_duck_hunt_address_verification.sql has been applied.
  // A NULL still shows up in the shipping queue -- the index is on
  // `IS DISTINCT FROM 'verified'`, which NULL satisfies.
  const verificationColumns =
    verification.status === "unchecked"
      ? {}
      : { address_verification: verificationStatus, address_verified_at: new Date().toISOString() };

  if (!body.newsletterOptIn) {
    return NextResponse.json(
      { error: "Newsletter opt-in is required to claim the Duck Hunt reward." },
      { status: 400 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const leadPayload = {
    first_name: firstName,
    last_name: lastName,
    email,
    city: body.city?.trim() || null,
    travel_reason: body.travelReason || null,
    duck_number: body.duckNumber?.trim() || null,
    batch: body.batch?.trim() || null,
    ship: insertedShip,
    source,
    cruise,
    scan_id: scanId,
    shipping_address1: addressToStore.address1,
    shipping_address2: addressToStore.address2 || null,
    shipping_city: addressToStore.city,
    shipping_state: addressToStore.state,
    shipping_zip: addressToStore.zip,
    ...verificationColumns,
    newsletter_opt_in: true,
    consent_text: consentText,
    consented_at: new Date().toISOString(),
  };

  if (serviceRoleKey) {
    const { data: lead, error: leadError } = await supabase
      .from("duck_hunt_leads")
      .insert(leadPayload)
      .select("id")
      .single();

    if (leadError) {
      console.error("Duck Hunt lead insert failed:", leadError);
      return NextResponse.json({ error: "Unable to save your Duck Hunt claim." }, { status: 500 });
    }

    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, source, interests")
      .eq("email", email)
      .maybeSingle();

    const mergedInterests = uniqueInterests([
      ...DUCK_HUNT_INTERESTS,
      ...((existing?.interests as string[] | null) || []),
    ]);

    const { data: subscriber, error: subscriberError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          first_name: firstName,
          city: body.city?.trim() || null,
          source: existing?.source || source,
          interests: mergedInterests,
          consent_status: "subscribed",
          consent_text: consentText,
          consented_at: new Date().toISOString(),
          unsubscribed_at: null,
          duck_hunt_lead_id: lead?.id || null,
          ship: insertedShip,
          duck_number: body.duckNumber?.trim() || null,
          batch: body.batch?.trim() || null,
          metadata: {
            latest_source: source,
            latest_signup_path: "duck-hunt-claim-api",
          },
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (subscriberError) {
      console.error("Duck Hunt newsletter signup failed:", subscriberError);
      return NextResponse.json({ error: "Unable to save your newsletter signup." }, { status: 500 });
    }

    if (subscriber?.id && lead?.id) {
      await supabase
        .from("duck_hunt_leads")
        .update({ newsletter_subscriber_id: subscriber.id })
        .eq("id", lead.id);
    }

    return NextResponse.json({ success: true, leadId: lead?.id, subscriberId: subscriber?.id });
  }

  const { error: leadError } = await supabase.from("duck_hunt_leads").insert(leadPayload);

  if (leadError) {
    console.error("Duck Hunt lead insert failed:", leadError);
    return NextResponse.json({ error: "Unable to save your Duck Hunt claim." }, { status: 500 });
  }

  const { error: subscriberError } = await supabase.from("newsletter_subscribers").insert({
    email,
    first_name: firstName,
    city: body.city?.trim() || null,
    source,
    interests: DUCK_HUNT_INTERESTS,
    consent_status: "subscribed",
    consent_text: consentText,
    consented_at: new Date().toISOString(),
    ship: insertedShip,
    duck_number: body.duckNumber?.trim() || null,
    batch: body.batch?.trim() || null,
    metadata: {
      latest_source: source,
      latest_signup_path: "duck-hunt-claim-api",
    },
  });

  if (subscriberError && subscriberError.code !== "23505") {
    console.error("Duck Hunt newsletter signup failed:", subscriberError);
    return NextResponse.json({ error: "Unable to save your newsletter signup." }, { status: 500 });
  }

  return NextResponse.json({ success: true, alreadySubscribed: subscriberError?.code === "23505" });
}
