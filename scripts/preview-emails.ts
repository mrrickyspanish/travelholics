import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { CAMPAIGNS, renderCampaignEmail } from "../lib/email-campaign-templates";

/**
 * Renders every nurture campaign through the real template code so the owner
 * reviews what will actually send, not a mock-up. Re-run after any copy edit.
 *
 *   npm run preview:emails
 *
 * Writes email-review/00-ALL-EMAILS-preview.html (every email, grouped by
 * campaign), one HTML file per email, and EMAIL-COPY-for-editing.md.
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
  hours === 0 ? "Right away" : hours % 24 === 0 ? `Day ${hours / 24} (${hours} hours after joining)` : `${hours} hours after joining`;

const audience = (required: string | null, excluded: readonly string[]) =>
  `${required ? `Subscribers tagged "${required}"` : "Every subscriber"}${excluded.length ? `, except anyone tagged ${excluded.map((e) => `"${e}"`).join(" or ")}` : ""}`;

const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function toPlainText(html: string): string {
  return html
    .replace(/<div style="display:none[^>]*>[\s\S]*?<\/div>/i, "")
    .replace(/<hr[\s\S]*$/i, "")
    .replace(/<a [^>]*>([\s\S]*?)<\/a>/gi, "[$1]")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .split("\n").map((line) => line.trim()).join("\n")
    .replace(/\n{3,}/g, "\n\n").trim();
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const total = CAMPAIGNS.reduce((sum, campaign) => sum + campaign.steps.length, 0);

let index = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Travelholics nurture emails (drafts)</title>
<style>
 :root{--ink:#1a2e2a;--muted:#6b6b6b;--line:#e5e0d8;--bg:#f6f2ea;--coral:#E8626F;}
 body{margin:0;background:var(--bg);font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:var(--ink);}
 .wrap{max-width:760px;margin:0 auto;padding:40px 16px 80px;}
 h1{font-size:34px;line-height:1.1;margin:0 0 10px;} h2{font-size:26px;margin:48px 0 6px;}
 .lede{font-size:18px;line-height:1.6;color:#444;max-width:62ch;}
 .warn{background:#fff;border-left:3px solid var(--coral);padding:14px 18px;margin:24px 0;font-size:17px;line-height:1.6;}
 .mail{background:#fff;border:1px solid var(--line);margin:22px 0;}
 .head{padding:16px 20px;border-bottom:1px solid var(--line);}
 .when{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:800;margin:0;}
 .subj{font-size:21px;font-weight:700;margin:6px 0 0;} .pre{font-size:16px;color:var(--muted);margin:4px 0 0;}
 .body{padding:22px 20px;}
</style></head><body><div class="wrap">
<h1>Travelholics nurture emails</h1>
<p class="lede">${CAMPAIGNS.length} campaigns, ${total} emails. This is exactly what subscribers receive (sample name "Denise").</p>
<div class="warn"><strong>Drafts written in Yolanda's voice, not by her.</strong> Nothing sends until a campaign is activated. Mark up anything that does not sound like her.</div>
`;

let md = `# Travelholics nurture emails: draft copy for review\n\n`;
md += `**Drafts written in Yolanda's voice, not by her.** Nothing sends until a campaign is activated.\n\n`;

let n = 0;
for (const campaign of CAMPAIGNS) {
  const who = audience(campaign.requiredInterest, campaign.excludeInterests);
  index += `<h2>${esc(campaign.name)}</h2><p class="lede">${esc(who)}. ${campaign.steps.length} emails.</p>\n`;
  md += `\n## ${campaign.name}\n\n${who}.\n\n| # | When it sends | Subject line | Preview text |\n|---|---|---|---|\n`;
  campaign.steps.forEach((step, i) => {
    md += `| ${i + 1} | ${timing(step.delayHours)} | ${step.subject} | ${step.preheader} |\n`;
  });
  for (const [i, step] of campaign.steps.entries()) {
    const body = renderCampaignEmail(step.templateKey, SAMPLE, PREVIEW_FOOTER);
    if (!body) throw new Error(`Missing template: ${step.templateKey}`);
    n += 1;
    const head = `<p class="when">${esc(timing(step.delayHours))}</p><p class="subj">${esc(step.subject)}</p><p class="pre">${esc(step.preheader)}</p>`;
    writeFileSync(
      join(OUT, `${String(n).padStart(2, "0")}-${step.templateKey}.html`),
      `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${esc(step.subject)}</title></head><body style="margin:0;background:#f6f2ea"><div style="max-width:720px;margin:0 auto;padding:24px 16px"><div style="background:#fff;border:1px solid #e5e0d8;padding:16px 18px;margin-bottom:18px;font-family:sans-serif">${head}</div><div style="background:#fff;border:1px solid #e5e0d8;padding:26px 24px">${body}</div></div></body></html>`,
    );
    index += `<div class="mail"><div class="head">${head}</div><div class="body">${body}</div></div>\n`;
    md += `\n### ${campaign.name}, email ${i + 1}: ${timing(step.delayHours)}\n\n**Subject:** ${step.subject}\n\n**Preview text:** ${step.preheader}\n\n${toPlainText(body)}\n\n*(Every email also carries an unsubscribe link in the footer.)*\n`;
  }
}

writeFileSync(join(OUT, "00-ALL-EMAILS-preview.html"), `${index}</div></body></html>`);
writeFileSync(join(OUT, "EMAIL-COPY-for-editing.md"), md);

console.log(`✓ previews written to email-review/ (${total} emails in ${CAMPAIGNS.length} campaigns)`);
console.log("  open email-review/00-ALL-EMAILS-preview.html");
