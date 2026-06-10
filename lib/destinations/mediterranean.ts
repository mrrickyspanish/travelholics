import type { DestinationConfig } from "./types";

// ⚠️ TODO lines need Yolanda's real opinions and real affiliate URLs before launch.

export const mediterranean: DestinationConfig = {
  slug: "mediterranean",
  name: "Mediterranean",
  seoTitle: "Mediterranean Cruise Planning with a Certified Cruise Specialist",
  seoDescription:
    "Plan your Mediterranean cruise with Yolanda, a CLIA Certified Cruise Specialist with 20+ years of experience. Port strategy, the excursions worth booking, and zero booking fees.",
  heroEyebrow: "Cruise the Mediterranean",
  heroHeadline: "Europe, unpacked once.",
  heroTake: "Three countries in a week and your suitcase never moves.",
  heroImage: "/images/destinations/mediterranean-hero.png",
  heroImageAlt: "Mediterranean coastal town seen from a cruise ship",
  whyParagraphs: [
    "The Mediterranean is the best value in European travel that almost nobody frames that way. Hotels in three countries, trains between them, restaurants every night, that adds up fast. A Med cruise gives you Barcelona, Rome, and the Greek islands with one unpack and your meals already handled.",
    "The catch is that Med ports are not beach days. They are big, historic cities where the port is sometimes an hour from the sights, and a badly planned day means spending Rome in a bus line. This is the itinerary where port strategy is everything, and where I earn my keep. Same price as booking direct, with a plan for every port before you board.",
  ],
  bestTime: {
    headline: "When to sail the Mediterranean",
    body: "The Med season runs April through November, and the difference between months is crowds and heat more than weather risk.",
    bestMonths:
      "May, early June, September, and October. Warm enough to swim, cool enough to walk ruins, and the summer crowds are gone.",
    avoid:
      "Late July and August if you can. It is beautiful, but European vacation season means peak prices, peak heat, and peak lines at every landmark.",
    idealFor: [
      "Travelers who want cities and culture, not just beaches",
      "First trips to Europe",
      "Couples and anniversary trips",
      "Foodies",
    ],
  },
  portNotes: [
    {
      port: "Barcelona, Spain",
      verdict: "Come early or stay late",
      note: "TODO: Yolanda's real take. Draft: Barcelona is usually embarkation, not a port stop. Fly in two days early. The city deserves more than the walk from the taxi to the terminal.",
    },
    {
      port: "Civitavecchia (Rome), Italy",
      verdict: "Plan this day like a mission",
      note: "TODO: Yolanda's real take. Draft: The port is over an hour from Rome. This is the one day I almost always recommend a structured tour with guaranteed return. Missing the ship in Italy is a story you do not want.",
    },
    {
      port: "Santorini, Greece",
      verdict: "Beat the cable car line",
      note: "TODO: Yolanda's real take. Draft: The views are real and so are the tender lines. Go early, head to Oia first while the crowds sleep in, work your way back.",
    },
    {
      port: "Mykonos, Greece",
      verdict: "Wander on purpose",
      note: "TODO: Yolanda's real take. Draft: This is the port where you do not need a tour. Get lost in the old town, find a windmill, eat by the water in Little Venice.",
    },
    {
      port: "Naples, Italy",
      verdict: "Pick one: Pompeii or the coast",
      note: "TODO: Yolanda's real take. Draft: People try to do Pompeii and the Amalfi Coast in one port day. Pick one and do it right. And yes, eat the pizza where it was invented.",
    },
  ],
  excursions: [
    {
      name: "TODO: Excursion name",
      port: "Rome (Civitavecchia)",
      blurb: "TODO: One line on why this beats the ship-sold version.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
    {
      name: "TODO: Excursion name",
      port: "Santorini",
      blurb: "TODO: One line on why Yolanda recommends it.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
    {
      name: "TODO: Excursion name",
      port: "Naples",
      blurb: "TODO: One line on why Yolanda recommends it.",
      url: "https://TODO-affiliate-link.example.com",
      priceFrom: "From $TODO",
    },
  ],
  testimonial: {
    quote:
      "Yolanda made our birthday cruise feel effortless. From the cabin choice to the little details, everything felt thought through. We just showed up and enjoyed ourselves.",
    name: "Alana Santos",
    trip: "Bahamas Cruise",
  },
  faqs: [
    {
      question: "Is a Mediterranean cruise a good way to see Europe for the first time?",
      answer:
        "It is one of the best. You sample multiple countries with one unpack, your hotel travels with you, and you learn which cities you want to return to for a longer stay. I help first-timers pick itineraries that balance big landmarks with breathing room.",
    },
    {
      question: "When is the best time for a Mediterranean cruise?",
      answer:
        "May, early June, September, and October are the sweet spot: swimmable water, walkable temperatures, and far smaller crowds than July and August, when European holiday season peaks.",
    },
    {
      question: "Do I need excursions in Mediterranean ports?",
      answer:
        "It depends on the port. Rome and Florence sit far from their ports and reward structured tours with guaranteed ship return. Greek island stops like Mykonos are better wandered on your own. I map this out port by port for every traveler before they sail.",
    },
    {
      question: "Does booking a Mediterranean cruise through a travel advisor cost more?",
      answer:
        "No. Same price as booking direct, no booking fees, and you get port strategy, cabin advice, and a real person to call if a flight or train threatens your embarkation day in a foreign country.",
    },
    {
      question: "Eastern or Western Mediterranean, which itinerary should I pick?",
      answer:
        "Western leans Spain, France, and Italy: big cities, art, and food. Eastern leans Greece, Croatia, and Turkey: islands, ruins, and coastlines. Neither is better. The right one depends on whether your dream day is the Vatican or a Santorini sunset, and I will help you decide.",
    },
    {
      question: "How many days should a Mediterranean cruise be?",
      answer:
        "Seven nights covers one region well. Ten to twelve nights lets you combine regions without feeling rushed and usually includes the sea days you will want after long port days. Med port days are walking days, plan recovery time.",
    },
  ],
  relatedSlugs: ["caribbean", "alaska"],
};
