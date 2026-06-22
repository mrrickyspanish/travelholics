'use client'

import { useState, useEffect } from 'react'
import { SUGGESTED_REGIONS } from '@/types/encyclopedia'
import { Copy, Check, Wand2 } from 'lucide-react'

interface DestinationOption {
  slug: string
  name: string
  ports: string[]
}

interface PortNoteUpdate {
  port: string
  verdict: string
  note: string
}

interface ExcursionSuggestion {
  name: string
  port: string
  blurb: string
  priceFrom: string
}

interface FaqAddition {
  question: string
  answer: string
}

interface Draft {
  portNoteUpdates: PortNoteUpdate[]
  excursionSuggestions: ExcursionSuggestion[]
  faqAdditions: FaqAddition[]
  notes: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied' : 'Copy snippet'}
    </button>
  )
}

export default function TripPagesPage() {
  const [destinations, setDestinations] = useState<DestinationOption[]>([])
  const [slug, setSlug] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)

  useEffect(() => {
    fetch('/api/trip-pages/destinations')
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data.destinations ?? [])
        if (data.destinations?.length) setSlug(data.destinations[0].slug)
      })
  }, [])

  async function handleDraft() {
    setLoading(true)
    setError('')
    setDraft(null)
    try {
      const res = await fetch('/api/trip-pages/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: slug, region: region || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setDraft(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const selected = destinations.find((d) => d.slug === slug)

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Trip Page Drafter</h1>
      <p className="text-gray-500 text-sm mb-6">
        Turns encyclopedia entries tagged &quot;Trip Pages&quot; or &quot;Both&quot; into draft updates for the /cruises
        overview pages. This is a review tool — nothing here writes to the site. Copy what&apos;s good into{' '}
        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">lib/destinations/[slug].ts</code>.
      </p>

      <div className="rounded-xl border border-gray-100 p-6 bg-gray-50 space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Destination page</label>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            >
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Region filter <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Eastern Caribbean"
              list="region-suggestions"
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            />
            <datalist id="region-suggestions">
              {SUGGESTED_REGIONS.map((r) => <option key={r} value={r} />)}
            </datalist>
          </div>
        </div>

        {selected && (
          <p className="text-xs text-gray-400">Current ports on this page: {selected.ports.join(', ')}</p>
        )}

        <button
          onClick={handleDraft}
          disabled={!slug || loading}
          className="flex items-center gap-2 rounded-lg bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
        >
          <Wand2 size={15} />
          {loading ? 'Drafting…' : 'Draft Update'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 mb-6">{error}</p>}

      {draft && (
        <div className="space-y-6">
          {draft.notes && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-5 py-4 text-sm text-amber-800">
              <strong>Notes:</strong> {draft.notes}
            </div>
          )}

          {draft.portNoteUpdates.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Port note updates</h2>
              <div className="space-y-3">
                {draft.portNoteUpdates.map((p, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">{p.port}</p>
                      <CopyButton
                        text={`{\n  port: "${p.port}",\n  verdict: "${p.verdict}",\n  note: "${p.note.replace(/"/g, '\\"')}",\n},`}
                      />
                    </div>
                    <p className="text-xs text-gray-400 italic mb-1">{p.verdict}</p>
                    <p className="text-sm text-gray-700">{p.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {draft.excursionSuggestions.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Excursion suggestions</h2>
              <div className="space-y-3">
                {draft.excursionSuggestions.map((ex, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">{ex.name} <span className="text-gray-400 font-normal">— {ex.port}</span></p>
                      <CopyButton
                        text={`{\n  name: "${ex.name}",\n  port: "${ex.port}",\n  blurb: "${ex.blurb.replace(/"/g, '\\"')}",\n  url: "TODO-affiliate-link",\n  priceFrom: "${ex.priceFrom || 'From $TODO'}",\n},`}
                      />
                    </div>
                    <p className="text-sm text-gray-700">{ex.blurb}</p>
                    {ex.priceFrom && <p className="text-xs text-gray-400 mt-1">{ex.priceFrom}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {draft.faqAdditions.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">FAQ additions</h2>
              <div className="space-y-3">
                {draft.faqAdditions.map((f, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">{f.question}</p>
                      <CopyButton
                        text={`{\n  question: "${f.question.replace(/"/g, '\\"')}",\n  answer: "${f.answer.replace(/"/g, '\\"')}",\n},`}
                      />
                    </div>
                    <p className="text-sm text-gray-700">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {draft.portNoteUpdates.length === 0 && draft.excursionSuggestions.length === 0 && draft.faqAdditions.length === 0 && (
            <p className="text-sm text-gray-400">Nothing drafted — check the notes above.</p>
          )}
        </div>
      )}
    </div>
  )
}
