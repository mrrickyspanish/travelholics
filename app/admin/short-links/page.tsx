import { createServerSupabase } from '@/lib/supabase-server'
import type { ShortLink } from '@/types/short-links'
import ShortLinksClient from './ShortLinksClient'

export default async function ShortLinksPage() {
  const supabase = await createServerSupabase()

  const [{ data: shortLinks }, { data: scans }, { data: claimedScans }] = await Promise.all([
    supabase.from('short_links').select('*').order('created_at', { ascending: false }),
    supabase.from('short_link_scans').select('id, short_link_id'),
    supabase.from('duck_hunt_leads').select('scan_id').not('scan_id', 'is', null),
  ])

  // duck_hunt_leads only stores which scan converted; join back to the short
  // link it belongs to here so the list can show a claim count per link
  // without a database view.
  const shortLinkIdByScanId = new Map((scans ?? []).map((s) => [s.id, s.short_link_id]))
  const claimCountByShortLinkId = new Map<string, number>()
  for (const { scan_id } of claimedScans ?? []) {
    const shortLinkId = scan_id ? shortLinkIdByScanId.get(scan_id) : undefined
    if (!shortLinkId) continue
    claimCountByShortLinkId.set(shortLinkId, (claimCountByShortLinkId.get(shortLinkId) ?? 0) + 1)
  }

  const claimCounts = Object.fromEntries(claimCountByShortLinkId)

  return (
    <ShortLinksClient
      initialShortLinks={(shortLinks ?? []) as ShortLink[]}
      claimCounts={claimCounts}
    />
  )
}
