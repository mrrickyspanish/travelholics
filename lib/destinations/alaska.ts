import type { DestinationConfig } from "./types";

// ⚠️ TODO lines need Yolanda's real opinions and real affiliate URLs before launch.

export const alaska: DestinationConfig = {
  slug: "alaska",
  name: "Alaska",
  seoTitle: "Alaska Cruise Planning with a Certified Cruise Specialist",
  seoDescription:
    "Plan your Alaska cruise with Yolanda, a CLIA Certified Cruise Specialist with 20+ years of experience. Glacier routes, balcony-side advice, the excursions worth it, and zero booking fees.",
  heroEyebrow: "Cruise Alaska",
  heroHeadline: "Alaska is the cruise that turns travelers into cruisers.",
  heroTake: "Pack the parka. Thank me on the glacier day.",
  heroImage: "/images/destinations/alaska-hero.png",
  heroImageAlt: "Glacier and mountain landscape on an Alaska cruise route",
  whyParagraphs: [
    "Alaska is the one itinerary where the ship is genuinely the best way to see the destination. The Inside Passage, the glaciers, the whales, most of it is only reachable by water. But Alaska punishes a lazy booking more than any other route. The wrong cabin side, the wrong week, or the wrong glacier itinerary and you miss the entire reason you came.",
    "This is where having a specialist actually shows. I know which lines run Glacier Bay versus Hubbard, which side of the ship faces the scenery on each route, and which excursions justify Alaska prices. Same cost as booking direct. Very different trip.",
  ],
  bestTime: {
    headline: "When to sail Alaska",
    body: "Alaska is a short season, roughly May through September, and every month sails differently. This is the destination where timing changes what you see, not just what you pay.",
    bestMonths:
      "Late June through July for long daylight and peak wildlife. May and September for lower prices and fewer crowds, with a real chance of northern lights in September.",
    avoid:
      "Nothing is truly bad, but early May can still be cold and some excursions are not running yet. Book May for value, not for guarantees.",
    idealFor: [
      "Travelers who think cruises are just beaches",
      "Wildlife and photography lovers",
      "Multi-gen family trips",
      "Anyone with a bucket list",
    ],
  },
  portNotes: [
    {
      port: "Juneau",
      verdict: "Book the glacier, skip the gift shops",
      note: "TODO: Yolanda's real take. Draft: Mendenhall Glacier is the move, and whale watching out of Juneau is the most reliable I have seen anywhere. Downtown is for souvenirs you will regret.",
    },
    {
      port: "Skagway",
      verdict: "The train is worth it",
      note: "TODO: Yolanda's real take. Draft: The White Pass railway is a tourist thing that is actually good. Sit on the left side going up. Trust me.",
    },
    {
      port: "Ketchikan",
      verdict: "Short port, plan tight",
      note: "TODO: Yolanda's real take. Draft: Ketchikan stops are often short. Pick one thing, Creek Street or a floatplane, and do it well instead of rushing two.",
    },
    {
      port: "Glacier Bay / Scenic Cruising",
      verdict: "Cabin side matters most here",
      note: "TODO: Yolanda's real take. Draft: This is the day your balcony pays for itself. Order room service, wear every layer you packed, and stay outside when the ice calves.",
    },
    {
      port: "Victoria, BC",
      verdict: "The bonus port",
      note: "TODO: Yolanda's real take. Draft: Usually an evening stop. Butchart Gardens if you have the hours, a waterfront walk if you do not.",
    },
  ],
  excursions: [
    {
      name: "TODO: Excursion name",
      port: "Juneau",
      blurb: "TODO: One line on why this beats the ship-sold version.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
    {
      name: "TODO: Excursion name",
      port: "Skagway",
      blurb: "TODO: One line on why Yolanda recommends it.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
    {
      name: "TODO: Excursion name",
      port: "Ketchikan",
      blurb: "TODO: One line on why Yolanda recommends it.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
  ],
  testimonial: {
    quote:
      "I was nervous about traveling with a group, but this ended up being one of the best trips I've ever taken. Good people, good energy, and everything was organized from start to finish.",
    name: "RJ Barnes",
    trip: "Alaska Group Trip",
  },
  faqs: [
    {
      question: "When is the best time to take an Alaska cruise?",
      answer:
        "The season runs May through September. Late June and July bring the longest daylight and peak wildlife. May and September offer lower prices and thinner crowds, and September sailings have a real shot at the northern lights.",
    },
    {
      question: "Do I need a balcony cabin for an Alaska cruise?",
      answer:
        "It is the one itinerary where I push for it. Glacier days and Inside Passage scenic cruising happen from the ship, and a balcony turns those into private front-row days. If the budget is tight, I will find you the right oceanview instead, on the right side of the ship.",
    },
    {
      question: "Glacier Bay or Hubbard Glacier, which itinerary is better?",
      answer:
        "Both are spectacular and they are not interchangeable. Glacier Bay is a national park with ranger narration and multiple glaciers. Hubbard is one massive, very active glacier. Which one fits depends on your line, your dates, and what you want from the day. That is exactly the kind of call I make with you.",
    },
    {
      question: "Does booking an Alaska cruise through a travel advisor cost more?",
      answer:
        "No. You pay the same as booking direct, with no booking fees. You also get cabin-side advice, itinerary comparison across lines, and someone who answers the phone if a flight delay threatens your embarkation.",
    },
    {
      question: "Are Alaska shore excursions worth the price?",
      answer:
        "Alaska excursions are the priciest in cruising and some are absolutely worth it. Whale watching, glacier access, and the Skagway railway tend to earn their cost. I tell my travelers which ones to book, which to skip, and where independent operators beat the ship's price.",
    },
    {
      question: "What should I pack for an Alaska cruise?",
      answer:
        "Layers, a real waterproof jacket, and binoculars you will actually use. Summer days can hit the 70s and glacier days can feel like winter, sometimes in the same afternoon. I send every Alaska traveler my packing list before they sail.",
    },
  ],
  relatedSlugs: ["caribbean", "mediterranean"],
};
