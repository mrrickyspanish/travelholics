/**
 * Travelholics free guides ("freebies") — source of truth for the Shop page
 * free-download section.
 *
 * Files live in /public/guides. Original filenames from the delivered asset
 * pack were renamed to clean, public-safe slugs (the Hawaii one-pager shipped
 * with a raw export UUID in its filename).
 */

export type GuideFormat = "pdf" | "xlsx" | "png";

export interface FreeGuide {
  id: string;
  title: string;
  /** Short shelf label for cards. */
  shortTitle: string;
  category: "Packing" | "Booking" | "Onboard" | "Cruise Chat";
  format: GuideFormat;
  /** Path under /public. */
  file: string;
  /** Filename suggested to the browser on download. */
  downloadName: string;
  pages?: number;
  fileSizeKb: number;
  blurb: string;
  /** Bullet highlights for card / detail copy. */
  highlights: string[];
  /** True once the asset has been reviewed and is safe to publish as-is. */
  readyToPublish: boolean;
  /** Anything that must be fixed before this goes live. */
  notes?: string[];
}

export const FREE_GUIDES: FreeGuide[] = [
  {
    id: "alaska-packing-checklist",
    title: "Alaska Cruise Packing Checklist",
    shortTitle: "Alaska Packing List",
    category: "Packing",
    format: "pdf",
    file: "/guides/travelholics-alaska-cruise-packing-checklist.pdf",
    downloadName: "Travelholics-Alaska-Cruise-Packing-Checklist.pdf",
    pages: 1,
    fileSizeKb: 58,
    blurb:
      "Layer smart, stay dry, cruise ready. A one-page checklist built around the base + mid + waterproof outer layer strategy.",
    highlights: [
      "Top 5: waterproof jacket, layers, walking shoes, warm hat/gloves, day bag",
      "Six sections: documents, clothing layers, shoes & cold-weather gear, excursion gear, toiletries, cabin extras",
      "Checkbox format, print-friendly",
    ],
    readyToPublish: true,
  },
  {
    id: "hawaii-packing-checklist",
    title: "What to Pack for a Hawaii Cruise",
    shortTitle: "Hawaii Packing List",
    category: "Packing",
    format: "pdf",
    file: "/guides/travelholics-hawaii-cruise-packing-checklist.pdf",
    downloadName: "Travelholics-Hawaii-Cruise-Packing-Checklist.pdf",
    pages: 1,
    fileSizeKb: 46,
    blurb:
      "One page for warm days, breezy nights, and island excursions — including the embarkation-day carry-on you keep with you.",
    highlights: [
      "Sun & water, shoes, clothing, excursions, ship essentials",
      "Reef-safe sunscreen and water shoes called out for island ports",
      "Embarkation-day carry-on list",
    ],
    readyToPublish: true,
    notes: [
      "Original filename contained a raw export UUID (DIGITAL_DOWNLOAD_088489d3-…); renamed for public hosting.",
    ],
  },
  {
    id: "what-not-to-bring",
    title: "Cruise Packing: What NOT to Bring",
    shortTitle: "What NOT to Bring",
    category: "Packing",
    format: "pdf",
    file: "/guides/travelholics-cruise-what-not-to-bring.pdf",
    downloadName: "Travelholics-Cruise-What-Not-To-Bring.pdf",
    pages: 1,
    fileSizeKb: 4,
    blurb:
      "The items that get confiscated at the terminal — fire hazards, surge protectors, weapons, restricted substances, and more.",
    highlights: [
      "Seven categories of prohibited or heavily restricted items",
      "Covers the surge-protector and power-strip rule people get caught by",
      "Carries an 'informational use only, policies vary by line' disclaimer",
    ],
    readyToPublish: true,
    notes: [
      "Distinct from 'What You DON'T Need to Pack' — this one is about PROHIBITED items, the other is about UNNECESSARY items. Titles must be clearly differentiated on the page or they will be mistaken for duplicates.",
    ],
  },
  {
    id: "what-you-dont-need-to-pack",
    title: "What You DON'T Need to Pack",
    shortTitle: "Stop Overpacking",
    category: "Packing",
    format: "png",
    file: "/guides/travelholics-what-you-dont-need-to-pack.png",
    downloadName: "Travelholics-What-You-Dont-Need-To-Pack.png",
    fileSizeKb: 1137,
    blurb:
      "The first-time cruiser freebie: 16 things you can safely leave at home, plus the biggest overpacking mistakes.",
    highlights: [
      "Beach towels, hair dryer, bedding, full-size toiletries, extra snacks, lots of cash",
      "'Biggest Overpacking Mistakes' callout panel",
      "Fully designed infographic — the most polished asset in the set",
    ],
    readyToPublish: false,
    notes: [
      "Delivered as a 1.1 MB PNG — the only guide that is not a document. Needs a PDF version for a consistent download experience, and the PNG should be compressed or served through next/image if it is also used as a preview.",
      "Overlaps in name with 'What NOT to Bring' (see that entry).",
    ],
  },
  {
    id: "best-time-to-book",
    title: "The Best Time to Book a Cruise",
    shortTitle: "Best Time to Book",
    category: "Booking",
    format: "pdf",
    file: "/guides/travelholics-best-time-to-book-a-cruise.pdf",
    downloadName: "Travelholics-Best-Time-To-Book-A-Cruise.pdf",
    pages: 3,
    fileSizeKb: 68,
    blurb:
      "Three booking windows, with honest pros and cons for each: last-minute, shoulder season, and Black Friday / Cyber Monday.",
    highlights: [
      "30–90 days out: lowest pricing, worst cabin selection",
      "Shoulder season: late April–early June, September–early December",
      "Black Friday / Cyber Monday: perks over base fare",
    ],
    readyToPublish: true,
    notes: [
      "Subtitled 'Lowest → Mid Pricing' and numbered 1–3, which implies a Part 2 covering the higher-price/early-booking windows. Either label it Part 1 on the page or drop the numbering.",
    ],
  },
  {
    id: "drink-package-calculator",
    title: "Drink Package Break-Even Calculator",
    shortTitle: "Drink Package Calculator",
    category: "Onboard",
    format: "xlsx",
    file: "/guides/travelholics-drink-package-calculator.xlsx",
    downloadName: "Travelholics-Drink-Package-Calculator.xlsx",
    fileSizeKb: 14,
    blurb:
      "Work out how many drinks a day you actually need to break even — then reality-check it against your sea days and port days.",
    highlights: [
      "Five steps: cruise details, package price, average drink cost, break-even, sea/port reality check",
      "Pre-filled suggested drink prices (cocktails $13, wine $11, beer $7.75, coffee $4.25, water $3.25, soda $3.50)",
      "Plain-English verdict at the end",
    ],
    readyToPublish: false,
    notes: [
      "BLOCKED — contains formula reference bugs that produce wrong answers. Step 3 (E18) reads B17/B19:B24 instead of B18/B20:B25, so a user-entered average drink price is silently ignored. Step 5 (B47, B48, E48, B49, E49) reads the 'evening' input rows instead of the day totals, the port-day verdict duplicates the sea-day verdict, and the weighted average uses the sea-day figure twice. Must be fixed before this is published.",
    ],
  },
  {
    id: "theo-theory",
    title: "THEO Theory — How the Casino Rates Your Play",
    shortTitle: "THEO Theory",
    category: "Onboard",
    format: "pdf",
    file: "/guides/travelholics-theo-theory-casino-guide.pdf",
    downloadName: "Travelholics-THEO-Theory-Cruise-Casino-Guide.pdf",
    pages: 1,
    fileSizeKb: 3,
    blurb:
      "Theoretical loss is the score that decides your perks and offers — and it measures how you play, not what you win or lose.",
    highlights: [
      "Theo = time played × average bet × house edge",
      "Why you can lose $600 and still get no perks",
      "Five habits that build a better Theo",
    ],
    readyToPublish: false,
    notes: [
      "Niche, adult-audience content (cruise casino). Decide whether it belongs in the same freebie shelf as the packing lists or on a separate page.",
      "Footer references '@Travelholics' and 'Become a Superfan' with no URLs attached — add real links before publishing.",
    ],
  },
  {
    id: "first-time-princess-part-1",
    title: "First Time Princess Series — Part One",
    shortTitle: "First Time Princess",
    category: "Cruise Chat",
    format: "pdf",
    file: "/guides/travelholics-first-time-princess-part-1.pdf",
    downloadName: "Travelholics-First-Time-Princess-Part-1.pdf",
    pages: 1,
    fileSizeKb: 53,
    blurb:
      "Royal at heart, Princess by choice — why a loyal Royal Caribbean cruiser booked Princess, and what the Medallion changes.",
    highlights: [
      "Curiosity beyond loyalty, a calmer onboard pace, fresh itineraries",
      "The Princess Medallion as the standout upgrade",
      "Community call to action for the next Cruise Chat",
    ],
    readyToPublish: false,
    notes: [
      "This is a Cruise Chat recap, not a lead magnet — no checklist, no takeaway asset, and it ends with a 'reply with your suggestions' CTA. It reads as blog/content, not as a shop freebie. Recommend publishing it under content/articles rather than the Shop freebie shelf.",
    ],
  },
];

/** Guides cleared for the Shop page today. */
export const PUBLISHABLE_GUIDES = FREE_GUIDES.filter((g) => g.readyToPublish);

export function getGuide(id: string) {
  return FREE_GUIDES.find((g) => g.id === id);
}
