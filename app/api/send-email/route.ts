import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "rjsmom1_68@yahoo.com";
const BCC_EMAIL = "ricky@creativeeyestudios.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

type SendEmailPayload = {
  formType?: "contact" | "collaborate" | "cruise-interest" | "duck-hunt";
  [key: string]: unknown;
};

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return NextResponse.json(
      { error: "Resend is not configured yet. Add RESEND_API_KEY to enable form email delivery." },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as SendEmailPayload;

  if (!payload?.formType) {
    return NextResponse.json({ error: "Missing formType." }, { status: 400 });
  }

  const allowedTypes = new Set(["contact", "collaborate", "cruise-interest", "duck-hunt"]);
  if (!allowedTypes.has(payload.formType)) {
    return NextResponse.json({ error: "Invalid formType." }, { status: 400 });
  }

  const resend = new Resend(resendKey);

  let subject = "New Travelholics Inquiry";
  let htmlContent = "";

  if (payload.formType === "contact") {
    subject = `New Contact Inquiry from ${payload.name || "Website Visitor"}`;
    htmlContent = `
      <h2>New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${payload.name || "N/A"}</p>
      <p><strong>Email:</strong> ${payload.email || "N/A"}</p>
      <p><strong>Phone:</strong> ${payload.phone || "N/A"}</p>
      <p><strong>Message:</strong> ${payload.message || "N/A"}</p>
    `;
  } else if (payload.formType === "collaborate") {
    subject = `Collaboration Inquiry from ${payload.company || payload.name || "Website Visitor"}`;
    htmlContent = `
      <h2>Collaboration Inquiry</h2>
      <p><strong>Name:</strong> ${payload.name || "N/A"}</p>
      <p><strong>Company:</strong> ${payload.company || "N/A"}</p>
      <p><strong>Email:</strong> ${payload.email || "N/A"}</p>
      <p><strong>Website / Social:</strong> ${payload.website || "N/A"}</p>
      <p><strong>Collaboration Type:</strong> ${payload.collaborationType || "N/A"}</p>
      <p><strong>Project Details:</strong> ${payload.details || "N/A"}</p>
    `;
  } else if (payload.formType === "cruise-interest") {
    subject = `New Cruise Interest Form from ${payload.name || payload.fullName || "Website Visitor"}`;
    htmlContent = `
      <h2>Cruise Interest Submission</h2>
      <p><strong>Name:</strong> ${payload.name || payload.fullName || "N/A"}</p>
      <p><strong>Email:</strong> ${payload.email || "N/A"}</p>
      <p><strong>Phone:</strong> ${payload.phone || "N/A"}</p>
      <p><strong>Message:</strong> ${payload.message || "N/A"}</p>
    `;
  } else if (payload.formType === "duck-hunt") {
    subject = `Duck Hunt Gift Entry from ${payload.firstName || "Website Visitor"}`;
    htmlContent = `
      <h2>Duck Hunt Gift Entry</h2>
      <p><strong>First Name:</strong> ${payload.firstName || "N/A"}</p>
      <p><strong>Email:</strong> ${payload.email || "N/A"}</p>
      <p><strong>City:</strong> ${payload.city || "N/A"}</p>
      <p><strong>Ship:</strong> ${payload.shipName || payload.ship || "N/A"}</p>
      <p><strong>Travel Reason:</strong> ${payload.travelReason || "N/A"}</p>
      <p><strong>Duck Number:</strong> ${payload.duckNumber || "N/A"}</p>
      <p><strong>Batch:</strong> ${payload.batch || "N/A"}</p>
      <p><strong>Source:</strong> ${payload.source || "N/A"}</p>
      <p><strong>Newsletter Opt-In:</strong> ${payload.newsletterOptIn ? "Yes" : "No"}</p>
      <p><strong>Consent Text:</strong> ${payload.consentText || "N/A"}</p>
    `;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      bcc: [BCC_EMAIL],
      subject,
      html: htmlContent,
      replyTo: typeof payload.email === "string" && payload.email.trim() ? payload.email : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Send email route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
