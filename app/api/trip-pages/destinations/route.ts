import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { destinations } from '@/lib/destinations'

export async function GET() {
  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({
    destinations: destinations.map((d) => ({
      slug: d.slug,
      name: d.name,
      ports: d.portNotes.map((p) => p.port),
    })),
  })
}
