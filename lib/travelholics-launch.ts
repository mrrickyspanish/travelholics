import type { LaunchConfig } from "@/components/launch/LaunchExperience";
import { TIKTOK_PROFILE_URL } from "@/lib/liveSchedule";

/**
 * Configuration for the /go launch experience — the "social front door" a
 * visitor lands on from the TikTok, Instagram, or YouTube bio link.
 *
 * Every href points at a route that exists in this repo. Two rules for edits:
 *
 *  1. Order is conversion order. Booking sits above content, content sits
 *     above merch. The live rail floats above all of it because that is what
 *     the bio-link audience is usually arriving for.
 *  2. Deep links beat index pages. "Shop Travelholics" opening a product page
 *     converts; opening a catalog makes the visitor start their search over.
 */
export const travelholicsLaunch: LaunchConfig = {
  brandName: "Travelholics",
  logoSrc: "/images/Traveholic_logo_wordmark_white.png",
  logoAlt: "Travelholics",
  portraitSrc: "/images/hero-yolanda.jpg",
  portraitAlt: "Yolanda Harris, Certified Cruise Specialist",
  hostName: "Yolanda Harris",
  hostTitle: "Certified Cruise Specialist · 20+ years",
  eyebrow: "Cruise smarter. Travel better.",
  headline: "Your next vacation",
  accentHeadline: "starts right here.",
  description:
    "Cruise planning, packing guides, daily lives, and travel gear — all in one place.",
  enterLabel: "Enter Travelholics",
  // The full site is the full experience. This used to open a second menu of
  // the same four links, wrapped in placeholder copy from the page template.
  enterHref: "/",
  transitionLabel: "Setting sail",
  liveScheduleHref: "/live",
  // Rendered after "© {year}" by LaunchExperience.
  footerNote: "Travelholics — Yolanda Harris. Same price as booking direct, zero planning fees.",
  footerLinks: [
    { label: "Full site", href: "/" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  // Ivory shoreline canvas with sand-toned surfaces and clear-water accents.
  accentColor: "#087F83",
  accentRgb: "8,127,131",
  secondaryColor: "#32C7C0",
  backgroundColor: "#FDFCF9",
  surfaceColor: "#F4E8D5",
  // Top-down shoreline footage supplied specifically for the /go experience.
  backgroundVideoSrc:
    "https://bnjcpfocmgtmutfbanhs.supabase.co/storage/v1/object/public/Images/higgsfield-05ce1958-13eb-4a2f-b070-109c2c7a9516.mp4",
  backgroundPosterSrc: "/images/Charlotte_Amalie_StThomas.jpg",
  actions: [
    {
      id: "plan",
      label: "Plan My Cruise",
      eyebrow: "Free — no planning fees",
      // The full intake form, not the homepage's short contact block. It
      // pre-qualifies destination, dates, budget, and party size in one pass.
      href: "/cruise-interest",
      icon: "compass",
      featured: true,
    },
    {
      id: "destinations",
      label: "Where Do You Want to Go?",
      eyebrow: "Pick your destination",
      icon: "ship",
      previewItems: [
        {
          title: "Caribbean",
          description: "Warm water year-round, shortest sailings, easiest first cruise.",
          href: "/cruises/caribbean",
          tag: "Most booked",
        },
        {
          title: "Alaska",
          description: "Glaciers and wildlife, May through September only.",
          href: "/cruises/alaska",
        },
        {
          title: "Mediterranean",
          description: "A different country most mornings. Best in shoulder season.",
          href: "/cruises/mediterranean",
        },
      ],
      previewFooter: { label: "Group trips", href: "/#group-trips" },
    },
    {
      id: "watch",
      label: "Watch the Latest Videos",
      eyebrow: "Ship tours & cruise news",
      href: "/videos",
      icon: "video",
    },
    {
      id: "guides",
      label: "Free Cruise Guides",
      eyebrow: "Free to read or print",
      icon: "guides",
      previewItems: [
        {
          title: "Alaska Cruise Packing Checklist",
          description: "Layers, rain gear, and the things people always forget.",
          href: "/guides/alaska-cruise-packing-list",
          tag: "Free",
        },
        {
          title: "What NOT to Bring on a Cruise",
          description: "The items that get confiscated at the terminal.",
          href: "/guides/what-not-to-bring-on-a-cruise",
        },
        {
          title: "The Best Time to Book a Cruise",
          description: "Booking windows, shoulder season, and Black Friday perks.",
          href: "/guides/best-time-to-book-a-cruise",
        },
      ],
      previewFooter: { label: "All free guides", href: "/guides" },
    },
    {
      id: "shop",
      label: "Shop Travelholics",
      eyebrow: "Cruise-ready favorites",
      icon: "shop",
      previewItems: [
        {
          title: "Cruise Life Door Magnet",
          description: "Find your stateroom door from down the hall. $19.99.",
          href: "/shop/merch-magnet-ticket-pacific",
          tag: "Original",
        },
        {
          title: "Atlantis Cruise Card Lanyard",
          description: "Keeps your SeaPass on you all week. $12, or two for $18.",
          href: "/shop/merch-cruise-card-lanyard-atlantis",
        },
        {
          title: "Cruise Finds on Amazon",
          description: "Luggage tag holders, power converters, and duck kits.",
          // /shop is a 307 redirect shim to /shop-full — link the real
          // catalog directly so this tap doesn't cost an extra round trip.
          href: "/shop-full",
        },
      ],
      previewFooter: { label: "Everything in the shop", href: "/shop-full" },
      note: "Amazon links are affiliate links — Travelholics may earn a commission at no extra cost to you.",
    },
  ],
  socials: [
    { label: "TikTok", href: TIKTOK_PROFILE_URL, icon: "tiktok" },
    { label: "YouTube", href: "https://www.youtube.com/@yotravelholic", icon: "youtube" },
    { label: "Instagram", href: "https://www.instagram.com/yotravelholic", icon: "instagram" },
    { label: "Facebook", href: "https://www.facebook.com/yotravelholic", icon: "facebook" },
    { label: "Text", href: "sms:+18472382473", icon: "message" },
    { label: "Email", href: "mailto:hello@yotravelholic.com", icon: "mail" },
  ],
};
