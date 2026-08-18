// Client-safe (no node built-ins) so it can run in the admin's "Duck Hunt QR"
// form as well as on the server. Builds a short link's slug/destination/label
// from structured campaign fields instead of a free-typed URL, so every duck
// QR carries ship + sailing + duck number in a consistent, parseable shape.

export interface DuckHuntQrInput {
  ship: string
  sailDate: string // YYYY-MM-DD
  duckNumber: string
  batch?: string
}

export function slugify(value: string, maxLength = 40) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}

export function buildDuckHuntLink(input: DuckHuntQrInput, siteUrl: string) {
  const shipSlug = slugify(input.ship, 30)
  const duckSlug = slugify(input.duckNumber, 12)
  const dateCompact = input.sailDate.replace(/-/g, '').slice(2) // YYMMDD

  const slug = ['duck', shipSlug, dateCompact, duckSlug].filter(Boolean).join('-')

  const destination = new URL('/duck-hunt', siteUrl)
  if (shipSlug) destination.searchParams.set('ship', shipSlug)
  if (input.sailDate) destination.searchParams.set('cruise', input.sailDate)
  if (input.duckNumber) destination.searchParams.set('duck', input.duckNumber)
  if (input.batch) destination.searchParams.set('batch', input.batch)
  destination.searchParams.set('source', 'qr-duck-hunt')

  const label = [
    input.ship || null,
    input.sailDate || null,
    input.duckNumber ? `Duck #${input.duckNumber}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return {
    slug,
    label,
    destinationUrl: destination.toString(),
    metadata: {
      campaign: 'duck-hunt' as const,
      ship: input.ship,
      ship_slug: shipSlug,
      sail_date: input.sailDate,
      duck_number: input.duckNumber || null,
      batch: input.batch || null,
    },
  }
}
