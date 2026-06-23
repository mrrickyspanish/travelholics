'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TOPIC_CLUSTERS, AUDIENCE_SCENARIOS } from '@/lib/article-clusters'
import type { ArticleGenerateMeta } from '@/types/article'
import { CoverImageUploader } from '@/components/cover-image-uploader'
import { RotateCcw, Save, Zap } from 'lucide-react'

type GenMode = 'structured' | 'freewrite'
type GenState = 'idle' | 'streaming' | 'done' | 'error'

const LENGTH_OPTIONS = [
  { label: 'Standard (750–950 words)', value: '750-950' },
  { label: 'Deep Dive (1100–1400 words)', value: '1100-1400' },
]

export default function NewArticlePage() {
  const router = useRouter()

  // Mode
  const [genMode, setGenMode] = useState<GenMode>('structured')

  // Structured inputs
  const [selectedCluster, setSelectedCluster] = useState('')
  const [keyword, setKeyword] = useState('')
  const [scenario, setScenario] = useState('')
  const [targetLength, setTargetLength] = useState('750-950')

  // Free write inputs
  const [brief, setBrief] = useState('')

  // Generation state
  const [genState, setGenState] = useState<GenState>('idle')
  const [streamText, setStreamText] = useState('')
  const streamRef = useRef('')

  // Parsed output
  const [meta, setMeta] = useState<Partial<ArticleGenerateMeta>>({})
  const [articleContent, setArticleContent] = useState('')
  const [complianceFlags, setComplianceFlags] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState('')
  const [coverAlt, setCoverAlt] = useState('')

  // Save state
  const [saving, setSaving] = useState(false)

  const canGenerate =
    genMode === 'freewrite'
      ? brief.trim().length > 0
      : selectedCluster.length > 0 && keyword.trim().length > 0

  async function generate() {
    setGenState('streaming')
    setStreamText('')
    streamRef.current = ''
    setMeta({})
    setArticleContent('')
    setComplianceFlags([])
    setCoverImage('')
    setCoverAlt('')

    const body =
      genMode === 'freewrite'
        ? { brief, targetLength }
        : { topicCluster: selectedCluster, keyword, scenario, targetLength }

    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(await res.text())

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        streamRef.current += chunk
        setStreamText(streamRef.current)
      }

      // Parse the completed stream
      parseOutput(streamRef.current)
      setGenState('done')
    } catch (err) {
      console.error(err)
      setGenState('error')
    }
  }

  function parseOutput(raw: string) {
    const separatorIdx = raw.indexOf('<<<CONTENT>>>')
    if (separatorIdx === -1) {
      // Fallback: treat entire output as content
      setArticleContent(raw.trim())
      return
    }

    const metaRaw = raw.slice(0, separatorIdx).trim()
    const content = raw.slice(separatorIdx + '<<<CONTENT>>>'.length).trim()

    try {
      // Strip code fences defensively
      const cleaned = metaRaw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      const parsed: ArticleGenerateMeta = JSON.parse(cleaned)
      setMeta(parsed)
      setComplianceFlags(parsed.compliance_flags ?? [])
      setCoverAlt(parsed.cover_image_alt ?? '')
    } catch {
      // If JSON parse fails, set title from first line
      setMeta({ title: metaRaw.split('\n')[0].replace(/^[#\s]+/, '') })
    }

    setArticleContent(content)
  }

  function countWords(text: string) {
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  async function saveDraft() {
    setSaving(true)
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: meta.title ?? 'Untitled',
          slug: meta.slug ?? `article-${Date.now()}`,
          content: articleContent,
          excerpt: meta.excerpt ?? null,
          seo_title: meta.seo_title ?? null,
          seo_description: meta.seo_description ?? null,
          topic_cluster: meta.topic_cluster ?? selectedCluster ?? null,
          keyword: meta.keyword ?? keyword ?? null,
          scenario: scenario ?? null,
          status: 'draft',
          word_count: countWords(articleContent),
          compliance_flags: complianceFlags,
          cover_image: coverImage || null,
          cover_alt: coverAlt || null,
        }),
      })
      const { id, error } = await res.json()
      if (error) throw new Error(error)
      router.push(`/admin/articles/${id}`)
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Generate Article</h1>
      <p className="text-gray-500 text-sm mb-6">AI-powered, written in Yolanda&apos;s voice</p>

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-gray-200 p-1 mb-6 w-fit">
        {(['structured', 'freewrite'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setGenMode(m)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              genMode === m ? 'bg-[#10755A] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {m === 'structured' ? '⊞ Structured' : '✎ Free Write'}
          </button>
        ))}
      </div>

      {genMode === 'structured' ? (
        <div className="space-y-6 mb-6">
          {/* Topic cluster grid */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Topic Cluster</label>
            <div className="grid grid-cols-2 gap-3">
              {TOPIC_CLUSTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCluster(c.id)}
                  className={`text-left rounded-xl border p-4 transition-colors ${
                    selectedCluster === c.id
                      ? 'border-[#10755A] bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-1 ${selectedCluster === c.id ? 'text-[#10755A]' : 'text-gray-900'}`}>
                    {c.label}
                  </p>
                  <p className="text-xs text-gray-500 leading-snug">{c.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Keyword */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Primary Keyword <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Royal Caribbean Caribbean cruise deals 2026"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
            />
          </div>

          {/* Scenario */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reader Scenario</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent bg-white"
            >
              <option value="">— None selected —</option>
              {AUDIENCE_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Article Brief</label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={5}
              placeholder="e.g. Write about my Mediterranean cruise last fall — the stop in Kotor, Montenegro that no one talks about, and why it was better than Dubrovnik. Pitch it to people who think they've done Europe already."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Length + generate */}
      <div className="flex items-center gap-4 mb-8">
        <select
          value={targetLength}
          onChange={(e) => setTargetLength(e.target.value)}
          className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A] bg-white"
        >
          {LENGTH_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={generate}
          disabled={!canGenerate || genState === 'streaming'}
          className="flex items-center gap-2 rounded-lg bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-40 transition-colors"
        >
          <Zap size={15} />
          {genState === 'streaming' ? 'Generating…' : 'Generate'}
        </button>
        {genState === 'done' && (
          <button
            onClick={generate}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <RotateCcw size={14} />
            Regenerate
          </button>
        )}
      </div>

      {/* Stream output */}
      {(genState === 'streaming' || genState === 'error') && (
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            {genState === 'streaming' ? 'Streaming…' : 'Error'}
          </p>
          <pre className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-600 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap font-mono">
            {streamText || 'Something went wrong. Check the console.'}
          </pre>
        </div>
      )}

      {/* Post-generation edit UI */}
      {genState === 'done' && (
        <div className="space-y-6">
          {/* Compliance flags */}
          {complianceFlags.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">Compliance flags detected</p>
              <ul className="space-y-1">
                {complianceFlags.map((flag, i) => (
                  <li key={i} className="text-sm text-amber-700">• {flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata fields */}
          <div className="rounded-xl border border-gray-100 p-6 space-y-4 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Article Metadata</h2>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input
                type="text"
                value={meta.title ?? ''}
                onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#10755A]">
                <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">
                  /blog/
                </span>
                <input
                  type="text"
                  value={meta.slug ?? ''}
                  onChange={(e) => setMeta((m) => ({ ...m, slug: e.target.value }))}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                SEO Title
                <span className="ml-2 text-gray-400">({(meta.seo_title ?? '').length}/60 chars)</span>
              </label>
              <input
                type="text"
                maxLength={70}
                value={meta.seo_title ?? ''}
                onChange={(e) => setMeta((m) => ({ ...m, seo_title: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Meta Description
                <span className={`ml-2 ${(meta.seo_description ?? '').length > 155 ? 'text-red-500' : 'text-gray-400'}`}>
                  ({(meta.seo_description ?? '').length}/155 chars)
                </span>
              </label>
              <textarea
                rows={2}
                maxLength={170}
                value={meta.seo_description ?? ''}
                onChange={(e) => setMeta((m) => ({ ...m, seo_description: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Excerpt</label>
              <textarea
                rows={2}
                value={meta.excerpt ?? ''}
                onChange={(e) => setMeta((m) => ({ ...m, excerpt: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Cover Image</label>
              {meta.cover_image_query && (
                <p className="text-xs text-gray-400 mb-2">
                  Suggested search: &ldquo;{meta.cover_image_query}&rdquo;
                </p>
              )}
              <CoverImageUploader value={coverImage} onChange={setCoverImage} alt={coverAlt} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cover Image Alt Text</label>
              <input
                type="text"
                value={coverAlt}
                onChange={(e) => setCoverAlt(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
              />
            </div>
          </div>

          {/* Content editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500">Article Content</label>
              <span className="text-xs text-gray-400">{countWords(articleContent)} words</span>
            </div>
            <textarea
              rows={24}
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            />
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={saveDraft}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#10755A] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
            >
              <Save size={15} />
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
