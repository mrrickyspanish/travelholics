import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { requireAdminSession } from '@/lib/require-admin'
import type { GroupTripUpdateInput } from '@/types/group-trips'

const TRIP_STATUSES = ['draft', 'published', 'archived'] as const

function clean(value: string | undefined) {
  return value?.trim() || null
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const body = await request.json() as { status?: 'draft' | 'published' | 'archived'; details?: GroupTripUpdateInput; confirmedImpact?: boolean }
  const supabase = createSupabaseAdmin()

  if (body.details) {
    const input = body.details
    const required = [input.name, input.destination, input.cruiseLine, input.ship, input.sailDate, input.accessCode, input.groupLeaderName, input.groupLeaderEmail]
    if (required.some((value) => !String(value ?? '').trim())) {
      return NextResponse.json({ error: 'Complete the required trip, sailing, access, and group leader fields.' }, { status: 400 })
    }
    if (!Array.isArray(input.cabins) || input.cabins.length === 0 || input.cabins.some((cabin) => !cabin.name?.trim())) {
      return NextResponse.json({ error: 'Keep at least one named cabin offer on the trip.' }, { status: 400 })
    }

    const [tripResult, cabinsResult, itineraryResult, deadlinesResult] = await Promise.all([
      supabase.from('group_trips').select('id,slug,access_code').eq('id', id).maybeSingle(),
      supabase.from('group_trip_cabin_offers').select('id').eq('trip_id', id),
      supabase.from('group_trip_itinerary_items').select('id').eq('trip_id', id),
      supabase.from('group_trip_deadlines').select('id').eq('trip_id', id),
    ])

    if (tripResult.error) return NextResponse.json({ error: tripResult.error.message }, { status: 500 })
    if (!tripResult.data) return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })
    const childError = cabinsResult.error || itineraryResult.error || deadlinesResult.error
    if (childError) return NextResponse.json({ error: childError.message }, { status: 500 })

    const existingCabinIds = new Set((cabinsResult.data ?? []).map((row) => row.id))
    const existingItineraryIds = new Set((itineraryResult.data ?? []).map((row) => row.id))
    const existingDeadlineIds = new Set((deadlinesResult.data ?? []).map((row) => row.id))

    if (input.cabins.some((row) => row.id && !existingCabinIds.has(row.id)) ||
        input.itinerary.some((row) => row.id && !existingItineraryIds.has(row.id)) ||
        input.deadlines.some((row) => row.id && !existingDeadlineIds.has(row.id))) {
      return NextResponse.json({ error: 'One of the trip items no longer belongs to this Trip Hub. Refresh and try again.' }, { status: 409 })
    }

    const { data: trip, error: tripError } = await supabase
      .from('group_trips')
      .update({
        name: input.name.trim(),
        destination: input.destination.trim(),
        cruise_line: input.cruiseLine.trim(),
        ship: input.ship.trim(),
        sail_date: input.sailDate,
        return_date: input.returnDate || null,
        departure_port: clean(input.departurePort),
        hero_image_url: clean(input.heroImageUrl),
        overview: clean(input.overview),
        access_code: input.accessCode.trim(),
        group_leader_name: input.groupLeaderName.trim(),
        group_leader_email: input.groupLeaderEmail.trim().toLowerCase(),
        group_leader_phone: clean(input.groupLeaderPhone),
        price_display: input.priceDisplay || 'both',
        booking_request_note: clean(input.bookingRequestNote),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (tripError || !trip) return NextResponse.json({ error: tripError?.message || 'Unable to update the Trip Hub.' }, { status: 500 })

    for (const [index, cabin] of input.cabins.entries()) {
      const values = {
        name: cabin.name.trim(),
        description: clean(cabin.description),
        occupancy_label: clean(cabin.occupancyLabel),
        per_person_price: cabin.perPersonPrice ?? null,
        cabin_total_price: cabin.cabinTotalPrice ?? null,
        availability_note: clean(cabin.availabilityNote),
        sort_order: index,
        active: true,
      }
      const result = cabin.id
        ? await supabase.from('group_trip_cabin_offers').update(values).eq('id', cabin.id).eq('trip_id', id)
        : await supabase.from('group_trip_cabin_offers').insert({ trip_id: id, ...values })
      if (result.error) return NextResponse.json({ error: `Trip details saved, but a cabin option could not be updated: ${result.error.message}` }, { status: 500 })
    }
    const keptCabinIds = input.cabins.flatMap((row) => row.id ? [row.id] : [])
    for (const cabinId of existingCabinIds) {
      if (!keptCabinIds.includes(cabinId)) {
        const { error } = await supabase.from('group_trip_cabin_offers').update({ active: false }).eq('id', cabinId).eq('trip_id', id)
        if (error) return NextResponse.json({ error: `Trip details saved, but an old cabin option could not be retired: ${error.message}` }, { status: 500 })
      }
    }

    for (const [index, item] of input.itinerary.entries()) {
      if (!item.title?.trim()) continue
      const values = {
        day_number: item.dayNumber,
        title: item.title.trim(),
        port: clean(item.port),
        arrival_time: clean(item.arrivalTime),
        departure_time: clean(item.departureTime),
        description: clean(item.description),
        sort_order: index,
      }
      const result = item.id
        ? await supabase.from('group_trip_itinerary_items').update(values).eq('id', item.id).eq('trip_id', id)
        : await supabase.from('group_trip_itinerary_items').insert({ trip_id: id, ...values })
      if (result.error) return NextResponse.json({ error: `Trip details saved, but an itinerary item could not be updated: ${result.error.message}` }, { status: 500 })
    }
    const keptItineraryIds = input.itinerary.flatMap((row) => row.id ? [row.id] : [])
    for (const itineraryId of existingItineraryIds) {
      if (!keptItineraryIds.includes(itineraryId)) {
        const { error } = await supabase.from('group_trip_itinerary_items').delete().eq('id', itineraryId).eq('trip_id', id)
        if (error) return NextResponse.json({ error: `Trip details saved, but an old itinerary item could not be removed: ${error.message}` }, { status: 500 })
      }
    }

    for (const deadline of input.deadlines) {
      if (!deadline.title?.trim() || !deadline.deadlineDate) continue
      const values = {
        title: deadline.title.trim(),
        deadline_date: deadline.deadlineDate,
        description: clean(deadline.description),
        reminder_days_before: deadline.reminderDaysBefore ?? [],
        active: true,
      }
      const result = deadline.id
        ? await supabase.from('group_trip_deadlines').update(values).eq('id', deadline.id).eq('trip_id', id)
        : await supabase.from('group_trip_deadlines').insert({ trip_id: id, ...values })
      if (result.error) return NextResponse.json({ error: `Trip details saved, but a deadline could not be updated: ${result.error.message}` }, { status: 500 })
    }
    const keptDeadlineIds = input.deadlines.flatMap((row) => row.id ? [row.id] : [])
    for (const deadlineId of existingDeadlineIds) {
      if (!keptDeadlineIds.includes(deadlineId)) {
        const { error } = await supabase.from('group_trip_deadlines').update({ active: false }).eq('id', deadlineId).eq('trip_id', id)
        if (error) return NextResponse.json({ error: `Trip details saved, but an old deadline could not be retired: ${error.message}` }, { status: 500 })
      }
    }

    const [savedCabins, savedItinerary, savedDeadlines] = await Promise.all([
      supabase.from('group_trip_cabin_offers').select('*').eq('trip_id', id).eq('active', true).order('sort_order', { ascending: true }),
      supabase.from('group_trip_itinerary_items').select('*').eq('trip_id', id).order('sort_order', { ascending: true }),
      supabase.from('group_trip_deadlines').select('*').eq('trip_id', id).eq('active', true).order('deadline_date', { ascending: true }),
    ])
    const refreshError = savedCabins.error || savedItinerary.error || savedDeadlines.error
    if (refreshError) return NextResponse.json({ error: `Trip Hub saved, but the editor could not refresh: ${refreshError.message}` }, { status: 500 })

    return NextResponse.json({
      trip,
      cabins: savedCabins.data ?? [],
      itinerary: savedItinerary.data ?? [],
      deadlines: savedDeadlines.data ?? [],
      accessCodeChanged: tripResult.data.access_code !== input.accessCode.trim(),
    })
  }

  if (!body.status || !TRIP_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid trip update.' }, { status: 400 })
  }

  const { data: currentTrip } = await supabase.from('group_trips').select('id,status').eq('id', id).maybeSingle()
  if (!currentTrip) return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })

  const disruptive = body.status === 'archived' || (currentTrip.status === 'published' && body.status === 'draft')
  if (disruptive && !body.confirmedImpact) {
    const { data: activeParties, error: partyError } = await supabase
      .from('group_trip_parties')
      .select('id,status')
      .eq('trip_id', id)
      .neq('status', 'invited')
    if (partyError) return NextResponse.json({ error: partyError.message }, { status: 500 })

    const activeCount = activeParties?.length ?? 0
    if (activeCount > 0) {
      const bookedCount = (activeParties ?? []).filter((party) => party.status === 'booked' || party.status === 'travel_ready').length
      return NextResponse.json({
        error: body.status === 'archived'
          ? `This trip has ${activeCount} active traveling ${activeCount === 1 ? 'party' : 'parties'}, including ${bookedCount} booked or Travel Ready. Confirm before archiving.`
          : `This published trip has ${activeCount} active traveling ${activeCount === 1 ? 'party' : 'parties'}. Confirm before returning it to draft.`,
        requiresConfirmation: true,
        activeCount,
        bookedCount,
      }, { status: 409 })
    }
  }

  const patch: Record<string, unknown> = { status: body.status }
  if (body.status === 'published') patch.published_at = new Date().toISOString()

  const { data, error } = await supabase.from('group_trips').update(patch).eq('id', id).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trip: data })
}
