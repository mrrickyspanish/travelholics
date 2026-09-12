'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BedDouble, CalendarDays, MapPinned, Plus, Save, Trash2 } from 'lucide-react'
import type { EditableCabinOfferInput, EditableDeadlineInput, EditableItineraryItemInput, GroupTripUpdateInput, PriceDisplay } from '@/types/group-trips'

type TripRow = {
  id: string
  slug: string
  status: string
  name: string
  destination: string
  cruise_line: string
  ship: string
  sail_date: string
  return_date: string | null
  departure_port: string | null
  hero_image_url: string | null
  overview: string | null
  access_code: string
  group_leader_name: string
  group_leader_email: string
  group_leader_phone: string | null
  price_display: PriceDisplay
  booking_request_note: string | null
}

type CabinRow = {
  id: string
  name: string
  description: string | null
  occupancy_label: string | null
  per_person_price: number | string | null
  cabin_total_price: number | string | null
  availability_note: string | null
}

type ItineraryRow = {
  id: string
  day_number: number
  title: string
  port: string | null
  arrival_time: string | null
  departure_time: string | null
  description: string | null
}

type DeadlineRow = {
  id: string
  title: string
  deadline_date: string
  description: string | null
  reminder_days_before: number[] | null
}

const inputClass = 'mt-1.5 w-full rounded-xl border border-[#dce4e0] bg-white px-3.5 py-3 text-sm text-[#10251e] outline-none transition placeholder:text-[#9ba8a2] focus:border-[#10755A] focus:ring-2 focus:ring-[#10755A]/10'
const labelClass = 'block text-sm font-semibold text-[#31453e]'

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className={labelClass}>{label}{children}{hint ? <span className="mt-1.5 block text-xs font-normal leading-5 text-[#829089]">{hint}</span> : null}</label>
}

function numeric(value: number | string | null) {
  if (value === null || value === '') return null
  const result = Number(value)
  return Number.isFinite(result) ? result : null
}

const emptyCabin = (): EditableCabinOfferInput => ({ name: '', description: '', occupancyLabel: '', perPersonPrice: null, cabinTotalPrice: null, availabilityNote: '' })
const emptyItinerary = (dayNumber: number): EditableItineraryItemInput => ({ dayNumber, title: '', port: '', arrivalTime: '', departureTime: '', description: '' })
const emptyDeadline = (): EditableDeadlineInput => ({ title: '', deadlineDate: '', description: '', reminderDaysBefore: [30, 14, 7] })

