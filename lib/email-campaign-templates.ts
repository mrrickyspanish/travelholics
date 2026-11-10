/**
 * Drip email rendering. The words live in `email-campaign-copy.ts` as plain
 * data (subject, preview text, paragraphs, one button) so the copy that was
 * reviewed is exactly the copy the seed, the previews and the live send use.
 *
 * Every body is wrapped by `renderCampaignEmail`, which appends the
 * unsubscribe footer. No drip email is ever assembled without it.
 */
import { CAMPAIGNS, type CampaignDefinition, type CampaignStepCopy } from "./email-campaign-copy";

export { CAMPAIGNS };
export type { CampaignDefinition, CampaignStepCopy };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yotravelholic.com";

type TemplateContext = { firstName: string | null };

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const greeting = (firstName: string | null) => `Hi ${escapeHtml(firstName?.trim() || "there")},`;

const button = (path: string, label: string) =>
  `<p style="margin:24px 0"><a href="${SITE_URL}${path}" style="display:inline-block;background:#E8626F;color:#ffffff;text-decoration:none;padding:14px 24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:15px">${escapeHtml(label)}</a></p>`;

const signoff = `<p style="margin-top:28px">Yolanda<br />
  <span style="color:#6b6b6b">Certified Cruise Specialist, Travelholics</span></p>`;

/** Hidden preview text: what inboxes show beside the subject line. */
const preheader = (text: string) =>
  `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(text)}</div>`;

/** Unresolved lines stand out in review previews. The seed refuses to build while any remain. */
const markConfirm = (html: string) =>
  html.replace(/\[YOLANDA TO CONFIRM[^\]]*\]/g, (m) => `<span style="background:#fde2e4;color:#8a1f2b;font-weight:700">${m}</span>`);

function renderStep(step: CampaignStepCopy, { firstName }: TemplateContext): string {
  return `
    ${preheader(step.preheader)}
    <p>${greeting(firstName)}</p>
    ${step.paragraphs.map((paragraph) => `<p>${markConfirm(escapeHtml(paragraph))}</p>`).join("\n    ")}
    ${button(step.button.path, step.button.label)}
    ${signoff}
  `;
}

const STEPS_BY_KEY: Record<string, CampaignStepCopy> = Object.fromEntries(
  CAMPAIGNS.flatMap((campaign) => campaign.steps.map((step) => [step.templateKey, step] as const)),
);

/** Kept for existing imports; the welcome series is one entry in CAMPAIGNS. */
export const WELCOME_SERIES = CAMPAIGNS.find((campaign) => campaign.slug === "cruise-life-welcome")!;

export function hasTemplate(key: string): boolean {
  return key in STEPS_BY_KEY;
}

export function templateKeys(): string[] {
  return Object.keys(STEPS_BY_KEY);
}

/**
 * Builds the full HTML for one drip email.
 *
 * The footer is passed in rather than imported: the real one needs a signing
 * key and so lives behind `server-only`, and this module has to stay
 * importable by `npm run preview:emails`. The parameter is required, so no
 * drip email can be assembled without a way out.
 */
export function renderCampaignEmail(
  templateKey: string,
  context: TemplateContext,
  footerHtml: string,
): string | null {
  const step = STEPS_BY_KEY[templateKey];
  if (!step) return null;
  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a2e2a;max-width:560px">
    ${renderStep(step, context)}
    ${footerHtml}
  </div>`;
}
