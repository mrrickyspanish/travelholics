import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import { CATEGORY_CONFIG } from '@/types/encyclopedia'
import type { EncyclopediaCategory } from '@/types/encyclopedia'
import { Upload, PlusCircle } from 'lucide-react'

export default async function EncyclopediaPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = await createServerSupabase()
  const activeCategory = searchParams.category as EncyclopediaCategory | undefined

  const [{ data: entries }, { data: counts }] = await Promise.all([
    supabase
      .from('encyclopedia_entries')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase.from('encyclopedia_entries').select('category'),
  ])

  // Build per-category counts
  const categoryCounts = (counts ?? []).reduce<Record<string, { total: number; active: number }>>(
    (acc, e: { category: string; active?: boolean }) => {
      if (!acc[e.category]) acc[e.category] = { total: 0, active: 0 }
      acc[e.category].total++
      return acc
    },
    {}
  )

  const { data: activeCounts } = await supabase
    .from('encyclopedia_entries')
    .select('category')
    .eq('active', true)

  ;(activeCounts ?? []).forEach((e: { category: string }) => {
    if (!categoryCounts[e.category]) categoryCounts[e.category] = { total: 0, active: 0 }
    categoryCounts[e.category].active++
  })

  const filtered = activeCategory
    ? (entries ?? []).filter((e) => e.category === activeCategory)
    : (entries ?? [])

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Encyclopedia</h1>
          <p className="text-gray-500 text-sm">Yolanda&apos;s knowledge base — used to improve every article</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/encyclopedia/ingest"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Upload size={15} />
            Import Transcript
          </Link>
          <Link
            href="/admin/encyclopedia/new"
            className="flex items-center gap-2 rounded-lg bg-[#10755A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] transition-colors"
          >
            <PlusCircle size={15} />
            Add Entry
          </Link>
        </div>
      </div>

      {/* How it works callout */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 px-5 py-4 mb-6 text-sm text-blue-700">
        <strong>How this works:</strong> Every active entry is injected into the AI prompt before an article is generated. The more context Yolanda adds here, the less the articles sound like AI.
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/encyclopedia"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !activeCategory ? 'bg-[#10755A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({entries?.length ?? 0})
        </Link>
        {Object.entries(CATEGORY_CONFIG).map(([cat, config]) => {
          const count = categoryCounts[cat]
          return (
            <Link
              key={cat}
              href={`/admin/encyclopedia?category=${cat}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#10755A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {config.icon} {config.label}
              {count && <span className="ml-1 opacity-60">{count.active}/{count.total}</span>}
            </Link>
          )
        })}
      </div>

      {/* Entries */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((entry) => {
            const config = CATEGORY_CONFIG[entry.category as EncyclopediaCategory]
            return (
              <Link
                key={entry.id}
                href={`/admin/encyclopedia/${entry.id}`}
                className={`flex items-start gap-4 rounded-xl border border-gray-100 px-5 py-4 hover:border-gray-200 hover:bg-gray-50 transition-colors ${
                  !entry.active ? 'opacity-50' : ''
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{config?.icon ?? '📝'}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{entry.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config?.bg ?? 'bg-gray-50'} ${config?.color ?? 'text-gray-600'}`}>
                      {config?.label ?? entry.category}
                    </span>
                    {!entry.active && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{entry.excerpt ?? entry.content}</p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm mb-2">No entries yet.</p>
          <Link href="/admin/encyclopedia/new" className="text-sm text-[#10755A] font-medium hover:underline">
            Add your first entry →
          </Link>
        </div>
      )}
    </div>
  )
}
