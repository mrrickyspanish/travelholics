import type { LaunchConfig } from "@/components/launch/LaunchExperience";

/**
 * Configuration for the /go launch experience — the "social front door" a
 * visitor lands on from a bio link, before they enter the main site.
 *
 * Every href below points at a route that exists today. The handoff package
 * shipped with placeholders for /contact, /deals, /newsletter, /blog/cruise-packing
 * and /blog/ship-rankings, none of which are routes in this repo; they have been
 * pointed at the real equivalents.
 */
export const travelholicsLaunch: LaunchConfig = {
  brandName: "Travelholics",
  logoSrc: "/images/Traveholic_logo_wordmark_white.png",
  logoAlt: "Travelholics",
  eyebrow: "Cruise smarter. Travel better.",
  headline: "Your next vacation",
  accentHeadline: "starts right here.",
  description:
    "Cruise tips, ship rankings, travel planning, products, and personal help from Yo Travelholic.",
  enterLabel: "Enter Travelholics",
  footerLabel: "A Creative Eye Launch experience",
  transitionLabel: "Setting sail",
  gatewayEyebrow: "Choose your next move",
  gatewayHeadline: "Plan less.",
  gatewayAccentHeadline: "Experience more.",
  gatewayDescription:
    "Move from social content into the right Travelholics experience without losing the brand, context, or momentum that brought you here.",
  // The hero video supplies the ocean, so the chrome stays out of its way:
  // deep navy glass over the footage, warm sun tones for type and CTAs.
  accentColor: "#F59E0B", // gold — low sun
  accentRgb: "245,158,11",
  secondaryColor: "#FCE8DC", // hero-sky — warm light on the horizon
  backgroundColor: "#0B2A3A", // navy, deepened — open water
  surfaceColor: "#14384E", // navy — glass sitting on the water
  // Same hero footage and poster frame the homepage uses, so /go and / open
  // on the identical shot.
  backgroundVideoSrc:
    "https://bnjcpfocmgtmutfbanhs.supabase.co/storage/v1/object/public/Images/travel_updated_hero_vid_2.mp4",
  backgroundPosterSrc: "/images/Charlotte_Amalie_StThomas.jpg",
  actions: [
    {
      id: "book",
      label: "Plan or Book Your Trip",
      eyebrow: "Personal travel help",
      href: "/#contact",
      icon: "compass",
      featured: true,
    },
    {
      id: "youtube",
      label: "Watch the Latest Video",
      eyebrow: "Cruise tips and rankings",
      href: "/videos",
      icon: "work",
    },
    {
      id: "resources",
      label: "Explore Cruise Resources",
      eyebrow: "Open without leaving",
      icon: "services",
      previewStyle: "list",
      previewItems: [
        {
          title: "Free Cruise Guides",
          description: "Packing checklists for Alaska and Hawaii, free to read or print.",
          href: "/guides",
        },
        {
          title: "What Not to Bring",
          description: "The items that get confiscated at the terminal.",
          href: "/guides/what-not-to-bring-on-a-cruise",
        },
        {
          title: "Best Time to Book",
          description: "Booking windows, shoulder season, and Black Friday perks.",
          href: "/guides/best-time-to-book-a-cruise",
        },
      ],
    },
    {
      id: "shop",
      label: "Shop Travelholics",
      eyebrow: "Cruise-ready favorites",
      icon: "shop",
      previewStyle: "cards",
      previewItems: [
        {
          title: "Cruise Door Magnets",
          description: "Personalize your cabin door with Travelholics style.",
          href: "/shop",
          tag: "Featured",
        },
        {
          title: "Premium Lanyards",
          description: "Keep your SeaPass secure without sacrificing the look.",
          href: "/shop",
          tag: "Cruise Essential",
        },
        {
          title: "Luggage Tags",
          description: "Boarding-pass inspired identification for every trip.",
          href: "/shop",
          tag: "Travel Gear",
        },
      ],
    },
  ],
  socials: [
    { label: "YouTube", href: "https://www.youtube.com/@yotravelholic", icon: "work" },
    { label: "TikTok", href: "https://www.tiktok.com/@rjsmom1", icon: "external" },
    { label: "Email", href: "mailto:hello@yotravelholic.com", icon: "mail" },
  ],
  gatewayItems: [
    {
      number: "01",
      title: "Plan a trip",
      description:
        "Start a conversation about your cruise or vacation and get personal help.",
      href: "/#contact",
    },
    {
      number: "02",
      title: "Watch and learn",
      description:
        "Move into Travelholics videos, rankings, packing advice, and cruise alerts.",
      href: "/videos",
    },
    {
      number: "03",
      title: "Shop the brand",
      description:
        "Browse cruise accessories and travel products selected for the Travelholics audience.",
      href: "/shop",
    },
    {
      number: "04",
      title: "Join the list",
      description: "Get new videos, cruise updates, and offers delivered directly.",
      href: "/#newsletter",
    },
  ],
};
