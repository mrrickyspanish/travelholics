import { createHmac } from 'crypto'
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createTripGrant, tripAccessCookieName } from '@/lib/group-trip-access'

const LOCK_AFTER = 5

type AccessAttempt = {
  failure_count: number
  locked_until: string | null
}

function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || request.headers.get('x-real-ip')?.trim()
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const rawClient = ip ? `ip:${ip}` : `ua:${userAgent}`
  const salt = process.env.GROUP_TRIP_ACCESS_RATE_LIMIT_SALT
    || process.env.CRON_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || 'travelholics-group-trip-access-v1'

  return createHmac('sha256', salt).update(rawClient).digest('hex')
}

function retrySeconds(value: string | null | undefined) {
  if (!value) return 0
  const delta = new Date(value).getTime() - Date.now()
  if (!Number.isFinite(delta) || delta <= 0) return 0
  return Math.ceil(delta / 1000)
}

function rpcAttempt(data: unknown): AccessAttempt | null {
  const row = Array.isArray(data) ? data[0] : data
  if (!row || typeof row !== 'object') return null
  const candidate = row as Partial<AccessAttempt>
  return {
    failure_count: Number(candidate.failure_count || 0),
    locked_until: typeof candidate.locked_until === 'string' ? candidate.locked_until : null,
  }
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
  const { data: attempt, error: attemptError } = await supabase
    .from('group_trip_access_attempts')
    .select('failure_count,locked_until')
    .eq('trip_id', trip.id)
    .eq('client_key', key)
    .maybeSingle()

  if (attemptError) {
    // Keep the access-code gate functional if the throttling migration has not been applied yet.
    console.error('Trip access throttling lookup error:', attemptError)
  }

  const retryAfter = retrySeconds(attempt?.locked_until)
  if (retryAfter > 0) {
    return NextResponse.json(
      {
        error: `Too many incorrect attempts. Try again in ${Math.ceil(retryAfter / 60)} minute${retryAfter > 60 ? 's' : ''}.`,
        retryAfter,
      },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  if (!accessCode || accessCode.trim().toLowerCase() !== String(trip.access_code).trim().toLowerCase()) {
    const { data: recordedData, error: throttleError } = await supabase
      .rpc('record_group_trip_access_failure', { p_trip_id: trip.id, p_client_key: key })

    if (throttleError) {
      console.error('Trip access throttling record error:', throttleError)
      return NextResponse.json({ error: 'That access code does not match this trip.' }, { status: 401 })
    }

    const recorded = rpcAttempt(recordedData)
    const failures = recorded?.failure_count ?? Number(attempt?.failure_count ?? 0) + 1
    const lockRetry = retrySeconds(recorded?.locked_until)

    if (lockRetry > 0 || failures >= LOCK_AFTER) {
      const seconds = lockRetry || 600
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Try again in 10 minutes.', retryAfter: seconds },
        { status: 429, headers: { 'Retry-After': String(seconds) } },
      )
    }

    const attemptsLeft = Math.max(0, LOCK_AFTER - failures)
    return NextResponse.json(
      {
        error: `That access code does not match this trip. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before a short lockout.`,
      },
      { status: 401 },
    )
  }

  const { error: clearError } = await supabase
    .from('group_trip_access_attempts')
    .delete()
    .eq('trip_id', trip.id)
    .eq('client_key', key)

  if (clearError) console.error('Trip access throttling clear error:', clearError)

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
