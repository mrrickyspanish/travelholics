import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createTripGrant, tripAccessCookieName } from '@/lib/group-trip-access'

const LOCK_AFTER = 5

function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const salt = process.env.GROUP_TRIP_ACCESS_RATE_LIMIT_SALT || process.env.CRON_SECRET || 'travelholics-group-trip-access-v1'
  return createHash('sha256').update(`${salt}:${ip}:${userAgent}`).digest('hex')
}

function retrySeconds(value: string | null) {
  if (!value) return 0
  return Math.max(1, Math.ceil((new Date(value).getTime() - Date.now()) / 1000))
}

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

  const key = clientKey(request)
  const { data: attempt } = await supabase
    .from('group_trip_access_attempts')
    .select('failure_count,locked_until')
    .eq('trip_id', trip.id)
    .eq('client_key', key)
    .maybeSingle()

  const retryAfter = retrySeconds(attempt?.locked_until ?? null)
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: `Too many incorrect attempts. Try again in ${Math.ceil(retryAfter / 60)} minute${retryAfter > 60 ? 's' : ''}.`, retryAfter },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  if (!accessCode || accessCode.trim().toLowerCase() !== String(trip.access_code).trim().toLowerCase()) {
    const { data: recorded, error: throttleError } = await supabase
      .rpc('record_group_trip_access_failure', { p_trip_id: trip.id, p_client_key: key })
      .maybeSingle()

    if (throttleError) {
      console.error('Trip access throttling error:', throttleError)
    }

    const failures = Number(recorded?.failure_count ?? (attempt?.failure_count ?? 0) + 1)
    const lockRetry = retrySeconds(recorded?.locked_until ?? null)
    if (lockRetry > 0 || failures >= LOCK_AFTER) {
      const seconds = lockRetry || 600
      return NextResponse.json(
        { error: `Too many incorrect attempts. Try again in ${Math.ceil(seconds / 60)} minutes.`, retryAfter: seconds },
        { status: 429, headers: { 'Retry-After': String(seconds) } },
      )
    }

    const attemptsLeft = Math.max(0, LOCK_AFTER - failures)
    return NextResponse.json({ error: `That access code does not match this trip. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before a short lockout.` }, { status: 401 })
  }

  await supabase
    .from('group_trip_access_attempts')
    .delete()
    .eq('trip_id', trip.id)
    .eq('client_key', key)

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
