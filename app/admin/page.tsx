import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import { BookOpen, ClipboardList, FileText, ListTodo, PlusCircle, Upload } from 'lucide-react'

function StatCard({
  href,
  icon,
  label,
  value,
}: {
  href: string
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5 transition-colors hover:border-gray-200 hover:bg-gray-100 active:bg-gray-100"
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs sm:text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
    </Link>
  )
}

export default async function AdminDashboard() {
  const supabase = await createServerSupabase()

  const [
    { count: articleCount },
    { count: encyclopediaCount },
    { count: activeProjectCount },
    { count: openTaskCount },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('encyclopedia_entries').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('content_projects').select('*', { count: 'exact', head: true }).neq('status', 'complete'),
    supabase.from('content_tasks').select('*', { count: 'exact', head: true }).neq('status', 'complete'),
    supabase
      .from('articles')
      .select('id, title, status, topic_cluster, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6 lg:mb-8">Travelholics operations and content engine</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <StatCard href="/admin/planner" icon={<ClipboardList size={16} className="shrink-0 text-[#10755A]" />} label="Active Projects" value={activeProjectCount ?? 0} />
        <StatCard href="/admin/planner" icon={<ListTodo size={16} className="shrink-0 text-[#10755A]" />} label="Open Tasks" value={openTaskCount ?? 0} />
        <StatCard href="/admin/articles" icon={<FileText size={16} className="shrink-0 text-[#10755A]" />} label="Total Articles" value={articleCount ?? 0} />
        <StatCard href="/admin/encyclopedia" icon={<BookOpen size={16} className="shrink-0 text-[#10755A]" />} label="Encyclopedia" value={encyclopediaCount ?? 0} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:gap-3 mb-6 lg:mb-8">
        <Link
          href="/admin/planner"
          className="flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-[#10755A] px-4 py-3 sm:py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] transition-colors"
        >
          <PlusCircle size={16} className="shrink-0" />
          Add Project or Topic
        </Link>
        <Link
          href="/admin/articles/new"
          className="flex items-center justify-center sm:justify-start gap-2 rounded-lg border border-gray-200 px-4 py-3 sm:py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <PlusCircle size={16} className="shrink-0" />
          Generate Article
        </Link>
        <Link
          href="/admin/encyclopedia/ingest"
          className="flex items-center justify-center sm:justify-start gap-2 rounded-lg border border-gray-200 px-4 py-3 sm:py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Upload size={16} className="shrink-0" />
          Import Transcript
        </Link>
        <Link
          href="/admin/encyclopedia/new"
          className="flex items-center justify-center sm:justify-start gap-2 rounded-lg border border-gray-200 px-4 py-3 sm:py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <PlusCircle size={16} className="shrink-0" />
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
                className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.topic_cluster} · {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
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
