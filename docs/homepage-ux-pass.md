**Homepage UX tasks**

Business direction: group cruises retain the primary hero action because they are
Yolanda's strongest profit opportunity. Family and couple planning retains a clear
secondary action, equal-width on phones, leading to homepage contact. Group
planning continues to its dedicated `/group-cruises` journey.

- [x] **Phase 1 — Essential usability.** Visible arrival navigation; consistent
  general-planning destination; menu focus containment and Escape/return focus;
  URL-safe video blurbs with word-boundary regression fixtures; visible reading
  content without JavaScript and under reduced motion.
- [x] **Phase 2 — Structure and trust.** One destination shelf, Yolanda earlier,
  one proof set, testimonials followed by cruise-line credibility, and a compact
  shop after contact. Retained both destination fragment targets and `#proof`.
- [x] **Phase 3 — Responsive layout and forms.** Clean group collage, compact
  quotes and video companions, improved mobile hero framing, 44px hit areas,
  autocomplete and field errors, retained inputs on failure, focused confirmation,
  and a sticky action that stays clear of hero/contact and stays off after contact.
- [x] **Phase 4 — Restrained motion.** Once-only visible-first reveals on two
  lower-page introductions, a decorative underline entrance and small hover
  feedback. No counters, marquee, parallax or image zoom. Reduced motion also
  disables confetti. Headline and priority image stay visible at first paint.
- [x] **Phase 5 — Acceptance.** Production build, TypeScript, address/growth,
  headline/type-floor and browser checks pass. Automated accessibility scans
  report zero violations at 390px and 1440px. Matched performance budgets pass.

**Reproduce the checks**

Start the app in production mode with the usual environment variables available:

```bash
npm ci
npm run build
npm run start
```

In cloud machines whose native Node fetch requires the platform proxy, prefix
build/start with `NODE_USE_ENV_PROXY=1`. In another terminal:

```bash
npm run check:address
npm run check:growth
npm run check:home-ux
npm run check:orphans
npm run check:type-floor
npx tsc --noEmit
```

Playwright is pinned as a development dependency. Install its Chromium once with
`npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_PATH` to an existing
system Chromium. The homepage browser check covers seven viewport widths,
keyboard/menu focus, sticky controls, no-JavaScript content, reduced motion,
contact validation and simulated delivery failure/retry, campaign continuity,
click-to-play and shared-page navigation. Database/email submissions and the
embedded player response are intercepted; the check does not send live leads.

The broader type-floor check discovered an existing 12px “Featured” label on the
blog. That single label now uses 14px; no blog copy or behavior changed. Generated
validation outputs are excluded from lint. Existing unrelated lint errors remain;
changed files are lint-clean.

The contact headline and existing 24-hour response wording remain unchanged.
Replacement marketing copy was not invented. No checkout, USPS, database schema,
email backend, or group-cruise booking logic was changed. No production deployment
or pull request is part of this local implementation.

**Measured result**

These measurements describe the first UX pass. The compact reference-driven
revision below supersedes them for the current homepage.

| Viewport | Before height | After height | Portrait now starts |
|---|---:|---:|---:|
| 390×844 | 12,541px | 9,472px | 1,557px |
| 768×900 | 14,669px | 9,306px | 1,471px |
| 1440×900 | 11,532px | 7,825px | 1,393px |

**Matched performance runs**

Three Lighthouse mobile runs per build, same local production server settings and default mobile simulation: median performance 82 → 83; median LCP 4.82s → 4.61s. CLS is zero in all after runs. The three-point non-regression, LCP and CLS budgets pass. These are local production-mode results, not field measurements from the deployed site.

The form and player checks use intercepted responses. External YouTube thumbnail requests were denied by the environment proxy; live playback remains unverified. Full-repository lint reports 31 existing errors and 9 warnings outside the changed source files.

**Owner follow-up — headline wrapping and group hero**

- Removed narrow headline caps in the service, group-cruise and contact introductions.
  Long testimonial copy uses the full section width; introductory columns start at
  desktop instead of squeezing tablet headlines. Phone sizes adapt to available width.
  All homepage section headlines are limited to two rendered lines without copy changes.
