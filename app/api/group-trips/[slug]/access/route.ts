import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createTripGrant, tripAccessCookieName } from '@/lib/group-trip-access'

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const { accessCode } = await request.json() as { accessCode?: string }
  const supabase = createSupabaseAdmin()
  const { data: trip, error } = await supabase
    .from('group_trips')
    .select('id,access_code,status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !trip) return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })
  if (!accessCode || accessCode.trim().toLowerCase() !== String(trip.access_code).trim().toLowerCase()) {
    return NextResponse.json({ error: 'That access code does not match this trip.' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(tripAccessCookieName(trip.id), createTripGrant(trip.id, trip.access_code), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return response
}
