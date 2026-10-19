# Travelholics — Homepage Audit & Recommendations

**Date:** 2026-10-19
**Build audited:** `4ac9de3` (branch `ccr-d2a520ba-bh9eu8`, on top of `main` @ `078f2fd`)
**Method:** Rendered measurement via Playwright at 390 / 768 / 1024 / 1440. Every number
below is measured from the live DOM, not estimated from markup.

---

## 1. Duck Hunt address verification — status

### ✅ Migration verified

The migration could not be checked against the production database from this session —
the Travelholics Supabase project is not on this MCP connection, and there are no local
credentials. **Instead it was verified by running it for real**: a throwaway PostgreSQL 16
instance was created, both Duck Hunt migrations applied in order, and the code's actual
insert payloads exercised against the result.

| Check | Result |
|---|---|
| `20260819000000_add_duck_hunt_shipping_address.sql` applies | ✅ |
| `20261011120000_add_duck_hunt_address_verification.sql` applies | ✅ |
| Columns created: `address_verification` TEXT, `address_verified_at` TIMESTAMPTZ | ✅ |
| Partial index `… WHERE address_verification IS DISTINCT FROM 'verified'` created | ✅ |
| Both migrations re-runnable (`IF NOT EXISTS` throughout, no error on second apply) | ✅ |
| Insert with `verified` | ✅ |
| Insert with `unconfirmed_accepted` | ✅ |
| Insert with columns omitted (check did not run) | ✅ |
| Shipping queue returns `unconfirmed_accepted` **and** NULL rows, excludes `verified` | ✅ |
| Planner actually uses the partial index for the queue query | ✅ (Bitmap Index Scan) |

The schema and the code agree. Nothing in the migration blocks a claim.

### 🔴 The credentials would not have worked — fixed

The keys were added to Vercel as **`USPS_CONSUMER_KEY`** / **`USPS_CONSUMER_SECRET`**
(production + preview). `lib/usps-address.ts` was reading **`USPS_CLIENT_ID`** /
**`USPS_CLIENT_SECRET`**.

The names never matched, so the lookup found nothing. Because the integration **fails open
by design** — so a USPS outage can never block a claim — this would have been silent:
every address recorded as unchecked, no error, no log, nothing visible in the UI. The
address problem would have appeared solved and would not have been.

Fixed in `4ac9de3`: the consumer names are read first, with the old pair kept as a
fallback. README and the module header updated to match. The Vercel naming was the correct
one — developer.usps.com issues these as "Consumer Key" and "Consumer Secret".

### ⚠️ Known gap: `unchecked` is never literally stored

The migration documents three values (`verified`, `unconfirmed_accepted`, `unchecked`), but
the code never writes `unchecked` — when the check does not run it omits both columns, so
the row keeps NULL. That was a deliberate choice to decouple the deploy from the migration.

**Operationally this is fine**: NULL satisfies `IS DISTINCT FROM 'verified'`, so those rows
still appear in the shipping queue (verified above).

**But** NULL now conflates two different things: "the check ran and could not reach USPS"
and "this row predates the feature". Now that the migration is applied, that decoupling is
no longer needed.

**Recommendation:** write `'unchecked'` explicitly. One-line change, makes the data
self-describing. Left unchanged pending your call, because it trades a small clarity win
for a real failure mode — if a pre-migration database is ever restored, an explicit write
fails the insert and breaks claims, whereas today's omission does not.

### 📋 Still needs you

- [ ] **Confirm the six cruise lines are ones Yolanda is authorised to sell.** Virgin
      Voyages was missing from `logos.zip`; Princess was substituted. Not verified by me.
- [ ] **End-to-end USPS test in production.** The credential fix is deployed in code but
      has never made a live call from this session — no keys available here. Submit one
      real Duck Hunt claim and confirm the row lands with `address_verification = 'verified'`.
      Until that happens the integration is *configured*, not *proven*.

---

## 2. Homepage — measured state

**Total page: 11,357px at 1440 — 12.6 screens.** The page got ~1,850px *longer* since the
last audit: removing the map saved 696px, `#videos` added 2,091px.

| Section | Height | Vertical padding | Padding as % |
|---|---:|---:|---:|
| `#videos` | **2,091** | 256 | 12% |
| `#testimonials` | **1,571** | 256 | 16% |
| `#group-trips` | 1,100 | 256 | 23% |
| `#destination-discovery` | 1,074 | 256 | 24% |
| `#how-it-works` | 948 | 256 | 27% |
| `#shop-strip` | 895 | 256 | 29% |
| `#contact` | 883 | 0 | — |
| `#hero` | 864 | 0 | — |
| `#about` | **606** ✅ | 192 | 32% |
| `#proof` | 267 | 0 | — |
| `#adventure-shelf` | 217 | 0 | — |
| `#cruise-lines` | 210 | 88 | 42% |

