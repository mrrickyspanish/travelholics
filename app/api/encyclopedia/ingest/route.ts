import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabase } from '@/lib/supabase-server'

export const maxDuration = 120

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

Also determine where this knowledge should be used:
- intent "trip_page": factual, decision-useful info about a destination (port logistics, timing, what to book/skip) — belongs on the destination overview page, not a blog post
- intent "blog": personal narrative, opinion, or moment-specific story — belongs in a trip-blog post, not the factual overview page
- intent "both": generic enough to support either
- regions: array of region/sub-region tags this applies to (e.g. "Eastern Caribbean", "Alaska"). Leave empty if not destination-specific (e.g. compliance notes, general vocabulary).

Return ONLY a valid JSON array. No markdown. No code fences. Start with [

Each entry must have:
- category: one of the values above
- title: short descriptive title (5-10 words)
- content: the full entry text (50-300 words)
- confidence: "high", "medium", or "low" based on how clearly it was stated
- excerpt: 1-sentence summary
- intent: "trip_page", "blog", or "both"
- regions: array of strings, can be empty`

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

  const stream = client.messages.stream({
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

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
    cancel() {
      stream.abort()
    },
  })

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
