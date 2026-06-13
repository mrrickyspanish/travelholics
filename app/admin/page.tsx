import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import { FileText, BookOpen, PlusCircle, Upload } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createServerSupabase()

  const [{ count: articleCount }, { count: encyclopediaCount }, { data: recentArticles }] =
    await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('encyclopedia_entries').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase
        .from('articles')
        .select('id, title, status, topic_cluster, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Travelholics Article Engine</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-center gap-3 mb-1">
            <FileText size={18} className="text-[#10755A]" />
            <span className="text-sm font-medium text-gray-600">Total Articles</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{articleCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-center gap-3 mb-1">
            <BookOpen size={18} className="text-[#10755A]" />
            <span className="text-sm font-medium text-gray-600">Encyclopedia Entries</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{encyclopediaCount ?? 0}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-[#10755A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] transition-colors"
        >
          <PlusCircle size={16} />
          Generate Article
        </Link>
        <Link
          href="/admin/encyclopedia/ingest"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Upload size={16} />
          Import Transcript
        </Link>
        <Link
          href="/admin/encyclopedia/new"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <PlusCircle size={16} />
          Add Encyclopedia Entry
        </Link>
      </div>

      {/* Recent articles */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Articles</h2>
        {recentArticles && recentArticles.length > 0 ? (
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
            {recentArticles.map((a) => (
              <Link
                key={a.id}
                href={`/admin/articles/${a.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.topic_cluster} · {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    a.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : a.status === 'archived'
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {a.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-400">No articles yet.</p>
            <Link href="/admin/articles/new" className="text-sm text-[#10755A] font-medium hover:underline mt-1 block">
              Generate your first article →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
