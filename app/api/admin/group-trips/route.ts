import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { requireAdminSession } from '@/lib/require-admin'
import type { GroupTripCreateInput } from '@/types/group-trips'

function cleanSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function GET() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('group_trips')
    .select('id,name,slug,status,destination,cruise_line,ship,sail_date,return_date,group_leader_name,group_leader_email,created_at')
    .order('sail_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trips: data ?? [] })
}

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const input = (await request.json()) as GroupTripCreateInput
  const slug = cleanSlug(input.slug || input.name || '')
  const required = [input.name, slug, input.destination, input.cruiseLine, input.ship, input.sailDate, input.accessCode, input.groupLeaderName, input.groupLeaderEmail]
  if (required.some((value) => !String(value ?? '').trim())) {
    return NextResponse.json({ error: 'Complete the required trip, sailing, access, and group leader fields.' }, { status: 400 })
  }

  if (!Array.isArray(input.cabins) || input.cabins.length === 0 || input.cabins.some((cabin) => !cabin.name?.trim())) {
    return NextResponse.json({ error: 'Add at least one named cabin offer.' }, { status: 400 })
  }

  const supabase = createSupabaseAdmin()

  if (input.inquiryId) {
    const { data: inquiry, error: inquiryError } = await supabase
      .from('group_cruise_inquiries')
      .select('id,status,converted_trip_id')
      .eq('id', input.inquiryId)
      .maybeSingle()

    if (inquiryError) return NextResponse.json({ error: inquiryError.message }, { status: 500 })
    if (!inquiry) return NextResponse.json({ error: 'The source inquiry could not be found.' }, { status: 404 })
    if (inquiry.converted_trip_id) {
      return NextResponse.json({ error: 'This inquiry has already been converted to a Trip Hub.' }, { status: 409 })
    }
    if (inquiry.status === 'closed_lost') {
      return NextResponse.json({ error: 'Reopen this inquiry before converting it to a trip.' }, { status: 409 })
    }
  }

  const { data: trip, error: tripError } = await supabase
    .from('group_trips')
    .insert({
      inquiry_id: input.inquiryId || null,
      slug,
      name: input.name.trim(),
      destination: input.destination.trim(),
      cruise_line: input.cruiseLine.trim(),
      ship: input.ship.trim(),
      sail_date: input.sailDate,
      return_date: input.returnDate || null,
      departure_port: input.departurePort?.trim() || null,
      hero_image_url: input.heroImageUrl?.trim() || null,
      overview: input.overview?.trim() || null,
      access_code: input.accessCode.trim(),
      group_leader_name: input.groupLeaderName.trim(),
      group_leader_email: input.groupLeaderEmail.trim().toLowerCase(),
      group_leader_phone: input.groupLeaderPhone?.trim() || null,
      price_display: input.priceDisplay || 'both',
      booking_request_note: input.bookingRequestNote?.trim() || null,
      created_by: session.user.email || null,
    })
    .select('*')
    .single()

  if (tripError || !trip) {
    if (tripError?.code === '23505') {
      return NextResponse.json({ error: 'A trip with this URL or source inquiry already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: tripError?.message || 'Unable to create trip.' }, { status: 500 })
  }

  try {
    const cabinRows = input.cabins.map((cabin, index) => ({
      trip_id: trip.id,
      name: cabin.name.trim(),
      description: cabin.description?.trim() || null,
      occupancy_label: cabin.occupancyLabel?.trim() || null,
      per_person_price: cabin.perPersonPrice ?? null,
      cabin_total_price: cabin.cabinTotalPrice ?? null,
      availability_note: cabin.availabilityNote?.trim() || null,
      sort_order: index,
    }))
    const { error: cabinError } = await supabase.from('group_trip_cabin_offers').insert(cabinRows)
    if (cabinError) throw cabinError

    if (input.itinerary?.length) {
      const { error } = await supabase.from('group_trip_itinerary_items').insert(
        input.itinerary.map((item, index) => ({
          trip_id: trip.id,
          day_number: item.dayNumber,
          title: item.title.trim(),
          port: item.port?.trim() || null,
          arrival_time: item.arrivalTime?.trim() || null,
          departure_time: item.departureTime?.trim() || null,
          description: item.description?.trim() || null,
          sort_order: index,
        }))
      )
      if (error) throw error
    }

    if (input.deadlines?.length) {
      const { error } = await supabase.from('group_trip_deadlines').insert(
        input.deadlines.map((deadline) => ({
          trip_id: trip.id,
          title: deadline.title.trim(),
          deadline_date: deadline.deadlineDate,
          description: deadline.description?.trim() || null,
          reminder_days_before: deadline.reminderDaysBefore ?? [],
        }))
      )
      if (error) throw error
    }

    if (input.inquiryId) {
      const { error: conversionError } = await supabase
        .from('group_cruise_inquiries')
        .update({
          status: 'confirmed',
          converted_trip_id: trip.id,
          converted_at: new Date().toISOString(),
        })
        .eq('id', input.inquiryId)
        .is('converted_trip_id', null)

      if (conversionError) throw conversionError
    }
  } catch (error) {
    await supabase.from('group_trips').delete().eq('id', trip.id)
    const message = error instanceof Error ? error.message : 'Unable to finish creating the trip.'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({
    trip,
    tripPath: `/trips/${trip.slug}`,
    leaderPath: `/trips/${trip.slug}/leader?token=${trip.leader_access_token}`,
  }, { status: 201 })
}
