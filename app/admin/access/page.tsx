import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { isOwnerEmail } from '@/lib/admin-auth'
import { MANAGED_ADMIN_ACCOUNT } from '@/lib/supabase-admin'
import PasswordResetForm from './PasswordResetForm'

export const metadata = { title: 'Admin Access — Travelholics' }

export default async function AdminAccessPage() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Hiding the nav link is not security — re-check on the server.
  if (!user || !isOwnerEmail(user.email)) redirect('/admin')

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Access</h1>
      <p className="text-gray-500 text-sm mb-6">Set a new password for an admin account.</p>

      <PasswordResetForm
        accountName={MANAGED_ADMIN_ACCOUNT.name}
        accountEmail={MANAGED_ADMIN_ACCOUNT.email}
      />
    </div>
  )
}
