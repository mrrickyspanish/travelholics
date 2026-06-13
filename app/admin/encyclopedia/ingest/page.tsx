'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY_CONFIG } from '@/types/encyclopedia'
import type { EncyclopediaCategory } from '@/types/encyclopedia'
import { CheckCircle, XCircle, Upload, Save } from 'lucide-react'

type Phase = 'input' | 'analyzing' | 'review' | 'saving' | 'done'

interface ExtractedEntry {
  category: EncyclopediaCategory
  title: string
  content: string
  excerpt: string
  confidence: 'high' | 'medium' | 'low'
  approved?: boolean
  edited?: boolean
}

export default function IngestPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('input')
  const [transcript, setTranscript] = useState('')
  const [source, setSource] = useState('')
  const [entries, setEntries] = useState<ExtractedEntry[]>([])
  const [error, setError] = useState('')
  const [savedCount, setSavedCount] = useState(0)

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setPhase('analyzing')
    try {
      const res = await fetch('/api/encyclopedia/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, source }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setEntries(
        (data.entries as ExtractedEntry[]).map((e) => ({ ...e, approved: true }))
      )
      setPhase('review')
    } catch (err) {
      setError((err as Error).message)
      setPhase('input')
    }
  }

  function toggleApprove(i: number) {
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, approved: !e.approved } : e)))
  }

  function updateEntry(i: number, field: keyof ExtractedEntry, value: string) {
    setEntries((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [field]: value, edited: true } : e))
    )
  }

  async function handleSave() {
    setPhase('saving')
    const approved = entries.filter((e) => e.approved)
    let count = 0
    for (const entry of approved) {
      const res = await fetch('/api/encyclopedia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: entry.category,
          title: entry.title,
          content: entry.content,
          excerpt: entry.excerpt || null,
          confidence: entry.confidence,
          source: source || null,
        }),
      })
      if (res.ok) count++
    }
    setSavedCount(count)
    setPhase('done')
  }

  const CONFIDENCE_STYLES = {
    high: 'bg-emerald-50 text-emerald-700',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-red-50 text-red-600',
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Import Transcript</h1>
      <p className="text-gray-500 text-sm mb-6">
        Paste a TikTok transcript, interview, voice note, or any Yolanda content. AI will extract knowledge entries.
      </p>

      {phase === 'input' && (
        <form onSubmit={handleAnalyze} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Transcript / Notes</label>
            <textarea
              required
              rows={12}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste Yolanda's TikTok transcript, voice note, interview, or any content here…"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Source <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. TikTok @rjsmom1 June 2026, podcast interview, manual notes"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#10755A] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] transition-colors"
          >
            <Upload size={15} />
            Analyze Transcript
          </button>
        </form>
      )}

      {phase === 'analyzing' && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10755A] border-t-transparent" />
          <p className="text-sm text-gray-500">Extracting knowledge entries…</p>
        </div>
      )}

      {phase === 'review' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Found <strong>{entries.length}</strong> entries.{' '}
              <span className="text-gray-400">Review, edit, and approve before saving.</span>
            </p>
            <button
              onClick={handleSave}
              disabled={!entries.some((e) => e.approved)}
              className="flex items-center gap-2 rounded-lg bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-40 transition-colors"
            >
              <Save size={14} />
              Save {entries.filter((e) => e.approved).length} Approved
            </button>
          </div>

          <div className="space-y-4">
            {entries.map((entry, i) => {
              const config = CATEGORY_CONFIG[entry.category]
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-5 transition-colors ${
                    entry.approved ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <button
                      onClick={() => toggleApprove(i)}
                      className="shrink-0 mt-0.5"
                    >
                      {entry.approved ? (
                        <CheckCircle size={20} className="text-[#10755A]" />
                      ) : (
                        <XCircle size={20} className="text-gray-300" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config?.bg} ${config?.color}`}>
                          {config?.icon} {config?.label}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CONFIDENCE_STYLES[entry.confidence]}`}>
                          {entry.confidence}
                        </span>
                        {entry.edited && (
                          <span className="text-xs text-blue-500">edited</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => updateEntry(i, 'title', e.target.value)}
                        className="w-full text-sm font-medium text-gray-900 border-0 border-b border-gray-200 pb-1 mb-2 focus:outline-none focus:border-[#10755A] bg-transparent"
                      />
                      <textarea
                        rows={3}
                        value={entry.content}
                        onChange={(e) => updateEntry(i, 'content', e.target.value)}
                        className="w-full text-sm text-gray-700 border border-gray-100 rounded-lg px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-[#10755A] bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'saving' && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10755A] border-t-transparent" />
          <p className="text-sm text-gray-500">Saving entries…</p>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {savedCount} {savedCount === 1 ? 'entry' : 'entries'} saved
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            The encyclopedia now has more of Yolanda&apos;s voice. Next article generation will use all of it.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setPhase('input')
                setTranscript('')
                setSource('')
                setEntries([])
              }}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Import Another
            </button>
            <button
              onClick={() => router.push('/admin/encyclopedia')}
              className="rounded-lg bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] transition-colors"
            >
              View Encyclopedia
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
