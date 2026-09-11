import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createTripGrant, tripAccessCookieName, validGrant } from '@/lib/group-trip-access'
import { sendBookingRequestInternal, sendBookingRequestReceipt } from '@/lib/group-trip-email'

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const body = await request.json() as Record<string, unknown>
  const primaryName = String(body.primaryName ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const phone = String(body.phone ?? '').trim()
  const partySize = Number(body.partySize)
  const cabinOfferId = String(body.cabinOfferId ?? '').trim() || null
  const cabinPreference = String(body.cabinPreference ?? '').trim()
  const notes = String(body.notes ?? '').trim()
  const members = Array.isArray(body.members)
    ? body.members.map((value) => String(value).trim()).filter(Boolean).slice(0, 20)
    : []

  if (!primaryName || !email || !email.includes('@') || !phone || !Number.isFinite(partySize) || partySize < 1) {
    return NextResponse.json({ error: 'Add the primary contact, valid email, phone number, and party size.' }, { status: 400 })
  }

  const supabase = createSupabaseAdmin()
  const { data: trip } = await supabase
    .from('group_trips')
    .select('id,name,slug,status,access_code')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (!trip) return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })

  const cookieStore = await cookies()
  const grant = cookieStore.get(tripAccessCookieName(trip.id))?.value
  if (!validGrant(grant, createTripGrant(trip.id, trip.access_code))) {
    return NextResponse.json({ error: 'Please enter the group access code before submitting a booking request.' }, { status: 403 })
  }

  let cabinName = cabinPreference || 'No cabin selected'
  if (cabinOfferId) {
    const { data: cabin } = await supabase
      .from('group_trip_cabin_offers')
      .select('name')
      .eq('id', cabinOfferId)
      .eq('trip_id', trip.id)
      .maybeSingle()
    if (!cabin) return NextResponse.json({ error: 'That cabin option is not available for this trip.' }, { status: 400 })
    cabinName = cabin.name
  }

  const { data: existing } = await supabase
    .from('group_trip_parties')
    .select('id,status')
    .eq('trip_id', trip.id)
    .eq('email', email)
    .maybeSingle()

  const partyPayload = {
    trip_id: trip.id,
    primary_name: primaryName,
    email,
    phone,
    party_size: partySize,
    cabin_offer_id: cabinOfferId,
    cabin_preference: cabinPreference || cabinName,
    notes: notes || null,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
  }

  let partyId: string
  if (existing) {
    const { data, error } = await supabase
      .from('group_trip_parties')
      .update(partyPayload)
      .eq('id', existing.id)
      .select('id')
      .single()
    if (error || !data) return NextResponse.json({ error: error?.message || 'Unable to update your request.' }, { status: 500 })
    partyId = data.id
    await supabase.from('group_trip_party_members').delete().eq('party_id', partyId)
  } else {
    const { data, error } = await supabase
      .from('group_trip_parties')
      .insert(partyPayload)
      .select('id')
      .single()
    if (error || !data) return NextResponse.json({ error: error?.message || 'Unable to save your request.' }, { status: 500 })
    partyId = data.id
  }

  if (members.length) {
    await supabase.from('group_trip_party_members').insert(members.map((fullName) => ({ party_id: partyId, full_name: fullName })))
  }

  await Promise.allSettled([
    sendBookingRequestReceipt({ name: primaryName, email, tripName: trip.name }),
    sendBookingRequestInternal({ partyId, tripId: trip.id, tripName: trip.name, name: primaryName, email, phone, cabin: cabinName }),
  ])

  return NextResponse.json({ success: true, partyId }, { status: 201 })
}
