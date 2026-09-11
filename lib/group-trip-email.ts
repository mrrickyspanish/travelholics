import 'server-only'

import { Resend } from 'resend'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yotravelholic.com'
const SCHEDULING_URL = process.env.NEXT_PUBLIC_GROUP_CRUISE_SCHEDULING_URL
const INTERNAL_TO = 'hello@yotravelholic.com'
const INTERNAL_BCC = 'ricky@creativeeyestudios.com'

function fromAddress() {
  return process.env.GROUP_TRIPS_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'Travelholics Trips <trips@yotravelholic.com>'
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

async function send(options: { to: string | string[]; subject: string; html: string; replyTo?: string; bcc?: string[] }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY missing; skipped group trip email:', options.subject)
    return false
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: Array.isArray(options.to) ? options.to : [options.to],
    bcc: options.bcc,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  })

  if (error) {
    console.error('Group trip email error:', error)
    return false
  }
  return true
}

function shell(content: string) {
  return `
    <div style="background:#f5efe4;padding:32px 16px;font-family:Arial,sans-serif;color:#1a2e2a">
      <div style="max-width:620px;margin:auto;background:#fcfaf5;border-radius:20px;padding:32px;border:1px solid #e8dfd2">
        <div style="font-weight:800;color:#0d4a3a;font-size:20px;margin-bottom:22px">Travelholics Trips</div>
        ${content}
        <p style="margin-top:28px;color:#6b7b74;font-size:13px;line-height:1.6">Travelholics · Group Cruise Concierge</p>
      </div>
    </div>`
}

export async function sendGroupInquiryReceipt(input: { name: string; email: string }) {
  const schedulingCta = SCHEDULING_URL
    ? `<a href="${SCHEDULING_URL}" style="display:inline-block;margin:10px 8px 0 0;background:#10755A;color:white;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:10px">Schedule time with Yolanda</a>`
    : ''

  return send({
    to: input.email,
    subject: 'Your group cruise is officially in motion ✨',
    html: shell(`
      <h1 style="font-size:28px;line-height:1.15;margin:0 0 14px">We got it, ${escapeHtml(input.name)}.</h1>
      <p style="font-size:16px;line-height:1.7">Thanks for trusting Travelholics with your group cruise. Yolanda will review what you shared and connect with you to start shaping the experience.</p>
      <p style="font-size:16px;line-height:1.7">Have your estimated group size, preferred dates, and any cruise ideas handy. If you already know what you want, even better.</p>
      ${schedulingCta}
      <a href="${SITE_URL}/thank-you/group-cruise" style="display:inline-block;margin-top:10px;background:#F26A75;color:white;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:10px">See what happens next</a>
    `),
  })
}

export async function sendGroupInquiryInternal(input: Record<string, unknown> & { id: string; leaderName: string; email: string }) {
  return send({
    to: INTERNAL_TO,
    bcc: [INTERNAL_BCC],
    replyTo: input.email,
    subject: `New Group Cruise Inquiry · ${input.leaderName}`,
    html: shell(`
      <h1 style="font-size:24px;margin:0 0 18px">New group cruise inquiry</h1>
      <p><strong>Group leader:</strong> ${escapeHtml(input.leaderName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(input.phone || 'Not provided')}</p>
      <p><strong>Group type:</strong> ${escapeHtml(input.groupType || 'Not provided')}</p>
      <p><strong>Estimated size:</strong> ${escapeHtml(input.estimatedGroupSize || 'Not provided')}</p>
      <p><strong>Trip direction:</strong> ${escapeHtml(input.cruiseStage === 'specific' ? 'Already has a cruise in mind' : 'Needs help choosing')}</p>
      <p><strong>Destination:</strong> ${escapeHtml(input.destination || 'Open')}</p>
      <p><strong>Preferred dates:</strong> ${escapeHtml(input.preferredDates || 'Open')}</p>
      <p><strong>Notes:</strong> ${escapeHtml(input.notes || 'None')}</p>
      <a href="${SITE_URL}/admin/group-trips?inquiry=${encodeURIComponent(input.id)}" style="display:inline-block;margin-top:12px;background:#10755A;color:white;text-decoration:none;font-weight:700;padding:12px 16px;border-radius:10px">Open in Travelholics Admin</a>
    `),
  })
}

export async function sendTripInvite(input: { name: string; email: string; tripName: string; slug: string; accessCode: string }) {
  return send({
    to: input.email,
    subject: `You're invited: ${input.tripName} 🚢`,
    html: shell(`
      <h1 style="font-size:28px;line-height:1.15;margin:0 0 14px">You're invited, ${escapeHtml(input.name)}!</h1>
      <p style="font-size:16px;line-height:1.7">Your group is planning <strong>${escapeHtml(input.tripName)}</strong> with Travelholics.</p>
      <p style="font-size:16px;line-height:1.7">Open the trip page to see the sailing details, itinerary, cabin choices, pricing, and next steps.</p>
      <p style="font-size:16px"><strong>Group access code:</strong> ${escapeHtml(input.accessCode)}</p>
      <a href="${SITE_URL}/trips/${encodeURIComponent(input.slug)}" style="display:inline-block;margin-top:10px;background:#F26A75;color:white;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:10px">View the group cruise</a>
    `),
  })
}

