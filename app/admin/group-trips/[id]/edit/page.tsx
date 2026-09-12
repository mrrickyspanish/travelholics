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

  const cabins = cabinsResult.data ?? []
  const itinerary = itineraryResult.data ?? []
  const deadlines = deadlinesResult.data ?? []
  const editorKey = [
    cabins.map((row) => row.id).join(','),
    itinerary.map((row) => row.id).join(','),
    deadlines.map((row) => row.id).join(','),
  ].join('|')

  return (
    <EditGroupTripForm
      key={editorKey}
      trip={tripResult.data}
      cabins={cabins}
      itinerary={itinerary}
      deadlines={deadlines}
    />
  )
}
