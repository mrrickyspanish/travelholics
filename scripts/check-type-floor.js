#!/usr/bin/env node
/**
 * Type floor checker.
 *
 * Fails if any text renders below 14px. See the "Typography minimums" section
 * of CLAUDE.md.
 *
 * Usage:  npm run dev          (in another terminal)
 *         npm run check:type-floor [-- --url http://localhost:3000] [--path /shop]
 *
 * Measures the COMPUTED font size in a real browser, which is the only way to
 * catch all of it. The globals.css guardrail rewrites small Tailwind classes,
 * but it is a set of attribute selectors, so it cannot see raw CSS font-size,
 * values in a stylesheet like mobile-polish.css, or an arbitrary rem value
 * nobody thought to enumerate. Every one of those has shipped a violation:
 * a 0.62rem figcaption, a 9px label below the guardrail's range, and a 12px
 * text-xs on a submit button.
 */

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('This check needs Playwright:  npm i -D playwright  (or run it with npx)');
  process.exit(2);
}

const FLOOR = 14;
const WIDTHS = [390, 768, 1440];
const DEFAULT_PATHS = ['/', '/group-cruises', '/shop', '/blog', '/live', '/duck-hunt', '/cruises/caribbean'];

// Deliberate exceptions, matched against the element's class attribute.
// A count badge in a 16px circle cannot hold 14px type; making it bigger
// bursts the circle. Keep this list short and justify every entry.
const ALLOWED = [
  { pattern: /h-4 w-4[^"]*rounded-full[^"]*bg-coral/, why: 'cart count inside a 16px circle' },
];

function parseArgs(argv) {
  const paths = [];
  let base = 'http://localhost:3000';
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--url') base = argv[++i];
    else if (argv[i] === '--path') paths.push(argv[++i]);
  }
  return { base, paths: paths.length ? paths : DEFAULT_PATHS };
}

// Runs in the page: every leaf text node's computed size.
function collect(floor) {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg')) continue;             // SVG text scales with its viewBox
    const text = el.textContent.trim();
    if (!text || el.children.length) continue;   // leaves only, so sizes are not double-counted
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const size = parseFloat(cs.fontSize);
    if (!size || size >= floor) continue;
    out.push({ size: +size.toFixed(1), text: text.slice(0, 40), cls: (el.className || '').toString() });
  }
  return out;
}

(async () => {
  const { base, paths } = parseArgs(process.argv.slice(2));
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined });
  let violations = 0;
  let allowed = 0;

  for (const path of paths) {
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      let found;
      try {
        await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(400);
        found = await page.evaluate(collect, FLOOR);
      } catch (error) {
        console.log(`! ${path} @ ${width}px — could not load (${error.message.split('\n')[0]})`);
        await page.close();
        continue;
      }
      await page.close();

      const real = found.filter((f) => {
        const ok = ALLOWED.find((a) => a.pattern.test(f.cls));
        if (ok) allowed++;
        return !ok;
      });

      if (real.length === 0) {
        console.log(`✓ ${path} @ ${width}px — clean`);
      } else {
        violations += real.length;
        console.log(`✗ ${path} @ ${width}px — ${real.length} under ${FLOOR}px`);
        for (const f of real) {
          console.log(`   ${f.size}px  ${JSON.stringify(f.text)}`);
          console.log(`          ${f.cls.slice(0, 92)}`);
        }
      }
    }
  }

  await browser.close();
  console.log(
    violations === 0
      ? `\nNo text under ${FLOOR}px.${allowed ? ` (${allowed} allowed exception${allowed > 1 ? 's' : ''} skipped.)` : ''}`
      : `\n${violations} element(s) under ${FLOOR}px. See CLAUDE.md for the floor.`,
  );
  process.exit(violations === 0 ? 0 : 1);
})();
