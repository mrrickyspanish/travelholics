import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import TripAccessGate from '@/components/trip-access-gate'
import TripHubClient from '@/components/trip-hub-client'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createLeaderGrant, createTripGrant, leaderAccessCookieName, tripAccessCookieName, validGrant } from '@/lib/group-trip-access'
import type { PriceDisplay } from '@/types/group-trips'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createSupabaseAdmin()
  const { data } = await supabase.from('group_trips').select('name').eq('slug', slug).eq('status', 'published').maybeSingle()
  return { title: data ? `${data.name} | Travelholics` : 'Group Trip | Travelholics', robots: { index: false, follow: false } }
}

export default async function GroupTripHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createSupabaseAdmin()
  const { data: trip } = await supabase
    .from('group_trips')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (!trip) notFound()

  const cookieStore = await cookies()
  const hasAccess = validGrant(cookieStore.get(tripAccessCookieName(trip.id))?.value, createTripGrant(trip.id, trip.access_code))

  if (!hasAccess) {
    return <><Header /><TripAccessGate slug={trip.slug} tripName={trip.name} cruiseLine={trip.cruise_line} ship={trip.ship} /><Footer /></>
  }

  const isLeader = validGrant(cookieStore.get(leaderAccessCookieName(trip.id))?.value, createLeaderGrant(trip.id, trip.leader_access_token))
  const [cabinsResult, itineraryResult, deadlinesResult, partiesResult] = await Promise.all([
    supabase.from('group_trip_cabin_offers').select('id,name,description,occupancy_label,per_person_price,cabin_total_price,availability_note').eq('trip_id', trip.id).eq('active', true).order('sort_order', { ascending: true }),
    supabase.from('group_trip_itinerary_items').select('id,day_number,title,port,arrival_time,departure_time,description').eq('trip_id', trip.id).order('sort_order', { ascending: true }),
    supabase.from('group_trip_deadlines').select('id,title,deadline_date,description').eq('trip_id', trip.id).eq('active', true).order('deadline_date', { ascending: true }),
    isLeader ? supabase.from('group_trip_parties').select('id,primary_name,email,status').eq('trip_id', trip.id).order('created_at', { ascending: true }) : Promise.resolve({ data: [] }),
  ])

  return (
    <>
      <Header />
      <TripHubClient
        trip={{
          id: trip.id,
          name: trip.name,
          slug: trip.slug,
          destination: trip.destination,
          cruiseLine: trip.cruise_line,
          ship: trip.ship,
          sailDate: trip.sail_date,
          returnDate: trip.return_date,
          departurePort: trip.departure_port,
          heroImageUrl: trip.hero_image_url,
          overview: trip.overview,
          priceDisplay: trip.price_display as PriceDisplay,
          bookingRequestNote: trip.booking_request_note,
          groupLeaderName: trip.group_leader_name,
        }}
        cabins={cabinsResult.data ?? []}
        itinerary={itineraryResult.data ?? []}
        deadlines={deadlinesResult.data ?? []}
        isLeader={isLeader}
        initialParties={partiesResult.data ?? []}
      />
      <Footer />
    </>
  )
}
