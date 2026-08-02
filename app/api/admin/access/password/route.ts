import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { isOwnerEmail, normalizeEmail } from '@/lib/admin-auth'
import { createSupabaseAdmin, MANAGED_ADMIN_ACCOUNT } from '@/lib/supabase-admin'

// Middleware only guards /admin/*, so this route authorizes itself.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MIN_PASSWORD_LENGTH = 8

const COMMON_PASSWORDS = new Set([
  '12345678',
  '123456789',
  '1234567890',
  'password',
  'password1',
  'password12',
  'password123',
  'passw0rd',
  'qwertyui',
  'qwerty123',
  'letmein1',
  'letmein123',
  'iloveyou',
  'welcome1',
  'welcome123',
  'admin123',
  'abc12345',
  'travelholics',
  'yotravelholic',
])

function passwordProblem(password: string, confirmPassword: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.'
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase()) || /^(.)\1+$/.test(password)) {
    return 'That password is too easy to guess. Pick something less common.'
  }
  return null
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()

  // getUser() validates the token with Supabase rather than trusting the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isOwnerEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const payload = (body ?? {}) as Record<string, unknown>
  const targetEmail = normalizeEmail(
    typeof payload.targetEmail === 'string' ? payload.targetEmail : ''
  )
  const password = typeof payload.password === 'string' ? payload.password : ''
  const confirmPassword =
    typeof payload.confirmPassword === 'string' ? payload.confirmPassword : ''

  if (targetEmail !== MANAGED_ADMIN_ACCOUNT.email) {
    return NextResponse.json({ error: 'That account cannot be managed here.' }, { status: 403 })
  }

  const problem = passwordProblem(password, confirmPassword)
  if (problem) {
    return NextResponse.json({ error: problem }, { status: 400 })
  }

  const supabaseAdmin = createSupabaseAdmin()

  // Confirm the stored id still belongs to the expected account before writing.
  const { data: target, error: lookupError } = await supabaseAdmin.auth.admin.getUserById(
    MANAGED_ADMIN_ACCOUNT.id
  )
  if (lookupError || !target?.user) {
    return NextResponse.json({ error: 'Could not load that account.' }, { status: 500 })
  }
  if (normalizeEmail(target.user.email) !== MANAGED_ADMIN_ACCOUNT.email) {
    return NextResponse.json({ error: 'Could not load that account.' }, { status: 500 })
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    MANAGED_ADMIN_ACCOUNT.id,
    { password }
  )
  if (updateError) {
    // Deliberately generic: never surface or log anything derived from the password.
    return NextResponse.json({ error: 'Could not update the password. Try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
