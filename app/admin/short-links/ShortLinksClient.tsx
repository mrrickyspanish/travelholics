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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yotravelholic.com'

function shortUrlFor(slug: string) {
  return `${SITE_URL}/s/${slug}`
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

function QrModal({ link, onClose }: { link: ShortLink; onClose: () => void }) {
  const [pngUrl, setPngUrl] = useState('')
  const [svgMarkup, setSvgMarkup] = useState('')
  const url = shortUrlFor(link.slug)

  useEffect(() => {
    QRCode.toDataURL(url, { width: 512, margin: 1 }).then(setPngUrl)
    QRCode.toString(url, { type: 'svg', margin: 1 }).then(setSvgMarkup)
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

        <div className="flex gap-2">
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
      </div>
    </div>
  )
}

export default function ShortLinksClient({ initialShortLinks }: { initialShortLinks: ShortLink[] }) {
  const [links, setLinks] = useState(initialShortLinks)
  const [destinationUrl, setDestinationUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [label, setLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [qrLink, setQrLink] = useState<ShortLink | null>(null)

  async function handleCreate() {
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/short-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_url: destinationUrl,
          slug: slug || undefined,
          label: label || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setLinks((prev) => [data.shortLink, ...prev])
      setDestinationUrl('')
      setSlug('')
      setLabel('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setCreating(false)
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
        Create trackable short links for print, signage, or social — each one comes with a
        downloadable QR code that points at it.
      </p>

      <div className="rounded-xl border border-gray-100 p-6 bg-gray-50 space-y-4 mb-8">
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
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Navigator ship flyer"
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!destinationUrl || creating}
          className="flex items-center gap-2 rounded-lg bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
        >
          <Plus size={15} />
          {creating ? 'Creating…' : 'Create Short Link'}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {links.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <Link2 size={20} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">No short links yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
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
                  {link.label || link.slug}
                </p>
                <p className="text-xs text-gray-400 truncate">{shortUrlFor(link.slug)}</p>
                <p className="text-xs text-gray-400 truncate">→ {link.destination_url}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-900">{link.click_count}</p>
                <p className="text-xs text-gray-400">clicks</p>
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
          ))}
        </div>
      )}

      {qrLink && <QrModal link={qrLink} onClose={() => setQrLink(null)} />}
    </div>
  )
}
