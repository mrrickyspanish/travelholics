import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { sendAdminFollowUpReminder, sendDeadlineReminder } from '@/lib/group-trip-email'

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}

function daysBetween(today: Date, targetDate: string) {
  const target = new Date(`${targetDate}T12:00:00Z`)
  const base = new Date(`${dateOnly(today)}T12:00:00Z`)
  return Math.round((target.getTime() - base.getTime()) / 86_400_000)
}

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseAdmin()
  let followUpsSent = 0
  let deadlineRemindersSent = 0
  const now = new Date()
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()

  const { data: staleParties } = await supabase
    .from('group_trip_parties')
    .select('id,trip_id,primary_name,email,submitted_at,group_trips!inner(name)')
    .eq('status', 'submitted')
    .lte('submitted_at', cutoff)

  for (const party of staleParties ?? []) {
    const eventKey = `48h:${party.id}:${String(party.submitted_at).slice(0, 10)}`
    const { data: logged } = await supabase.from('group_trip_email_log').select('id').eq('event_key', eventKey).maybeSingle()
    if (logged) continue
    const tripJoin = Array.isArray(party.group_trips) ? party.group_trips[0] : party.group_trips
    const sent = await sendAdminFollowUpReminder({ tripId: party.trip_id, tripName: tripJoin?.name || 'Group Trip', name: party.primary_name, email: party.email })
    if (sent) {
      await supabase.from('group_trip_email_log').insert({ trip_id: party.trip_id, party_id: party.id, event_key: eventKey, email_type: '48h_admin_followup', recipient: 'hello@yotravelholic.com' })
      followUpsSent += 1
    }
  }

  const { data: deadlines } = await supabase
    .from('group_trip_deadlines')
    .select('id,trip_id,title,deadline_date,reminder_days_before,audience_statuses,group_trips!inner(name,slug,status)')
    .eq('active', true)
    .gte('deadline_date', dateOnly(now))

  for (const deadline of deadlines ?? []) {
    const tripJoin = Array.isArray(deadline.group_trips) ? deadline.group_trips[0] : deadline.group_trips
    if (!tripJoin || tripJoin.status !== 'published') continue
    const daysUntil = daysBetween(now, deadline.deadline_date)
    const reminderDays: number[] = deadline.reminder_days_before ?? []
    if (!reminderDays.includes(daysUntil)) continue

    const statuses: string[] = deadline.audience_statuses ?? []
    if (!statuses.length) continue
    const { data: parties } = await supabase
      .from('group_trip_parties')
      .select('id,primary_name,email,status')
      .eq('trip_id', deadline.trip_id)
      .in('status', statuses)

    for (const party of parties ?? []) {
      // Include the due date in the idempotency key. If Yolanda moves a deadline,
      // the reminder schedule should follow the new date instead of being blocked
      // by a reminder that belonged to the old date.
      const eventKey = `deadline:${deadline.id}:${deadline.deadline_date}:${party.id}:${daysUntil}`
      const { data: logged } = await supabase.from('group_trip_email_log').select('id').eq('event_key', eventKey).maybeSingle()
      if (logged) continue
      const sent = await sendDeadlineReminder({ name: party.primary_name, email: party.email, tripName: tripJoin.name, deadlineTitle: deadline.title, deadlineDate: deadline.deadline_date, slug: tripJoin.slug })
      if (sent) {
        await supabase.from('group_trip_email_log').insert({ trip_id: deadline.trip_id, party_id: party.id, event_key: eventKey, email_type: 'deadline_reminder', recipient: party.email })
        deadlineRemindersSent += 1
      }
    }
  }

  return NextResponse.json({ ok: true, followUpsSent, deadlineRemindersSent, checkedAt: now.toISOString() })
}
