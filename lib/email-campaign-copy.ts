/**
 * Nurture email copy and campaign definitions: the single source the seed SQL
 * (`npm run build:campaign-seed`), the review previews (`npm run
 * preview:emails`) and the live send all read from.
 *
 * GENERATED from the reviewed copy in the Creative Eye Agent OS
 * (projects/travelholics/outputs/14-nurture-email-copy.md) by
 * projects/travelholics/email/import-copy.py. Edit the reviewed copy and
 * re-import, so what ships is what was approved.
 *
 * Copy is in Yolanda's voice and needs RJ's approval (and Yolanda's, through
 * RJ) before any campaign is activated. Campaigns are seeded as 'draft' and
 * send nothing until activated deliberately. Lines marked YOLANDA TO CONFIRM
 * block the seed until resolved.
 *
 * Rules enforced by `npm run check:email-campaigns`: no em dashes, preview
 * text under 90 characters, one button per email pointing at a live page.
 */

export type CampaignStepCopy = {
  position: number;
  /** Hours after enrollment (not after the previous email). */
  delayHours: number;
  templateKey: string;
  subject: string;
  preheader: string;
  paragraphs: string[];
  button: { label: string; path: string };
};

export type CampaignDefinition = {
  slug: string;
  name: string;
  /** Enrol only subscribers carrying this interest (null: everyone). */
  requiredInterest: string | null;
  /** Never enrol subscribers carrying any of these interests. */
  excludeInterests: string[];
  steps: CampaignStepCopy[];
};

/** Pages a button may point at. The check script refuses anything else. */
export const ALLOWED_PATHS = [
  "/group-cruises",
  "/cruise-interest",
  "/#contact",
  "/videos",
  "/guides",
  "/guides/what-not-to-bring-on-a-cruise",
  "/guides/hawaii-cruise-packing-list",
  "/guides/alaska-cruise-packing-list",
  "/duck-hunt",
  "/shop",
] as const;

