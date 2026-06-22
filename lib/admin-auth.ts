export const ADMIN_EMAILS = ['ricky@creativeeyestudios.com', 'rjsmom1_68@yahoo.com'] as const

export function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? ''
}

export function isAdminEmail(email?: string | null) {
  return ADMIN_EMAILS.includes(normalizeEmail(email) as (typeof ADMIN_EMAILS)[number])
}
