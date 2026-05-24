import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = 'rjsmom1_68@yahoo.com';
const BCC_EMAIL = 'ricky@creativeeyestudios.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formType, ...formData } = body;

    let subject = 'New Travelholics Inquiry';
    let htmlContent = '';

    if (formType === 'contact') {
      subject = `New Contact Inquiry from ${formData.name || 'Website Visitor'}`;
      htmlContent = `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
        <p><strong>Message:</strong> ${formData.message}</p>
      `;
    } else if (formType === 'collaborate') {
      subject = `Collaboration Inquiry from ${formData.company || formData.name}`;
      htmlContent = `
        <h2>Collaboration Inquiry</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Company:</strong> ${formData.company || 'N/A'}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Website / Social:</strong> ${formData.website || 'N/A'}</p>
        <p><strong>Collaboration Type:</strong> ${formData.collaborationType || 'N/A'}</p>
        <p><strong>Project Details:</strong> ${formData.details}</p>
      `;
    } else if (formType === 'cruise-interest') {
      subject = `New Cruise Interest Form from ${formData.name || formData.fullName}`;
      htmlContent = `
        <h2>Cruise Interest Submission</h2>
        <p><strong>Name:</strong> ${formData.name || formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
        <p><strong>Message:</strong> ${formData.message || 'N/A'}</p>
      `;
    } else if (formType === 'duck-hunt') {
      subject = `Duck Hunt Gift Entry from ${formData.firstName}`;
      htmlContent = `
        <h2>Duck Hunt Gift Entry</h2>
        <p><strong>First Name:</strong> ${formData.firstName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>City:</strong> ${formData.city || 'N/A'}</p>
        <p><strong>Ship:</strong> ${formData.ship || 'N/A'}</p>
        <p><strong>Travel Reason:</strong> ${formData.travelReason || 'N/A'}</p>
        <p><strong>Duck Number:</strong> ${formData.duckNumber || 'N/A'}</p>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      bcc: [BCC_EMAIL],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Send email route error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
