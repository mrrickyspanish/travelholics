import { notFound } from 'next/navigation'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import EditGroupTripForm from './EditGroupTripForm'

export const dynamic = 'force-dynamic'

export default async function EditGroupTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createSupabaseAdmin()
  const [tripResult, cabinsResult, itineraryResult, deadlinesResult] = await Promise.all([
    supabase.from('group_trips').select('*').eq('id', id).maybeSingle(),
    supabase.from('group_trip_cabin_offers').select('*').eq('trip_id', id).eq('active', true).order('sort_order', { ascending: true }),
    supabase.from('group_trip_itinerary_items').select('*').eq('trip_id', id).order('sort_order', { ascending: true }),
    supabase.from('group_trip_deadlines').select('*').eq('trip_id', id).eq('active', true).order('deadline_date', { ascending: true }),
  ])

  if (!tripResult.data) notFound()

  return (
    <EditGroupTripForm
      key={tripResult.data.updated_at}
      trip={tripResult.data}
      cabins={cabinsResult.data ?? []}
      itinerary={itineraryResult.data ?? []}
      deadlines={deadlinesResult.data ?? []}
    />
  )
}
