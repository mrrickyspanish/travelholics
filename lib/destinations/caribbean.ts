import type { DestinationConfig } from "./types";

// ⚠️ PORT NOTES + EXCURSIONS: drafted in Yolanda's voice as structure.
// Every line marked TODO needs her real opinion or real affiliate URL
// before this page ships. The voice is right, the specifics need her.

export const caribbean: DestinationConfig = {
  slug: "caribbean",
  name: "Caribbean",
  seoTitle: "Caribbean Cruise Planning with a Certified Cruise Specialist",
  seoDescription:
    "Plan your Caribbean cruise with Yolanda, a CLIA Certified Cruise Specialist with 20+ years at sea. Real port opinions, the excursions worth booking, and zero booking fees.",
  heroEyebrow: "Cruise the Caribbean",
  heroHeadline: "The Caribbean, planned by someone who keeps going back.",
  heroTake: "Twenty years in and I still book myself a balcony for this one.",
  heroImage: "/images/destinations/caribbean-hero.png",
  heroImageAlt: "Cruise ship docked at a Caribbean port with turquoise water",
  whyParagraphs: [
    "The Caribbean is where most people fall in love with cruising, and it is where most people get oversold. Every itinerary looks the same in the brochure. They are not the same. The difference between a trip you repeat and a trip you tolerate comes down to the ship, the cabin side, and which ports you actually get off at.",
    "I have sailed these waters across every major line. I know which private islands are worth the hype, which ports you can do yourself for a third of the excursion price, and which sea days you will actually want. When you plan with me, you pay the same as booking direct. You just stop guessing.",
  ],
  bestTime: {
    headline: "When to sail the Caribbean",
    body: "The Caribbean runs year round, but the experience does not. Pricing, weather, and crowds move in patterns, and knowing them is half the value of a specialist.",
    bestMonths:
      "December through April for the driest weather, late April through May for the price-to-weather sweet spot.",
    avoid:
      "Peak hurricane season, late August through October, unless you are flexible and chasing deals. Ships reroute, they do not cancel, but your itinerary can change.",
    idealFor: [
      "First-time cruisers",
      "Families and multi-gen groups",
      "Couples who want beach days without planning them",
      "Anyone escaping a Midwest winter",
    ],
  },
  portNotes: [
    {
      port: "Cozumel, Mexico",
      verdict: "Skip the terminal shops",
      note: "TODO: Yolanda's real take. Draft: The cruise terminal is a mall. Get past it. A short cab gets you to beach clubs the locals actually rate, and the snorkeling on the west side is some of the best on any Caribbean route.",
    },
    {
      port: "Nassau, Bahamas",
      verdict: "Have a plan or stay on the ship",
      note: "TODO: Yolanda's real take. Draft: Nassau rewards people who book something and punishes people who wander. If you do not have a beach day or excursion locked, this is honestly a great day to enjoy a quiet ship.",
    },
    {
      port: "Grand Cayman",
      verdict: "Worth the tender wait",
      note: "TODO: Yolanda's real take. Draft: Stingray City is the rare famous excursion that lives up to it. Book the early slot before the sandbar gets crowded.",
    },
    {
      port: "St. Thomas, USVI",
      verdict: "The beach is the excursion",
      note: "TODO: Yolanda's real take. Draft: Magens Bay is the postcard for a reason. You do not need a tour here, you need a cab, a chair, and a return time you actually honor.",
    },
    {
      port: "Labadee / Private Islands",
      verdict: "Lean in",
      note: "TODO: Yolanda's real take. Draft: People roll their eyes at private islands until they have a full beach day with no logistics. This is the day you book nothing and enjoy everything.",
    },
  ],
  excursions: [
    {
      name: "TODO: Excursion name",
      port: "Cozumel",
      blurb: "TODO: One line on why this one beats the ship-sold version.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
    {
      name: "TODO: Excursion name",
      port: "Grand Cayman",
      blurb: "TODO: One line on why Yolanda recommends it.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
    {
      name: "TODO: Excursion name",
      port: "Nassau",
      blurb: "TODO: One line on why Yolanda recommends it.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
  ],
  testimonial: {
    quote:
      "Yolanda knows cruises inside and out. She answered every question, helped us feel prepared, and made the whole process easy. I would absolutely book with her again.",
    name: "Angela P.",
    trip: "Caribbean Cruise",
  },
  faqs: [
    {
      question: "Does booking a Caribbean cruise through a travel advisor cost more?",
      answer:
        "No. You pay the same price as booking directly with the cruise line, and there are never booking fees. The difference is you get 20+ years of Caribbean experience picking your ship, cabin, and itinerary, plus someone in your corner if anything goes sideways at sea.",
    },
    {
      question: "What is the best month for a Caribbean cruise?",
      answer:
        "December through April offers the driest, most reliable weather. Late April through May is the sweet spot where prices drop before summer crowds arrive. Late August through October is hurricane season, where deals are real but itineraries can change.",
    },
    {
      question: "Which Caribbean itinerary is best for first-time cruisers?",
      answer:
        "Western Caribbean itineraries (Cozumel, Grand Cayman, Jamaica) are a strong first cruise: short sea days, big-name ports, and easy beach access. Eastern routes trade a little convenience for prettier beaches. Tell me your travel style and I will match you to the right one.",
    },
    {
      question: "Are cruise line shore excursions worth it in the Caribbean?",
      answer:
        "Sometimes. Some ports are genuinely better with a booked excursion, and some you can do yourself for far less. I tell my travelers port by port which is which, and I share the independent excursions I trust.",
    },
    {
      question: "Can you plan a group Caribbean cruise?",
      answer:
        "Yes. I have built and led multiple group sailings, handling cabins, dining, and logistics so the group actually gets to enjoy each other. Group rates and perks often beat what individuals can book alone.",
    },
    {
      question: "How far in advance should I book a Caribbean cruise?",
      answer:
        "For the best cabin selection, 9 to 18 months out, especially for school break weeks. Last-minute deals exist, but they are a gamble on cabin location, and cabin location matters more than people think.",
    },
  ],
  relatedSlugs: ["alaska", "mediterranean"],
};
