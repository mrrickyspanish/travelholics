// Destination landing page config contract.
// One file per destination in lib/destinations/.
// Keep everything serializable (no components, no functions) so configs
// can pass from server pages into client islands without issue.

export type PortNote = {
  port: string;
  /** Yolanda's real opinion, first person. This is the SEO differentiator. */
  note: string;
  /** Optional short tag, e.g. "Skip the terminal" or "Worth the early wake-up" */
  verdict?: string;
};

export type Excursion = {
  name: string;
  port: string;
  blurb: string;
  /** Affiliate URL. Rendered with rel="sponsored nofollow noopener". */
  url: string;
  /** Optional price anchor, e.g. "From $89" */
  priceFrom?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type DestinationTestimonial = {
  quote: string;
  name: string;
  trip: string;
};

export type DestinationConfig = {
  /** URL segment: /cruises/[slug] */
  slug: string;
  /** Display name, e.g. "Caribbean" */
  name: string;
  /** SEO title (without site suffix, layout template appends "| Travelholics") */
  seoTitle: string;
  seoDescription: string;
  /** Hero */
  heroEyebrow: string;
  heroHeadline: string;
  /** Yolanda's one-line take, rendered in script font */
  heroTake: string;
  /** Hero background image path under /public */
  heroImage: string;
  heroImageAlt: string;
  /** Why [destination]: 2-3 short paragraphs, Yolanda's voice */
  whyParagraphs: string[];
  /** Best time to sail + who it's for */
  bestTime: {
    headline: string;
    body: string;
    bestMonths: string;
    avoid: string;
    idealFor: string[];
  };
  portNotes: PortNote[];
  excursions: Excursion[];
  testimonial: DestinationTestimonial;
  faqs: FaqItem[];
  /** Slugs of the other destinations to cross-link */
  relatedSlugs: string[];
};
