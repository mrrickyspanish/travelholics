'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, BedDouble, CalendarClock, Check, MapPinned, Plus, Ship, Trash2, UsersRound } from 'lucide-react'
import type { CabinOfferInput, DeadlineInput, GroupTripCreateInput, ItineraryItemInput, PriceDisplay } from '@/types/group-trips'

const STEPS = [
  { label: 'Basics', icon: Ship },
  { label: 'Booking details', icon: UsersRound },
  { label: 'Cabins & pricing', icon: BedDouble },
  { label: 'Trip experience', icon: MapPinned },
  { label: 'Hub setup', icon: CalendarClock },
  { label: 'Review & launch', icon: Check },
]

const inputClass = 'mt-1.5 w-full rounded-xl border border-[#dce4e0] bg-white px-3.5 py-3 text-sm text-[#10251e] outline-none transition placeholder:text-[#9ba8a2] focus:border-[#10755A] focus:ring-2 focus:ring-[#10755A]/10'
const labelClass = 'block text-sm font-semibold text-[#31453e]'

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className={labelClass}>{label}{children}{hint ? <span className="mt-1.5 block text-xs font-normal leading-5 text-[#829089]">{hint}</span> : null}</label>
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

function money(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Not set'
}

const emptyCabin = (): CabinOfferInput => ({ name: '', description: '', occupancyLabel: '', perPersonPrice: null, cabinTotalPrice: null, availabilityNote: '' })
const emptyItinerary = (dayNumber: number): ItineraryItemInput => ({ dayNumber, title: '', port: '', arrivalTime: '', departureTime: '', description: '' })
const emptyDeadline = (): DeadlineInput => ({ title: '', deadlineDate: '', description: '', reminderDaysBefore: [30, 14, 7] })

