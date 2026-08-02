export const ADMIN_EMAILS = ['ricky@creativeeyestudios.com', 'rjsmom1_68@yahoo.com', 'info@yotravelholic.com'] as const

// Owners are admins who may also manage other admins' accounts.
export const OWNER_EMAILS = ['ricky@creativeeyestudios.com'] as const

export function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? ''
}

export function isAdminEmail(email?: string | null) {
  return ADMIN_EMAILS.includes(normalizeEmail(email) as (typeof ADMIN_EMAILS)[number])
}

export function isOwnerEmail(email?: string | null) {
  return OWNER_EMAILS.includes(normalizeEmail(email) as (typeof OWNER_EMAILS)[number])
}
