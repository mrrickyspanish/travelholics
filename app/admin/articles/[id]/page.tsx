'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Article } from '@/types/article'
import { categoryFromTopicCluster } from '@/lib/article-clusters'
import { contentToBlocks } from '@/lib/articles'
import { ExternalLink, Save, Trash2 } from 'lucide-react'

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Editable fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [status, setStatus] = useState<Article['status']>('draft')
  const [isVoiceExample, setIsVoiceExample] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [coverAlt, setCoverAlt] = useState('')

  useEffect(() => {
    const supabase = createBrowserSupabase()
    supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setArticle(data)
          setTitle(data.title)
          setSlug(data.slug)
          setContent(data.content ?? '')
          setExcerpt(data.excerpt ?? '')
          setSeoTitle(data.seo_title ?? '')
          setSeoDescription(data.seo_description ?? '')
          setStatus(data.status)
          setIsVoiceExample(data.is_voice_example)
          setCoverImage(data.cover_image ?? '')
          setCoverAlt(data.cover_alt ?? '')
        }
        setLoading(false)
      })
  }, [id])

  function wordCount() {
    return content.trim().split(/\s+/).filter(Boolean).length
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createBrowserSupabase()
    const { error } = await supabase
      .from('articles')
      .update({
        title,
        slug,
        content,
        excerpt: excerpt || null,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        status,
        is_voice_example: isVoiceExample,
        cover_image: coverImage || null,
        cover_alt: coverAlt || null,
        word_count: wordCount(),
        published: status === 'published',
        category: categoryFromTopicCluster(article?.topic_cluster ?? null),
        body: contentToBlocks(content),
        published_at: status === 'published' && !article?.published_at ? new Date().toISOString() : article?.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    setSaving(false)
    if (!error) router.refresh()
  }

  async function handleDelete() {
    const supabase = createBrowserSupabase()
    await supabase.from('articles').delete().eq('id', id)
    router.push('/admin/articles')
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#10755A] border-t-transparent" />
      </div>
    )
  }

  if (!article) {
    return <div className="p-8 text-gray-500">Article not found.</div>
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{article.title}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {article.topic_cluster} · Created {new Date(article.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {status === 'published' && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ExternalLink size={14} />
              View
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#10755A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Status + flags */}
        <div className="flex flex-wrap gap-4 rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Article['status'])}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVoiceExample}
                onChange={(e) => setIsVoiceExample(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#10755A] focus:ring-[#10755A]"
              />
              <span className="text-sm text-gray-700">Use as voice example (injected into AI prompts)</span>
            </label>
          </div>
          {article.compliance_flags?.length > 0 && (
            <div className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">Compliance flags</p>
              {article.compliance_flags.map((f, i) => (
                <p key={i} className="text-xs text-amber-600">• {f}</p>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#10755A]">
            <span className="px-3 py-2.5 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* SEO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              SEO Title <span className="text-gray-400">({seoTitle.length}/60)</span>
            </label>
            <input
              type="text"
              maxLength={70}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Meta Description <span className={seoDescription.length > 155 ? 'text-red-500' : 'text-gray-400'}>({seoDescription.length}/155)</span>
            </label>
            <input
              type="text"
              maxLength={170}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Excerpt</label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Cover image */}
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cover Image URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cover Image Alt Text</label>
              <input
                type="text"
                value={coverAlt}
                onChange={(e) => setCoverAlt(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
              />
            </div>
          </div>
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={coverAlt || 'Cover preview'}
              className="h-24 w-36 rounded-lg object-cover border border-gray-200"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500">Content</label>
            <span className="text-xs text-gray-400">{wordCount()} words</span>
          </div>
          <textarea
            rows={28}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Danger zone */}
        <div className="border-t border-gray-100 pt-5">
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-red-600">Delete this article permanently?</p>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={14} />
              Delete Article
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
