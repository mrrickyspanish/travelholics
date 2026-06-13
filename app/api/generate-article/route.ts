import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabase } from '@/lib/supabase-server'
import { buildSystemPrompt, buildUserPrompt, buildFreeWriteUserPrompt } from '@/lib/encyclopedia'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { topicCluster, keyword, scenario, targetLength, brief } = await req.json()

  if (!topicCluster && !brief) {
    return NextResponse.json({ error: 'topicCluster or brief is required' }, { status: 400 })
  }

  // Fetch active encyclopedia entries
  const { data: encyclopediaEntries } = await supabase
    .from('encyclopedia_entries')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  // Fetch up to 3 published voice example articles
  const { data: voiceExamples } = await supabase
    .from('articles')
    .select('title, content')
    .eq('status', 'published')
    .eq('is_voice_example', true)
    .limit(3)

  const systemPrompt = buildSystemPrompt(encyclopediaEntries ?? [], voiceExamples ?? [])
  const userPrompt = brief
    ? buildFreeWriteUserPrompt(brief, targetLength ?? '750-950')
    : buildUserPrompt(topicCluster, keyword ?? '', scenario ?? '', targetLength ?? '750-950')

  const client = new Anthropic()

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
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
