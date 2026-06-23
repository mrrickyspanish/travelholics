import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import { sendAlert } from "@/lib/alerts";

const DEFAULT_CONSENT_TEXT =
  "Yes, sign me up for the Travelholics Cruise Life list so I can receive cruise deals, shop drops, travel tips, and Travelholics updates. I understand I can unsubscribe anytime.";

const DEFAULT_INTERESTS = ["newsletter", "shop_deals", "cruise_deals"];
const TO_EMAIL = "rjsmom1_68@yahoo.com";
const BCC_EMAIL = "ricky@creativeeyestudios.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const NEWSLETTER_AUTOREPLY_ENABLED = process.env.NEWSLETTER_AUTOREPLY_ENABLED !== "false";
const NEWSLETTER_CONTACT_EMAIL = "hello@yotravelholic.com";
const NEWSLETTER_WEBSITE_URL = "yotravelholic.com";

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

function getResendClient() {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return null;
  }

  return new Resend(resendKey);
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
  const resend = getResendClient();

  if (!resend) {
    console.warn("Newsletter signup notification skipped: RESEND_API_KEY is not configured.");
    return;
  }

  try {
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
      await sendAlert("Newsletter signup notification email failed", { email, error: error.message });
    }
  } catch (error) {
    console.error("Newsletter signup notification exception:", error);
    await sendAlert("Newsletter signup notification threw an exception", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function sendNewsletterSignupAutoReply({
  firstName,
  email,
  already,
}: {
  firstName: string | null;
  email: string;
  already?: boolean;
}) {
  if (!NEWSLETTER_AUTOREPLY_ENABLED) {
    return;
  }

  const resend = getResendClient();

  if (!resend) {
    return;
  }

  try {
    const name = firstName || "there";
    const subject = already
      ? "You are still on the Travelholics Cruise Life list"
      : "Welcome to the Travelholics Cruise Life list";

    const html = already
      ? `
        <p>Hi ${name},</p>
        <p>You are already subscribed to Travelholics Cruise Life updates. We will keep sending cruise deals, shop drops, and travel tips to this email address.</p>
        <p>If this was not you, reply to this email and we will help.</p>
        <p>Best,<br />Travelholics Team<br />${NEWSLETTER_CONTACT_EMAIL}<br />${NEWSLETTER_WEBSITE_URL}</p>
      `
      : `
        <p>Hi ${name},</p>
        <p>Welcome to Travelholics Cruise Life. You are all set to receive cruise deals, shop drops, travel tips, and Travelholics updates.</p>
        <p>Keep an eye out for our next email.</p>
        <p>Best,<br />Travelholics Team<br />${NEWSLETTER_CONTACT_EMAIL}<br />${NEWSLETTER_WEBSITE_URL}</p>
      `;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject,
      html,
      replyTo: TO_EMAIL,
    });

    if (error) {
      console.error("Newsletter auto-reply failed:", error);
    }
  } catch (error) {
    console.error("Newsletter auto-reply exception:", error);
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
      console.error("Newsletter signup failed:", JSON.stringify(error, null, 2));
      await sendAlert("Newsletter signup failed to save", { email, source, error: error.message });
      return NextResponse.json(
        { error: "Unable to save your signup.", detail: error.message, code: error.code },
        { status: 500 },
      );
    }

    await Promise.all([
      sendNewsletterSignupNotification({
        firstName,
        email,
        source,
        interests: mergedInterests,
        already: Boolean(existing),
      }),
      sendNewsletterSignupAutoReply({
        firstName,
        email,
        already: Boolean(existing),
      }),
    ]);

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
      await Promise.all([
        sendNewsletterSignupNotification({
          firstName,
          email,
          source,
          interests: requestedInterests,
          already: true,
        }),
        sendNewsletterSignupAutoReply({
          firstName,
          email,
          already: true,
        }),
      ]);

      return NextResponse.json({ success: true, already: true });
    }

    console.error("Newsletter signup failed:", JSON.stringify(error, null, 2));
    await sendAlert("Newsletter signup failed to save", { email, source, error: error.message });
    return NextResponse.json(
      { error: "Unable to save your signup.", detail: error.message, code: error.code },
      { status: 500 },
    );
  }

  await Promise.all([
    sendNewsletterSignupNotification({
      firstName,
      email,
      source,
      interests: requestedInterests,
    }),
    sendNewsletterSignupAutoReply({
      firstName,
      email,
    }),
  ]);

  return NextResponse.json({ success: true });
}