export default function GroupTripWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [form, setForm] = useState<GroupTripCreateInput>({
    name: '', slug: '', destination: '', cruiseLine: '', ship: '', sailDate: '', returnDate: '', departurePort: '',
    heroImageUrl: '', overview: '', accessCode: '', groupLeaderName: '', groupLeaderEmail: '', groupLeaderPhone: '',
    priceDisplay: 'both', bookingRequestNote: '', cabins: [emptyCabin()], itinerary: [], deadlines: [],
  })

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(form.name && form.destination && form.cruiseLine && form.ship && form.sailDate)
    if (step === 1) return Boolean(form.groupLeaderName && form.groupLeaderEmail && form.accessCode)
    if (step === 2) return form.cabins.some((cabin) => cabin.name.trim())
    return true
  }, [form, step])

  function set<K extends keyof GroupTripCreateInput>(key: K, value: GroupTripCreateInput[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function setName(value: string) {
    setForm((current) => ({ ...current, name: value, slug: slugTouched ? current.slug : slugify(value) }))
  }

  function updateCabin(index: number, patch: Partial<CabinOfferInput>) {
    set('cabins', form.cabins.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  function updateItinerary(index: number, patch: Partial<ItineraryItemInput>) {
    set('itinerary', form.itinerary.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  function updateDeadline(index: number, patch: Partial<DeadlineInput>) {
    set('deadlines', form.deadlines.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  function next() {
    if (!canContinue) {
      setError('Finish the required fields before continuing.')
      return
    }
    setError('')
    setStep((value) => Math.min(STEPS.length - 1, value + 1))
  }

  async function submit(publish: boolean) {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        cabins: form.cabins.filter((cabin) => cabin.name.trim()),
        itinerary: form.itinerary.filter((item) => item.title.trim()),
        deadlines: form.deadlines.filter((item) => item.title.trim() && item.deadlineDate),
      }
      const response = await fetch('/api/admin/group-trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to create group trip.')

      if (publish) {
        const publishResponse = await fetch(`/api/admin/group-trips/${data.trip.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'published' }),
        })
        const publishData = await publishResponse.json()
        if (!publishResponse.ok) throw new Error(publishData.error || 'Trip was created but could not be published.')
      }
      router.push(`/admin/group-trips/${data.trip.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create group trip.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full bg-[#f7f8f5] px-4 py-6 sm:px-8 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#10755A]">Create Group Trip</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#10251e] sm:text-4xl">Build the group experience</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65736d]">Fill it out once. Travelholics turns it into the protected trip hub your group will use.</p>
        </div>

        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex min-w-[720px] gap-2">
            {STEPS.map(({ label, icon: Icon }, index) => (
              <button key={label} type="button" onClick={() => index <= step && setStep(index)} className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-3 text-left text-xs font-semibold transition ${index === step ? 'bg-[#0d4a3a] text-white' : index < step ? 'bg-[#e2f0ea] text-[#0d4a3a]' : 'bg-white text-[#829089]'}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${index === step ? 'bg-white/12' : 'bg-black/[0.03]'}`}><Icon size={15} /></span>
                <span>{index + 1}. {label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#e2e8e5] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
          {step === 0 ? (
            <div className="space-y-6">
              <div><h2 className="text-xl font-semibold text-[#10251e]">Start with the sailing</h2><p className="mt-1 text-sm text-[#718079]">The core facts that define this group cruise.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Trip name *"><input className={inputClass} value={form.name} onChange={(e) => setName(e.target.value)} placeholder="Barnes Family Cruise 2027" /></Field>
                <Field label="Trip URL *" hint="This becomes yotravelholic.com/trips/your-trip-name"><input className={inputClass} value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)) }} placeholder="barnes-family-cruise-2027" /></Field>
                <Field label="Destination *"><input className={inputClass} value={form.destination} onChange={(e) => set('destination', e.target.value)} placeholder="Eastern Caribbean" /></Field>
                <Field label="Departure port"><input className={inputClass} value={form.departurePort} onChange={(e) => set('departurePort', e.target.value)} placeholder="Port Canaveral, Florida" /></Field>
                <Field label="Cruise line *"><input className={inputClass} value={form.cruiseLine} onChange={(e) => set('cruiseLine', e.target.value)} placeholder="Royal Caribbean" /></Field>
                <Field label="Ship *"><input className={inputClass} value={form.ship} onChange={(e) => set('ship', e.target.value)} placeholder="Wonder of the Seas" /></Field>
                <Field label="Sail date *"><input type="date" className={inputClass} value={form.sailDate} onChange={(e) => set('sailDate', e.target.value)} /></Field>
                <Field label="Return date"><input type="date" className={inputClass} value={form.returnDate} onChange={(e) => set('returnDate', e.target.value)} /></Field>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6">
              <div><h2 className="text-xl font-semibold text-[#10251e]">Leader, access, and booking context</h2><p className="mt-1 text-sm text-[#718079]">This is where the white-glove handoff starts.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Group leader name *"><input className={inputClass} value={form.groupLeaderName} onChange={(e) => set('groupLeaderName', e.target.value)} /></Field>
                <Field label="Group leader email *"><input type="email" className={inputClass} value={form.groupLeaderEmail} onChange={(e) => set('groupLeaderEmail', e.target.value)} /></Field>
                <Field label="Group leader phone"><input className={inputClass} value={form.groupLeaderPhone} onChange={(e) => set('groupLeaderPhone', e.target.value)} /></Field>
                <Field label="Shared group access code *" hint="The code Yolanda and the group leader agree on during planning."><input className={inputClass} value={form.accessCode} onChange={(e) => set('accessCode', e.target.value)} placeholder="SMITHS2027" /></Field>
                <Field label="Pricing display"><select className={inputClass} value={form.priceDisplay} onChange={(e) => set('priceDisplay', e.target.value as PriceDisplay)}><option value="both">Per person + cabin total</option><option value="per_person">Per person only</option><option value="cabin_total">Cabin total only</option></select></Field>
              </div>
              <Field label="Trip overview" hint="A warm, concise intro guests will see once they enter the trip hub."><textarea className={`${inputClass} min-h-28 resize-y`} value={form.overview} onChange={(e) => set('overview', e.target.value)} placeholder="This is the cruise the whole family has been talking about..." /></Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-[#10251e]">Cabins & pricing</h2><p className="mt-1 text-sm text-[#718079]">Add every cabin choice the group can request.</p></div><button type="button" onClick={() => set('cabins', [...form.cabins, emptyCabin()])} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#eaf5f0] px-3 py-2 text-xs font-bold text-[#10755A]"><Plus size={15} /> Add cabin</button></div>
              <div className="space-y-4">
                {form.cabins.map((cabin, index) => (
                  <div key={index} className="rounded-2xl border border-[#e2e8e5] bg-[#fbfcfa] p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold text-[#10251e]">Cabin option {index + 1}</p>{form.cabins.length > 1 ? <button type="button" onClick={() => set('cabins', form.cabins.filter((_, i) => i !== index))} className="rounded-lg p-2 text-[#9b5b60] hover:bg-red-50" aria-label={`Remove cabin option ${index + 1}`}><Trash2 size={16} /></button> : null}</div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Field label="Cabin name *"><input className={inputClass} value={cabin.name} onChange={(e) => updateCabin(index, { name: e.target.value })} placeholder="Ocean View Balcony" /></Field>
                      <Field label="Occupancy"><input className={inputClass} value={cabin.occupancyLabel} onChange={(e) => updateCabin(index, { occupancyLabel: e.target.value })} placeholder="2 guests" /></Field>
                      <Field label="Per-person price"><input type="number" min="0" step="0.01" className={inputClass} value={cabin.perPersonPrice ?? ''} onChange={(e) => updateCabin(index, { perPersonPrice: e.target.value ? Number(e.target.value) : null })} placeholder="1299.00" /></Field>
                      <Field label="Total cabin price"><input type="number" min="0" step="0.01" className={inputClass} value={cabin.cabinTotalPrice ?? ''} onChange={(e) => updateCabin(index, { cabinTotalPrice: e.target.value ? Number(e.target.value) : null })} placeholder="2598.00" /></Field>
                      <Field label="Availability note"><input className={inputClass} value={cabin.availabilityNote} onChange={(e) => updateCabin(index, { availabilityNote: e.target.value })} placeholder="Limited group inventory" /></Field>
                      <Field label="Short description"><input className={inputClass} value={cabin.description} onChange={(e) => updateCabin(index, { description: e.target.value })} placeholder="Private balcony + ocean view" /></Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-[#10251e]">Build the itinerary</h2><p className="mt-1 text-sm text-[#718079]">Enough detail to keep everyone excited and oriented.</p></div><button type="button" onClick={() => set('itinerary', [...form.itinerary, emptyItinerary(form.itinerary.length + 1)])} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#eaf5f0] px-3 py-2 text-xs font-bold text-[#10755A]"><Plus size={15} /> Add day</button></div>
              {form.itinerary.length === 0 ? <button type="button" onClick={() => set('itinerary', [emptyItinerary(1)])} className="w-full rounded-2xl border border-dashed border-[#cfd9d4] px-5 py-10 text-sm font-semibold text-[#10755A]">+ Add the first itinerary day</button> : null}
              <div className="space-y-4">
                {form.itinerary.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-[#e2e8e5] bg-[#fbfcfa] p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold text-[#10251e]">Day {item.dayNumber}</p><button type="button" onClick={() => set('itinerary', form.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 })))} className="rounded-lg p-2 text-[#9b5b60] hover:bg-red-50" aria-label={`Remove itinerary day ${item.dayNumber}`}><Trash2 size={16} /></button></div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Field label="Title"><input className={inputClass} value={item.title} onChange={(e) => updateItinerary(index, { title: e.target.value })} placeholder="Perfect Day at CocoCay" /></Field>
                      <Field label="Port / location"><input className={inputClass} value={item.port} onChange={(e) => updateItinerary(index, { port: e.target.value })} placeholder="CocoCay, Bahamas" /></Field>
                      <Field label="Arrival"><input className={inputClass} value={item.arrivalTime} onChange={(e) => updateItinerary(index, { arrivalTime: e.target.value })} placeholder="7:00 AM" /></Field>
                      <Field label="Departure"><input className={inputClass} value={item.departureTime} onChange={(e) => updateItinerary(index, { departureTime: e.target.value })} placeholder="5:00 PM" /></Field>
                    </div>
                    <Field label="What guests should know"><textarea className={`${inputClass} min-h-20 resize-y`} value={item.description} onChange={(e) => updateItinerary(index, { description: e.target.value })} /></Field>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-7">
              <div><h2 className="text-xl font-semibold text-[#10251e]">Finish the trip hub</h2><p className="mt-1 text-sm text-[#718079]">Visual identity, booking guidance, and the dates nobody should miss.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Hero image URL" hint="Destination or sailing image for this group's page."><input className={inputClass} value={form.heroImageUrl} onChange={(e) => set('heroImageUrl', e.target.value)} placeholder="https://..." /></Field>
                <Field label="Booking request note" hint="Optional line shown above the guest booking request."><input className={inputClass} value={form.bookingRequestNote} onChange={(e) => set('bookingRequestNote', e.target.value)} placeholder="Choose the cabin that feels right. Yolanda will confirm availability with you." /></Field>
              </div>
              <div>
                <div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="font-semibold text-[#10251e]">Important deadlines</h3><p className="mt-1 text-xs text-[#829089]">Each date can have its own reminder timing.</p></div><button type="button" onClick={() => set('deadlines', [...form.deadlines, emptyDeadline()])} className="inline-flex items-center gap-1.5 rounded-xl bg-[#eaf5f0] px-3 py-2 text-xs font-bold text-[#10755A]"><Plus size={15} /> Add deadline</button></div>
                <div className="space-y-3">
                  {form.deadlines.map((deadline, index) => (
                    <div key={index} className="grid gap-4 rounded-2xl border border-[#e2e8e5] bg-[#fbfcfa] p-4 sm:grid-cols-[1.4fr_1fr_1.2fr_auto] sm:items-end">
                      <Field label="Deadline"><input className={inputClass} value={deadline.title} onChange={(e) => updateDeadline(index, { title: e.target.value })} placeholder="Final payment" /></Field>
                      <Field label="Date"><input type="date" className={inputClass} value={deadline.deadlineDate} onChange={(e) => updateDeadline(index, { deadlineDate: e.target.value })} /></Field>
                      <Field label="Reminder days before" hint="Comma separated"><input className={inputClass} value={deadline.reminderDaysBefore.join(', ')} onChange={(e) => updateDeadline(index, { reminderDaysBefore: e.target.value.split(',').map((v) => Number(v.trim())).filter((v) => Number.isFinite(v) && v >= 0) })} placeholder="30, 14, 7" /></Field>
                      <button type="button" onClick={() => set('deadlines', form.deadlines.filter((_, i) => i !== index))} className="mb-0.5 rounded-lg p-3 text-[#9b5b60] hover:bg-red-50" aria-label={`Remove ${deadline.title || 'deadline'}`}><Trash2 size={17} /></button>
                    </div>
                  ))}
                  {form.deadlines.length === 0 ? <p className="rounded-xl bg-[#f7f8f5] px-4 py-4 text-sm text-[#718079]">No deadlines added yet. You can launch without them and add them later.</p> : null}
                </div>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-6">
              <div><h2 className="text-xl font-semibold text-[#10251e]">Review the experience</h2><p className="mt-1 text-sm text-[#718079]">Create a draft to review privately, or publish it immediately if everything is locked.</p></div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl bg-[#f7f8f5] p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#829089]">Trip</p><p className="mt-2 text-lg font-semibold text-[#10251e]">{form.name || 'Untitled'}</p><p className="mt-1 text-sm text-[#65736d]">{form.cruiseLine} · {form.ship}</p><p className="text-sm text-[#65736d]">{form.destination}</p></div>
                <div className="rounded-2xl bg-[#f7f8f5] p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#829089]">Group leader</p><p className="mt-2 text-lg font-semibold text-[#10251e]">{form.groupLeaderName}</p><p className="mt-1 text-sm text-[#65736d]">{form.groupLeaderEmail}</p><p className="mt-1 text-sm font-semibold text-[#10755A]">Access code: {form.accessCode}</p></div>
                <div className="rounded-2xl bg-[#f7f8f5] p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#829089]">Experience</p><p className="mt-2 text-lg font-semibold text-[#10251e]">{form.cabins.filter((c) => c.name).length} cabin option(s)</p><p className="mt-1 text-sm text-[#65736d]">{form.itinerary.filter((i) => i.title).length} itinerary days · {form.deadlines.filter((d) => d.title && d.deadlineDate).length} deadlines</p></div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#e2e8e5]"><div className="bg-[#0d4a3a] px-5 py-4 text-white"><p className="text-xs font-bold uppercase tracking-wide text-white/60">Guest pricing preview</p></div><div className="divide-y divide-[#edf1ef]">{form.cabins.filter((c) => c.name).map((cabin, index) => <div key={index} className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="font-semibold text-[#10251e]">{cabin.name}</p><p className="text-xs text-[#718079]">{cabin.occupancyLabel || 'Occupancy varies'}</p></div><p className="text-right text-sm font-semibold text-[#10251e]">{form.priceDisplay !== 'cabin_total' ? `${money(cabin.perPersonPrice)} pp` : ''}{form.priceDisplay === 'both' ? ' · ' : ''}{form.priceDisplay !== 'per_person' ? `${money(cabin.cabinTotalPrice)} cabin` : ''}</p></div>)}</div></div>
              <div className="rounded-2xl border border-[#d6e7df] bg-[#eff8f4] p-4 text-sm leading-6 text-[#315c4d]">No payment is collected through this flow. Guests submit a booking request, Yolanda follows up, and admins control the traveler status from the command center.</div>
            </div>
          ) : null}

          {error ? <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#edf1ef] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={() => step === 0 ? router.push('/admin/group-trips') : setStep((value) => value - 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dce4e0] px-4 py-2.5 text-sm font-semibold text-[#4c5f57] hover:bg-[#f7f8f5]"><ArrowLeft size={17} /> {step === 0 ? 'Cancel' : 'Back'}</button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d604a]">Continue <ArrowRight size={17} /></button>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="button" disabled={saving} onClick={() => submit(false)} className="min-h-11 rounded-xl border border-[#10755A] px-5 py-2.5 text-sm font-semibold text-[#10755A] disabled:opacity-50">{saving ? 'Saving…' : 'Save as draft'}</button>
                <button type="button" disabled={saving} onClick={() => submit(true)} className="min-h-11 rounded-xl bg-[#F26A75] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#D9505C] disabled:opacity-50">{saving ? 'Building…' : 'Create & publish'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
