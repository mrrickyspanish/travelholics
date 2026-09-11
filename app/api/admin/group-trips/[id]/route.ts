import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { requireAdminSession } from '@/lib/require-admin'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const body = await request.json() as { status?: 'draft' | 'published' | 'archived' }
  if (!body.status || !['draft', 'published', 'archived'].includes(body.status)) {
    return NextResponse.json({ error: 'Invalid trip status.' }, { status: 400 })
  }

  const supabase = createSupabaseAdmin()
  const patch: Record<string, unknown> = { status: body.status }
  if (body.status === 'published') patch.published_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('group_trips')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trip: data })
}
