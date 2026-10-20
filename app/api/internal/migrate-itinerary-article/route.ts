import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { STATIC_ARTICLES } from '@/lib/static-articles'

const MIGRATION_TOKEN = 'ep4-cms-20261020-7f43c9d2'

function bodyToContent(body: typeof STATIC_ARTICLES[number]['body']) {
  return body.map((block) => {
    switch (block.type) {
      case 'h2': return `**${block.text}**`
      case 'h3': return `**${block.text}**`
      case 'p': return block.text
      case 'quote': return `"${block.text}"${block.attribution ? ` — ${block.attribution}` : ''}`
      case 'list': return block.items.map((item) => `• ${item}`).join('\n')
      case 'img': return `[Image: ${block.alt}] ${block.src}`
      case 'divider': return '---'
    }
  }).join('\n\n')
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('token') !== MIGRATION_TOKEN) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const article = STATIC_ARTICLES.find((item) => item.slug === 'how-to-choose-the-right-cruise-itinerary')
  if (!article) return NextResponse.json({ error: 'Source article missing' }, { status: 500 })

  const supabase = createSupabaseAdmin()
  const content = bodyToContent(article.body)

  const { data, error } = await supabase
    .from('articles')
    .upsert({
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      excerpt: article.excerpt,
      body: article.body,
      category: article.category,
      author: article.author,
      cover_image: article.cover_image,
      cover_alt: article.cover_alt,
      tags: article.tags,
      featured: article.featured,
      published: article.published,
      published_at: article.published_at,
      meta_title: article.meta_title,
      meta_description: article.meta_description,
      cta_label: article.cta_label,
      cta_url: article.cta_url,
      content,
      seo_title: article.meta_title,
      seo_description: article.meta_description,
      topic_cluster: 'trip-blog',
      keyword: 'how to choose a cruise itinerary',
      scenario: 'first-time-cruiser',
      status: 'published',
      word_count: content.trim().split(/\s+/).filter(Boolean).length,
      compliance_flags: [],
      is_voice_example: false,
    }, { onConflict: 'slug' })
    .select('id,slug,title,status,published')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, article: data })
}
