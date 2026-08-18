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
}
