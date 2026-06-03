import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const DEFAULT_CONSENT_TEXT =
  "Yes, sign me up for the Travelholics Cruise Life list so I can receive cruise deals, shop drops, travel tips, and Travelholics updates. I understand I can unsubscribe anytime.";

const DEFAULT_INTERESTS = ["newsletter", "shop_deals", "cruise_deals"];
const TO_EMAIL = "rjsmom1_68@yahoo.com";
const BCC_EMAIL = "ricky@creativeeyestudios.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

type NewsletterSubscribeRequest = {
  firstName?: string;
  first_name?: string;
  email?: string;
  city?: string;
  source?: string;
  interests?: string[];
  consentText?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function uniqueInterests(interests: string[]) {
  return Array.from(
    new Set(
      interests
        .map((interest) => interest.trim())
        .filter(Boolean),
    ),
  );
}

async function sendNewsletterSignupNotification({
  firstName,
  email,
  source,
  interests,
  already,
}: {
  firstName: string | null;
  email: string;
  source: string;
  interests: string[];
  already?: boolean;
}) {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.warn("Newsletter signup notification skipped: RESEND_API_KEY is not configured.");
    return;
  }

  const resend = new Resend(resendKey);
  const subject = already
    ? `Travelholics Newsletter Updated: ${email}`
    : `New Travelholics Newsletter Signup: ${firstName || email}`;

  const html = `
    <h2>${already ? "Newsletter Subscriber Updated" : "New Newsletter Signup"}</h2>
    <p><strong>First Name:</strong> ${firstName || "N/A"}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Source:</strong> ${source}</p>
    <p><strong>Interests:</strong> ${interests.join(", ")}</p>
    <p><strong>Status:</strong> Subscribed</p>
  `;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    bcc: [BCC_EMAIL],
    subject,
    html,
    replyTo: email,
  });

  if (error) {
    console.error("Newsletter signup notification failed:", error);
  }
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseKey = serviceRoleKey || anonKey;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Database not configured." }, { status: 500 });
  }

  const body = (await request.json()) as NewsletterSubscribeRequest;
  const rawEmail = body.email?.trim() || "";
  const firstName = body.firstName?.trim() || body.first_name?.trim() || null;
  const source = body.source?.trim() || "footer-newsletter";
  const consentText = body.consentText?.trim() || DEFAULT_CONSENT_TEXT;
  const requestedInterests = uniqueInterests([
    ...DEFAULT_INTERESTS,
    ...(Array.isArray(body.interests) ? body.interests : []),
  ]);

  if (!rawEmail || !isValidEmail(rawEmail)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const email = normalizeEmail(rawEmail);
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  if (serviceRoleKey) {
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, source, interests")
      .eq("email", email)
      .maybeSingle();

    const mergedInterests = uniqueInterests([
      ...requestedInterests,
      ...((existing?.interests as string[] | null) || []),
    ]);

    const { data, error } = await supabase
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
          metadata: {
            latest_source: source,
            latest_signup_path: "newsletter-subscribe-api",
          },
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (error) {
      console.error("Newsletter signup failed:", error);
      return NextResponse.json({ error: "Unable to save your signup." }, { status: 500 });
    }

    await sendNewsletterSignupNotification({
      firstName,
      email,
      source,
      interests: mergedInterests,
      already: Boolean(existing),
    });

    return NextResponse.json({ success: true, subscriberId: data?.id, already: Boolean(existing) });
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    first_name: firstName,
    city: body.city?.trim() || null,
    source,
    interests: requestedInterests,
    consent_status: "subscribed",
    consent_text: consentText,
    consented_at: new Date().toISOString(),
    metadata: {
      latest_source: source,
      latest_signup_path: "newsletter-subscribe-api",
    },
  });

  if (error) {
    if (error.code === "23505") {
      await sendNewsletterSignupNotification({
        firstName,
        email,
        source,
        interests: requestedInterests,
        already: true,
      });

      return NextResponse.json({ success: true, already: true });
    }

    console.error("Newsletter signup failed:", error);
    return NextResponse.json({ error: "Unable to save your signup." }, { status: 500 });
  }

  await sendNewsletterSignupNotification({
    firstName,
    email,
    source,
    interests: requestedInterests,
  });

  return NextResponse.json({ success: true });
}
