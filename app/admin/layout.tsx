import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from './AdminShell'

export const metadata = { title: 'Admin — Travelholics' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Read pathname forwarded by middleware — skip auth check for public admin routes
  // to prevent the redirect loop that causes ERR_TOO_MANY_REDIRECTS
  const headerStore = await headers()
  const pathname = headerStore.get('x-pathname') ?? ''
  if (pathname === '/admin/login' || pathname === '/admin/update-password') {
    return <>{children}</>
  }

  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/admin/login')

  return <AdminShell userEmail={session.user.email ?? ''}>{children}</AdminShell>
}
