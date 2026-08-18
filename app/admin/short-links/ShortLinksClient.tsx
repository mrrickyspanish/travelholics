'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import {
  Copy,
  Check,
  Download,
  Link2,
  Plus,
  QrCode,
  Trash2,
  X,
} from 'lucide-react'
import type { ShortLink } from '@/types/short-links'
import { buildDuckHuntLink } from '@/lib/duck-hunt-links'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yotravelholic.com'

function shortUrlFor(slug: string) {
  return `${SITE_URL}/s/${slug}`
}

function formatSailDate(sailDate: string) {
  const [year, month, day] = sailDate.split('-').map(Number)
  if (!year || !month || !day) return sailDate
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
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
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}

// Ducks live outdoors on a ship — sun-faded, salt-sprayed, handled by
// hundreds of guests. High error correction (~30% tolerance) plus a real
// quiet zone keeps the code scannable well after it's taken a beating, and
// the 640px source stays crisp printed a few inches across.
const QR_OPTIONS = { errorCorrectionLevel: 'H' as const, width: 640, margin: 4 }

function QrModal({ link, onClose }: { link: ShortLink; onClose: () => void }) {
  const [pngUrl, setPngUrl] = useState('')
  const [svgMarkup, setSvgMarkup] = useState('')
  const url = shortUrlFor(link.slug)

  useEffect(() => {
    QRCode.toDataURL(url, QR_OPTIONS).then(setPngUrl)
    QRCode.toString(url, { ...QR_OPTIONS, type: 'svg' }).then(setSvgMarkup)
  }, [url])

  function downloadPng() {
    const a = document.createElement('a')
    a.href = pngUrl
    a.download = `${link.slug}-qr.png`
    a.click()
  }

  function downloadSvg() {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' })
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `${link.slug}-qr.svg`
    a.click()
    URL.revokeObjectURL(blobUrl)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">{link.label || link.slug}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-6 mb-4">
          {pngUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pngUrl} alt={`QR code for ${url}`} width={220} height={220} />
          ) : (
            <div className="h-[220px] w-[220px] animate-pulse rounded-lg bg-gray-200" />
          )}
        </div>

        <p className="text-xs text-gray-400 break-all text-center mb-4">{url}</p>

        <div className="flex gap-2 mb-3">
          <button
            onClick={downloadPng}
            disabled={!pngUrl}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#10755A] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
          >
            <Download size={14} />
            PNG
          </button>
          <button
            onClick={downloadSvg}
            disabled={!svgMarkup}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <Download size={14} />
            SVG
          </button>
        </div>

        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          Print at least 1.5in across. SVG scales cleanest for large signage; PNG is fine for
          stickers and print shops.
        </p>
      </div>
    </div>
  )
}

type Mode = 'duck' | 'custom'

