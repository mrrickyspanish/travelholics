import Link from 'next/link'
import { CalendarDays, Mail, Plus, UsersRound } from 'lucide-react'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import InquiryStatusSelect from './InquiryStatusSelect'
import type { InquiryStatus } from '@/types/group-trips'

export const dynamic = 'force-dynamic'

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function GroupTripsAdminPage({ searchParams }: { searchParams: Promise<{ inquiry?: string }> }) {
  const { inquiry: highlightedInquiry } = await searchParams
  const supabase = createSupabaseAdmin()
  const [tripsResult, inquiriesResult] = await Promise.all([
    supabase
      .from('group_trips')
      .select('id,name,slug,status,destination,cruise_line,ship,sail_date,group_leader_name,group_trip_parties(count)')
      .order('sail_date', { ascending: true }),
    supabase
      .from('group_cruise_inquiries')
      .select('id,status,leader_name,email,phone,preferred_contact,group_type,estimated_group_size,cruise_stage,destination,preferred_dates,cruise_line,ship,sailing_date,created_at,converted_trip_id')
      .neq('status', 'closed_lost')
      .order('created_at', { ascending: false }),
  ])

  const databaseError = tripsResult.error || inquiriesResult.error
  const trips = tripsResult.data ?? []
  const inquiries = inquiriesResult.data ?? []

  return (
    <div className="min-h-full bg-[#f7f8f5] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#10755A]">Group cruise command center</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#10251e] sm:text-4xl">Group Trips</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65736d]">Inquiry to embarkation, in one operating view.</p>
          </div>
          <Link href="/admin/group-trips/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#10755A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d604a]"><Plus size={18} /> Create Group Trip</Link>
        </div>

        {databaseError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            <p className="font-semibold">The Group Trips workspace is built, but its database migration has not been applied in this preview environment.</p>
            <p className="mt-2 text-amber-800/80">The migration is scoped to production main, so preview can validate the application build without touching live data.</p>
          </div>
        ) : (
          <>
            <section className="mb-10">
              <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F26A75]">Incoming opportunities</p><h2 className="mt-1 text-2xl font-semibold text-[#10251e]">Group cruise inquiries</h2></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#60736a] shadow-sm">{inquiries.filter((item) => !item.converted_trip_id).length} active</span></div>
              {inquiries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#cfd9d4] bg-white px-5 py-8 text-center text-sm text-[#829089]">New Group Cruise form submissions will land here.</div>
              ) : (
                <div className="grid gap-3">
                  {inquiries.map((item) => {
                    const converted = Boolean(item.converted_trip_id)
                    const highlighted = item.id === highlightedInquiry
                    return <article key={item.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${highlighted ? 'border-[#F26A75] ring-2 ring-[#F26A75]/10' : 'border-[#e2e8e5]'}`}>
                      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_auto] lg:items-center">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-[#829089]">{dateLabel(item.created_at)}</span>{converted ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-800">Trip created</span> : null}</div>
                          <h3 className="text-lg font-semibold text-[#10251e]">{item.leader_name}</h3>
                          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#65736d]"><Mail size={14} /> {item.email}{item.phone ? ` · ${item.phone}` : ''}</p>
                        </div>
                        <div><p className="text-xs font-bold uppercase tracking-wide text-[#9aa69f]">Cruise direction</p><p className="mt-1 text-sm font-semibold text-[#31453e]">{item.cruise_stage === 'specific' ? `${item.cruise_line || 'Cruise'}${item.ship ? ` · ${item.ship}` : ''}` : 'Needs help choosing'}</p><p className="mt-1 text-xs text-[#829089]">{item.group_type || 'Group cruise'} · {item.estimated_group_size ? `~${item.estimated_group_size} travelers` : 'Size open'}{item.preferred_dates ? ` · ${item.preferred_dates}` : ''}</p></div>
                        <div className="flex flex-wrap items-center gap-2 lg:justify-end"><InquiryStatusSelect inquiryId={item.id} initialStatus={item.status as InquiryStatus} />{!converted ? <Link href={`/admin/group-trips/new?inquiry=${item.id}`} className="inline-flex min-h-9 items-center rounded-xl bg-[#10755A] px-3.5 py-2 text-xs font-bold text-white">Build Trip</Link> : null}</div>
                      </div>
                    </article>
                  })}
                </div>
              )}
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#10755A]">Confirmed experiences</p><h2 className="mt-1 text-2xl font-semibold text-[#10251e]">Trip hubs</h2></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#60736a] shadow-sm">{trips.length} total</span></div>
              {!trips.length ? (
                <div className="rounded-3xl border border-dashed border-[#cfd9d4] bg-white px-6 py-14 text-center"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf5f0] text-[#10755A]"><UsersRound size={26} /></div><h3 className="text-xl font-semibold text-[#10251e]">No group trips yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718079]">When Yolanda locks in the first group cruise, build the personalized guest experience here.</p></div>
              ) : (
                <div className="grid gap-4">
                  {trips.map((trip) => {
                    const count = Array.isArray(trip.group_trip_parties) ? Number(trip.group_trip_parties[0]?.count ?? 0) : 0
                    return <Link key={trip.id} href={`/admin/group-trips/${trip.id}`} className="group rounded-2xl border border-[#e2e8e5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b9cec4] hover:shadow-md sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${trip.status === 'published' ? 'bg-emerald-100 text-emerald-800' : trip.status === 'archived' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'}`}>{trip.status}</span><span className="text-xs text-[#829089]">/{trip.slug}</span></div><h3 className="truncate text-xl font-semibold text-[#10251e] group-hover:text-[#10755A]">{trip.name}</h3><p className="mt-1 text-sm text-[#65736d]">{trip.cruise_line} · {trip.ship} · {trip.destination}</p></div><div className="grid grid-cols-2 gap-3 sm:min-w-[310px]"><div className="rounded-xl bg-[#f7f8f5] p-3"><div className="flex items-center gap-2 text-xs font-medium text-[#718079]"><CalendarDays size={14} /> Sailing</div><p className="mt-1 text-sm font-semibold text-[#10251e]">{new Date(`${trip.sail_date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div><div className="rounded-xl bg-[#f7f8f5] p-3"><div className="flex items-center gap-2 text-xs font-medium text-[#718079]"><UsersRound size={14} /> Parties</div><p className="mt-1 text-sm font-semibold text-[#10251e]">{count} · {trip.group_leader_name}</p></div></div></div></Link>
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