Section padding totals 1,816px — 17% of all section height. Real, but not the main problem.

---

## 3. Findings, ranked

### 🔴 P1 — `#videos`: 776px of empty column

The main grid is `lg:grid-cols-[1.55fr_.45fr]`, 1,632px tall. Measured:

- **Left column** (featured 16:9 video + title + blurb, 986px wide): content ends at **+856px**
- **Right rail** (3 stacked vertical shorts, 286px wide): content runs the full **1,632px**

Three 9:16 shorts stacked in a narrow rail are ~523px each. They set the section's height,
and the left column — the actual main content — is empty for its bottom **776px**.

This is the same structural failure already fixed in `#about`: *content sized to fill a
column instead of the column sized to content.* It is now the single largest waste on the page.

Note the irony: **mobile is already correct.** Below `lg` the shorts render `grid-cols-3`,
three across. Only the desktop layout stacks them.

**Recommendation:** run the shorts as a horizontal row beneath the featured video at
desktop too, matching mobile. Expected saving ~700–800px with no content removed.

### 🔴 P1 — `#videos`: a raw tracking URL is rendering as body copy

The featured video blurb currently reads, verbatim on the live homepage:

> Need help matching the ship to your people? Plan with Yolanda:
> `https://yotravelholic.com/group-cruises?utm_source=youtube&utm_medium=video&…`

Cause: `firstLine()` in `lib/youtube.ts` takes the first non-empty line of the YouTube
description as-is and hard-truncates at 140 characters — which lands mid-URL, hence the
trailing `…`. It is a YouTube description pasted straight onto the site.

This is a copy and credibility bug on the highest-traffic page, and it will recur on every
new upload whose description opens with a link.

**Recommendation:** strip URLs in `firstLine()` before truncating, and truncate on a word
boundary. Small, contained fix in `lib/youtube.ts`.

### 🟠 P2 — `#testimonials`: 1,571px for two quotes

Second-tallest section, 2.6× the rebuilt `#about`, carrying two testimonial cards and a
single heading. Lowest content-to-height ratio on the page after `#videos`.

**Recommendation:** tighten to roughly the `#about` treatment. Either run the two quotes
side by side at desktop, or add a third so the height is doing work. Worth ~600px.

### 🟠 P2 — `#group-trips`: 1,100px, left-column dead space

Same pattern as `#about` and `#videos`. Not yet measured in detail; flagged as the next
instance of the recurring problem rather than a new one.

### 🟡 P3 — `#destination-discovery`: 1,074px, unchanged by `7d08c59`

The "simplify destination discovery" commit did not move the section's height. Worth a look
to confirm the simplification achieved what was intended.

### 🟡 P3 — Section padding could come down

Six sections carry `py-32` (256px). Dropping to `py-24` saves ~384px across the page. Do
this **after** the structural fixes, not instead of them — padding is not why the page is long.

---

## 4. What is healthy

- ✅ **Orphaned headlines: zero**, across 25 headings × 4 widths on `/` and 21 × 4 on
  `/group-cruises`. Sustained across several builds now.
- ✅ **Type floor: clean.** Nothing renders under 14px across 7 pages × 3 widths.
- ✅ **Address format validation:** 13 real addresses accepted, 15 junk inputs rejected,
  including PO boxes, rural routes and APO/FPO.
- ✅ **`#about` rebuilt:** 801 → 606px at 1440; portrait 477×672 → 416×312.
- ✅ **`#cruise-lines` (210px) and `#adventure-shelf` (217px)** are the density benchmarks
  the large sections should be measured against.

---

## 5. Recommended order of work

1. **`#videos` shorts rail** → horizontal at desktop. Biggest single win (~776px), low risk.
2. **`firstLine()` URL stripping.** Visible copy bug, contained fix.
3. **`#testimonials`** restructure (~600px).
4. **`#group-trips`** left column.
5. **Live USPS end-to-end test** (yours — needs a real claim submission).
6. `#destination-discovery` review, then the global padding pass.

Items 1–4 would bring the page from 12.6 screens to roughly 10, without removing content.

---

## Appendix — verification commands

```bash
npm run check:orphans      # heading wraps at 390/768/1024/1440 — currently clean
npm run check:type-floor   # rendered font sizes, 7 pages × 3 widths — currently clean
npm run check:address      # address validation accept/reject suite — currently clean
```

All three require the dev server running. All three pass on `4ac9de3`.
