'use client'

import { useMemo, useState } from 'react'
import { BedDouble, CalendarDays, Check, CheckCircle2, Clock3, Mail, MapPin, Pencil, Plus, Send, Ship, Trash2, X } from 'lucide-react'
import { partyStatusLabel, type PartyStatus, type PriceDisplay } from '@/types/group-trips'

type Cabin = { id: string; name: string; description: string | null; occupancy_label: string | null; per_person_price: number | string | null; cabin_total_price: number | string | null; availability_note: string | null }
type Itinerary = { id: string; day_number: number; title: string; port: string | null; arrival_time: string | null; departure_time: string | null; description: string | null }
type Deadline = { id: string; title: string; deadline_date: string; description: string | null }
type Party = { id: string; primary_name: string; email: string; status: PartyStatus }
type Trip = { id: string; name: string; slug: string; destination: string; cruiseLine: string; ship: string; sailDate: string; returnDate: string | null; departurePort: string | null; heroImageUrl: string | null; overview: string | null; priceDisplay: PriceDisplay; bookingRequestNote: string | null; groupLeaderName: string }

function money(value: number | string | null) {
  if (value === null || value === undefined || value === '') return null
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function dateLabel(value: string | null) {
  if (!value) return ''
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TripHubClient({ trip, cabins, itinerary, deadlines, isLeader, initialParties }: { trip: Trip; cabins: Cabin[]; itinerary: Itinerary[]; deadlines: Deadline[]; isLeader: boolean; initialParties: Party[] }) {
  const [selectedCabin, setSelectedCabin] = useState('')
  const [bookingState, setBookingState] = useState<'idle' | 'sending' | 'success'>('idle')
  const [bookingError, setBookingError] = useState('')
  const [parties, setParties] = useState(initialParties)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteBusy, setInviteBusy] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteNotice, setInviteNotice] = useState('')
  const [editingInviteId, setEditingInviteId] = useState<string | null>(null)
  const [editInviteName, setEditInviteName] = useState('')
  const [editInviteEmail, setEditInviteEmail] = useState('')
  const [editInviteBusy, setEditInviteBusy] = useState(false)

  const counts = useMemo(() => ({
    invited: parties.filter((party) => party.status === 'invited').length,
    responded: parties.filter((party) => party.status !== 'invited').length,
    booked: parties.filter((party) => party.status === 'booked' || party.status === 'travel_ready').length,
  }), [parties])

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBookingState('sending')
    setBookingError('')
    const formData = new FormData(event.currentTarget)
    const members = String(formData.get('members') || '').split('\n').map((value) => value.trim()).filter(Boolean)
    const payload = {
      primaryName: formData.get('primaryName'), email: formData.get('email'), phone: formData.get('phone'), partySize: Number(formData.get('partySize')), cabinOfferId: formData.get('cabinOfferId'), cabinPreference: formData.get('cabinPreference'), notes: formData.get('notes'), members,
    }
    const response = await fetch(`/api/group-trips/${trip.slug}/booking-request`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await response.json()
    if (!response.ok) { setBookingError(data.error || 'Unable to submit your request.'); setBookingState('idle'); return }
    setBookingState('success')
  }

  async function inviteGuest(event: React.FormEvent) {
    event.preventDefault()
    setInviteBusy(true)
    setInviteError('')
    setInviteNotice('')
    const response = await fetch(`/api/group-trips/${trip.slug}/invite`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: inviteName, email: inviteEmail }) })
    const data = await response.json()
    setInviteBusy(false)
    if (!response.ok) { setInviteError(data.error || 'Unable to send invitation.'); return }
    setParties((current) => [...current, data.party])
    setInviteName('')
    setInviteEmail('')
    setInviteNotice(`Invitation sent to ${data.party.primary_name}.`)
  }

  function startInviteEdit(party: Party) {
    setEditingInviteId(party.id)
    setEditInviteName(party.primary_name)
    setEditInviteEmail(party.email)
    setInviteError('')
    setInviteNotice('')
  }

  function cancelInviteEdit() {
    setEditingInviteId(null)
    setEditInviteName('')
    setEditInviteEmail('')
  }

  async function saveInviteEdit(partyId: string) {
    setEditInviteBusy(true)
    setInviteError('')
    setInviteNotice('')
    const response = await fetch(`/api/group-trips/${trip.slug}/invite`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partyId, name: editInviteName, email: editInviteEmail }),
    })
    const data = await response.json()
    setEditInviteBusy(false)
    if (!response.ok) { setInviteError(data.error || 'Unable to update invitation.'); return }
    setParties((current) => current.map((party) => party.id === partyId ? data.party : party))
    cancelInviteEdit()
    setInviteNotice(data.invitationResent ? 'Invitation updated and a fresh email was sent.' : 'Invitation saved.')
  }

  async function removeInvite(partyId: string) {
    setInviteError('')
    setInviteNotice('')
    const response = await fetch(`/api/group-trips/${trip.slug}/invite?partyId=${encodeURIComponent(partyId)}`, { method: 'DELETE' })
    const data = await response.json()
    if (!response.ok) { setInviteError(data.error || 'Unable to remove invitation.'); return }
    setParties((current) => current.filter((party) => party.id !== partyId))
    if (editingInviteId === partyId) cancelInviteEdit()
    setInviteNotice('Guest removed from the invitation list.')
  }

  function chooseCabin(id: string) {
    setSelectedCabin(id)
    window.setTimeout(() => document.getElementById('booking-request')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const heroStyle = { backgroundImage: `linear-gradient(90deg,rgba(13,74,58,.96),rgba(13,74,58,.72),rgba(13,74,58,.26)),url('${trip.heroImageUrl || '/images/dest-caribbean.jpg'}')` }

  return (
    <main className="bg-sand text-ink">
      <section className="relative min-h-[72vh] bg-cover bg-center px-5 pb-16 pt-24 text-white sm:px-8 lg:px-12 lg:pb-20" style={heroStyle}>
        <div className="mx-auto flex min-h-[58vh] max-w-7xl items-end">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] backdrop-blur-sm"><Ship size={15} className="text-coral" /> Your Travelholics Group Cruise</div>
            <h1 className="font-serif text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em]">{trip.name}</h1>
            <p className="mt-6 text-lg font-semibold text-white/82 sm:text-xl">{trip.destination} · {trip.cruiseLine} · {trip.ship}</p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-white/75"><span className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">{dateLabel(trip.sailDate)}{trip.returnDate ? ` → ${dateLabel(trip.returnDate)}` : ''}</span>{trip.departurePort ? <span className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">Sailing from {trip.departurePort}</span> : null}</div>
          </div>
        </div>
      </section>

      {isLeader ? (
        <section className="border-b border-ink/8 bg-cream px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Group Leader View</p><h2 className="mt-1 font-serif text-3xl font-semibold text-royal-deep">Your crew at a glance</h2></div><p className="max-w-md text-sm text-stone">Names and booking progress only. You can correct or remove invitations until a guest responds. Travelholics handles the booking work.</p></div>
            <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-sand p-4"><p className="text-xs font-bold uppercase tracking-wide text-stone">People invited</p><p className="mt-1 text-3xl font-semibold text-royal-deep">{parties.length}</p></div><div className="rounded-2xl bg-sand p-4"><p className="text-xs font-bold uppercase tracking-wide text-stone">Responded</p><p className="mt-1 text-3xl font-semibold text-royal-deep">{counts.responded}</p></div><div className="rounded-2xl bg-emerald-mid/10 p-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-mid">Booked / ready</p><p className="mt-1 text-3xl font-semibold text-emerald-deep">{counts.booked}</p></div></div>
            {inviteError ? <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{inviteError}</p> : null}
            {inviteNotice ? <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-mid/10 px-4 py-3 text-sm font-semibold text-emerald-deep"><Check size={16} /> {inviteNotice}</p> : null}
            <div className="mt-5 overflow-hidden rounded-2xl border border-ink/8 bg-white"><div className="divide-y divide-ink/8">{parties.length ? parties.map((party) => {
              const editing = editingInviteId === party.id
              return <div key={party.id} className="px-4 py-3.5 sm:px-5">{editing ? <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr_auto] sm:items-end"><label className="text-xs font-bold uppercase tracking-wide text-stone">Guest name<input autoFocus required value={editInviteName} onChange={(e) => setEditInviteName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-ink/10 bg-cream px-3.5 py-3 text-sm font-medium normal-case tracking-normal text-ink outline-none focus:border-emerald-mid" /></label><label className="text-xs font-bold uppercase tracking-wide text-stone">Email<input required type="email" value={editInviteEmail} onChange={(e) => setEditInviteEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-ink/10 bg-cream px-3.5 py-3 text-sm font-medium normal-case tracking-normal text-ink outline-none focus:border-emerald-mid" /></label><div className="flex gap-2"><button type="button" disabled={editInviteBusy} onClick={() => saveInviteEdit(party.id)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-mid px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Check size={15} /> {editInviteBusy ? 'Saving…' : 'Save'}</button><button type="button" onClick={cancelInviteEdit} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-ink/10 px-3 text-stone" aria-label="Cancel edit"><X size={17} /></button></div></div> : <div className="flex items-center justify-between gap-4"><div className="min-w-0"><p className="truncate font-semibold text-ink">{party.primary_name}</p><p className="truncate text-xs text-stone">{party.status === 'invited' ? `Invited · ${party.email}` : partyStatusLabel(party.status)}</p></div>{party.status === 'invited' ? <div className="flex shrink-0 gap-1"><button type="button" onClick={() => startInviteEdit(party)} className="rounded-lg p-2 text-stone hover:bg-sand hover:text-emerald-deep" aria-label={`Edit invitation for ${party.primary_name}`}><Pencil size={16} /></button><button type="button" onClick={() => removeInvite(party.id)} className="rounded-lg p-2 text-stone hover:bg-red-50 hover:text-red-600" aria-label={`Remove invitation for ${party.primary_name}`}><Trash2 size={16} /></button></div> : <CheckCircle2 size={18} className="shrink-0 text-emerald-mid" />}</div>}</div>
            }) : <p className="px-5 py-8 text-center text-sm text-stone">No guests added yet.</p>}</div></div>
            <form onSubmit={inviteGuest} className="mt-4 grid gap-3 rounded-2xl bg-emerald-deep p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5"><label className="text-xs font-bold uppercase tracking-wide text-white/60">Guest name<input required className="mt-1.5 w-full rounded-xl border border-white/10 bg-white px-3.5 py-3 text-sm text-ink outline-none" value={inviteName} onChange={(e) => setInviteName(e.target.value)} /></label><label className="text-xs font-bold uppercase tracking-wide text-white/60">Guest email<input required type="email" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white px-3.5 py-3 text-sm text-ink outline-none" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} /></label><button disabled={inviteBusy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-coral px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><Send size={16} /> {inviteBusy ? 'Sending…' : 'Send invite'}</button></form>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-start">
          <div><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Welcome aboard</p><h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep">Everything your group needs, together.</h2><p className="mt-5 max-w-3xl text-base leading-7 text-stone">{trip.overview || `${trip.groupLeaderName} and Travelholics are bringing the group together for an unforgettable sailing. This page is your home base for the details and next steps.`}</p></div>
          <div className="rounded-2xl border border-ink/8 bg-cream p-5"><p className="text-xs font-black uppercase tracking-wide text-stone">Travelholics contact</p><p className="mt-2 font-serif text-2xl font-semibold text-royal-deep">Yolanda</p><p className="mt-2 text-sm leading-6 text-stone">Questions about the trip or your booking request? Yolanda and the Travelholics team are here.</p><a href="mailto:trips@yotravelholic.com" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-mid"><Mail size={16} /> trips@yotravelholic.com</a></div>
        </div>
      </section>

      <section className="bg-cream px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Choose your view</p><h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep">Cabin options for the group</h2><p className="mt-4 text-sm leading-6 text-stone">These are the group options Yolanda has prepared. Selecting one sends a booking request, not a payment or final booking.</p></div><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cabins.map((cabin) => { const pp = money(cabin.per_person_price); const total = money(cabin.cabin_total_price); return <article key={cabin.id} className="flex flex-col rounded-[1.6rem] border border-ink/8 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><BedDouble className="mb-4 text-coral" size={23} /><h3 className="text-xl font-bold text-ink">{cabin.name}</h3><p className="mt-1 text-sm text-stone">{cabin.occupancy_label || 'Occupancy varies'}</p></div>{cabin.availability_note ? <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-stone">{cabin.availability_note}</span> : null}</div>{cabin.description ? <p className="mt-4 text-sm leading-6 text-stone">{cabin.description}</p> : null}<div className="mt-auto pt-6"><div className="mb-4 rounded-xl bg-sand p-4">{trip.priceDisplay !== 'cabin_total' ? <p className="text-lg font-bold text-royal-deep">{pp || 'Ask Yolanda'} <span className="text-xs font-semibold text-stone">per person</span></p> : null}{trip.priceDisplay !== 'per_person' ? <p className={`${trip.priceDisplay === 'both' ? 'mt-1' : ''} text-sm font-semibold text-ink`}>{total || 'Ask Yolanda'} <span className="text-xs font-normal text-stone">cabin total</span></p> : null}</div><button type="button" onClick={() => chooseCabin(cabin.id)} className="min-h-11 w-full rounded-xl bg-emerald-mid px-4 py-3 text-sm font-bold text-white hover:bg-emerald-deep">Request this cabin</button></div></article>})}</div></div>
      </section>

      {itinerary.length ? <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20"><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Your sailing</p><h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep">The itinerary</h2><div className="mt-8 space-y-3">{itinerary.map((item) => <article key={item.id} className="grid gap-4 rounded-2xl border border-ink/8 bg-cream p-5 sm:grid-cols-[80px_1fr_auto] sm:items-center"><div><p className="text-xs font-black uppercase tracking-wide text-coral">Day</p><p className="font-serif text-3xl font-semibold text-royal-deep">{item.day_number}</p></div><div><h3 className="text-lg font-bold text-ink">{item.title}</h3><p className="mt-1 flex items-center gap-2 text-sm text-stone"><MapPin size={14} /> {item.port || 'At sea'}</p>{item.description ? <p className="mt-2 text-sm leading-6 text-stone">{item.description}</p> : null}</div>{item.arrival_time || item.departure_time ? <div className="rounded-xl bg-white px-4 py-3 text-xs font-semibold text-stone"><Clock3 size={14} className="mb-1 text-emerald-mid" />{item.arrival_time ? `Arrive ${item.arrival_time}` : ''}{item.arrival_time && item.departure_time ? <br /> : null}{item.departure_time ? `Depart ${item.departure_time}` : ''}</div> : null}</article>)}</div></section> : null}

      {deadlines.length ? <section className="bg-emerald-deep px-5 py-14 text-white sm:px-8 sm:py-18 lg:px-12 lg:py-20"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Keep these on the radar</p><h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em]">Important dates</h2><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{deadlines.map((deadline) => <article key={deadline.id} className="rounded-2xl border border-white/12 bg-white/[0.07] p-5"><CalendarDays className="text-coral" size={22} /><p className="mt-4 text-xs font-bold uppercase tracking-wide text-white/50">{dateLabel(deadline.deadline_date)}</p><h3 className="mt-1 text-lg font-bold">{deadline.title}</h3>{deadline.description ? <p className="mt-2 text-sm leading-6 text-white/65">{deadline.description}</p> : null}</article>)}</div></div></section> : null}

      <section id="booking-request" className="scroll-mt-6 px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start"><div><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Ready to join the cruise?</p><h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep">Send Yolanda your booking request.</h2><p className="mt-4 text-sm leading-6 text-stone">{trip.bookingRequestNote || 'Choose your cabin preference and tell us who is traveling. Yolanda will follow up to confirm availability and complete the booking with you.'}</p><div className="mt-5 rounded-xl border border-ink/8 bg-cream p-4 text-xs font-semibold leading-5 text-stone">No payment is collected here. Your submission tells Travelholics what you want so Yolanda can take the next step with you.</div></div>
          {bookingState === 'success' ? <div className="rounded-[2rem] border border-emerald-mid/20 bg-cream p-8 text-center shadow-sm"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-mid text-white"><CheckCircle2 size={23} /></span><h3 className="mt-5 font-serif text-3xl font-semibold text-royal-deep">Request received.</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone">We sent you a confirmation email so there is no wondering what happens next. Yolanda will review your request and follow up.</p></div> : <form onSubmit={submitBooking} className="rounded-[2rem] border border-ink/8 bg-cream p-5 shadow-sm sm:p-7"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-ink">Primary contact *<input required name="primaryName" className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-mid" /></label><label className="text-sm font-bold text-ink">Email *<input required type="email" name="email" className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-mid" /></label><label className="text-sm font-bold text-ink">Phone *<input required name="phone" className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-mid" /></label><label className="text-sm font-bold text-ink">Number of travelers *<input required type="number" min="1" name="partySize" className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-mid" /></label><label className="text-sm font-bold text-ink sm:col-span-2">Cabin preference<select name="cabinOfferId" value={selectedCabin} onChange={(e) => setSelectedCabin(e.target.value)} className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-mid"><option value="">Choose a cabin</option>{cabins.map((cabin) => <option key={cabin.id} value={cabin.id}>{cabin.name}</option>)}</select><input type="hidden" name="cabinPreference" value={cabins.find((cabin) => cabin.id === selectedCabin)?.name || ''} /></label><label className="text-sm font-bold text-ink sm:col-span-2">Who else is traveling in your cabin?<textarea name="members" className="mt-1.5 min-h-24 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-mid" placeholder={'One traveler name per line\nAshley Barnes\nGreyson Barnes'} /></label><label className="text-sm font-bold text-ink sm:col-span-2">Anything Yolanda should know?<textarea name="notes" className="mt-1.5 min-h-20 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-mid" /></label></div>{bookingError ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{bookingError}</p> : null}<button disabled={bookingState === 'sending'} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3 text-base font-bold text-white hover:bg-coral-deep disabled:opacity-50"><Plus size={18} /> {bookingState === 'sending' ? 'Sending request…' : 'Send My Booking Request'}</button></form>}
        </div>
      </section>
    </main>
  )
}