- Extended `check:orphans` to detect excessive homepage section-headline wrapping
  at eleven widths from 320 to 1920px, alongside the existing orphan checks.
- Replaced the group-cruise hero video with its original group photo. Removed video
  playback code and controls; the hero no longer requests video media.

**Owner follow-up — compact editorial layout**

Reference: https://www.evyssavacations.com/ and the owner's side-by-side process
screenshots. The direction is denser, image-led presentation using Travelholics'
existing voice, coral, deep green and royal ink.

- Rebuilt the process section as an introduction beside numbered photo cards.
  Native scrolling, arrow buttons and keyboard navigation expose all three steps;
  reduced motion uses immediate scrolling. The repeated closing no-fees message is
  consolidated into the existing explanation of supplier-paid planning support.
- Reviews use small portraits and compact quotes, with a phone rail instead of two
  stacked panels. The group-cruise collage and contact form sit in contained panels.
  Video lessons sit beside their introduction and short companions on tablet/desktop.
- Reduced section headline sizes, oversized photography and vertical spacing.
  Preserved the group-cruise hero priority and the general family/couple inquiry path.
  Body copy remains 18px; field labels remain 16px; no text drops below 14px.
- Extended rendered heading checks to marked visual subheads as well as h1/h2/h3.
  Added section-height budgets and carousel reachability/keyboard checks to the
  browser suite. These prevent oversized sections returning unnoticed.
- Corrected the live-show header's coral-background theme to use dark text and
  icons; the upcoming-show dark header and transparent hero keep white text.

Measured locally in production at 900px viewport height:

| Viewport width | Before | Current | Reduction |
|---|---:|---:|---:|
| 390px | 9,317px | 8,148px | 13% |
| 768px | 9,342px | 6,253px | 33% |
| 1440px | 7,889px | 5,834px | 26% |

At 1440px, process is 797 → 480px, reviews 932 → 509px, group cruises
588 → 408px, and video content 1,386 → 679px. Phone process is 1,173 → 848px.
The inquiry form remains the longest phone section because all fields remain visible.

The earlier Lighthouse measurements belong to the first pass; they were not rerun
for this revision. Current acceptance uses the production build, rendered browser
checks, headline/type-floor checks and automated accessibility scans. No production
deployment or pull request was made.

Final automated accessibility scans report zero violations at 390, 768 and 1440px, including live, upcoming-show and offline header themes.

**Owner refinement — breathing room, color and visible entrance motion**

The owner accepted the compact layouts and requested more separation, brand color,
an ocean-video break, and sections visibly growing to full size as they enter view.
This direction supersedes the earlier no-parallax motion treatment above.

- Added 16–24px of space per section edge while preserving the compact content
  arrangements. Yolanda's section uses sea-glass; reviews use a pale coral field.
- Added one shallow ocean divider after the process section: 168px on phones,
  about 259px at 1440px, capped at 320px. It reuses the existing `/go` shoreline
  footage, reframed for a wide strip, compressed, and stripped of audio. Source:
  `lib/travelholics-launch.ts` → `backgroundVideoSrc`. The new public assets are
  `videos/ocean-shoreline.mp4` and `images/ocean-shoreline.webp`.
- Video loads only when visible, pauses offscreen or in background tabs, and has
  a manual play/pause control whose paused state survives scrolling away/back.
  A gentle scroll-linked media offset adds depth in supporting browsers.
- Every content section after the hero grows once from 97% to 100% as it reaches
  the main viewport. Content remains opaque and readable. Focus immediately
  settles the section. No layout dimensions change during the effect.
- Reduced motion and no JavaScript keep full-size content and the still ocean
  image. Motion preference changes stop active effects and playback immediately.
  The group-cruise hero remains photo-only.

At a 900px viewport height, the homepage measures 8,540px at 390px width, 6,709px
at 768px, and 6,381px at 1440px. The new 1440px process section is 528px tall;
the previous oversized version was 797px. Updated total-height budgets account
for the requested spacing and one divider; per-section limits remain compact.
