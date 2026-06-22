'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { CATEGORY_CONFIG, INTENT_CONFIG, SUGGESTED_REGIONS } from '@/types/encyclopedia'
import type { EncyclopediaEntry, EncyclopediaCategory, EncyclopediaIntent } from '@/types/encyclopedia'
import { Save, Trash2 } from 'lucide-react'

export default function EncyclopediaEntryPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [entry, setEntry] = useState<EncyclopediaEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Editable fields
  const [category, setCategory] = useState<EncyclopediaCategory>('story')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [source, setSource] = useState('')
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('high')
  const [active, setActive] = useState(true)
  const [intent, setIntent] = useState<EncyclopediaIntent>('both')
  const [regions, setRegions] = useState<string[]>([])
  const [regionInput, setRegionInput] = useState('')

  function addRegion(value: string) {
    const trimmed = value.trim()
    if (!trimmed || regions.includes(trimmed)) return
    setRegions((prev) => [...prev, trimmed])
    setRegionInput('')
  }

  function removeRegion(value: string) {
    setRegions((prev) => prev.filter((r) => r !== value))
  }

  useEffect(() => {
    const supabase = createBrowserSupabase()
    supabase
      .from('encyclopedia_entries')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setEntry(data)
          setCategory(data.category)
          setTitle(data.title)
          setContent(data.content)
          setExcerpt(data.excerpt ?? '')
          setSource(data.source ?? '')
          setConfidence(data.confidence ?? 'high')
          setActive(data.active)
          setIntent(data.intent ?? 'both')
          setRegions(data.regions ?? [])
        }
        setLoading(false)
      })
  }, [id])

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/encyclopedia', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        category,
        title,
        content,
        excerpt: excerpt || null,
        source: source || null,
        confidence,
        active,
        intent,
        regions,
      }),
    })
    setSaving(false)
    if (res.ok) router.refresh()
  }

  async function handleDelete() {
    await fetch(`/api/encyclopedia?id=${id}`, { method: 'DELETE' })
    router.push('/admin/encyclopedia')
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#10755A] border-t-transparent" />
      </div>
    )
  }

  if (!entry) return <div className="p-8 text-gray-500">Entry not found.</div>

  const config = CATEGORY_CONFIG[category]

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Entry</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#10755A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
        >
          <Save size={14} />
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="space-y-5">
        {/* Active toggle */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-5 py-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setActive(!active)}
              className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${active ? 'bg-[#10755A]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${active ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {active ? 'Active — included in AI prompts' : 'Inactive — excluded from AI prompts'}
            </span>
          </label>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as EncyclopediaCategory)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          >
            {Object.entries(CATEGORY_CONFIG).map(([cat, c]) => (
              <option key={cat} value={cat}>{c.icon} {c.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">{config?.description}</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Excerpt <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Intent */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Used for</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(INTENT_CONFIG).map(([key, c]) => (
              <button
                key={key}
                type="button"
                onClick={() => setIntent(key as EncyclopediaIntent)}
                className={`text-left rounded-xl border p-3 transition-colors ${
                  intent === key ? 'border-[#10755A] bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className={`text-sm font-medium ${intent === key ? 'text-[#10755A]' : 'text-gray-800'}`}>{c.label}</p>
                <p className="text-xs text-gray-500 leading-snug mt-0.5">{c.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Regions <span className="text-gray-400 font-normal">(optional — leave empty to apply everywhere)</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SUGGESTED_REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => addRegion(r)}
                disabled={regions.includes(r)}
                className="rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100 transition-colors"
              >
                + {r}
              </button>
            ))}
          </div>
          {regions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {regions.map((r) => (
                <span key={r} className="flex items-center gap-1.5 rounded-full bg-emerald-50 text-[#10755A] px-3 py-1 text-xs font-medium">
                  {r}
                  <button type="button" onClick={() => removeRegion(r)} className="text-[#10755A]/60 hover:text-[#10755A]">×</button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            value={regionInput}
            onChange={(e) => setRegionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                addRegion(regionInput)
              }
            }}
            placeholder="Type a region and press Enter"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
          />
        </div>

        {/* Source + confidence */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
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
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Danger zone */}
        <div className="border-t border-gray-100 pt-5">
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-red-600">Delete this entry permanently?</p>
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
              Delete Entry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
