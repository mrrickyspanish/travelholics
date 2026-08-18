import { createServerSupabase } from '@/lib/supabase-server'
import type { ShortLink } from '@/types/short-links'
import ShortLinksClient from './ShortLinksClient'

export default async function ShortLinksPage() {
  const supabase = await createServerSupabase()

  const { data } = await supabase
    .from('short_links')
    .select('*')
    .order('created_at', { ascending: false })

  return <ShortLinksClient initialShortLinks={(data ?? []) as ShortLink[]} />
}
