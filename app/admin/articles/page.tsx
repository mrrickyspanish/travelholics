import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import { PlusCircle } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-amber-50 text-amber-700',
  archived: 'bg-gray-100 text-gray-500',
}

export default async function ArticlesPage() {
  const supabase = await createServerSupabase()
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, status, topic_cluster, word_count, created_at, is_voice_example')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 text-sm">{articles?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-[#10755A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] transition-colors"
        >
          <PlusCircle size={16} />
          Generate Article
        </Link>
      </div>

      {articles && articles.length > 0 ? (
        <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/admin/articles/${a.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#10755A] transition-colors">
                  {a.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {a.topic_cluster && <span className="mr-2">{a.topic_cluster}</span>}
                  {a.word_count && <span className="mr-2">{a.word_count} words</span>}
                  <span>{new Date(a.created_at).toLocaleDateString()}</span>
                  {a.is_voice_example && (
                    <span className="ml-2 text-[#10755A] font-medium">★ voice example</span>
                  )}
                </p>
              </div>
              <span className={`ml-4 shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[a.status] ?? 'bg-gray-100 text-gray-500'}`}>
                {a.status}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm mb-2">No articles yet.</p>
          <Link href="/admin/articles/new" className="text-sm text-[#10755A] font-medium hover:underline">
            Generate your first article →
          </Link>
        </div>
      )}
    </div>
  )
}
