import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, KeyRound, MapPin, Pencil, Ship, UserRound } from 'lucide-react'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import TripCommandCenter from './TripCommandCenter'

export const dynamic = 'force-dynamic'

function dateLabel(value: string | null) {
  if (!value) return 'Not set'
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function money(value: number | string | null) {
  if (value === null || value === undefined || value === '') return 'Not set'
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default async function GroupTripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createSupabaseAdmin()
  const [tripResult, partiesResult, cabinsResult, deadlinesResult] = await Promise.all([
    supabase.from('group_trips').select('*').eq('id', id).maybeSingle(),
    supabase.from('group_trip_parties').select('id,primary_name,email,phone,party_size,cabin_preference,status,created_at').eq('trip_id', id).order('created_at', { ascending: true }),
    supabase.from('group_trip_cabin_offers').select('*').eq('trip_id', id).eq('active', true).order('sort_order', { ascending: true }),
    supabase.from('group_trip_deadlines').select('*').eq('trip_id', id).eq('active', true).order('deadline_date', { ascending: true }),
  ])

  const trip = tripResult.data
  if (!trip) notFound()
  const parties = partiesResult.data ?? []
  const cabins = cabinsResult.data ?? []
  const deadlines = deadlinesResult.data ?? []

  const facts = [
    { label: 'Sailing', icon: CalendarDays, value: dateLabel(trip.sail_date), sub: `Return: ${dateLabel(trip.return_date)}` },
    { label: 'Departure', icon: MapPin, value: trip.departure_port || 'Not set', sub: trip.destination },
    { label: 'Ship', icon: Ship, value: trip.ship, sub: trip.cruise_line },
    { label: 'Group leader', icon: UserRound, value: trip.group_leader_name, sub: trip.group_leader_email },
  ]

  return (
    <div className="min-h-full bg-[#f7f8f5] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/group-trips" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#60736a] hover:text-[#10755A]"><ArrowLeft size={16} /> All group trips</Link>

        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${trip.status === 'published' ? 'bg-emerald-100 text-emerald-800' : trip.status === 'archived' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'}`}>{trip.status}</span>
              <span className="text-xs text-[#829089]">/{trip.slug}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#10251e] sm:text-4xl">{trip.name}</h1>
            <p className="mt-2 text-sm text-[#65736d]">{trip.cruise_line} · {trip.ship} · {trip.destination}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/admin/group-trips/${trip.id}/edit`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#cbd8d2] bg-white px-4 py-2.5 text-sm font-semibold text-[#315c4d] shadow-sm hover:bg-[#fbfcfa]"><Pencil size={16} /> Edit Trip Hub</Link>
            <div className="rounded-2xl border border-[#d6e7df] bg-[#eff8f4] px-5 py-4 text-sm text-[#315c4d]"><p className="flex items-center gap-2 font-semibold"><KeyRound size={16} /> Shared group code</p><p className="mt-1 font-mono text-lg font-bold tracking-wide text-[#0d4a3a]">{trip.access_code}</p></div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ label, icon: Icon, value, sub }) => <div key={label} className="rounded-2xl border border-[#e2e8e5] bg-white p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#829089]"><Icon size={14} /> {label}</p><p className="mt-2 text-sm font-semibold text-[#10251e]">{value}</p><p className="mt-0.5 truncate text-xs text-[#829089]">{sub}</p></div>)}
        </div>

        <TripCommandCenter tripId={trip.id} slug={trip.slug} status={trip.status} leaderToken={trip.leader_access_token} parties={parties} />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#e2e8e5] bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-[#10251e]">Cabin offers</h2><span className="text-xs font-bold text-[#829089]">{trip.price_display.replace('_', ' ')}</span></div>
            <div className="space-y-3">{cabins.length ? cabins.map((cabin) => <div key={cabin.id} className="rounded-xl bg-[#f7f8f5] p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-[#10251e]">{cabin.name}</p><p className="mt-1 text-xs text-[#718079]">{cabin.occupancy_label || 'Occupancy varies'}{cabin.availability_note ? ` · ${cabin.availability_note}` : ''}</p></div><p className="text-right text-sm font-semibold text-[#10251e]">{trip.price_display !== 'cabin_total' ? `${money(cabin.per_person_price)} pp` : ''}{trip.price_display === 'both' ? <br /> : null}{trip.price_display !== 'per_person' ? `${money(cabin.cabin_total_price)} cabin` : ''}</p></div></div>) : <p className="text-sm text-[#829089]">No cabin offers added.</p>}</div>
          </section>

          <section className="rounded-2xl border border-[#e2e8e5] bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-[#10251e]">Guest deadlines</h2><span className="text-xs font-bold text-[#829089]">Configurable reminders</span></div>
            <div className="space-y-3">{deadlines.length ? deadlines.map((deadline) => <div key={deadline.id} className="rounded-xl bg-[#f7f8f5] p-4"><p className="font-semibold text-[#10251e]">{deadline.title}</p><p className="mt-1 text-sm text-[#65736d]">{dateLabel(deadline.deadline_date)}</p><p className="mt-1 text-xs text-[#829089]">Reminder days: {(deadline.reminder_days_before || []).join(', ') || 'None'}</p></div>) : <p className="text-sm text-[#829089]">No guest deadlines added.</p>}</div>
          </section>
        </div>
      </div>
    </div>
  )
}
