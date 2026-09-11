import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createLeaderGrant, createTripGrant, leaderAccessCookieName, tripAccessCookieName } from '@/lib/group-trip-access'

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL(`/trips/${slug}`, request.url))

  const supabase = createSupabaseAdmin()
  const { data: trip } = await supabase
    .from('group_trips')
    .select('id,slug,status,access_code,leader_access_token')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (!trip || token !== trip.leader_access_token) {
    return NextResponse.redirect(new URL(`/trips/${slug}?leader=invalid`, request.url))
  }

  const response = NextResponse.redirect(new URL(`/trips/${slug}`, request.url))
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  }
  response.cookies.set(tripAccessCookieName(trip.id), createTripGrant(trip.id, trip.access_code), cookieOptions)
  response.cookies.set(leaderAccessCookieName(trip.id), createLeaderGrant(trip.id, trip.leader_access_token), cookieOptions)
  return response
}
