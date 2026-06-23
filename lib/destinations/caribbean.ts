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
  personalPhoto: {
    src: "/images/dest-caribbean.jpg",
    alt: "Yolanda and a travel companion watching the sunset from a Caribbean cruise deck",
    caption: "Me, on the balcony I keep booking myself for this exact itinerary.",
  },
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
      verdict: "Hot, crowded, well-developed",
      note: "I've said it before — Cozumel is one of the hottest places I've ever set foot on. Nine times out of ten, you're sharing that port with ships from multiple cruise lines because those piers can hold four to six ships each. It's the most accessible Western Caribbean stop for travelers with mobility concerns, but go in knowing it will be busy.",
    },
    {
      port: "Nassau, Bahamas",
      verdict: "Have a plan or stay on the ship",
      note: "TODO: Yolanda's real take. Draft: Nassau rewards people who book something and punishes people who wander. If you do not have a beach day or excursion locked, this is honestly a great day to enjoy a quiet ship.",
    },
    {
      port: "Grand Cayman",
      verdict: "Tender port — plan accordingly",
      note: "Grand Cayman is a tender port, meaning the ship anchors offshore and you take a smaller boat in. That extra step matters if you have mobility concerns, and it adds time to your day. Factor that in before you commit to a full excursion schedule here.",
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
    {
      port: "Costa Maya, Mexico",
      verdict: "Extremely hot — dress smart",
      note: "I walked off the ship in Costa Maya and immediately started sweating without feeling hot — that's how intense it is. I tell my travelers this upfront so they're not caught off guard. Decent accessibility at the pier, but that heat is no joke.",
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
    {
      name: "Dunn's River Falls Climb",
      port: "Ocho Rios, Jamaica",
      blurb: "Book this one through the cruise line, not an independent vendor — the accountability matters on a physically demanding excursion where you're signing a waiver and climbing a live waterfall linked hand-to-hand with strangers. Worth every dollar.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $100",
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
    {
      question: "Is the Western Caribbean a good choice for first-time cruisers?",
      answer:
        "It's what I call the starter pack. Most ports are ported — meaning the ship pulls right up to a pier — so you're not dealing with tender boats at most stops. Things to do are right there when you walk off. Five-night sailings are available. Cost is the lowest of any Caribbean itinerary. If you've never cruised before and you want an easy, low-stress introduction, this is the one.",
    },
    {
      question: "Do I have to get off at every port?",
      answer:
        "No — and I want to say that clearly because a regular booking site won't. It is completely fine to stay on the ship at any stop. The Western Caribbean especially is a trip you can book when you just want to get away and don't care where you're going. The ship itself has plenty to do on days you'd rather not deal with the heat or the crowds.",
    },
    {
      question: "What happens if the ship changes the itinerary?",
      answer:
        "It happens, and the ship's first priority is always passenger safety, not hitting a specific destination. Weather is the most common reason. I tell every one of my travelers before they board: do not get emotionally locked into any single port. If you've been dreaming about snorkeling in Cozumel specifically, understand that port could change. Being prepared for that possibility makes the whole trip better.",
    },
    {
      question: "When is the best time to book a Western Caribbean cruise?",
      answer:
        "At least six months out for a standard booking. Prices drop when school is in session because family travel demand falls — that's your sweet spot. Avoid holidays like Christmas and New Year's if budget matters to you; deals essentially disappear. Hurricane season runs June 1 through November 30, which I always tell clients about, but I don't tell them to automatically avoid it either — just go in informed.",
    },
    {
      question: "What should I expect from the landscape at Western Caribbean ports?",
      answer:
        "Flat terrain at most stops — Mexico, Belize, Honduras. Don't book expecting mountains in those areas. Jamaica is the exception, where you get lush, dramatic scenery. Setting that expectation before you book prevents a lot of disappointment.",
    },
    {
      question: "Should I book excursions through the cruise line or independently?",
      answer:
        "For physically demanding or higher-risk activities, go through the cruise line. They're accountable, they know the conditions, and if something goes wrong they're better positioned to respond. For general port exploration and shopping you have more flexibility, but I caution against random vendors in port — especially in Jamaica, where the sales pressure can be aggressive. If you're not going through the ship, use a reputable third-party source.",
    },
  ],
  relatedSlugs: ["alaska", "mediterranean"],
};
