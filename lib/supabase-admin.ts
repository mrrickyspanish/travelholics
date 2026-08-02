import { createClient } from '@supabase/supabase-js'

/**
 * The admin account an owner can manage from /admin/access. The Supabase user
 * id stays here on the server — it is never typed in, shown, or posted by the
 * browser.
 */
export const MANAGED_ADMIN_ACCOUNT = {
  id: '6e901a7e-9fa2-4c9a-b9ef-cd32882af102',
  name: 'Yolanda',
  email: 'rjsmom1_68@yahoo.com',
} as const

/**
 * Service-role Supabase client for privileged auth operations.
 *
 * Server-only. `SUPABASE_SERVICE_ROLE_KEY` has no `NEXT_PUBLIC_` prefix, so
 * Next never inlines it into a client bundle; the guard below turns an
 * accidental client-side import into a loud failure instead of a silently
 * keyless client.
 */
export function createSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('createSupabaseAdmin() must only be called on the server.')
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
