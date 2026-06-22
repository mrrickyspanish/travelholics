import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabase } from '@/lib/supabase-server'
import { getDestination } from '@/lib/destinations'
import {
  selectEncyclopediaEntries,
  buildDynamicKnowledgeSection,
  TRIP_PAGE_SYSTEM_PROMPT,
  buildTripPageUserPrompt,
} from '@/lib/encyclopedia'

export const maxDuration = 120

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { destination: slug, region } = await req.json()
  const destination = getDestination(slug)
  if (!destination) {
    return NextResponse.json({ error: `Unknown destination "${slug}"` }, { status: 400 })
  }

  const { data: encyclopediaEntries } = await supabase
    .from('encyclopedia_entries')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  const matched = selectEncyclopediaEntries(encyclopediaEntries ?? [], {
    intent: 'trip_page',
    region: region || undefined,
  })

  if (matched.length === 0) {
    return NextResponse.json({
      portNoteUpdates: [],
      excursionSuggestions: [],
      faqAdditions: [],
      notes: 'No matching encyclopedia entries found. Tag some entries as "Trip Pages" or "Both"' + (region ? ` for "${region}"` : '') + ' before drafting.',
    })
  }

  const systemPrompt = TRIP_PAGE_SYSTEM_PROMPT + buildDynamicKnowledgeSection(matched)
  const userPrompt = buildTripPageUserPrompt(
    destination.name,
    region || undefined,
    destination.portNotes.map((p) => p.port)
  )

  const client = new Anthropic()
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = response.content.find((b) => b.type === 'text')?.text ?? ''
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

  try {
    const draft = JSON.parse(cleaned)
    return NextResponse.json(draft)
  } catch {
    return NextResponse.json({ error: 'Could not parse the draft. Try again.', raw: text }, { status: 502 })
  }
}
