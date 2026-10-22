/**
 * Drip email bodies, keyed by the `template_key` on email_campaign_steps.
 *
 * DRAFT COPY. Yolanda's voice is the product and the copy is hers; these are
 * a starting point for her to edit, not finished messages. The welcome
 * campaign ships with status 'draft' and sends nothing until somebody
 * activates it deliberately, which is the point at which the copy should
 * have her sign-off.
 *
 * Every body is wrapped by `renderCampaignEmail`, which appends the
 * unsubscribe footer. No drip email is ever assembled without it.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yotravelholic.com";

type TemplateContext = { firstName: string | null };

const greeting = (firstName: string | null) => `Hi ${firstName || "there"},`;

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="display:inline-block;background:#E8626F;color:#ffffff;text-decoration:none;padding:14px 24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:15px">${label}</a></p>`;

const signoff = `<p style="margin-top:28px">Yolanda<br />
  <span style="color:#6b6b6b">Certified Cruise Specialist, Travelholics</span></p>`;

const TEMPLATES: Record<string, (context: TemplateContext) => string> = {
  "welcome-01-start": ({ firstName }) => `
    <p>${greeting(firstName)}</p>
    <p>Welcome to Cruise Life. You joined because a cruise is somewhere on your list &mdash; maybe a firm plan, maybe a someday.</p>
    <p>Either way, the next few emails are the things I wish somebody had told me before my first sailing: how to pick a ship, what a fare actually includes, and when booking early genuinely saves money.</p>
    <p>No pressure to book anything. If you only ever read these and plan it yourself, that is a win.</p>
    ${button(`${SITE_URL}/videos`, "Start with Cruise School")}
    ${signoff}
  `,

  "welcome-02-ship": ({ firstName }) => `
    <p>${greeting(firstName)}</p>
    <p>The first question most people ask is which cruise line is best. It is the wrong question.</p>
    <p>A big ship and a small ship are different holidays. One has the waterslides, the shows, and somewhere to be at every hour. The other has quieter decks and ports the big ones cannot reach.</p>
    <p>Neither is better. One of them is better <em>for you</em>, and knowing which saves you from a week of wishing you had booked the other.</p>
    ${button(`${SITE_URL}/videos`, "Big ship vs. small ship")}
    ${signoff}
  `,

  "welcome-03-price": ({ firstName }) => `
    <p>${greeting(firstName)}</p>
    <p>The fare you see advertised is almost never what you pay.</p>
    <p>Gratuities, taxes and port fees, drinks, wi-fi, speciality dining, excursions &mdash; a $499 headline can land closer to $1,100 before you have left the terminal.</p>
    <p>That is not a scam, it is just how cruise pricing is quoted. But it does mean comparing two headline fares tells you very little. Here is what to add up instead.</p>
    ${button(`${SITE_URL}/videos`, "What the advertised fare leaves out")}
    ${signoff}
  `,

  "welcome-04-plan": ({ firstName }) => `
    <p>${greeting(firstName)}</p>
    <p>If you have been reading these and thinking "I would still rather someone just tell me what to book" &mdash; that is what I do.</p>
    <p>I have sailed these ships. I know which cabins are worth the upgrade, which itineraries look better on paper than in person, and when the quoted price is about to move.</p>
    <p>There is no planning fee. You book through me at the same price, and you get someone who knows your trip.</p>
    ${button(`${SITE_URL}/#contact`, "Plan my cruise")}
    ${signoff}
  `,

  "welcome-05-groups": ({ firstName }) => `
    <p>${greeting(firstName)}</p>
    <p>Last one, then I will drop back to the regular list.</p>
    <p>If your cruise involves other people &mdash; a birthday, an anniversary, a reunion, a girls' trip &mdash; do not try to coordinate it in a group chat. I have watched that go badly more than once.</p>
    <p>Group bookings get their own trip page, so everybody sees the same dates, the same prices, and the same deadlines, and books their own cabin without you chasing anyone.</p>
    ${button(`${SITE_URL}/group-cruises`, "See how group cruises work")}
    ${signoff}
  `,
};

/**
 * The welcome series: the one definition the seed SQL, the review previews
 * and the live send all read from, so a subject line or a delay cannot drift
 * between what was reviewed and what goes out.
 *
 * `delayHours` is measured from enrollment, not from the previous email.
 */
export const WELCOME_SERIES = {
  slug: "cruise-life-welcome",
  name: "Cruise Life welcome series",
  steps: [
    { position: 1, delayHours: 0,   templateKey: "welcome-01-start",  subject: "Welcome to Cruise Life" },
    { position: 2, delayHours: 48,  templateKey: "welcome-02-ship",   subject: "Big ship or small ship?" },
    { position: 3, delayHours: 120, templateKey: "welcome-03-price",  subject: "That cruise price is not the final total" },
    { position: 4, delayHours: 216, templateKey: "welcome-04-plan",   subject: "Want me to just tell you what to book?" },
    { position: 5, delayHours: 336, templateKey: "welcome-05-groups", subject: "Cruising with other people? Read this first" },
  ],
} as const;

export function hasTemplate(key: string): boolean {
  return key in TEMPLATES;
}

export function templateKeys(): string[] {
  return Object.keys(TEMPLATES);
}

/**
 * Builds the full HTML for one drip email.
 *
 * The footer is passed in rather than imported, for two reasons: the real one
 * needs a signing key and so lives behind `server-only`, and this module has
 * to stay importable by `npm run preview:emails` so the owner can see exactly
 * what will send before approving the copy. A footer is still required --
 * the parameter is not optional -- so no drip email can be assembled without
 * a way out.
 */
export function renderCampaignEmail(
  templateKey: string,
  context: TemplateContext,
  footerHtml: string,
): string | null {
  const template = TEMPLATES[templateKey];
  if (!template) return null;
  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a2e2a;max-width:560px">
    ${template(context)}
    ${footerHtml}
  </div>`;
}
