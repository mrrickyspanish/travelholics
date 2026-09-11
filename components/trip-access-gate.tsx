'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { KeyRound, Ship } from 'lucide-react'

export default function TripAccessGate({ slug, tripName, cruiseLine, ship }: { slug: string; tripName: string; cruiseLine: string; ship: string }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch(`/api/group-trips/${encodeURIComponent(slug)}/access`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessCode: code }),
    })
    const data = await response.json()
    setLoading(false)
    if (!response.ok) { setError(data.error || 'That code did not work.'); return }
    router.refresh()
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-emerald-deep px-5 py-24 text-white">
      <div className="absolute inset-0 opacity-25" aria-hidden="true"><Image src="/images/dest-caribbean.jpg" alt="" fill priority className="object-cover" sizes="100vw" /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/45 to-emerald-deep" aria-hidden="true" />
      <form onSubmit={submit} className="relative w-full max-w-lg rounded-[2rem] border border-white/15 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral"><KeyRound size={22} /></div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-coral">Private Travelholics Group Trip</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.04em]">{tripName}</h1>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-white/65"><Ship size={15} /> {cruiseLine} · {ship}</p>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-white/70">Enter the shared access code from your Travelholics invitation to open the group trip.</p>
        <label className="mt-6 block text-left text-xs font-bold uppercase tracking-wide text-white/55">Group access code<input autoFocus required value={code} onChange={(e) => setCode(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-white px-4 py-3.5 text-center font-mono text-lg font-bold tracking-[0.12em] text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20" placeholder="YOURCODE" /></label>
        {error ? <p role="alert" className="mt-3 rounded-xl bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-100">{error}</p> : null}
        <button type="submit" disabled={loading} className="mt-4 min-h-12 w-full rounded-xl bg-coral px-5 py-3 text-base font-bold text-white transition hover:bg-coral-deep disabled:opacity-50">{loading ? 'Opening…' : 'Open My Group Trip'}</button>
        <p className="mt-4 text-xs text-white/40">Need help? Contact Travelholics at trips@yotravelholic.com.</p>
      </form>
    </main>
  )
}
