import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { sendGroupInquiryInternal, sendGroupInquiryReceipt } from '@/lib/group-trip-email'

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>
  const leaderName = String(body.leaderName ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const phone = String(body.phone ?? '').trim()
  const preferredContact = String(body.preferredContact ?? '')
  const cruiseStage = body.cruiseStage === 'specific' ? 'specific' : 'help'

  if (!leaderName || !email || !email.includes('@')) {
    return NextResponse.json({ error: 'Please add your name and a valid email address.' }, { status: 400 })
  }
  if (!['phone', 'text', 'email'].includes(preferredContact)) {
    return NextResponse.json({ error: 'Choose how you prefer Yolanda to contact you.' }, { status: 400 })
  }
  if (preferredContact === 'text' && body.smsConsent !== true) {
    return NextResponse.json({ error: 'SMS consent is required when text is selected.' }, { status: 400 })
  }

  const estimatedGroupSize = Number(body.estimatedGroupSize)
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('group_cruise_inquiries')
    .insert({
      source: String(body.source ?? 'group-cruises-page'),
      leader_name: leaderName,
      email,
      phone: phone || null,
      preferred_contact: preferredContact,
      sms_consent: body.smsConsent === true,
      group_type: String(body.groupType ?? '').trim() || null,
      estimated_group_size: Number.isFinite(estimatedGroupSize) && estimatedGroupSize > 0 ? estimatedGroupSize : null,
      cruise_stage: cruiseStage,
      destination: String(body.destination ?? '').trim() || null,
      preferred_dates: String(body.preferredDates ?? '').trim() || null,
      budget_range: String(body.budgetRange ?? '').trim() || null,
      cruise_line: cruiseStage === 'specific' ? String(body.cruiseLine ?? '').trim() || null : null,
      ship: cruiseStage === 'specific' ? String(body.ship ?? '').trim() || null : null,
      sailing_date: cruiseStage === 'specific' && body.sailingDate ? String(body.sailingDate) : null,
      notes: String(body.notes ?? '').trim() || null,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('Group cruise inquiry insert error:', error)
    return NextResponse.json({ error: 'We could not save your request. Please try again.' }, { status: 500 })
  }

  const emailInput = {
    ...body,
    id: data.id,
    leaderName,
    email,
    phone,
    cruiseStage,
  }
  await Promise.allSettled([
    sendGroupInquiryReceipt({ name: leaderName, email }),
    sendGroupInquiryInternal(emailInput),
  ])

  return NextResponse.json({ success: true, inquiryId: data.id }, { status: 201 })
}
