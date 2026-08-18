import { randomBytes } from 'node:crypto'

// Mirrors the CHECK constraint on public.short_links.slug.
const SLUG_PATTERN = /^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$/

export function isValidSlug(slug: string) {
  return SLUG_PATTERN.test(slug)
}

export function normalizeSlug(input: string) {
  return input.trim().toLowerCase()
}

const RANDOM_SLUG_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

/** A short, URL-safe slug for links created without a custom one. */
export function generateRandomSlug(length = 7) {
  const bytes = randomBytes(length)
  let slug = ''
  for (let i = 0; i < length; i++) {
    slug += RANDOM_SLUG_ALPHABET[bytes[i] % RANDOM_SLUG_ALPHABET.length]
  }
  return slug
}

export function isValidDestinationUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function buildShortUrl(slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yotravelholic.com'
  return `${siteUrl}/s/${slug}`
}
