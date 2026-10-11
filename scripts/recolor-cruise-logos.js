#!/usr/bin/env node
/**
 * Recolour cruise line logos to one slate and write them into
 * public/images/cruise-lines/.
 *
 *   node scripts/recolor-cruise-logos.js <source-dir> <output-dir>
 *
 * The source directory holds the brand files exactly as supplied, in
 * whatever mix of SVG / PNG / JPEG they arrive in. Add new ones to JOBS
 * below. See public/images/cruise-lines/README.md for why the alpha channel
 * is preserved rather than flattened, and why the recolour happens here
 * instead of as a CSS filter at render time.
 */
const sharp = require("sharp");
const fs = require("fs");
const R = process.argv[2], OUT = process.argv[3];
const SLATE = { r: 0x47, g: 0x55, b: 0x69 };      // slate-600 #475569
const H = 128;                                     // 4x the ~32px render height

// Knockouts matter: MSC reverses "msc" out of its star, NCL reverses its
// letters out of a solid box. Recolouring must keep alpha and only replace
// RGB, never flatten to a silhouette.
async function toSlate(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    data[i] = SLATE.r; data[i + 1] = SLATE.g; data[i + 2] = SLATE.b;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

// The NCL file is a JPEG with no alpha: a grey plate behind a black box with
// white letters reversed out. Near-white becomes transparent, which drops the
// plate AND opens the letters so the page shows through them.
async function keyOutWhite(path, cutoff = 205) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > cutoff && data[i + 1] > cutoff && data[i + 2] > cutoff) data[i + 3] = 0;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

const JOBS = [
  ["RoyalCaribbeanLogo2024.svg", "royal-caribbean.png"],
  ["Celebrity-Cruises-Logo.svg", "celebrity.png"],
  ["Norwegian_Cruise_Line_2026_Logo.jpg", "norwegian.png"],
  ["MSC_Cruises_Logo.png", "msc.png"],
  ["Carnival_Cruise_Line_Logo.svg", "carnival.png"],
  ["Princess_Cruises_logo.svg", "princess.png"],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [src, dest] of JOBS) {
    const p = `${R}/${src}`;
    let buf = src.endsWith(".jpg") ? await keyOutWhite(p)
            : await sharp(p, { density: 900 }).png().toBuffer();
    // Trim transparent padding so every mark fills its box evenly, then
    // normalise on height so they share one optical weight.
    buf = await sharp(buf).trim({ threshold: 1 }).toBuffer();
    buf = await toSlate(buf);
    buf = await sharp(buf).resize({ height: H, fit: "inside" }).png({ compressionLevel: 9 }).toBuffer();
    const m = await sharp(buf).metadata();
    fs.writeFileSync(`${OUT}/${dest}`, buf);
    console.log(dest.padEnd(22), `${m.width}x${m.height}`, `${(buf.length / 1024).toFixed(1)}KB`);
  }
})();
