import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { normalizeSlug } from '@/lib/short-links'

// Public QR / short-link redirect target. Reads through the service-role
// client since anonymous scanners never authenticate — there is no anon RLS
// policy on short_links or short_link_scans.
//
// Every hit here is a physical QR scan (a duck found on a ship), so beyond
// redirecting we log a scan event and stamp its id onto the destination URL.
// The destination page (e.g. /duck-hunt) can thread that id back through its
// claim form, which is what lets a completed claim be joined back to the
// exact scan that produced it — not just to a ship-level click counter.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }
type ClickResult = { id: string; destination_url: string }

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

  const match = (data as ClickResult[] | null)?.[0]

  if (error || !match) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  let destination = match.destination_url

  try {
    const { data: scan } = await supabaseAdmin
      .from('short_link_scans')
      .insert({
        short_link_id: match.id,
        user_agent: req.headers.get('user-agent'),
        referer: req.headers.get('referer'),
      })
      .select('id')
      .single()

    if (scan?.id) {
      const destinationUrl = new URL(destination)
      destinationUrl.searchParams.set('scan', scan.id)
      destination = destinationUrl.toString()
    }
  } catch {
    // Scan logging is best-effort — a broken insert must never block the
    // redirect. The click counter above already recorded the scan happened.
  }

  return NextResponse.redirect(destination)
}
