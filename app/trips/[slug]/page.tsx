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
  const { data } = await supabase.from('group_trips').select('name').eq('slug', slug).maybeSingle()
  return { title: data ? `${data.name} | Travelholics` : 'Group Trip | Travelholics', robots: { index: false, follow: false } }
}

function TripStateMessage({ tripName, status }: { tripName: string; status: 'draft' | 'archived' }) {
  const draft = status === 'draft'
  return (
    <main className="flex min-h-[72vh] items-center justify-center bg-sand px-5 py-28 text-ink">
      <div className="w-full max-w-2xl rounded-[2rem] border border-ink/8 bg-cream p-7 text-center shadow-sm sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Travelholics Group Trip</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep sm:text-5xl">{tripName}</h1>
        <h2 className="mt-6 text-xl font-bold text-ink">{draft ? 'This Trip Hub is getting ready.' : 'This Trip Hub is archived.'}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone">{draft ? 'Travelholics is still putting the group details together. If Yolanda or your group leader sent you this link, check back once the trip is published.' : 'This trip is no longer accepting new activity. If you already traveled with the group or need help with an existing booking, contact Travelholics directly.'}</p>
        <a href="/group-cruises" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-mid px-5 py-3 text-sm font-bold text-white">Back to Group Cruises</a>
      </div>
    </main>
  )
}

export default async function GroupTripHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createSupabaseAdmin()
  const { data: trip } = await supabase.from('group_trips').select('*').eq('slug', slug).maybeSingle()
  if (!trip) notFound()

  const cookieStore = await cookies()
  const isLeader = validGrant(cookieStore.get(leaderAccessCookieName(trip.id))?.value, createLeaderGrant(trip.id, trip.leader_access_token))
  const hasGuestGrant = validGrant(cookieStore.get(tripAccessCookieName(trip.id))?.value, createTripGrant(trip.id, trip.access_code))
  const hasAccess = isLeader || hasGuestGrant

  if (trip.status === 'draft' && !isLeader) return <><Header /><TripStateMessage tripName={trip.name} status="draft" /><Footer /></>
  if (trip.status === 'archived' && !hasAccess) return <><Header /><TripStateMessage tripName={trip.name} status="archived" /><Footer /></>
  if (trip.status === 'published' && !hasAccess) return <><Header /><TripAccessGate slug={trip.slug} tripName={trip.name} cruiseLine={trip.cruise_line} ship={trip.ship} /><Footer /></>

  const mode: 'live' | 'preview' | 'archived' = trip.status === 'published' ? 'live' : trip.status === 'draft' ? 'preview' : 'archived'
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
        trip={{ id: trip.id, name: trip.name, slug: trip.slug, destination: trip.destination, cruiseLine: trip.cruise_line, ship: trip.ship, sailDate: trip.sail_date, returnDate: trip.return_date, departurePort: trip.departure_port, heroImageUrl: trip.hero_image_url, overview: trip.overview, priceDisplay: trip.price_display as PriceDisplay, bookingRequestNote: trip.booking_request_note, groupLeaderName: trip.group_leader_name }}
        cabins={cabinsResult.data ?? []}
        itinerary={itineraryResult.data ?? []}
        deadlines={deadlinesResult.data ?? []}
        isLeader={isLeader}
        initialParties={partiesResult.data ?? []}
        mode={mode}
      />
      <Footer />
    </>
  )
}
