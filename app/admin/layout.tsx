import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { isAdminEmail } from '@/lib/admin-auth'
import AdminShell from './AdminShell'

export const metadata = { title: 'Admin — Travelholics' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers()
  const pathname = headerStore.get('x-pathname') ?? ''
  if (pathname === '/admin/login' || pathname === '/admin/update-password') {
    return <>{children}</>
  }

  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session || !isAdminEmail(session.user.email)) redirect('/admin/login')

  return <AdminShell userEmail={session.user.email ?? ''}>{children}</AdminShell>
}
