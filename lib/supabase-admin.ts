// Importing this module from a Client Component fails the build. Without it,
// a stray client import compiles clean and ships MANAGED_ADMIN_ACCOUNT.id to
// the browser — the service-role key is safe either way (no NEXT_PUBLIC_
// prefix means Next never inlines it), but the account data is not.
import 'server-only'
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
 * The `server-only` import above is the real guard; the runtime check below
 * is a backstop for any path that reaches this function in a browser anyway.
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