# Cruise line logos

Drop approved logo files here and reference them from `logo:` in
`components/cruise-line-strip.tsx`. A line with no `logo` falls back to a
styled wordmark, so the strip renders correctly at every stage of filling
this folder in — you do not have to collect all six before shipping one.

## What to get

Each line publishes assets through its travel-advisor / partner portal or a
press-and-media kit. As an authorized advisor Yolanda should be able to pull
these; a logo scraped off a web page is not an approved asset and usually
breaches the brand terms.

- Royal Caribbean, Celebrity — Royal Caribbean Group media centre
- Norwegian — NCL partner / press assets
- Virgin Voyages — First Mates / press kit
- MSC — MSC Book partner portal
- Carnival — Carnival press and brand assets

## Requirements

- **SVG preferred**, PNG at 3x the rendered height otherwise. The strip
  renders them ~28px tall, so PNG wants ~84px of real height.
- **Monochrome or single-colour variant**, where the brand provides one.
  Several of these brands prohibit altering the mark, so the component
  deliberately applies no CSS filter — it will not recolour a full-colour
  logo into something the brand terms do not allow. Supply the approved
  mono file rather than relying on CSS to fake it.
- Trim surrounding whitespace from the file. The strip handles spacing, and
  baked-in padding makes one logo look smaller than its neighbours.
- Name files by slug: `royal-caribbean.svg`, `celebrity.svg`,
  `norwegian.svg`, `virgin-voyages.svg`, `msc.svg`, `carnival.svg`.

## Check before shipping

Confirm the strip only names lines Yolanda is actually authorized to sell.
The heading claims first-hand knowledge of these ships; listing a line she
cannot book is a claim worth not making.
