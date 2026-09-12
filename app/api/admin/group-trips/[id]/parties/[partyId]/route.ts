import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { requireAdminSession } from '@/lib/require-admin'
import { sendBookedWelcome } from '@/lib/group-trip-email'
import { PARTY_STATUSES, type PartyStatus } from '@/types/group-trips'

const BOOKED_STATUSES = new Set<PartyStatus>(['booked', 'travel_ready'])

export async function PATCH(request: Request, context: { params: Promise<{ id: string; partyId: string }> }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, partyId } = await context.params
  const body = await request.json() as { status?: PartyStatus; action?: 'resend_welcome' }
  const supabase = createSupabaseAdmin()

  const { data: current } = await supabase
    .from('group_trip_parties')
    .select('id,status,primary_name,email,phone,party_size,cabin_preference,booked_at,updated_at')
    .eq('id', partyId)
    .eq('trip_id', id)
    .maybeSingle()
  if (!current) return NextResponse.json({ error: 'Traveler party not found.' }, { status: 404 })

  if (body.action === 'resend_welcome') {
    if (!BOOKED_STATUSES.has(current.status as PartyStatus)) {
      return NextResponse.json({ error: 'The welcome email can only be resent after this party is booked.' }, { status: 409 })
    }
    const { data: trip } = await supabase.from('group_trips').select('name,slug,access_code').eq('id', id).maybeSingle()
    if (!trip) return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })
    const sent = await sendBookedWelcome({ name: current.primary_name, email: current.email, tripName: trip.name, slug: trip.slug, accessCode: trip.access_code })
    if (!sent) return NextResponse.json({ error: 'The welcome email could not be sent.' }, { status: 502 })
    return NextResponse.json({ party: current, resent: true })
  }

  const status = body.status
  if (!status || !PARTY_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid traveler status.' }, { status: 400 })

  const firstBookedEntry = BOOKED_STATUSES.has(status) && !current.booked_at
  const patch: Record<string, unknown> = { status }
  if (firstBookedEntry) patch.booked_at = new Date().toISOString()

  const { data: party, error } = await supabase
    .from('group_trip_parties')
    .update(patch)
    .eq('id', partyId)
    .select('id,status,primary_name,email,phone,party_size,cabin_preference,booked_at,updated_at')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (firstBookedEntry) {
    const { data: trip } = await supabase.from('group_trips').select('name,slug,access_code').eq('id', id).maybeSingle()
    if (trip) await sendBookedWelcome({ name: current.primary_name, email: current.email, tripName: trip.name, slug: trip.slug, accessCode: trip.access_code })
  }

  return NextResponse.json({ party })
}
