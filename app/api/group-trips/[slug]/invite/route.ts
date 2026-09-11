import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createLeaderGrant, leaderAccessCookieName, validGrant } from '@/lib/group-trip-access'
import { sendTripInvite } from '@/lib/group-trip-email'

async function getLeaderTrip(slug: string) {
  const supabase = createSupabaseAdmin()
  const { data: trip } = await supabase
    .from('group_trips')
    .select('id,name,slug,access_code,leader_access_token,status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (!trip) return { supabase, trip: null, authorized: false }
  const cookieStore = await cookies()
  const leaderCookie = cookieStore.get(leaderAccessCookieName(trip.id))?.value
  return { supabase, trip, authorized: validGrant(leaderCookie, createLeaderGrant(trip.id, trip.leader_access_token)) }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const body = await request.json() as { name?: string; email?: string }
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!name || !email || !email.includes('@')) return NextResponse.json({ error: 'Add a guest name and valid email.' }, { status: 400 })

  const { supabase, trip, authorized } = await getLeaderTrip(slug)
  if (!trip) return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })
  if (!authorized) return NextResponse.json({ error: 'Group leader access required.' }, { status: 403 })

  const { data: party, error } = await supabase
    .from('group_trip_parties')
    .insert({ trip_id: trip.id, primary_name: name, email, status: 'invited', invited_by_group_leader: true })
    .select('id,primary_name,email,status')
    .single()

  if (error || !party) {
    const duplicate = error?.code === '23505'
    return NextResponse.json({ error: duplicate ? 'That email is already on this trip.' : (error?.message || 'Unable to add guest.') }, { status: duplicate ? 409 : 500 })
  }

  await sendTripInvite({ name, email, tripName: trip.name, slug: trip.slug, accessCode: trip.access_code })
  return NextResponse.json({ party }, { status: 201 })
}

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const body = await request.json() as { partyId?: string; name?: string; email?: string }
  const partyId = String(body.partyId ?? '')
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!partyId || !name || !email || !email.includes('@')) return NextResponse.json({ error: 'Add a guest name and valid email.' }, { status: 400 })

  const { supabase, trip, authorized } = await getLeaderTrip(slug)
  if (!trip) return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })
  if (!authorized) return NextResponse.json({ error: 'Group leader access required.' }, { status: 403 })

  const { data: party, error } = await supabase
    .from('group_trip_parties')
    .update({ primary_name: name, email })
    .eq('id', partyId)
    .eq('trip_id', trip.id)
    .eq('status', 'invited')
    .select('id,primary_name,email,status')
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'That email is already on this trip.' : error.message }, { status: error.code === '23505' ? 409 : 500 })
  if (!party) return NextResponse.json({ error: 'Only guests who are still Invited can be edited.' }, { status: 409 })

  await sendTripInvite({ name, email, tripName: trip.name, slug: trip.slug, accessCode: trip.access_code })
  return NextResponse.json({ party })
}

export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const url = new URL(request.url)
  const partyId = url.searchParams.get('partyId')
  if (!partyId) return NextResponse.json({ error: 'Missing invited guest.' }, { status: 400 })

  const { supabase, trip, authorized } = await getLeaderTrip(slug)
  if (!trip) return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })
  if (!authorized) return NextResponse.json({ error: 'Group leader access required.' }, { status: 403 })

  const { error } = await supabase.from('group_trip_parties').delete().eq('id', partyId).eq('trip_id', trip.id).eq('status', 'invited')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
