import { NextResponse } from "next/server";
import { Resend } from "resend";

import { FORM_EMAIL_BCC, FORM_EMAIL_TO } from "@/lib/form-email";

type SubmitFormRequest = {
  subject?: string;
  body?: string;
  replyTo?: string;
};

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return NextResponse.json(
      { error: "Resend is not configured yet. Add RESEND_API_KEY to enable form email delivery." },
      { status: 500 },
    );
  }

  const { subject, body, replyTo } = (await request.json()) as SubmitFormRequest;

  if (!subject || !body) {
    return NextResponse.json({ error: "Missing email subject or body." }, { status: 400 });
  }

  const resend = new Resend(resendKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "Travelholics <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [FORM_EMAIL_TO],
      bcc: [FORM_EMAIL_BCC],
      subject,
      text: body,
      replyTo: replyTo?.trim() ? replyTo : undefined,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form email send error:", error);
    return NextResponse.json({ error: "Unable to send form email." }, { status: 500 });
  }
}