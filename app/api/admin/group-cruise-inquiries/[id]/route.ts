import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { requireAdminSession } from '@/lib/require-admin'
import { INQUIRY_STATUSES, type InquiryStatus } from '@/types/group-trips'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const { status } = await request.json() as { status?: InquiryStatus }
  if (!status || !INQUIRY_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid inquiry status.' }, { status: 400 })

  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase.from('group_cruise_inquiries').update({ status }).eq('id', id).select('id,status').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inquiry: data })
}
