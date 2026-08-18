import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { isAdminEmail } from '@/lib/admin-auth'
import {
  generateRandomSlug,
  isValidDestinationUrl,
  isValidSlug,
  normalizeSlug,
} from '@/lib/short-links'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('short_links')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ shortLinks: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const payload = (body ?? {}) as Record<string, unknown>
  const destinationUrl = typeof payload.destination_url === 'string' ? payload.destination_url.trim() : ''
  const label = typeof payload.label === 'string' ? payload.label.trim() : ''
  const requestedSlug = typeof payload.slug === 'string' ? normalizeSlug(payload.slug) : ''
  const metadata =
    payload.metadata && typeof payload.metadata === 'object' && !Array.isArray(payload.metadata)
      ? (payload.metadata as Record<string, unknown>)
      : {}

  if (!isValidDestinationUrl(destinationUrl)) {
    return NextResponse.json(
      { error: 'Enter a full destination URL starting with http:// or https://.' },
      { status: 400 }
    )
  }

  let slug = requestedSlug
  if (slug) {
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        {
          error:
            'Slugs may only use lowercase letters, numbers, and hyphens, and must be 64 characters or fewer.',
        },
        { status: 400 }
      )
    }
  } else {
    slug = generateRandomSlug()
  }

  const { data, error } = await supabase
    .from('short_links')
    .insert({
      slug,
      destination_url: destinationUrl,
      label: label || null,
      metadata,
      created_by: session.user.email ?? null,
    })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'That slug is already taken.' }, { status: 409 })
    }
    if (error.code === '23514') {
      return NextResponse.json(
        {
          error:
            'That slug isn\'t valid — use lowercase letters, numbers, and hyphens, 64 characters or fewer.',
        },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ shortLink: data })
}
