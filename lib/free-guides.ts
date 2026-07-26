/**
 * Travelholics free guides ("freebies") — source of truth for the /guides page.
 *
 * The files live in private/guides, deliberately OUTSIDE public/, so the only
 * way to reach one is a signed link issued by /api/guides/unlock after a name
 * and email are captured. Original filenames from the delivered asset pack were
 * renamed to clean slugs (the Hawaii one-pager shipped with a raw export UUID).
 */

export type GuideFormat = "pdf" | "xlsx" | "png";

/**
 * A block of the guide's body copy, rendered as crawlable HTML on the guide's
 * own page. This is what earns the page its search ranking — the PDF is the
 * printable upgrade, not the only place the content exists.
 */
export interface GuideSection {
  heading: string;
  body?: string;
  items?: string[];
  pros?: string[];
  cons?: string[];
  bestFor?: string;
  callout?: string;
}

export interface FreeGuide {
  id: string;
  /** URL segment for /guides/[slug]. Written to match how people search. */
  slug: string;
  title: string;
  /** Short shelf label for cards. */
  shortTitle: string;
  /** Overrides <title> on the guide's own page when set. */
  metaTitle?: string;
  metaDescription?: string;
  category: "Packing" | "Booking" | "Onboard" | "Cruise Chat";
  format: GuideFormat;
  /** Filename inside private/guides — never served directly. */
  fileName: string;
  /** Filename suggested to the browser on download. */
  downloadName: string;
  pages?: number;
  fileSizeKb: number;
  blurb: string;
  /** Bullet highlights for card / detail copy. */
  highlights: string[];
  /** Opening paragraph on the guide's own page. */
  intro?: string;
  /** The guide's actual content, rendered on-page for search engines. */
  sections?: GuideSection[];
  /** Closing Travelholics tip. */
  tip?: string;
  /** Small print shown under the content, e.g. policies-vary notices. */
  disclaimer?: string;
  /** True once the asset has been reviewed and is safe to publish as-is. */
  readyToPublish: boolean;
  /** Anything that must be fixed before this goes live. */
  notes?: string[];
}

