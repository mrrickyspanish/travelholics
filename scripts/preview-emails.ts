import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { WELCOME_SERIES, renderCampaignEmail } from "../lib/email-campaign-templates";

/**
 * Renders the drip through the real template code so the owner reviews what
 * will actually send, not a mock-up. Re-run after any copy edit.
 *
 *   npm run preview:emails
 */

const OUT = join(process.cwd(), "email-review");
const SAMPLE = { firstName: "Denise" };

const PREVIEW_FOOTER = `
      <hr style="border:none;border-top:1px solid #e5e0d8;margin:28px 0 16px" />
      <p style="font-size:14px;line-height:20px;color:#6b6b6b;margin:0">
        You are receiving this because you joined the Travelholics Cruise Life list.
        <a href="https://yotravelholic.com/unsubscribe" style="color:#6b6b6b">Unsubscribe</a>.
      </p>
  `;

const timing = (hours: number) =>
  hours === 0 ? "Immediately on signup" : `Day ${hours / 24} (${hours}h after signup)`;

const page = (subject: string, when: string, body: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${subject}</title>
<style>
 :root{--ink:#1a2e2a;--muted:#6b6b6b;--line:#e5e0d8;--bg:#f6f2ea;}
 body{margin:0;background:var(--bg);font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:var(--ink);}
 .wrap{max-width:720px;margin:0 auto;padding:24px 16px 64px;}
 .meta{background:#fff;border:1px solid var(--line);padding:16px 18px;margin-bottom:18px;}
 .meta dt{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:800;}
 .meta dd{margin:4px 0 14px;font-size:17px;} .meta dd:last-child{margin-bottom:0;}
 .inbox{background:#fff;border:1px solid var(--line);padding:26px 24px;}
 .label{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:800;margin:0 0 10px;}
</style></head><body><div class="wrap">
 <dl class="meta"><dt>Subject line</dt><dd><strong>${subject}</strong></dd>
 <dt>When it sends</dt><dd>${when}</dd></dl>
 <p class="label">What the reader sees</p>
 <div class="inbox">${body}</div>
</div></body></html>`;

function toPlainText(html: string): string {
  return html
    .replace(/<hr[\s\S]*$/i, "")
    .replace(/<a [^>]*>([\s\S]*?)<\/a>/gi, "[$1]")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&mdash;/g, "—").replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/&amp;/g, "&")
    .split("\n").map((line) => line.trim()).join("\n")
    .replace(/\n{3,}/g, "\n\n").trim();
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let index = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${WELCOME_SERIES.name} — drafts</title>
<style>
 :root{--ink:#1a2e2a;--muted:#6b6b6b;--line:#e5e0d8;--bg:#f6f2ea;--coral:#E8626F;}
 body{margin:0;background:var(--bg);font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:var(--ink);}
 .wrap{max-width:760px;margin:0 auto;padding:40px 16px 80px;}
 h1{font-size:34px;line-height:1.1;margin:0 0 10px;}
 .lede{font-size:18px;line-height:1.6;color:#444;max-width:62ch;}
 .warn{background:#fff;border-left:3px solid var(--coral);padding:14px 18px;margin:24px 0;font-size:17px;line-height:1.6;}
 .mail{background:#fff;border:1px solid var(--line);margin:22px 0;}
 .head{padding:16px 20px;border-bottom:1px solid var(--line);}
 .when{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:800;margin:0;}
 .subj{font-size:21px;font-weight:700;margin:6px 0 0;}
 .body{padding:22px 20px;}
</style></head><body><div class="wrap">
<h1>${WELCOME_SERIES.name}</h1>
<p class="lede">Sent automatically after someone joins the list. This is exactly what they receive — sample name &ldquo;Denise&rdquo;.</p>
<div class="warn"><strong>Drafts written in Yolanda&rsquo;s voice, not by her.</strong> Nothing sends until the campaign is activated deliberately. Mark up anything that does not sound like her — the copy is hers.</div>
`;

let md = `# ${WELCOME_SERIES.name} — draft copy for review\n\n`;
md += `**Drafts written in Yolanda's voice, not by her.** Nothing sends until the campaign is activated deliberately.\n\n`;
md += `Edit freely — rewrite, cut, reorder, change subject lines or timing. Send it back and the edits go straight into the build.\n\n`;
md += `| # | When it sends | Subject line |\n|---|---|---|\n`;
WELCOME_SERIES.steps.forEach((step, i) => {
  md += `| ${i + 1} | ${timing(step.delayHours)} | ${step.subject} |\n`;
});
md += `\n---\n`;

WELCOME_SERIES.steps.forEach((step, i) => {
  const body = renderCampaignEmail(step.templateKey, SAMPLE, PREVIEW_FOOTER);
  if (!body) throw new Error(`Missing template: ${step.templateKey}`);
  const n = String(i + 1).padStart(2, "0");
  writeFileSync(join(OUT, `${n}-${step.templateKey}.html`), page(step.subject, timing(step.delayHours), body));
  index += `<div class="mail"><div class="head"><p class="when">${timing(step.delayHours)}</p><p class="subj">${step.subject}</p></div><div class="body">${body}</div></div>\n`;
  md += `\n## Email ${i + 1} — ${timing(step.delayHours)}\n\n**Subject:** ${step.subject}\n\n${toPlainText(body)}\n\n*(Every email also carries an unsubscribe link in the footer.)*\n\n---\n`;
});

writeFileSync(join(OUT, "00-ALL-EMAILS-preview.html"), `${index}</div></body></html>`);
writeFileSync(join(OUT, "EMAIL-COPY-for-editing.md"), md);

console.log(`✓ previews written to email-review/ (${WELCOME_SERIES.steps.length} emails)`);
console.log("  open email-review/00-ALL-EMAILS-preview.html");
