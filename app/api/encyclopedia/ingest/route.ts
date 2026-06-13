import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabase } from '@/lib/supabase-server'

export const maxDuration = 60

const INGEST_SYSTEM_PROMPT = `You are extracting knowledge from a transcript or notes provided by Yolanda Harris of Travelholics.

Extract structured knowledge entries that can be used to improve AI-generated articles written in Yolanda's voice.

For each entry, determine the best category:
- story: A specific travel story or experience Yolanda describes
- quote: A memorable phrase or exact quote from Yolanda
- client_scenario: A real client situation or booking outcome
- stat: A number, statistic, or factual data point
- vocabulary: A cruise/travel term and how Yolanda defines or uses it
- compliance_note: Any legal, regulatory, or disclosure information
- topic_guidance: Guidance on how to approach a specific topic

Return ONLY a valid JSON array. No markdown. No code fences. Start with [

Each entry must have:
- category: one of the values above
- title: short descriptive title (5-10 words)
- content: the full entry text (50-300 words)
- confidence: "high", "medium", or "low" based on how clearly it was stated
- excerpt: 1-sentence summary`

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { transcript, source } = await req.json()

  if (!transcript) {
    return NextResponse.json({ error: 'transcript is required' }, { status: 400 })
  }

  const client = new Anthropic()

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    system: INGEST_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Extract knowledge entries from this transcript:\n\nSource: ${source ?? 'Unknown'}\n\n${transcript}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '[]'

  let entries: unknown[]
  try {
    // Strip code fences defensively
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    entries = JSON.parse(cleaned)
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response', raw }, { status: 500 })
  }

  return NextResponse.json({ entries })
}