export const CAMPAIGNS: CampaignDefinition[] = [
  {
    "slug": "cruise-life-welcome",
    "name": "Cruise Life welcome series",
    "requiredInterest": "newsletter",
    "excludeInterests": [
      "duck_hunt",
      "guides"
    ],
    "steps": [
      {
        "position": 1,
        "delayHours": 0,
        "templateKey": "welcome-01-start",
        "subject": "Welcome to Cruise Life",
        "preheader": "Start with the experience you want. The rest gets easier from there.",
        "paragraphs": [
          "Welcome to Cruise Life. You signed up because a cruise is somewhere on your mind. Maybe it is booked, maybe it is a plan, maybe it is a someday.",
          "Either way, I am glad you are here.",
          "Over the next couple of weeks I will send you a few short notes: how to pick the right cruise line for you, what to look at before you compare prices, and how I can help if you would rather not plan it alone.",
          "No pressure to book anything. If you only ever read these and plan it yourself, that is a win.",
          "The best place to start is Cruise School. Watch before you book."
        ],
        "button": {
          "label": "Start with Cruise School",
          "path": "/videos"
        }
      },
      {
        "position": 2,
        "delayHours": 48,
        "templateKey": "welcome-02-ship",
        "subject": "There is no one best cruise line",
        "preheader": "Ask a better question before you compare a single fare.",
        "paragraphs": [
          "The first thing most people ask me is which cruise line is best.",
          "Here is what I tell them. There is no one best cruise line. There is only the cruise line that's the best fit for you.",
          "Two people can take a cruise to the exact same Caribbean island and come home from two completely different vacations. [YOLANDA TO CONFIRM: her own example of what makes the two vacations different]",
          "So start with the experience you want. What do you want your vacation to feel like?",
          "Then ask one question about every cruise line you look at: does this cruise line consistently offer the experience I said I wanted?",
          "I walk through all of this in Cruise School."
        ],
        "button": {
          "label": "Watch Cruise School",
          "path": "/videos"
        }
      },
      {
        "position": 3,
        "delayHours": 120,
        "templateKey": "welcome-03-price",
        "subject": "Before you compare cruise prices",
        "preheader": "Write this down first. It makes every price easier to read.",
        "paragraphs": [
          "Before you start comparing prices, I want you to write down your top three vacation priorities.",
          "Here is why. The fare you see advertised is usually not everything you will spend. Depending on the line and the sailing, things like gratuities, taxes and port fees, drinks, wi-fi, specialty dining and excursions can sit outside it. [YOLANDA TO CONFIRM: this list, and how she wants to say it]",
          "That is not a trick. It is just how cruise pricing is quoted. But it means two fares side by side tell you very little on their own.",
          "Your three priorities tell you a lot more. If great food is on your list, look at the dining. If you need to stay connected, look at the wi-fi. Compare the things you will actually use, not just the number in the ad."
        ],
        "button": {
          "label": "Watch before you book",
          "path": "/videos"
        }
      },
      {
        "position": 4,
        "delayHours": 216,
        "templateKey": "welcome-04-plan",
        "subject": "Want me to just tell you what to book?",
        "preheader": "Personal planning support. No added planning fee.",
        "paragraphs": [
          "If you have been reading these and thinking, \"I would still rather someone just tell me what to book,\" that is what I do.",
          "You tell me what you want your vacation to feel like. I help you find the cruise line, the ship and the sailing that fit it.",
          "[YOLANDA TO CONFIRM: one or two sentences on her own cruising experience, for example which lines or ships she has sailed. Her facts, no numbers unless she supplies them.]",
          "Personal planning support. No added planning fee.",
          "Tell me where your mind keeps going."
        ],
        "button": {
          "label": "Plan my cruise",
          "path": "/#contact"
        }
      },
      {
        "position": 5,
        "delayHours": 336,
        "templateKey": "welcome-05-groups",
        "subject": "Cruising with other people? Read this first",
        "preheader": "Your people. One unforgettable cruise. A rough headcount is enough to start.",
        "paragraphs": [
          "This is the last note in my welcome series.",
          "If your cruise involves other people (a birthday, an anniversary, a reunion, a girls' trip), please do not try to run it all from a group chat.",
          "When I plan a group, everybody sees the same trip details and books their own cabin, so you are not chasing anyone. [YOLANDA TO CONFIRM: that this is how her group bookings work today, in her words]",
          "You do not need every detail to get started. A rough headcount is enough to start.",
          "Your people. One unforgettable cruise."
        ],
        "button": {
          "label": "Plan my group cruise",
          "path": "/group-cruises"
        }
      }
    ]
  },
  {
    "slug": "duck-hunt-finders",
    "name": "Duck Hunt finder series",
    "requiredInterest": "duck_hunt",
    "excludeInterests": [],
    "steps": [
      {
        "position": 1,
        "delayHours": 0,
        "templateKey": "duck-01-thanks",
        "subject": "You found the duck!",
        "preheader": "Thank you for playing the Travelholics Duck Hunt and for joining the list.",
        "paragraphs": [
          "You found the duck! Thank you for scanning it, claiming it and joining my list. Spotting a little duck on a big ship takes a good eye.",
          "[YOLANDA TO CONFIRM: one line about the prize, in her words. No shipping date, no delivery timing.]",
          "You have already been on board, so you know the feeling. Over the next couple of weeks I will send you a few short notes to help you plan the next one.",
          "And if you want a little Travelholics at home too, the shop is open."
        ],
        "button": {
          "label": "See the Travelholics shop",
          "path": "/shop"
        }
      },
      {
        "position": 2,
        "delayHours": 72,
        "templateKey": "duck-02-cruise-school",
        "subject": "Watch before you book",
        "preheader": "Cruise School lessons to help you choose your next sailing on purpose.",
        "paragraphs": [
          "You have been on a cruise, so you already know how different one ship can feel from the next.",
          "That is what Cruise School is for. It helps you choose the next one on purpose.",
          "One of my lessons is about choosing the right cruise line. Here is the heart of it: start with the experience you want. Choosing the cruise line is only half of the decision.",
          "Watch before you book."
        ],
        "button": {
          "label": "Watch Cruise School",
          "path": "/videos"
        }
      },
      {
        "position": 3,
        "delayHours": 168,
        "templateKey": "duck-03-why-yolanda",
        "subject": "Why plan your next cruise with me",
        "preheader": "Personal planning support. No added planning fee.",
        "paragraphs": [
          "You can book a cruise on your own. Plenty of people do.",
          "But if you would rather have someone in your corner, that is what I do. You tell me what you want your vacation to feel like, and I help you find the cruise line, the ship and the sailing that fit.",
          "[YOLANDA TO CONFIRM: one or two sentences, in her words, on why people plan with her. Her own experience and approach, not results, numbers or client quotes.]",
          "Personal planning support. No added planning fee.",
          "Tell me where your mind keeps going."
        ],
        "button": {
          "label": "Plan my cruise",
          "path": "/cruise-interest"
        }
      },
      {
        "position": 4,
        "delayHours": 336,
        "templateKey": "duck-04-group",
        "subject": "Bring your people next time",
        "preheader": "Your people. One unforgettable cruise. A rough headcount is enough to start.",
        "paragraphs": [
          "This is the last note in this series.",
          "You found a duck on a ship full of people. Next time, what if the people were yours?",
          "Birthdays, anniversaries, reunions, girls' trips. I plan group cruises so everybody sails together and nobody has to run it all from a group chat. [YOLANDA TO CONFIRM: which group occasions she wants to name]",
          "You do not need every detail to get started. A rough headcount is enough to start.",
          "Your people. One unforgettable cruise."
        ],
        "button": {
          "label": "Plan my group cruise",
          "path": "/group-cruises"
        }
      }
    ]
  },
  {
    "slug": "free-guide-followup",
    "name": "Free guide follow-up series",
    "requiredInterest": "guides",
    "excludeInterests": [
      "duck_hunt"
    ],
    "steps": [
      {
        "position": 1,
        "delayHours": 0,
        "templateKey": "guide-01-tip",
        "subject": "Your free guide, plus one tip",
        "preheader": "Thanks for grabbing a packing guide. Here is one tip before you sail.",
        "paragraphs": [
          "Thank you for grabbing one of my free packing guides. If you need it again, it is always on the guides page.",
          "Here is one tip that is not about packing at all: do not leave your pool towel outside your room. Take it back to the towel station.",
          "[YOLANDA TO CONFIRM: the reason, in her words. Why it matters on board.]",
          "I will check in again in a few days."
        ],
        "button": {
          "label": "Browse free guides",
          "path": "/guides"
        }
      },
      {
        "position": 2,
        "delayHours": 96,
        "templateKey": "guide-02-mistake",
        "subject": "One of the biggest cruise planning mistakes",
        "preheader": "It happens before you ever look at a price.",
        "paragraphs": [
          "Here's one of the biggest mistakes I see: choosing a cruise line before you decide what kind of vacation you actually want.",
          "There is no one best cruise line. There is only the cruise line that's the best fit for you.",
          "So before you start comparing prices, I want you to write down your top three vacation priorities. Then, for every cruise line you look at, ask: does this cruise line consistently offer the experience I said I wanted?",
          "I walk through it in my Cruise School lesson on choosing the right cruise line."
        ],
        "button": {
          "label": "Watch Cruise School",
          "path": "/videos"
        }
      },
      {
        "position": 3,
        "delayHours": 216,
        "templateKey": "guide-03-help",
        "subject": "Want help planning the rest?",
        "preheader": "Packing is one piece. I can help with the cruise itself.",
        "paragraphs": [
          "This is the last note in this series.",
          "A packing guide covers the suitcase. The bigger decisions come before that: which cruise line, which ship, which sailing.",
          "If you would like help with those, that is what I do. Tell me where your mind keeps going, and I will help you find the cruise that fits the vacation you want.",
          "Personal planning support. No added planning fee."
        ],
        "button": {
          "label": "Plan my cruise",
          "path": "/cruise-interest"
        }
      }
    ]
  }
];