export const FREE_GUIDES: FreeGuide[] = [
  {
    id: "alaska-packing-checklist",
    slug: "alaska-cruise-packing-list",
    title: "Alaska Cruise Packing Checklist",
    shortTitle: "Alaska Packing List",
    metaTitle: "Alaska Cruise Packing List — Free Printable Checklist",
    metaDescription:
      "What to pack for an Alaska cruise: layers, waterproof gear, excursion kit, and cabin extras. Free printable checklist from Travelholics.",
    category: "Packing",
    format: "pdf",
    fileName: "travelholics-alaska-cruise-packing-checklist.pdf",
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
    intro:
      "Alaska is the sailing people most often pack wrong for. It is not simply cold — it is cold, then wet, then surprisingly warm indoors, sometimes in the same afternoon. The strategy that works is layering: a base layer, a mid layer, and a waterproof outer layer you can add or shed as the day changes. Everything below is built around that.",
    sections: [
      {
        heading: "The Travelholics Top 5",
        body: "If you pack nothing else on this list, pack these.",
        items: [
          "Waterproof jacket",
          "Layers (base, mid, outer)",
          "Walking shoes",
          "Warm hat and gloves",
          "Day bag",
        ],
      },
      {
        heading: "Documents & Essentials",
        items: [
          "Passport or government ID",
          "Cruise documents and boarding passes",
          "Flight, hotel, and transfer details",
          "Wallet, cards, and a little cash",
          "Phone, charger, and power bank",
          "Prescription medications",
        ],
      },
      {
        heading: "Clothing Layers",
        items: [
          "T-shirts and long-sleeve tops",
          "Thermal base layers",
          "Sweater, hoodie, or fleece",
          "Waterproof rain jacket",
          "Warm coat or insulated jacket",
          "Comfortable pants or jeans",
        ],
      },
      {
        heading: "Shoes & Cold-Weather Gear",
        items: [
          "Walking shoes",
          "Waterproof shoes or hikers",
          "Cabin slippers or flip-flops",
          "Warm socks",
          "Beanie or warm hat",
          "Gloves and scarf",
        ],
      },
      {
        heading: "Excursion Gear",
        items: [
          "Small backpack or day bag",
          "Reusable water bottle",
          "Binoculars for wildlife viewing",
          "Camera or extra phone storage",
          "Sunglasses",
          "Waterproof pouch or zip bags",
        ],
      },
      {
        heading: "Toiletries & Health",
        items: [
          "Toothbrush and toothpaste",
          "Deodorant and skincare",
          "Lip balm and moisturizer",
          "Pain reliever",
          "Motion sickness remedy",
          "Band-aids or small first-aid items",
        ],
      },
      {
        heading: "Cabin Extras",
        items: [
          "Magnetic hooks",
          "Over-the-door organizer",
          "Highlighter for the daily planner",
          "Travel laundry items",
          "Refillable tumbler or cup",
          "Compact umbrella or poncho",
        ],
      },
    ],
    tip: "Alaska weather can change fast. Pack for chilly mornings, windy decks, rainy ports, and warm indoor spaces — often all in one day.",
    readyToPublish: true,
  },
  {
    id: "hawaii-packing-checklist",
    slug: "hawaii-cruise-packing-list",
    title: "What to Pack for a Hawaii Cruise",
    shortTitle: "Hawaii Packing List",
    metaTitle: "Hawaii Cruise Packing List — Free Printable Checklist",
    metaDescription:
      "What to pack for a Hawaii cruise: reef-safe sunscreen, water shoes, light layers for breezy ship evenings, and an embarkation-day carry-on list.",
    category: "Packing",
    format: "pdf",
    fileName: "travelholics-hawaii-cruise-packing-checklist.pdf",
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
    intro:
      "A Hawaii sailing is warm days and genuinely breezy nights — ship evenings get cooler than first-timers expect, and every island port asks something slightly different of your bag. Two things people regret skipping: reef-safe sunscreen, which some places require, and water shoes, because the best beaches are rarely the softest ones.",
    sections: [
      {
        heading: "Documents & Must-Haves",
        items: [
          "Passport (recommended) or ID, plus cruise docs and boarding passes",
          "Wallet: credit card (preferred), cash for tips and markets, small coin pouch",
          "Medications and copies of prescriptions, plus a motion sickness remedy",
          "Reusable water bottle and hydration packets or electrolytes",
          "Day bag or small backpack for ports",
        ],
      },
      {
        heading: "Sun & Water",
        items: [
          "Reef-safe sunscreen (SPF 30+) and after-sun aloe",
          "Polarized sunglasses and a hat or visor",
          "Swimsuits (2–3) and a rash guard — great for snorkeling",
          "Cover-up or sarong and a quick-dry towel (optional)",
          "Snorkel set (optional) or anti-fog drops",
        ],
      },
      {
        heading: "Shoes",
        items: [
          "Walking shoes or sneakers for port days",
          "Water shoes for rocky beaches and tide pools",
          "Sandals or flip-flops",
          "Dress shoes if you are doing formal night or a chef's table",
        ],
      },
      {
        heading: "Clothes for Warm Days and Breezy Nights",
        items: [
          "Light layers: tee or tank plus a cardigan or hoodie — ship evenings can be cool",
          "Shorts and skirts, plus 1–2 casual dresses or sets",
          "1–2 pairs of lightweight pants or jeans for dinner",
          "Sleepwear, undergarments, and socks",
          "Light rain jacket or packable windbreaker",
        ],
      },
      {
        heading: "Excursions & Gear",
        items: [
          "Phone lanyard or waterproof pouch",
          "Small first-aid kit with bandages and blister pads",
          "Bug spray (light) and itch relief",
          "Portable charger and charging cables",
          "Binoculars for whales and dolphins (optional)",
        ],
      },
      {
        heading: "Ship Essentials",
        items: [
          "Magnetic hooks or clips for cabin organization (optional)",
          "Non-surge power strip, cruise-approved, if your line allows it",
          "Wrinkle-release spray",
          "Laundry bag and a few detergent sheets",
        ],
      },
      {
        heading: "Embarkation Day Carry-On",
        body: "Keep this with you — your checked bag may not reach the cabin for hours.",
        items: [
          "Swimsuit",
          "Sunscreen",
          "Medications",
          "Phone and charger",
          "Cruise docs and ID",
          "A change of clothes",
          "Valuables",
        ],
      },
    ],
    readyToPublish: true,
    notes: [
      "Original filename contained a raw export UUID (DIGITAL_DOWNLOAD_088489d3-…); renamed for public hosting.",
    ],
  },
  {
    id: "what-not-to-bring",
    slug: "what-not-to-bring-on-a-cruise",
    title: "Cruise Packing: What NOT to Bring",
    shortTitle: "What NOT to Bring",
    metaTitle: "What Not to Bring on a Cruise — Prohibited Items Checklist",
    metaDescription:
      "Items that get confiscated at the cruise terminal: surge protectors, irons and steamers, weapons, drones, and more. Free checklist from Travelholics.",
    category: "Packing",
    format: "pdf",
    fileName: "travelholics-cruise-what-not-to-bring.pdf",
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
    intro:
      "This is the list that saves you a conversation with security on embarkation day. These items are usually prohibited or heavily restricted across most cruise lines — the surge protector one catches people constantly, because a normal power strip is often fine while a surge-protected one is not. Always confirm against your own line and sailing.",
    sections: [
      {
        heading: "Fire & Heating Hazards",
        items: [
          "Irons and portable steamers",
          "Hot plates, immersion heaters, coffee makers, kettles",
          "Candles, incense, wax warmers",
          "Heating pads, space heaters, electric blankets (often prohibited)",
          "Curling irons and flat irons are allowed on many lines — check your policy",
        ],
      },
      {
        heading: "Power & Electrical (Commonly Confiscated)",
        items: [
          "Surge protectors and power strips with surge protection",
          "Extension cords",
          "High-wattage appliances and oversized chargers",
        ],
      },
      {
        heading: "Weapons & Look-Alikes",
        items: [
          "Firearms, ammunition, BB and pellet guns",
          "Knives (including large pocketknives), pepper spray, stun devices",
          "Toy weapons or replicas that look real",
          "Self-defense keychains or sharp tactical tools",
        ],
      },
      {
        heading: "Illegal or Restricted Substances",
        items: [
          "Illegal drugs or controlled substances without proper documentation",
          "Marijuana and THC products, including edibles and vapes — often prohibited even where legal on land",
          "Open alcohol brought onboard beyond your cruise line's allowance",
        ],
      },
      {
        heading: "Hazardous Materials",
        items: [
          "Flammable liquids such as lighter fluid and gasoline, and aerosols beyond personal size",
          "Fireworks, sparklers, explosives",
          "Compressed gas cylinders, including some camping gear",
          "Chemical cleaners or strong solvents",
        ],
      },
      {
        heading: "Electronics & Gadgets (Often Restricted)",
        items: [
          "Drones — may be banned outright or restricted to ports only",
          "Hoverboards and some lithium battery micromobility devices",
          "Two-way radios on some sailings",
          "Large speakers — sometimes restricted",
        ],
      },
      {
        heading: "Food, Beverages & Misc.",
        items: [
          "Fresh fruit, vegetables, meat, and dairy — restrictions vary by itinerary",
          "Heating food devices such as mini-grills and toaster ovens",
          "Items that violate local customs rules at ports",
        ],
      },
    ],
    tip: "If you're unsure, pack it in your suitcase and be ready for it to be held by security, or just leave it at home. Confiscated items may not be returned until the end of the cruise — or at all.",
    disclaimer:
      "For informational use only. Policies vary by cruise line and itinerary. Always confirm with your cruise line for your exact sailing.",
    readyToPublish: true,
    notes: [
      "Distinct from 'What You DON'T Need to Pack' — this one is about PROHIBITED items, the other is about UNNECESSARY items. Titles must be clearly differentiated on the page or they will be mistaken for duplicates.",
    ],
  },
  {
    id: "what-you-dont-need-to-pack",
    slug: "what-you-dont-need-to-pack-on-a-cruise",
    title: "What You DON'T Need to Pack",
    shortTitle: "Stop Overpacking",
    category: "Packing",
    format: "png",
    fileName: "travelholics-what-you-dont-need-to-pack.png",
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
    slug: "best-time-to-book-a-cruise",
    title: "The Best Time to Book a Cruise",
    shortTitle: "Best Time to Book",
    metaTitle: "Best Time to Book a Cruise — Lowest to Mid Pricing Windows",
    metaDescription:
      "When to book a cruise for the best price: the 30–90 day last-minute window, shoulder season travel, and Black Friday perk promotions — with honest pros and cons.",
    category: "Booking",
    format: "pdf",
    fileName: "travelholics-best-time-to-book-a-cruise.pdf",
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
    intro:
      "This guide is about when to book. Shoulder season is included because it is about when you travel, and that heavily affects what you pay. Each window below has a real trade-off — none of them is simply best, and the cheapest fare is not always the best deal once cabin choice and airfare are counted.",
    sections: [
      {
        heading: "30–90 Days Before Sailing",
        body: "The last-minute booking window. Cruise lines discount unsold cabins as the sail date closes in.",
        pros: [
          "Lowest potential pricing",
          "Cruise lines are motivated to fill cabins",
          "Great for spontaneous travelers",
        ],
        cons: [
          "Very limited cabin selection",
          "Flights may be expensive or unavailable",
          "Risky for families, groups, or special cabins",
        ],
        bestFor: "Locals, flexible schedules, and repeat cruisers",
      },
      {
        heading: "Shoulder Season",
        body: "Travel timing that impacts price. Shoulder season is the stretch between peak and off-season, when demand drops, crowds thin, and prices often fall with them. Timing varies by itinerary, but it typically lands late April through early June, and September through early December before the holidays.",
        pros: [
          "Lower pricing due to reduced demand",
          "Fewer kids and lighter crowds",
          "Better chance of an upgrade",
        ],
        cons: [
          "Weather can be unpredictable",
          "Overlaps hurricane season in the Caribbean, August through October",
          "Some ports or excursions may run limited hours",
        ],
        callout: "Travelholics Truth: this is value cruising — not bargain chasing.",
      },
      {
        heading: "Black Friday & Cyber Monday",
        body: "The perk-focused booking window. These promotions tend to add extras rather than cut the base fare.",
        pros: [
          "Bonus onboard credit",
          "Drink packages, Wi-Fi, or dining perks",
          "Great for stacking add-ons",
        ],
        cons: [
          "Base cruise price is not always lower",
          "Short booking windows",
          "Offers can be confusing to compare",
        ],
      },
    ],
    readyToPublish: true,
    notes: [
      "Subtitled 'Lowest → Mid Pricing' and numbered 1–3, which implies a Part 2 covering the higher-price/early-booking windows. Either label it Part 1 on the page or drop the numbering.",
    ],
  },
  {
    id: "drink-package-calculator",
    slug: "cruise-drink-package-calculator",
    title: "Drink Package Break-Even Calculator",
    shortTitle: "Drink Package Calculator",
    category: "Onboard",
    format: "xlsx",
    fileName: "travelholics-drink-package-calculator.xlsx",
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
    slug: "cruise-casino-theo-rating-explained",
    title: "THEO Theory — How the Casino Rates Your Play",
    shortTitle: "THEO Theory",
    category: "Onboard",
    format: "pdf",
    fileName: "travelholics-theo-theory-casino-guide.pdf",
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
    slug: "first-time-princess-cruise-part-1",
    title: "First Time Princess Series — Part One",
    shortTitle: "First Time Princess",
    category: "Cruise Chat",
    format: "pdf",
    fileName: "travelholics-first-time-princess-part-1.pdf",
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

/** Guides cleared to appear on /guides today. */
export const PUBLISHABLE_GUIDES = FREE_GUIDES.filter((g) => g.readyToPublish);

export function getGuide(id: string) {
  return FREE_GUIDES.find((g) => g.id === id);
}

/** Only ready guides are unlockable — the rest are not addressable at all. */
export function getUnlockableGuide(id: string) {
  return PUBLISHABLE_GUIDES.find((g) => g.id === id);
}

/** Resolve a /guides/[slug] route. Unpublished guides intentionally 404. */
export function getGuideBySlug(slug: string) {
  return PUBLISHABLE_GUIDES.find((g) => g.slug === slug);
}

/** Other guides to surface at the foot of a guide page. */
export function getRelatedGuides(slug: string, limit = 3) {
  const current = getGuideBySlug(slug);
  if (!current) return [];

  const others = PUBLISHABLE_GUIDES.filter((g) => g.slug !== slug);
  // Same-category guides first, then anything else, to fill the row.
  return [
    ...others.filter((g) => g.category === current.category),
    ...others.filter((g) => g.category !== current.category),
  ].slice(0, limit);
}

const MIME_BY_FORMAT: Record<GuideFormat, string> = {
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  png: "image/png",
};

export function guideContentType(guide: FreeGuide) {
  return MIME_BY_FORMAT[guide.format];
}

/** Human-readable size for card copy, e.g. "1.1 MB" or "58 KB". */
export function formatGuideSize(guide: FreeGuide) {
  return guide.fileSizeKb >= 1024
    ? `${(guide.fileSizeKb / 1024).toFixed(1)} MB`
    : `${guide.fileSizeKb} KB`;
}

export const GUIDE_CATEGORIES = ["Packing", "Booking", "Onboard"] as const;

export const GUIDE_CONSENT_TEXT =
  "Yes, send me my free Travelholics guide and add me to the Cruise Life list for cruise deals, new guides, and travel tips. I understand I can unsubscribe anytime.";
