# Travelholics — Agent Notes

Cruise planning site for Yolanda Harris (Certified Cruise Specialist), plus a shop, blog,
and a Group Trip / Trip Hub system. Stack: Next.js 16 (App Router), React 19, TypeScript,
Tailwind CSS v4, Framer Motion, Supabase, Stripe, deployed on Vercel.

## Hard bans — treat these as non-negotiable, not preferences to weigh case by case

### No orphaned words in headlines, ever

A single word stranded alone on the last line of a heading or subhead is never shippable.
This is the single most-reported issue on this project. It is not a nitpick.

- `text-wrap: balance` is applied to every `h1`/`h2`/`h3` site-wide in `app/globals.css`.
  That handles most cases automatically. **Do not remove it.**
- Balance cannot save a heading whose container is too narrow for the copy. When the last
  line would hold one word, fix it by: widening the container (`max-w-[Nch]` caps are the
  usual culprit — `ch` units scale with font size, so a tight cap forces bad wraps at every
  size), lowering the font size, adding a deliberate `<span className="block">` break at a
  sensible point, or rewording. **Reword only with the owner's sign-off — the copy is theirs.**
- **Verify the rendered wrap, do not eyeball the markup.** Run `npm run check:orphans`
  (dev server must be running). It checks the homepage at eleven widths from 320 to
  1920px and group cruises at 390 / 768 / 1024 / 1440.
- Avoid excessive headline stacking as well as orphans. Homepage section headlines
  must fit within two rendered lines. Give long introductions more width, especially
  on tablets, and scale phone type to the available space. The same checker enforces
  this limit; do not shorten the owner's copy or add forced breaks to satisfy it.
- Any change to a headline's font size, `max-w-[Nch]`, `leading`, or copy changes its wrap.
  Re-run the check after those edits — including changes that only *look* like they affect
  desktop, because `mobile-polish.css` sizes some headings independently.
- A deliberate `<br />` (e.g. `Eastern Caribbean<br />2027`, where the year is meant to sit
  alone) is a designed stack, not an orphan. The checker flags it; that one is a known
  false positive. Do not "fix" it.

### Typography minimums

- Body copy: 18px (`text-lg`) at every width. Do not drop body paragraphs to `text-base`
  on mobile — 16px reads as fine print on a phone.
- Form field labels: 16px (`text-base`) minimum.
- **Nothing renders below 14px.** `app/globals.css` has a base-layer guardrail that
  force-bumps `text-xs` and any `text-[1px]`–`text-[13px]` arbitrary class up to 14px.
  If you find yourself fighting it, the size is too small.
- The guardrail is a set of attribute selectors, so it only sees class names. It cannot
  see a raw `font-size` in a stylesheet, an arbitrary rem value, or an inline style —
  and all three have shipped violations here (a `0.62rem` figcaption in
  `mobile-polish.css`, a `text-[9px]` label that sat *below* the guardrail's old range,
  and a `text-xs` submit button). **Verify with `npm run check:type-floor`**, which
  measures what actually renders, across 7 pages at 390 / 768 / 1440.
- Deliberate exceptions go in that script's `ALLOWED` list with a reason, not into the
  page. There is one today: the cart count inside its 16px circle.

### Headline sizing

Headlines are large and editorial by design, but `vw`-driven `clamp()` with a high cap
balloons on wide monitors and reads as obnoxious rather than confident. Current ceilings,
which should not creep back up:

- Hero `h1`: `clamp(3.4rem, 7vw, 6.75rem)` — about 100px at 1440.
- Section `h2`: `clamp(2.6rem, 4.2vw, 4.5rem)` — about 60px at 1440.
- Homepage section headlines use the tighter 40px ceiling in `app/home.css`.
  Preserve that scale; the larger ceiling above applies to other page layouts.

### Homepage section density

The owner's reference is Evyssa Vacations' compact editorial presentation. Use
introductions beside image cards and small review portraits. The group panel spans
the desktop width and stays contained on phones; contact stays contained. Do not reduce
body-copy sizes to fit. `npm run check:home-ux` checks section-height budgets and
that every process card remains reachable with native scrolling and controls.
The process rail has no visible scrollbar or counter. Its previous/next controls sit
below the cards so each phone card fills the content width. Keep touch targets at
least 44px and keyboard scrolling intact.

The latest owner refinement adds breathing room around those compact layouts,
sea-glass and pale coral fields, and a shallow coastal-image pause after the
process section. Its native source is 4096px wide; do not substitute a soft video
or upscale a small still. Keep the group-cruise hero as a photo. Desktop major topics
get 74svh of space so the next topic appears as a preview. Growth follows scroll
position from 94% on desktop (97% on phones) to full size as the topic reaches the
main viewport; settled sections stay full size. Do not reintroduce opacity fades.
Reduced motion uses full-size content and a static coastal image.

## Mobile styling lives in a separate stylesheet

`app/mobile-polish.css` (imported by both `app/page.tsx` and `app/group-cruises/page.tsx`)
overrides heading sizes and section spacing under 768px using `!important` and deep
`nth-child`/`nth-of-type` selectors scoped to `.home-mobile-optimized` /
`.group-cruise-mobile-optimized`.

Consequences to keep in mind:

- **Changing a heading's Tailwind classes often has no effect on mobile** — the stylesheet
  wins. Check both places.
- Those `nth-child` chains are positional and brittle. Reordering or nesting sections in
  `app/page.tsx` will silently repoint them at the wrong elements. If you reorder sections,
  re-verify mobile.

## Layout gotcha that has already bitten once

Do not put `ml-auto` / `mr-auto` on a grid item whose only content is an absolutely
positioned `<Image fill>`. The item has no in-flow content to size against, the auto margin
absorbs all the free space, and the element collapses to zero width — the image renders
invisibly and leaves a dead gap. Use explicit placement (`col-start-N`) instead.

## Sticky CTAs

The homepage has no floating booking bar. The owner's latest mobile review removed
it because it covered photos and competed with in-page planning buttons.

Both sticky mobile CTAs must clear the iOS home indicator. Use
`env(safe-area-inset-bottom)` (see `components/mobile-cta.tsx` and
`components/group-cruise-hero-minimal.tsx`), never a flat `bottom-4`.

`components/mobile-cta.tsx` hides itself as `#contact` approaches so it never covers the
form. Preserve that behavior in any new sticky bar.

## Group cruise page structure

`app/group-cruises/page.tsx` owns the main landmark. Its visible hero and only mobile
sticky CTA live in `components/group-cruise-hero-minimal.tsx`. The sections below the hero
live in `components/group-cruise-story.tsx`; do not add a second hero or sticky CTA there.

## Local dev

Supabase env vars are required for `/trips/[slug]` (Trip Hub) to render real data. Without
them the homepage and `/group-cruises` still render fine, which is enough for visual QA.

## Workflow

- Never push to a branch other than the one specified for the current task without explicit
  permission.
- Don't open a pull request unless explicitly asked to.