export default function EditGroupTripForm({ trip, cabins: initialCabins, itinerary: initialItinerary, deadlines: initialDeadlines }: { trip: TripRow; cabins: CabinRow[]; itinerary: ItineraryRow[]; deadlines: DeadlineRow[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState<GroupTripUpdateInput>({
    name: trip.name,
    destination: trip.destination,
    cruiseLine: trip.cruise_line,
    ship: trip.ship,
    sailDate: trip.sail_date,
    returnDate: trip.return_date || '',
    departurePort: trip.departure_port || '',
    heroImageUrl: trip.hero_image_url || '',
    overview: trip.overview || '',
    accessCode: trip.access_code,
    groupLeaderName: trip.group_leader_name,
    groupLeaderEmail: trip.group_leader_email,
    groupLeaderPhone: trip.group_leader_phone || '',
    priceDisplay: trip.price_display,
    bookingRequestNote: trip.booking_request_note || '',
    cabins: initialCabins.map((cabin) => ({ id: cabin.id, name: cabin.name, description: cabin.description || '', occupancyLabel: cabin.occupancy_label || '', perPersonPrice: numeric(cabin.per_person_price), cabinTotalPrice: numeric(cabin.cabin_total_price), availabilityNote: cabin.availability_note || '' })),
    itinerary: initialItinerary.map((item) => ({ id: item.id, dayNumber: item.day_number, title: item.title, port: item.port || '', arrivalTime: item.arrival_time || '', departureTime: item.departure_time || '', description: item.description || '' })),
    deadlines: initialDeadlines.map((deadline) => ({ id: deadline.id, title: deadline.title, deadlineDate: deadline.deadline_date, description: deadline.description || '', reminderDaysBefore: deadline.reminder_days_before || [] })),
  })

  function set<K extends keyof GroupTripUpdateInput>(key: K, value: GroupTripUpdateInput[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateCabin(index: number, patch: Partial<EditableCabinOfferInput>) {
    set('cabins', form.cabins.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  function updateItinerary(index: number, patch: Partial<EditableItineraryItemInput>) {
    set('itinerary', form.itinerary.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  function updateDeadline(index: number, patch: Partial<EditableDeadlineInput>) {
    set('deadlines', form.deadlines.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  async function save() {
    setSaving(true)
    setError('')
    setNotice('')

    const details: GroupTripUpdateInput = {
      ...form,
      cabins: form.cabins.filter((cabin) => cabin.name.trim()),
      itinerary: form.itinerary.filter((item) => item.title.trim()),
      deadlines: form.deadlines.filter((deadline) => deadline.title.trim() && deadline.deadlineDate),
    }

    try {
      const response = await fetch(`/api/admin/group-trips/${trip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save the Trip Hub.')
      setNotice(data.accessCodeChanged ? 'Trip Hub saved. The shared access code changed, so guests will need to enter the new code next time they open the hub.' : 'Trip Hub saved.')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save the Trip Hub.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full bg-[#f7f8f5] px-4 py-6 sm:px-8 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href={`/admin/group-trips/${trip.id}`} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#60736a] hover:text-[#10755A]"><ArrowLeft size={16} /> Back to command center</Link>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#10755A]">Edit Trip Hub</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#10251e] sm:text-4xl">Keep the trip current</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65736d]">Update what guests see without rebuilding the trip or disturbing their booking progress.</p>
          </div>
          <button type="button" disabled={saving} onClick={save} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#10755A] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0d604a] disabled:opacity-50"><Save size={17} /> {saving ? 'Saving…' : 'Save changes'}</button>
        </div>

        {error ? <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}
        {notice ? <p role="status" className="mb-5 rounded-xl border border-[#cfe6dc] bg-[#eaf5f0] px-4 py-3 text-sm font-medium text-[#176047]">{notice}</p> : null}

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#e2e8e5] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6"><h2 className="text-xl font-semibold text-[#10251e]">Sailing details</h2><p className="mt-1 text-sm text-[#718079]">Dates, ship, destination, and the details guests use to orient themselves.</p></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Trip name *"><input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
              <Field label="Trip URL" hint="Locked after creation so invitations and saved links never break."><input disabled className={`${inputClass} cursor-not-allowed bg-[#f3f5f4] text-[#7e8b85]`} value={`yotravelholic.com/trips/${trip.slug}`} /></Field>
              <Field label="Destination *"><input className={inputClass} value={form.destination} onChange={(e) => set('destination', e.target.value)} /></Field>
              <Field label="Departure port"><input className={inputClass} value={form.departurePort} onChange={(e) => set('departurePort', e.target.value)} /></Field>
              <Field label="Cruise line *"><input className={inputClass} value={form.cruiseLine} onChange={(e) => set('cruiseLine', e.target.value)} /></Field>
              <Field label="Ship *"><input className={inputClass} value={form.ship} onChange={(e) => set('ship', e.target.value)} /></Field>
              <Field label="Sail date *"><input type="date" className={inputClass} value={form.sailDate} onChange={(e) => set('sailDate', e.target.value)} /></Field>
              <Field label="Return date"><input type="date" className={inputClass} value={form.returnDate} onChange={(e) => set('returnDate', e.target.value)} /></Field>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e2e8e5] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6"><h2 className="text-xl font-semibold text-[#10251e]">Leader, access, and guest guidance</h2><p className="mt-1 text-sm text-[#718079]">Operational details can change without changing the private leader link.</p></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Group leader name *"><input className={inputClass} value={form.groupLeaderName} onChange={(e) => set('groupLeaderName', e.target.value)} /></Field>
              <Field label="Group leader email *"><input type="email" className={inputClass} value={form.groupLeaderEmail} onChange={(e) => set('groupLeaderEmail', e.target.value)} /></Field>
              <Field label="Group leader phone"><input className={inputClass} value={form.groupLeaderPhone} onChange={(e) => set('groupLeaderPhone', e.target.value)} /></Field>
              <Field label="Shared group access code *" hint="Changing this intentionally signs guests out of the shared Trip Hub and requires the new code."><input className={inputClass} value={form.accessCode} onChange={(e) => set('accessCode', e.target.value)} /></Field>
              <Field label="Pricing display"><select className={inputClass} value={form.priceDisplay} onChange={(e) => set('priceDisplay', e.target.value as PriceDisplay)}><option value="both">Per person + cabin total</option><option value="per_person">Per person only</option><option value="cabin_total">Cabin total only</option></select></Field>
              <Field label="Hero image URL"><input className={inputClass} value={form.heroImageUrl} onChange={(e) => set('heroImageUrl', e.target.value)} placeholder="https://..." /></Field>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Field label="Trip overview"><textarea className={`${inputClass} min-h-28 resize-y`} value={form.overview} onChange={(e) => set('overview', e.target.value)} /></Field>
              <Field label="Booking request note"><textarea className={`${inputClass} min-h-28 resize-y`} value={form.bookingRequestNote} onChange={(e) => set('bookingRequestNote', e.target.value)} /></Field>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e2e8e5] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><BedDouble size={20} className="text-[#10755A]" /><h2 className="text-xl font-semibold text-[#10251e]">Cabins & pricing</h2></div><p className="mt-1 text-sm text-[#718079]">Removed options are retired, not deleted, so existing traveler records stay intact.</p></div><button type="button" onClick={() => set('cabins', [...form.cabins, emptyCabin()])} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#eaf5f0] px-3 py-2 text-xs font-bold text-[#10755A]"><Plus size={15} /> Add cabin</button></div>
            <div className="space-y-4">
              {form.cabins.map((cabin, index) => <div key={cabin.id || `new-${index}`} className="rounded-2xl border border-[#e2e8e5] bg-[#fbfcfa] p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold text-[#10251e]">Cabin option {index + 1}</p>{form.cabins.length > 1 ? <button type="button" onClick={() => set('cabins', form.cabins.filter((_, i) => i !== index))} className="rounded-lg p-2 text-[#9b5b60] hover:bg-red-50" aria-label={`Remove cabin option ${index + 1}`}><Trash2 size={16} /></button> : null}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Cabin name *"><input className={inputClass} value={cabin.name} onChange={(e) => updateCabin(index, { name: e.target.value })} /></Field><Field label="Occupancy"><input className={inputClass} value={cabin.occupancyLabel || ''} onChange={(e) => updateCabin(index, { occupancyLabel: e.target.value })} /></Field><Field label="Per-person price"><input type="number" min="0" step="0.01" className={inputClass} value={cabin.perPersonPrice ?? ''} onChange={(e) => updateCabin(index, { perPersonPrice: e.target.value ? Number(e.target.value) : null })} /></Field><Field label="Total cabin price"><input type="number" min="0" step="0.01" className={inputClass} value={cabin.cabinTotalPrice ?? ''} onChange={(e) => updateCabin(index, { cabinTotalPrice: e.target.value ? Number(e.target.value) : null })} /></Field><Field label="Availability note"><input className={inputClass} value={cabin.availabilityNote || ''} onChange={(e) => updateCabin(index, { availabilityNote: e.target.value })} /></Field><Field label="Short description"><input className={inputClass} value={cabin.description || ''} onChange={(e) => updateCabin(index, { description: e.target.value })} /></Field></div></div>)}
            </div>
          </section>

          <section className="rounded-3xl border border-[#e2e8e5] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><MapPinned size={20} className="text-[#10755A]" /><h2 className="text-xl font-semibold text-[#10251e]">Itinerary</h2></div><p className="mt-1 text-sm text-[#718079]">Keep the public trip rhythm current as ports or times change.</p></div><button type="button" onClick={() => set('itinerary', [...form.itinerary, emptyItinerary(form.itinerary.length + 1)])} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#eaf5f0] px-3 py-2 text-xs font-bold text-[#10755A]"><Plus size={15} /> Add day</button></div>
            {form.itinerary.length === 0 ? <button type="button" onClick={() => set('itinerary', [emptyItinerary(1)])} className="w-full rounded-2xl border border-dashed border-[#cfd9d4] px-5 py-8 text-sm font-semibold text-[#10755A]">+ Add the first itinerary day</button> : null}
            <div className="space-y-4">{form.itinerary.map((item, index) => <div key={item.id || `new-${index}`} className="rounded-2xl border border-[#e2e8e5] bg-[#fbfcfa] p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold text-[#10251e]">Day {index + 1}</p><button type="button" onClick={() => set('itinerary', form.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 })))} className="rounded-lg p-2 text-[#9b5b60] hover:bg-red-50" aria-label={`Remove itinerary day ${index + 1}`}><Trash2 size={16} /></button></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="Title"><input className={inputClass} value={item.title} onChange={(e) => updateItinerary(index, { title: e.target.value, dayNumber: index + 1 })} /></Field><Field label="Port / location"><input className={inputClass} value={item.port || ''} onChange={(e) => updateItinerary(index, { port: e.target.value })} /></Field><Field label="Arrival"><input className={inputClass} value={item.arrivalTime || ''} onChange={(e) => updateItinerary(index, { arrivalTime: e.target.value })} /></Field><Field label="Departure"><input className={inputClass} value={item.departureTime || ''} onChange={(e) => updateItinerary(index, { departureTime: e.target.value })} /></Field></div><Field label="What guests should know"><textarea className={`${inputClass} min-h-20 resize-y`} value={item.description || ''} onChange={(e) => updateItinerary(index, { description: e.target.value })} /></Field></div>)}</div>
          </section>

          <section className="rounded-3xl border border-[#e2e8e5] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><CalendarDays size={20} className="text-[#10755A]" /><h2 className="text-xl font-semibold text-[#10251e]">Important deadlines</h2></div><p className="mt-1 text-sm text-[#718079]">Existing deadlines keep their identity so editing a date does not reset reminder history.</p></div><button type="button" onClick={() => set('deadlines', [...form.deadlines, emptyDeadline()])} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#eaf5f0] px-3 py-2 text-xs font-bold text-[#10755A]"><Plus size={15} /> Add deadline</button></div>
            {form.deadlines.length === 0 ? <p className="rounded-xl bg-[#f7f8f5] px-4 py-4 text-sm text-[#718079]">No deadlines yet. Add one when the group has a date everyone needs to hit.</p> : null}
            <div className="space-y-3">{form.deadlines.map((deadline, index) => <div key={deadline.id || `new-${index}`} className="grid gap-4 rounded-2xl border border-[#e2e8e5] bg-[#fbfcfa] p-4 sm:grid-cols-[1.4fr_1fr_1.2fr_auto] sm:items-end"><Field label="Deadline"><input className={inputClass} value={deadline.title} onChange={(e) => updateDeadline(index, { title: e.target.value })} /></Field><Field label="Date"><input type="date" className={inputClass} value={deadline.deadlineDate} onChange={(e) => updateDeadline(index, { deadlineDate: e.target.value })} /></Field><Field label="Reminder days before" hint="Comma separated"><input className={inputClass} value={deadline.reminderDaysBefore.join(', ')} onChange={(e) => updateDeadline(index, { reminderDaysBefore: e.target.value.split(',').map((v) => Number(v.trim())).filter((v) => Number.isFinite(v) && v >= 0) })} /></Field><button type="button" onClick={() => set('deadlines', form.deadlines.filter((_, i) => i !== index))} className="mb-0.5 rounded-lg p-3 text-[#9b5b60] hover:bg-red-50" aria-label={`Remove ${deadline.title || 'deadline'}`}><Trash2 size={17} /></button></div>)}</div>
          </section>
        </div>

        <div className="sticky bottom-4 mt-7 flex flex-col gap-3 rounded-2xl border border-[#d8e1dd] bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p className="px-1 text-xs leading-5 text-[#718079]">Changes update the same Trip Hub. Guest and leader URLs stay intact.</p>
          <div className="flex gap-2"><Link href={`/admin/group-trips/${trip.id}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#dce4e0] px-4 py-2.5 text-sm font-semibold text-[#4c5f57] sm:flex-none">Cancel</Link><button type="button" disabled={saving} onClick={save} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#10755A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:flex-none"><Save size={17} /> {saving ? 'Saving…' : 'Save changes'}</button></div>
        </div>
      </div>
    </div>
  )
}
