export interface DuckHuntLinkMetadata {
  campaign: 'duck-hunt'
  ship: string
  ship_slug: string
  sail_date: string
  duck_number: string | null
  batch: string | null
}

export interface ShortLink {
  id: string
  created_at: string
  updated_at: string
  slug: string
  destination_url: string
  label: string | null
  is_active: boolean
  click_count: number
  last_clicked_at: string | null
  created_by: string | null
  metadata: Partial<DuckHuntLinkMetadata> & Record<string, unknown>
}

export interface ShortLinkScan {
  id: string
  short_link_id: string
  scanned_at: string
  user_agent: string | null
  referer: string | null
}
