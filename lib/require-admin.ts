import 'server-only'

import { createServerSupabase } from '@/lib/supabase-server'
import { isAdminEmail } from '@/lib/admin-auth'

export async function requireAdminSession() {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !isAdminEmail(session.user.email)) {
    return null
  }

  return session
}
