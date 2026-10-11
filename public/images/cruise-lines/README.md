# Cruise line logos

All six marks are in place, recoloured to one slate (`#475569`) so the strip
reads as a set rather than six competing brand palettes.

| File | Source supplied |
|---|---|
| `royal-caribbean.png` | SVG |
| `celebrity.png` | SVG |
| `carnival.png` | SVG (vector wrapper around ~50 embedded rasters) |
| `princess.png` | SVG |
| `msc.png` | PNG with alpha |
| `norwegian.png` | **JPEG, no alpha** — see below |

## How they were processed

Rasterised at high density, trimmed of transparent padding, then recoloured by
**replacing RGB while preserving the alpha channel**. That detail is the whole
job: MSC reverses "msc" out of its star and NCL reverses its letters out of a
solid box, so flattening to a silhouette would have filled both in and
destroyed the marks. Output is 128px tall, 4x the ~32px render height.

The Norwegian file arrived as a JPEG with a grey plate behind the logo and no
transparency. Near-white pixels were keyed out, which drops the plate and
simultaneously opens the letters so the page shows through them. **It is the
weakest asset of the six** — if an SVG or transparent PNG turns up, replace it.

## Optical balance

Sizing six logos to one height does not make them look one size. Celebrity is
4.5:1 and rendered 145px wide; NCL is 1.3:1 and rendered 41px, with unreadable
letters. Each entry carries a `scale` in `components/cruise-line-strip.tsx` —
the share of the row height it fills. Wide wordmarks sit near 0.65, compact
stacked marks at 1. Rendered widths now span 51–116px instead of 41–145px.

## Replacing or adding one

1. Put the source file somewhere, add it to `JOBS` in
   `scripts/recolor-cruise-logos.js`, and run:
   `node scripts/recolor-cruise-logos.js <source-dir> public/images/cruise-lines`
2. Update its entry's `logo`, `width`, `height` and `scale`.
3. A line with no `logo` falls back to a styled wordmark in the same box, so
   the strip stays correct mid-swap.

Prefer the brand's own monochrome variant where one exists. The component
applies no CSS filter — recolouring happens once, here, rather than on every
render in a way that could be pointed at a full-colour asset by accident.

## Still worth confirming

- **Princess replaced Virgin Voyages.** The old list named Virgin; the supplied
  assets included Princess and not Virgin, so the strip follows the assets.
- The heading claims first-hand knowledge of these ships, so the list should
  match the lines Yolanda is actually authorized to sell.
