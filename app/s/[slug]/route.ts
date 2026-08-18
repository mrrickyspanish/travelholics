import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { normalizeSlug } from '@/lib/short-links'

// Public QR / short-link redirect target. Reads through the service-role
// client since anonymous scanners never authenticate — there is no anon RLS
// policy on short_links.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const normalizedSlug = normalizeSlug(slug)

  if (!normalizedSlug) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const supabaseAdmin = createSupabaseAdmin()
  const { data, error } = await supabaseAdmin.rpc('register_short_link_click', {
    link_slug: normalizedSlug,
  })

  const destination = data?.[0]?.destination_url as string | undefined

  if (error || !destination) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.redirect(destination)
}
