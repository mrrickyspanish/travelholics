import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  MAX_SEND_ATTEMPTS,
  isComplete,
  isMailable,
  nextDueStep,
  shouldEnroll,
  type CampaignStep,
  type SendRecord,
} from "@/lib/email-campaign-schedule";
import { renderCampaignEmail } from "@/lib/email-campaign-templates";
import { unsubscribeHeaders } from "@/lib/newsletter-unsubscribe";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const REPLY_TO = "news@yotravelholic.com";

// Capped per run so one invocation cannot empty the queue into the provider
// in a burst. Hourly x 40 is ample for current volume and keeps well inside
// Resend's rate limits.
const MAX_SENDS_PER_RUN = 40;
const MAX_ENROLLMENTS_PER_RUN = 200;

type CampaignRow = {
  id: string;
  slug: string;
  status: "draft" | "active" | "paused";
  enroll_from: string;
  required_interest: string | null;
};

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured." }, { status: 500 });
  }

  const supabase = createSupabaseAdmin();
  const resend = new Resend(resendKey);
  const now = new Date();

  const { data: campaigns } = await supabase
    .from("email_campaigns")
    .select("id, slug, status, enroll_from, required_interest")
    .eq("status", "active");

  if (!campaigns?.length) {
    return NextResponse.json({ ok: true, campaigns: 0, enrolled: 0, sent: 0, note: "No active campaigns." });
  }

  let enrolled = 0;
  let sent = 0;
  let failed = 0;
  let skippedUnsubscribed = 0;

  for (const campaign of campaigns as CampaignRow[]) {
    const { data: stepRows } = await supabase
      .from("email_campaign_steps")
      .select("id, position, delay_hours, template_key, subject")
      .eq("campaign_id", campaign.id)
      .order("position");

    const steps: CampaignStep[] = (stepRows || []).map((row) => ({
      id: row.id as string,
      position: row.position as number,
      delayHours: row.delay_hours as number,
      templateKey: row.template_key as string,
      subject: row.subject as string,
    }));

    if (!steps.length) continue;

    // --- enrollment -----------------------------------------------------
    // Reconciliation rather than a hook on the signup path: a transient
    // failure at signup would otherwise drop that subscriber out of the drip
    // silently and forever. `enroll_from` bounds it to people who joined
    // after the campaign went live.
    if (enrolled < MAX_ENROLLMENTS_PER_RUN) {
      const { data: candidates } = await supabase
        .from("newsletter_subscribers")
        .select("id, created_at, consent_status, interests")
        .eq("consent_status", "subscribed")
        .gte("created_at", campaign.enroll_from)
        .limit(MAX_ENROLLMENTS_PER_RUN);

      for (const candidate of candidates || []) {
        const ok = shouldEnroll({
          campaignStatus: campaign.status,
          enrollFrom: new Date(campaign.enroll_from),
          requiredInterest: campaign.required_interest,
          subscriber: {
            consentStatus: candidate.consent_status as "subscribed",
            interests: (candidate.interests as string[]) || [],
          },
          subscriberCreatedAt: new Date(candidate.created_at as string),
          // The unique constraint is the real guard; this call only avoids a
          // pointless insert when we already know.
          alreadyEnrolled: false,
        });
        if (!ok) continue;

        const { error } = await supabase
          .from("email_campaign_enrollments")
          .insert({ campaign_id: campaign.id, subscriber_id: candidate.id })
          .select("id")
          .single();

        // 23505 is the unique violation: already enrolled, which is the
        // normal case on every run after the first.
        if (!error) enrolled += 1;
        else if (error.code !== "23505") console.error("Enrollment failed:", error);
      }
    }

    // --- sending --------------------------------------------------------
    const { data: enrollments } = await supabase
      .from("email_campaign_enrollments")
      .select("id, enrolled_at, status, subscriber_id, newsletter_subscribers!inner(id, email, first_name, consent_status)")
      .eq("campaign_id", campaign.id)
      .eq("status", "active")
      .limit(500);

    for (const enrollment of enrollments || []) {
      if (sent >= MAX_SENDS_PER_RUN) break;

      const subscriber = enrollment.newsletter_subscribers as unknown as {
        email: string;
        first_name: string | null;
        consent_status: "subscribed" | "unsubscribed" | "pending";
      };

      // Re-checked here, immediately before sending, and not only at
      // enrollment: somebody can unsubscribe at any point between joining
      // the drip and the next step falling due.
      if (!isMailable({ consentStatus: subscriber.consent_status, interests: [] })) {
        await supabase
          .from("email_campaign_enrollments")
          .update({ status: "cancelled" })
          .eq("id", enrollment.id);
        skippedUnsubscribed += 1;
        continue;
      }

      const { data: sendRows } = await supabase
        .from("email_sends")
        .select("step_id, status, attempts")
        .eq("enrollment_id", enrollment.id);

      const sends: SendRecord[] = (sendRows || []).map((row) => ({
        stepId: row.step_id as string,
        status: row.status as SendRecord["status"],
        attempts: row.attempts as number,
      }));

      if (isComplete(steps, sends)) {
        await supabase
          .from("email_campaign_enrollments")
          .update({ status: "completed" })
          .eq("id", enrollment.id);
        continue;
      }

      const step = nextDueStep({
        enrollment: {
          id: enrollment.id as string,
          enrolledAt: new Date(enrollment.enrolled_at as string),
          status: enrollment.status as "active",
        },
        steps,
        sends,
        now,
      });

      if (!step) continue;

      const existing = sends.find((row) => row.stepId === step.id);

      // Claim before sending. The unique constraint on
      // (enrollment_id, step_id) means a second worker's insert fails here
      // rather than producing a duplicate email.
      if (!existing) {
        const { error: claimError } = await supabase
          .from("email_sends")
          .insert({ enrollment_id: enrollment.id, step_id: step.id, email: subscriber.email, attempts: 1 });
        if (claimError) {
          if (claimError.code !== "23505") console.error("Send claim failed:", claimError);
          continue;
        }
      } else {
        // A retry of a failed send.
        if (existing.attempts >= MAX_SEND_ATTEMPTS) continue;
        await supabase
          .from("email_sends")
          .update({ attempts: existing.attempts + 1, status: "pending" })
          .eq("enrollment_id", enrollment.id)
          .eq("step_id", step.id);
      }

      const html = renderCampaignEmail(step.templateKey, { firstName: subscriber.first_name }, subscriber.email);

      if (!html) {
        await supabase
          .from("email_sends")
          .update({ status: "failed", last_error: `Unknown template: ${step.templateKey}` })
          .eq("enrollment_id", enrollment.id)
          .eq("step_id", step.id);
        failed += 1;
        continue;
      }

      const { data: result, error: sendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [subscriber.email],
        subject: step.subject,
        html,
        replyTo: REPLY_TO,
        headers: unsubscribeHeaders(subscriber.email),
      });

      if (sendError) {
        await supabase
          .from("email_sends")
          .update({ status: "failed", last_error: String(sendError.message || sendError) })
          .eq("enrollment_id", enrollment.id)
          .eq("step_id", step.id);
        failed += 1;
        continue;
      }

      await supabase
        .from("email_sends")
        .update({ status: "sent", sent_at: new Date().toISOString(), provider_message_id: result?.id || null })
        .eq("enrollment_id", enrollment.id)
        .eq("step_id", step.id);
      sent += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    campaigns: campaigns.length,
    enrolled,
    sent,
    failed,
    cancelledUnsubscribed: skippedUnsubscribed,
  });
}
