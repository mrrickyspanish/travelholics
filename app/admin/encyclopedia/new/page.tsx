'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY_CONFIG } from '@/types/encyclopedia'
import type { EncyclopediaCategory } from '@/types/encyclopedia'

export default function NewEncyclopediaEntryPage() {
  const router = useRouter()
  const [category, setCategory] = useState<EncyclopediaCategory>('story')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [source, setSource] = useState('')
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('high')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/encyclopedia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, content, excerpt: excerpt || null, source: source || null, confidence }),
      })
      const { id, error: err } = await res.json()
      if (err) throw new Error(err)
      router.push(`/admin/encyclopedia/${id}`)
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Encyclopedia Entry</h1>
      <p className="text-gray-500 text-sm mb-6">This will be injected into every article generation prompt.</p>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([cat, config]) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat as EncyclopediaCategory)}
                className={`text-left rounded-xl border p-3 transition-colors ${
                  category === cat
                    ? 'border-[#10755A] bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-base">{config.icon}</span>
                <p className={`text-sm font-medium mt-1 ${category === cat ? 'text-[#10755A]' : 'text-gray-800'}`}>
                  {config.label}
                </p>
                <p className="text-xs text-gray-500 leading-snug mt-0.5">{config.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short descriptive title"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content</label>
          <textarea
            required
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="The full entry text — write it like you're briefing an AI writer on what Yolanda knows or would say"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Excerpt <span className="text-gray-400 font-normal">(optional — 1-sentence summary)</span>
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Source + confidence */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Source <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="TikTok video, interview, manual…"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confidence</label>
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value as 'high' | 'medium' | 'low')}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            >
              <option value="high">High — Yolanda said this directly</option>
              <option value="medium">Medium — Inferred or paraphrased</option>
              <option value="low">Low — Uncertain, needs verification</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#10755A] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