export default function ShortLinksClient({
  initialShortLinks,
  claimCounts,
}: {
  initialShortLinks: ShortLink[]
  claimCounts: Record<string, number>
}) {
  const [links, setLinks] = useState(initialShortLinks)
  const [mode, setMode] = useState<Mode>('duck')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [qrLink, setQrLink] = useState<ShortLink | null>(null)

  // Duck Hunt mode
  const [ship, setShip] = useState('')
  const [sailDate, setSailDate] = useState('')
  const [duckNumber, setDuckNumber] = useState('')
  const [batch, setBatch] = useState('')

  // Custom link mode
  const [destinationUrl, setDestinationUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [customLabel, setCustomLabel] = useState('')

  const duckPreview =
    mode === 'duck' && ship && sailDate
      ? buildDuckHuntLink({ ship, sailDate, duckNumber, batch }, SITE_URL)
      : null

  async function createShortLink(payload: {
    destination_url: string
    slug?: string
    label?: string
    metadata?: Record<string, unknown>
  }) {
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/short-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setLinks((prev) => [data.shortLink, ...prev])
      return true
    } catch (err) {
      setError((err as Error).message)
      return false
    } finally {
      setCreating(false)
    }
  }

  async function handleCreateDuck() {
    if (!duckPreview) return
    const ok = await createShortLink({
      destination_url: duckPreview.destinationUrl,
      slug: duckPreview.slug,
      label: duckPreview.label,
      metadata: duckPreview.metadata,
    })
    if (ok) {
      setShip('')
      setSailDate('')
      setDuckNumber('')
      setBatch('')
    }
  }

  async function handleCreateCustom() {
    const ok = await createShortLink({
      destination_url: destinationUrl,
      slug: customSlug || undefined,
      label: customLabel || undefined,
    })
    if (ok) {
      setDestinationUrl('')
      setCustomSlug('')
      setCustomLabel('')
    }
  }

  async function toggleActive(link: ShortLink) {
    const res = await fetch(`/api/admin/short-links/${link.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !link.is_active }),
    })
    if (!res.ok) return
    const data = await res.json()
    setLinks((prev) => prev.map((l) => (l.id === link.id ? data.shortLink : l)))
  }

  async function handleDelete(link: ShortLink) {
    if (!confirm(`Delete "${link.label || link.slug}"? This can't be undone.`)) return
    const res = await fetch(`/api/admin/short-links/${link.id}`, { method: 'DELETE' })
    if (!res.ok) return
    setLinks((prev) => prev.filter((l) => l.id !== link.id))
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Short Links & QR Codes</h1>
      <p className="text-gray-500 text-sm mb-6">
        Every scan is logged the moment it happens — not just when someone finishes a form — so
        you can see scan volume per sailing alongside how many actually converted.
      </p>

      <div className="rounded-xl border border-gray-100 p-6 bg-gray-50 mb-8">
        <div className="flex gap-1 mb-5 rounded-lg bg-gray-200/60 p-1 w-fit">
          <button
            onClick={() => setMode('duck')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              mode === 'duck' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🦆 Duck Hunt QR
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              mode === 'custom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Custom Link
          </button>
        </div>

        {mode === 'duck' ? (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 -mt-1">
              Leave duck number blank to print one QR for every duck on this sailing — fill it
              in only if you want to track a specific duck&apos;s hiding spot separately.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ship</label>
                <input
                  type="text"
                  value={ship}
                  onChange={(e) => setShip(e.target.value)}
                  placeholder="e.g. Navigator of the Seas"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sail date</label>
                <input
                  type="date"
                  value={sailDate}
                  onChange={(e) => setSailDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Duck number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={duckNumber}
                  onChange={(e) => setDuckNumber(e.target.value)}
                  placeholder="Blank = shared by all ducks this sailing"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Batch <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. spring-2026"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
                />
              </div>
            </div>

            {duckPreview && (
              <p className="text-xs text-gray-400 font-mono break-all">
                {shortUrlFor(duckPreview.slug)}
              </p>
            )}

            <button
              onClick={handleCreateDuck}
              disabled={!duckPreview || creating}
              className="flex items-center gap-2 rounded-lg bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
            >
              <Plus size={15} />
              {creating ? 'Creating…' : 'Create Duck QR'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Destination URL</label>
                <input
                  type="text"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://yotravelholic.com/cruises/caribbean"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Custom slug <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="e.g. navigator-flyer"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Label <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="e.g. Navigator ship flyer"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
                />
              </div>
            </div>

            <button
              onClick={handleCreateCustom}
              disabled={!destinationUrl || creating}
              className="flex items-center gap-2 rounded-lg bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
            >
              <Plus size={15} />
              {creating ? 'Creating…' : 'Create Short Link'}
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>

      {links.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <Link2 size={20} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">No short links yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => {
            const isDuck = link.metadata?.campaign === 'duck-hunt'
            const claims = claimCounts[link.id] ?? 0

            return (
              <div
                key={link.id}
                className={`rounded-xl border p-4 flex items-center gap-4 ${
                  link.is_active ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <button
                  onClick={() => setQrLink(link)}
                  className="shrink-0 rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 hover:text-[#10755A] transition-colors"
                  aria-label="Show QR code"
                >
                  <QrCode size={18} />
                </button>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {isDuck ? '🦆 ' : ''}
                    {link.label || link.slug}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{shortUrlFor(link.slug)}</p>
                  {isDuck ? (
                    <p className="text-xs text-gray-400 truncate">
                      Sailing {link.metadata.sail_date ? formatSailDate(link.metadata.sail_date) : '—'}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 truncate">→ {link.destination_url}</p>
                  )}
                  {link.last_clicked_at && (
                    <p className="text-[11px] text-gray-300 truncate">
                      Last scanned {formatTimestamp(link.last_clicked_at)}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {link.click_count}
                    {isDuck && <span className="text-gray-400 font-normal"> / {claims}</span>}
                  </p>
                  <p className="text-xs text-gray-400">{isDuck ? 'scans / claims' : 'clicks'}</p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <CopyButton text={shortUrlFor(link.slug)} />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleActive(link)}
                      className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {link.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(link)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Delete short link"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {qrLink && <QrModal link={qrLink} onClose={() => setQrLink(null)} />}
    </div>
  )
}
