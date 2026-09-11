import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { requireAdminSession } from '@/lib/require-admin'
import { sendBookedWelcome } from '@/lib/group-trip-email'
import { PARTY_STATUSES, type PartyStatus } from '@/types/group-trips'

export async function PATCH(request: Request, context: { params: Promise<{ id: string; partyId: string }> }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, partyId } = await context.params
  const { status } = await request.json() as { status?: PartyStatus }
  if (!status || !PARTY_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid traveler status.' }, { status: 400 })
  }

  const supabase = createSupabaseAdmin()
  const { data: current } = await supabase
    .from('group_trip_parties')
    .select('id,status,primary_name,email')
    .eq('id', partyId)
    .eq('trip_id', id)
    .maybeSingle()
  if (!current) return NextResponse.json({ error: 'Traveler party not found.' }, { status: 404 })

  const patch: Record<string, unknown> = { status }
  if (status === 'booked' && current.status !== 'booked') patch.booked_at = new Date().toISOString()
  if (status !== 'booked' && current.status === 'booked') patch.booked_at = null

  const { data: party, error } = await supabase
    .from('group_trip_parties')
    .update(patch)
    .eq('id', partyId)
    .select('id,status,primary_name,email,phone,party_size,cabin_preference,updated_at')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === 'booked' && current.status !== 'booked') {
    const { data: trip } = await supabase
      .from('group_trips')
      .select('name,slug,access_code')
      .eq('id', id)
      .single()
    if (trip) {
      await sendBookedWelcome({
        name: current.primary_name,
        email: current.email,
        tripName: trip.name,
        slug: trip.slug,
        accessCode: trip.access_code,
      })
    }
  }

  return NextResponse.json({ party })
}
