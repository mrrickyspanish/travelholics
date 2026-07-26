import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { GUIDE_CONSENT_TEXT, getUnlockableGuide } from "@/lib/free-guides";
import { buildGuideDownloadPath } from "@/lib/guide-tokens";

type UnlockRequest = {
  firstName?: string;
  email?: string;
  guideId?: string;
  newsletterOptIn?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as UnlockRequest | null;

  const firstName = body?.firstName?.trim() ?? "";
  const email = body?.email?.trim().toLowerCase() ?? "";
  const guideId = body?.guideId?.trim() ?? "";

  if (!firstName) {
    return NextResponse.json({ error: "Please add your first name." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please add a valid email address." }, { status: 400 });
  }

  // Only guides cleared for publishing are addressable.
  const guide = getUnlockableGuide(guideId);

  if (!guide) {
    return NextResponse.json({ error: "That guide isn't available." }, { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Downloads aren't configured yet." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const source = `guides-${guide.id}`;

  const { error: downloadError } = await supabase.from("guide_downloads").insert({
    first_name: firstName,
    email,
    guide_id: guide.id,
    guide_title: guide.title,
    source,
    consent_text: GUIDE_CONSENT_TEXT,
  });

  // A repeat download of the same guide is fine — hand the file over anyway.
  if (downloadError && downloadError.code !== "23505") {
    console.error("Guide download logging failed:", JSON.stringify(downloadError, null, 2));
    return NextResponse.json({ error: "Unable to unlock your guide." }, { status: 500 });
  }

  // Newsletter opt-in is a checkbox, not a condition of the download. Failures
  // here must never cost someone the file they just asked for.
  if (body?.newsletterOptIn) {
    const { error: subscribeError } = await supabase.from("newsletter_subscribers").upsert(
      {
        email,
        first_name: firstName,
        source,
        interests: ["newsletter", "guides", "cruise_deals"],
        consent_status: "subscribed",
        consent_text: GUIDE_CONSENT_TEXT,
        consented_at: new Date().toISOString(),
        unsubscribed_at: null,
        metadata: { latest_source: source, latest_signup_path: "guides-unlock-api" },
      },
      { onConflict: "email" },
    );

    if (subscribeError) {
      console.error("Guide newsletter opt-in failed:", JSON.stringify(subscribeError, null, 2));
    }
  }

  return NextResponse.json({
    success: true,
    downloadUrl: buildGuideDownloadPath(guide.id),
    fileName: guide.downloadName,
  });
}
