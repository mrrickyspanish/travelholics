export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface ArticleGenerateMeta {
  title: string
  slug: string
  seo_title: string
  seo_description: string
  excerpt: string
  compliance_flags: string[]
  topic_cluster: string
  keyword: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  seo_title: string | null
  seo_description: string | null
  topic_cluster: string | null
  keyword: string | null
  scenario: string | null
  status: ArticleStatus
  word_count: number | null
  compliance_flags: string[]
  is_voice_example: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
