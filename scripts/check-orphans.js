#!/usr/bin/env node
/**
 * Headline orphan checker.
 *
 * Fails if any heading wraps so that its last rendered line holds a single word.
 * See the "No orphaned words in headlines, ever" section of CLAUDE.md.
 *
 * Usage:  npm run dev        (in another terminal)
 *         npm run check:orphans [-- --url http://localhost:3000] [--path / --path /group-cruises]
 *
 * Measures the ACTUAL rendered line boxes via Range rects, because the wrap
 * depends on font size, container width, letter-spacing and `ch`-based caps —
 * none of which can be judged by reading the markup.
 */

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('This check needs Playwright:  npm i -D playwright  (or run it with npx)');
  process.exit(2);
}

const WIDTHS = [390, 768, 1024, 1440];

// Headings whose single-word last line is a deliberate typographic stack rather
// than an accident. Matched against the heading's text content.
const INTENTIONAL = [/^Eastern Caribbean\s*2027$/];

function parseArgs(argv) {
  const paths = [];
  let base = 'http://localhost:3000';
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--url') base = argv[++i];
    else if (argv[i] === '--path') paths.push(argv[++i]);
  }
  return { base, paths: paths.length ? paths : ['/', '/group-cruises'] };
}

// Runs in the page: group each heading's words into rendered lines.
function collectHeadings() {
  function linesOf(el) {
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const re = /\S+/g;
      let m;
      while ((m = re.exec(node.textContent))) {
        const range = document.createRange();
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const rect = range.getBoundingClientRect();
        if (!rect.width && !rect.height) continue;
        words.push({ word: m[0], top: Math.round(rect.top) });
      }
    }
    const lines = [];
    for (const w of words) {
      const line = lines.find((l) => Math.abs(l.top - w.top) <= 6);
      if (line) line.words.push(w.word);
      else lines.push({ top: w.top, words: [w.word] });
    }
    return lines.sort((a, b) => a.top - b.top).map((l) => l.words);
  }

  return Array.from(document.querySelectorAll('h1, h2, h3'))
    .filter((h) => h.getBoundingClientRect().height > 0 && h.textContent.trim())
    .map((h) => {
      const lines = linesOf(h);
      const last = lines[lines.length - 1] || [];
      return {
        tag: h.tagName,
        text: h.textContent.trim().replace(/\s+/g, ' '),
        lines: lines.map((l) => l.join(' ')),
        orphan:
          lines.length > 1 &&
          last.length === 1 &&
          /\w/.test(last[0]),
      };
    });
}

(async () => {
  const { base, paths } = parseArgs(process.argv.slice(2));
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
  });
  let failures = 0;

  for (const path of paths) {
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();
      try {
        await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        console.error(`Could not load ${base + path} — is the dev server running?`);
        await browser.close();
        process.exit(2);
      }
      // Scroll the page so viewport-triggered animations reveal their content.
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);

      const headings = await page.evaluate(collectHeadings);
      const bad = headings.filter(
        (h) => h.orphan && !INTENTIONAL.some((re) => re.test(h.text))
      );

      if (bad.length) {
        failures += bad.length;
        console.log(`\n✗ ${path} @ ${width}px — ${bad.length} orphan(s)`);
        for (const h of bad) {
          console.log(`   [${h.tag}] ${h.text}`);
          h.lines.forEach((l, i) =>
            console.log(`       ${i === h.lines.length - 1 ? '>>' : '  '} ${l}`)
          );
        }
      } else {
        console.log(`✓ ${path} @ ${width}px — clean (${headings.length} headings)`);
      }
      await ctx.close();
    }
  }

  await browser.close();
  if (failures) {
    console.log(`\n${failures} orphaned headline(s). See CLAUDE.md for how to fix them.`);
    process.exit(1);
  }
  console.log('\nNo orphaned headlines.');
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
