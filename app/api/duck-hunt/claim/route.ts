import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { sendAlert } from "@/lib/alerts";

const DUCK_HUNT_CONSENT_TEXT =
  "Yes, sign me up for the Travelholics Cruise Life list so I can receive cruise deals, shop drops, travel tips, and updates connected to my Duck Hunt reward. I understand I can unsubscribe anytime.";

const DUCK_HUNT_INTERESTS = ["newsletter", "duck_hunt", "shop_deals", "cruise_deals"];

type DuckHuntClaimRequest = {
  firstName?: string;
  email?: string;
  city?: string;
  shipName?: string | null;
  travelReason?: string;
  duckNumber?: string | null;
  batch?: string | null;
  ship?: string | null;
  source?: string | null;
  newsletterOptIn?: boolean;
  consentText?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  const rawEmail = body.email?.trim() || "";
  const email = normalizeEmail(rawEmail);
  const consentText = body.consentText?.trim() || DUCK_HUNT_CONSENT_TEXT;
  const source = body.source?.trim() || "duck-hunt";
  const insertedShip = body.shipName?.trim() || body.ship?.trim() || null;

  if (!firstName || !rawEmail || !isValidEmail(rawEmail)) {
    return NextResponse.json({ error: "First name and a valid email are required." }, { status: 400 });
  }

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
    email,
    city: body.city?.trim() || null,
    travel_reason: body.travelReason || null,
    duck_number: body.duckNumber?.trim() || null,
    batch: body.batch?.trim() || null,
    ship: insertedShip,
    source,
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
      await sendAlert("Duck Hunt lead insert failed", { email, error: leadError.message });
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
      await sendAlert("Duck Hunt newsletter signup failed", { email, error: subscriberError.message });
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
    await sendAlert("Duck Hunt lead insert failed", { email, error: leadError.message });
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
    await sendAlert("Duck Hunt newsletter signup failed", { email, error: subscriberError.message });
    return NextResponse.json({ error: "Unable to save your newsletter signup." }, { status: 500 });
  }

  return NextResponse.json({ success: true, alreadySubscribed: subscriberError?.code === "23505" });
}
