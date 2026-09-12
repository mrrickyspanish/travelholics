'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, ExternalLink, Mail, Send, UsersRound } from 'lucide-react'
import { PARTY_STATUSES, partyStatusLabel, type PartyStatus } from '@/types/group-trips'

type Party = {
  id: string
  primary_name: string
  email: string
  phone: string | null
  party_size: number | null
  cabin_preference: string | null
  status: PartyStatus
  created_at: string
}

type Props = {
  tripId: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  leaderToken: string
  parties: Party[]
}

export default function TripCommandCenter({ tripId, slug, status: initialStatus, leaderToken, parties: initialParties }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [parties, setParties] = useState(initialParties)
  const [busy, setBusy] = useState('')
  const [copied, setCopied] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function absolute(path: string) {
    return typeof window === 'undefined' ? path : `${window.location.origin}${path}`
  }

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice((current) => current === message ? '' : current), 3200)
  }

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(absolute(value))
    setCopied(label)
    showNotice(label === 'guest' ? 'Guest Trip Hub link copied.' : 'Private group leader link copied.')
    window.setTimeout(() => setCopied(''), 1600)
  }

  async function setTripStatus(nextStatus: 'draft' | 'published' | 'archived') {
    const active = parties.filter((party) => party.status !== 'invited').length
    const booked = parties.filter((party) => party.status === 'booked' || party.status === 'travel_ready').length
    const disruptive = nextStatus === 'archived' || (status === 'published' && nextStatus === 'draft')

    if (nextStatus === 'archived') {
      const detail = active
        ? ` This trip has ${active} active traveling ${active === 1 ? 'party' : 'parties'}${booked ? `, including ${booked} booked or Travel Ready` : ''}.`
        : ''
      const confirmed = window.confirm(`Archive this Trip Hub?${detail}\n\nExisting authorized travelers and the group leader will keep read-only access, but new access-code entries, invitations, and booking requests will pause until the trip is republished.`)
      if (!confirmed) return
    }

    if (status === 'published' && nextStatus === 'draft') {
      const confirmed = window.confirm(`Return this live Trip Hub to draft?${active ? ` It currently has ${active} active traveling ${active === 1 ? 'party' : 'parties'}.` : ''}\n\nGuest access will pause until you publish again. The private group leader link will continue to work as a read-only preview.`)
      if (!confirmed) return
    }

    setBusy('trip')
    setError('')
    setNotice('')
    const response = await fetch(`/api/admin/group-trips/${tripId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus, confirmedImpact: disruptive }),
    })
    const data = await response.json()
    setBusy('')
    if (!response.ok) { setError(data.error || 'Unable to update trip.'); return }
    setStatus(nextStatus)
    showNotice(nextStatus === 'published' ? 'Trip Hub published.' : nextStatus === 'archived' ? 'Trip Hub archived in read-only reference mode.' : 'Trip Hub returned to draft. Leader preview remains available.')
    router.refresh()
  }

  async function setPartyStatus(partyId: string, nextStatus: PartyStatus) {
    setBusy(partyId)
    setError('')
    setNotice('')
    const response = await fetch(`/api/admin/group-trips/${tripId}/parties/${partyId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }),
    })
    const data = await response.json()
    setBusy('')
    if (!response.ok) { setError(data.error || 'Unable to update traveler.'); return }
    setParties((current) => current.map((party) => party.id === partyId ? { ...party, status: nextStatus } : party))
    showNotice('Traveler status updated.')
  }

  async function resendWelcome(party: Party) {
    const busyKey = `welcome:${party.id}`
    setBusy(busyKey)
    setError('')
    setNotice('')
    const response = await fetch(`/api/admin/group-trips/${tripId}/parties/${party.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'resend_welcome' }),
    })
    const data = await response.json()
    setBusy('')
    if (!response.ok) { setError(data.error || 'Unable to resend the welcome email.'); return }
    showNotice(`Booked welcome resent to ${party.primary_name}.`)
  }

  const booked = parties.filter((party) => party.status === 'booked' || party.status === 'travel_ready').length
  const submitted = parties.filter((party) => party.status !== 'invited').length

  return (
    <div className="space-y-6">
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}
      {notice ? <div role="status" className="fixed bottom-5 right-5 z-[80] max-w-sm rounded-xl border border-[#cfe6dc] bg-white px-4 py-3 text-sm font-semibold text-[#10755A] shadow-xl">{notice}</div> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e2e8e5] bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#829089]">People on trip</p><p className="mt-2 text-3xl font-semibold text-[#10251e]">{parties.length}</p></div>
        <div className="rounded-2xl border border-[#e2e8e5] bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#829089]">Responded</p><p className="mt-2 text-3xl font-semibold text-[#10251e]">{submitted}</p></div>
        <div className="rounded-2xl border border-[#e2e8e5] bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#829089]">Booked / ready</p><p className="mt-2 text-3xl font-semibold text-[#10755A]">{booked}</p></div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#e2e8e5] bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-[#10251e]"><Send size={18} /><h2 className="font-semibold">Guest trip link</h2></div>
          <p className="text-sm leading-6 text-[#718079]">Guests use this link plus the shared group code when the Trip Hub is published.</p>
          <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => copy('guest', `/trips/${slug}`)} className="inline-flex items-center gap-2 rounded-xl bg-[#eaf5f0] px-4 py-2.5 text-sm font-semibold text-[#10755A]"><Copy size={15} /> {copied === 'guest' ? 'Copied' : 'Copy guest link'}</button>{status === 'published' ? <a href={`/trips/${slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e0] px-4 py-2.5 text-sm font-semibold text-[#4d625a]">Open <ExternalLink size={15} /></a> : null}</div>
        </div>
        <div className="rounded-2xl border border-[#e2e8e5] bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-[#10251e]"><UsersRound size={18} /><h2 className="font-semibold">Group leader link</h2></div>
          <p className="text-sm leading-6 text-[#718079]">Private link works in draft preview, live mode, and archived read-only mode.</p>
          <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => copy('leader', `/trips/${slug}/leader?token=${leaderToken}`)} className="inline-flex items-center gap-2 rounded-xl bg-[#eaf5f0] px-4 py-2.5 text-sm font-semibold text-[#10755A]"><Copy size={15} /> {copied === 'leader' ? 'Copied' : 'Copy leader link'}</button><a href={`/trips/${slug}/leader?token=${leaderToken}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e0] px-4 py-2.5 text-sm font-semibold text-[#4d625a]">{status === 'draft' ? 'Preview' : 'Open'} <ExternalLink size={15} /></a></div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e2e8e5] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wide text-[#829089]">Trip status</p><p className="mt-1 text-lg font-semibold capitalize text-[#10251e]">{status}</p>{status === 'archived' ? <p className="mt-1 text-xs text-[#718079]">Existing authorized sessions are read-only. New trip activity is paused.</p> : status === 'draft' ? <p className="mt-1 text-xs text-[#718079]">Guests cannot enter. The private leader preview is available.</p> : null}</div>
          <div className="flex flex-wrap gap-2">
            {status !== 'published' ? <button type="button" disabled={busy === 'trip'} onClick={() => setTripStatus('published')} className="rounded-xl bg-[#F26A75] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Publish Trip Hub</button> : <button type="button" disabled={busy === 'trip'} onClick={() => setTripStatus('draft')} className="rounded-xl border border-[#dce4e0] px-4 py-2.5 text-sm font-semibold text-[#4d625a] disabled:opacity-50">Return to draft</button>}
            {status !== 'archived' ? <button type="button" disabled={busy === 'trip'} onClick={() => setTripStatus('archived')} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50">Archive</button> : null}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e2e8e5] bg-white">
        <div className="flex items-center justify-between border-b border-[#edf1ef] px-5 py-4 sm:px-6"><div><h2 className="font-semibold text-[#10251e]">Traveling parties</h2><p className="mt-1 text-xs text-[#829089]">Admins have full status control in either direction.</p></div><span className="rounded-full bg-[#f0f4f2] px-3 py-1 text-xs font-bold text-[#5d7068]">{parties.length}</span></div>
        {parties.length === 0 ? <div className="px-6 py-12 text-center text-sm text-[#829089]">No invitations or booking requests yet.</div> : <div className="divide-y divide-[#edf1ef]">{parties.map((party) => <div key={party.id} className="grid gap-4 px-5 py-4 sm:px-6 lg:grid-cols-[1.25fr_1fr_1fr_auto] lg:items-center"><div><p className="font-semibold text-[#10251e]">{party.primary_name}</p><p className="mt-0.5 text-xs text-[#829089]">{party.email}{party.phone ? ` · ${party.phone}` : ''}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-[#9aa69f]">Party / cabin</p><p className="mt-1 text-sm text-[#4d625a]">{party.party_size ? `${party.party_size} traveler${party.party_size === 1 ? '' : 's'}` : 'Size pending'} · {party.cabin_preference || 'Cabin pending'}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-[#9aa69f]">Current status</p><p className="mt-1 text-sm font-semibold text-[#10251e]">{partyStatusLabel(party.status)}</p></div><div className="flex flex-col gap-2"><select disabled={busy === party.id} aria-label={`Status for ${party.primary_name}`} className="rounded-xl border border-[#dce4e0] bg-white px-3 py-2.5 text-sm font-semibold text-[#31453e] outline-none focus:border-[#10755A] disabled:opacity-50" value={party.status} onChange={(e) => setPartyStatus(party.id, e.target.value as PartyStatus)}>{PARTY_STATUSES.map((option) => <option key={option} value={option}>{partyStatusLabel(option)}</option>)}</select>{party.status === 'booked' || party.status === 'travel_ready' ? <button type="button" disabled={busy === `welcome:${party.id}`} onClick={() => resendWelcome(party)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#dce4e0] px-3 py-2 text-xs font-semibold text-[#4d625a] hover:bg-[#f7faf8] disabled:opacity-50"><Mail size={14} /> {busy === `welcome:${party.id}` ? 'Sending…' : 'Resend welcome'}</button> : null}</div></div>)}</div>}
      </div>
    </div>
  )
}