export async function sendBookingRequestReceipt(input: { name: string; email: string; tripName: string }) {
  return send({
    to: input.email,
    subject: `We received your ${input.tripName} request`,
    html: shell(`
      <h1 style="font-size:28px;line-height:1.15;margin:0 0 14px">You're on Yolanda's list, ${escapeHtml(input.name)}.</h1>
      <p style="font-size:16px;line-height:1.7">We received your booking request for <strong>${escapeHtml(input.tripName)}</strong>. This is a request, not a completed booking yet.</p>
      <p style="font-size:16px;line-height:1.7">Yolanda will review your cabin preference and contact information, then follow up to lock in the booking details with you.</p>
    `),
  })
}

export async function sendBookingRequestInternal(input: { partyId: string; tripId: string; tripName: string; name: string; email: string; phone?: string; cabin?: string }) {
  return send({
    to: INTERNAL_TO,
    bcc: [INTERNAL_BCC],
    replyTo: input.email,
    subject: `New booking request · ${input.tripName} · ${input.name}`,
    html: shell(`
      <h1 style="font-size:24px;margin:0 0 18px">New group cruise booking request</h1>
      <p><strong>Trip:</strong> ${escapeHtml(input.tripName)}</p>
      <p><strong>Party:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(input.phone || 'Not provided')}</p>
      <p><strong>Cabin:</strong> ${escapeHtml(input.cabin || 'No selection')}</p>
      <a href="${SITE_URL}/admin/group-trips/${encodeURIComponent(input.tripId)}" style="display:inline-block;margin-top:12px;background:#10755A;color:white;text-decoration:none;font-weight:700;padding:12px 16px;border-radius:10px">Open traveler record</a>
    `),
  })
}

export async function sendBookedWelcome(input: { name: string; email: string; tripName: string; slug: string; accessCode: string }) {
  return send({
    to: input.email,
    subject: `You're booked for ${input.tripName} 🎉`,
    html: shell(`
      <h1 style="font-size:28px;line-height:1.15;margin:0 0 14px">You're booked, ${escapeHtml(input.name)}!</h1>
      <p style="font-size:16px;line-height:1.7">Your Travelholics group cruise is officially on the calendar. Keep your trip page handy for group details and updates.</p>
      <p><strong>Access code:</strong> ${escapeHtml(input.accessCode)}</p>
      <a href="${SITE_URL}/trips/${encodeURIComponent(input.slug)}" style="display:inline-block;margin-top:10px;background:#F26A75;color:white;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:10px">Back to your trip</a>
    `),
  })
}

export async function sendAdminFollowUpReminder(input: { tripId: string; tripName: string; name: string; email: string }) {
  return send({
    to: INTERNAL_TO,
    bcc: [INTERNAL_BCC],
    subject: `48-hour follow-up · ${input.tripName} · ${input.name}`,
    html: shell(`
      <h1 style="font-size:24px;margin:0 0 18px">This booking request still needs follow-up</h1>
      <p><strong>${escapeHtml(input.name)}</strong> has been in Submitted status for at least 48 hours.</p>
      <p>${escapeHtml(input.email)}</p>
      <a href="${SITE_URL}/admin/group-trips/${encodeURIComponent(input.tripId)}" style="display:inline-block;margin-top:12px;background:#10755A;color:white;text-decoration:none;font-weight:700;padding:12px 16px;border-radius:10px">Open trip dashboard</a>
    `),
  })
}

export async function sendDeadlineReminder(input: { name: string; email: string; tripName: string; deadlineTitle: string; deadlineDate: string; slug: string }) {
  return send({
    to: input.email,
    subject: `${input.tripName}: ${input.deadlineTitle} is coming up`,
    html: shell(`
      <h1 style="font-size:26px;line-height:1.2;margin:0 0 14px">A quick cruise reminder, ${escapeHtml(input.name)}</h1>
      <p style="font-size:16px;line-height:1.7"><strong>${escapeHtml(input.deadlineTitle)}</strong> is due ${escapeHtml(input.deadlineDate)} for ${escapeHtml(input.tripName)}.</p>
      <a href="${SITE_URL}/trips/${encodeURIComponent(input.slug)}" style="display:inline-block;margin-top:10px;background:#F26A75;color:white;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:10px">View trip details</a>
    `),
  })
}
