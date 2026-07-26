export type ShopZone = "tiktok" | "amazon" | "merch";

export interface AffiliateProduct {
  id: string;
  zone: Exclude<ShopZone, "merch">;
  name: string;
  category: string;
  price: string;
  badge: string;
  href: string;
  caption: string;
  visualLabel: string;
  accentFrom: string;
  accentTo: string;
  /** Amazon ASIN, for building clean destination URLs. */
  asin?: string;
  /** Full product title exactly as listed on Amazon. */
  listingTitle?: string;
  /**
   * The Linktree Shop click-tracking URL. Kept for reference only — see
   * AMAZON_ASSOCIATE_TAG below before choosing which URL the site links to.
   */
  linktreeHref?: string;
}

export interface MerchOptionSet {
  colors: string[];
  sizes: string[];
}

export interface MerchProduct {
  id: string;
  zone: "merch";
  name: string;
  displayName?: string;
  description: string;
  badge: string;
  price: number;
  compareAtPrice?: number;
  bundlePrice?: number;
  bundleQuantity?: number;
  currency: "usd";
  stripeLabel: string;
  checkoutMode: "api";
  colors: string[];
  sizes: string[];
  mockupLabel: string;
  imageSrc?: string;
  category?: string;
  subtitle?: string;
  details?: string[];
  gallery?: {
    label: string;
    imageSrc: string;
    alt: string;
  }[];
  comingSoon?: boolean;
}

export const SHOP_TABS = [
  { id: "travelholics-originals", label: "Originals" },
  { id: "travelholics-finds", label: "Finds" },
] as const;

/**
 * Amazon Associates tag carried by every delivered affiliate URL.
 *
 * NOTE: `113088-…` is Linktree's Associates store ID and `travelholic_68` is
 * the sub-tag inside it — these links earn through Linktree's account, not
 * through a Travelholics-owned Associates account. Swap this constant once a
 * first-party tag is approved.
 */
export const AMAZON_ASSOCIATE_TAG = "113088-travelholic_68-20";

/** Build a clean tagged Amazon URL from an ASIN. */
export function amazonUrl(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ogi&th=1&psc=1`;
}

/**
 * Live affiliate inventory, from travelholic_shop_affiliate_inventory.xlsx
 * (Linktree Shop tab, captured 2026-07-26). Prices are the listed prices on
 * that date and will drift — treat them as indicative, not guaranteed.
 *
 * `caption` copy below is descriptive placeholder text. It deliberately avoids
 * first-person claims ("I use these every sailing") because that voice has to
 * come from Yolanda, not from us.
 */
export const AMAZON_PRODUCTS: AffiliateProduct[] = [
  {
    id: "amazon-cruise-rubber-ducks",
    zone: "amazon",
    name: "Cruise Ship Rubber Ducks — 110 Piece Hiding Kit",
    listingTitle:
      "110 Pieces Rubber Ducks for Cruise Ships Hiding with Tags Kits",
    category: "Cruise Traditions",
    price: "$20.99",
    badge: "Fan Favorite",
    href: "https://www.amazon.com/dp/B0F43VD9C8?tag=113088-travelholic_68-20&linkCode=ogi&th=1&psc=1",
    asin: "B0F43VD9C8",
    caption:
      "Duck hiding is one of the best traditions at sea. This kit comes with tags so you're ready on day one.",
    visualLabel: "Cruising duck life",
    accentFrom: "#ca8a04",
    accentTo: "#f59e0b",
    linktreeHref:
      "https://earn.linktr.ee/clicks/v2?b64=eyJ1c2VybmFtZSI6InRyYXZlbGhvbGljXzY4IiwibmV0d29yayI6IkFtYXpvbiIsInVybCI6Imh0dHBzOi8vci5hbXpsaW5rLnRvLz9idG5fdXJsPWh0dHBzJTNBJTJGJTJGd3d3LmFtYXpvbi5jb20lMkZkcCUyRkIwRjQzVkQ5QzglM0Z0YWclM0QxMTMwODgtdHJhdmVsaG9saWNfNjgtMjAlMjZsaW5rQ29kZSUzRG9naSUyNnRoJTNEMSUyNnBzYyUzRDEmYnRuX3JlZj1vcmctNDMzYmIzOTNlMWI4YjUwMyIsInZlcnNpb24iOiJ2MiIsInNpZ25hdHVyZSI6ImMzMWJkODEzZmRiZTBmMWU2N2E1N2NhN2ExZTI1ZmMwNWE1ZTJlZjBjYmJlODI1NGIwNDU1ODA2M2NmZjE5YjUifQ%253D%253D",
  },
  {
    id: "amazon-travel-power-converter",
    zone: "amazon",
    name: "220V to 110V Travel Adapter & Power Converter",
    listingTitle:
      "DAILYLIFE 220V to 110V Converter, Travel Adapter US to Europe - Power Converter Adapter Combo with 3 USB C and 1 USB A for US/UK/EU/AU, (1 Pack) - Black",
    category: "Airport & Transit",
    price: "$19.99",
    badge: "Trip Essential",
    href: "https://www.amazon.com/dp/B0D95QMZJ2?tag=113088-travelholic_68-20&linkCode=ogi&th=1&psc=1",
    asin: "B0D95QMZJ2",
    caption:
      "Covers US, UK, EU, and AU outlets with three USB-C ports and one USB-A, so the whole cabin charges off one plug.",
    visualLabel: "Charge anywhere",
    accentFrom: "#334155",
    accentTo: "#475569",
    linktreeHref:
      "https://earn.linktr.ee/clicks/v2?b64=eyJ1c2VybmFtZSI6InRyYXZlbGhvbGljXzY4IiwibmV0d29yayI6IkFtYXpvbiIsInVybCI6Imh0dHBzOi8vci5hbXpsaW5rLnRvLz9idG5fdXJsPWh0dHBzJTNBJTJGJTJGd3d3LmFtYXpvbi5jb20lMkZkcCUyRkIwRDk1UU1aSjIlMkZyZWYlM0Rhc2NfZGZfQjBEOTVRTVpKMjE3Njg5OTMyMDAwMDAlM0Z0YWclM0QxMTMwODgtdHJhdmVsaG9saWNfNjgtMjAlMjZjcmVhdGl2ZSUzRDM5NTI2MSUyNmNyZWF0aXZlQVNJTiUzREIwRDk1UU1aSjIlMjZsaW5rQ29kZSUzRGFzbiZidG5fcmVmPW9yZy00MzNiYjM5M2UxYjhiNTAzIiwidmVyc2lvbiI6InYyIiwic2lnbmF0dXJlIjoiYzhkNDEzOGI1YmExMTIwMzQyNzE0YTE5N2Y4MjBmZjFmZDkzNjZjYzQyNGE5ODE4OWFlMmU0NWFhMDVhNjY3YiJ9",
  },
  {
    id: "amazon-luggage-tags-royal-caribbean",
    zone: "amazon",
    name: "Royal Caribbean Luggage Tag Holders (4 Pack)",
    listingTitle:
      "Cruise On Royal Caribbean Cruise Luggage Tag Holder (4 Pack) – Fits All Royal Caribbean Ships, Durable Travel ID Holders for 2026-2027 Cruises, Clear Waterproof Cruise Essentials",
    category: "Cruise Essentials",
    price: "$12.99",
    badge: "Royal Caribbean",
    href: "https://www.amazon.com/dp/B074TRRXCS?tag=113088-travelholic_68-20&linkCode=ogi&th=1&psc=1",
    asin: "B074TRRXCS",
    caption:
      "Clear, waterproof holders sized for Royal Caribbean tags so they survive the walk from the terminal to your cabin.",
    visualLabel: "Embarkation day",
    accentFrom: "#1e3a8a",
    accentTo: "#2563eb",
    linktreeHref:
      "https://earn.linktr.ee/clicks/v2?b64=eyJ1c2VybmFtZSI6InRyYXZlbGhvbGljXzY4IiwibmV0d29yayI6IkFtYXpvbiIsInVybCI6Imh0dHBzOi8vci5hbXpsaW5rLnRvLz9idG5fdXJsPWh0dHBzJTNBJTJGJTJGd3d3LmFtYXpvbi5jb20lMkZkcCUyRkIwNzRUUlJYQ1MlMkZyZWYlM0Rhc2NfZGZfQjA3NFRSUlhDUzE3ODQ5NzcyMDAwMDAlM0Z0YWclM0QxMTMwODgtdHJhdmVsaG9saWNfNjgtMjAlMjZjcmVhdGl2ZSUzRDM5NTI2MSUyNmNyZWF0aXZlQVNJTiUzREIwNzRUUlJYQ1MlMjZsaW5rQ29kZSUzRGFzbiZidG5fcmVmPW9yZy00MzNiYjM5M2UxYjhiNTAzIiwidmVyc2lvbiI6InYyIiwic2lnbmF0dXJlIjoiZDgxY2M5Y2M2N2IzMWZlYjU2ZGYwNzAzZjQ1YjBlMzZhMTVjNWZhMzQ5Njc2MTE4ZGU1ODRjNmQwZDFlZDg4OCJ9",
  },
  {
    id: "amazon-luggage-tags-multi-line",
    zone: "amazon",
    name: "Cruise Luggage Tag Holders — Carnival, Princess, NCL, MSC",
    listingTitle:
      "Cruise Ship Essentials for Carnival, Princess, NCL, MSC by JOLLYANTS, Cruise Luggage Tag Holders, Cruise Must Haves Waterproof & Reusable",
    category: "Cruise Essentials",
    price: "$5.99",
    badge: "Under $10",
    href: "https://www.amazon.com/dp/B07MX2WFB8?tag=113088-travelholic_68-20&linkCode=ogi&th=1&psc=1",
    asin: "B07MX2WFB8",
    caption:
      "Waterproof and reusable holders that fit Carnival, Princess, NCL, and MSC tags — the cheapest cruise upgrade on this list.",
    visualLabel: "Multi-line fit",
    accentFrom: "#0f766e",
    accentTo: "#14b8a6",
    linktreeHref:
      "https://earn.linktr.ee/clicks/v2?b64=eyJ1c2VybmFtZSI6InRyYXZlbGhvbGljXzY4IiwibmV0d29yayI6IkFtYXpvbiIsInVybCI6Imh0dHBzOi8vci5hbXpsaW5rLnRvLz9idG5fdXJsPWh0dHBzJTNBJTJGJTJGd3d3LmFtYXpvbi5jb20lMkZkcCUyRkIwN01YMldGQjglMkZyZWYlM0Rhc2NfZGZfQjA3TVgyV0ZCODE3ODQ5NzcyMDAwMDAlM0Z0YWclM0QxMTMwODgtdHJhdmVsaG9saWNfNjgtMjAlMjZjcmVhdGl2ZSUzRDM5NTI2MSUyNmNyZWF0aXZlQVNJTiUzREIwN01YMldGQjglMjZsaW5rQ29kZSUzRGFzbiZidG5fcmVmPW9yZy00MzNiYjM5M2UxYjhiNTAzIiwidmVyc2lvbiI6InYyIiwic2lnbmF0dXJlIjoiOTg5MzI1NzUzMjVlNDIwOTljODdiZWU1MTA3M2FmM2FlZGU5MjIzNDgzM2I0ODhiYjcxNjk4ODAyMGIzNTliMiJ9",
  },
  {
    id: "amazon-luggage-tags-disney",
    zone: "amazon",
    name: "Disney Cruise Line Luggage Tag Holders (8 Pack)",
    listingTitle:
      "DCL Cruise Luggage Tag Holders, 8 Pack Zip Seal Clear Cruise Luggage Tag Holder with Steel Loops Fits for Dream, Fantasy, Magic, Wonder, Wish & Treasure 2025-2026 (8 Pcs with 7 Colors)",
    category: "Cruise Essentials",
    price: "$7.99",
    badge: "Disney Cruise Line",
    href: "https://www.amazon.com/dp/B0D46J7JPC?tag=113088-travelholic_68-20&linkCode=ogi&th=1&psc=1",
    asin: "B0D46J7JPC",
    caption:
      "Zip-seal holders with steel loops in seven colors, sized for Dream, Fantasy, Magic, Wonder, Wish, and Treasure.",
    visualLabel: "DCL ready",
    accentFrom: "#5b21b6",
    accentTo: "#7c3aed",
    linktreeHref:
      "https://earn.linktr.ee/clicks/v2?b64=eyJ1c2VybmFtZSI6InRyYXZlbGhvbGljXzY4IiwibmV0d29yayI6IkFtYXpvbiIsInVybCI6Imh0dHBzOi8vci5hbXpsaW5rLnRvLz9idG5fdXJsPWh0dHBzJTNBJTJGJTJGd3d3LmFtYXpvbi5jb20lMkZkcCUyRkIwRDQ2SjdKUEMlM0Z0YWclM0QxMTMwODgtdHJhdmVsaG9saWNfNjgtMjAlMjZsaW5rQ29kZSUzRG9naSUyNnRoJTNEMSUyNnBzYyUzRDEmYnRuX3JlZj1vcmctNDMzYmIzOTNlMWI4YjUwMyIsInZlcnNpb24iOiJ2MiIsInNpZ25hdHVyZSI6IjQxOTUyMmJiMzUwMzMxNDFkYjgwZmRkZWJlZGJmZTk2YmY0NDIzYmIxZTViMGE0MWM5NjNhMWM0NWNjYTZhOWMifQ%253D%253D",
  },
];

/**
 * No TikTok Shop inventory was included in the delivered link pack — the
 * spreadsheet covers the five Linktree Shop cards only. Populate this once
 * TikTok Shop links exist; until then the Shop page should not advertise a
 * TikTok zone.
 */
export const TIKTOK_PRODUCTS: AffiliateProduct[] = [];

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: "merch-cruise-card-lanyard-atlantis",
    zone: "merch",
    name: "Travelholics Atlantis Lanyard",
    displayName: "Atlantis Lanyard",
    subtitle: "Atlantis Travelholics Edition",
    description:
      "Keeps your cruise card, room key, or travel pass close without sacrificing style. Designed in the signature Atlantis colorway with Travelholics branding, cruise-inspired icons, and a silver lobster claw clip.",
    badge: "Travel Essentials",
    price: 1200,
    compareAtPrice: 1400,
    bundlePrice: 1800,
    bundleQuantity: 2,
    currency: "usd",
    stripeLabel: "Travelholics Cruise Card Lanyard — Atlantis Edition",
    checkoutMode: "api",
    colors: ["Atlantis Gradient"],
    sizes: ["One Size"],
    mockupLabel: "Atlantis Edition",
    imageSrc: "/images/travelholics_lanyard_hero.png",
    category: "Travel Essentials",
    details: [
      '1" wide lanyard',
      '36" standard length',
      "Full-color dye sublimation",
      "Printed on both sides",
      "Travelholics logo pattern on front",
      "YOTRAVELHOLIC.COM on back",
      "Silver lobster claw attachment",
      "Smooth polyester feel",
      "Great for cruise cards, ID badges, room keys, and travel passes",
    ],
    gallery: [
      {
        label: "Hero product image",
        imageSrc: "/images/travelholics_lanyard_hero.png",
        alt: "Travelholics Cruise Card Lanyard Atlantis Edition hero product photo",
      },
      {
        label: "Approved design/spec image",
        imageSrc: "/images/travelholics_lanyard_specs.png",
        alt: "Travelholics Cruise Card Lanyard approved front and back design specification image",
      },
      {
        label: "Logo repeat close-up",
        imageSrc: "/images/travelholics_lanyard_logo_repeat.png",
        alt: "Travelholics Cruise Card Lanyard front and back logo repeat in Atlantis gradient",
      },
      {
        label: "Clip/detail image",
        imageSrc: "/images/travelholics_lanyard_clip_detail.png",
        alt: "Travelholics Cruise Card Lanyard silver lobster claw clip close-up",
      },
      {
        label: "Lifestyle/use image",
        imageSrc: "/images/travelholics_lanyard_lifestyle.png",
        alt: "Travelholics Cruise Card Lanyard styled with passport and travel essentials",
      },
    ],
  },
  {
    id: "merch-magnet-ticket-pacific",
    zone: "merch",
    name: "Travelholics Cruise Life Door Magnet",
    displayName: "Cruise Life Door Magnet",
    description:
      "A collectible Travelholics door magnet made to stand out on your stateroom door. Inspired by the Cruise Life aesthetic — bold, graphic, and built for the sailing community.",
    badge: "Cruise Life",
    price: 1999,
    currency: "usd",
    stripeLabel: "Travelholics Cruise Ticket Door Magnet",
    checkoutMode: "api",
    colors: ["Standard"],
    sizes: ["One Size"],
    mockupLabel: "Ticket edition",
    imageSrc: "/images/travelholic_ticket_magnent_pacific.png",
  },
  {
    id: "merch-magnet-mexican-pacific",
    zone: "merch",
    name: "Pacific Mexican Door Magnet",
    displayName: "Pacific Coast Magnet",
    description:
      "A bold Travelholics magnet made to bring personality and cruise energy to your door.",
    badge: "Original",
    price: 1999,
    currency: "usd",
    stripeLabel: "Travelholics Pacific Mexican Door Magnet",
    checkoutMode: "api",
    colors: ["Standard"],
    sizes: ["One Size"],
    mockupLabel: "Classic edition",
    imageSrc: "/images/pacific_mexican_door_magnent.png",
  },
  {
    id: "merch-crewneck",
    zone: "merch",
    name: "Travelholics Crewneck",
    description:
      "Official Travelholics gear with a clean logo-forward front that works at the airport, on deck, or on a casual day out.",
    badge: "New Drop",
    price: 5800,
    currency: "usd",
    stripeLabel: "Travelholics Crewneck",
    checkoutMode: "api",
    colors: ["Navy", "Sand", "Forest"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    mockupLabel: "Wordmark front",
    imageSrc: "/images/travelholics_lifestyle_couple-beach-tees.png",
  },
  {
    id: "merch-hoodie",
    zone: "merch",
    name: "Travelholics Hoodie",
    description:
      "Heavyweight comfort with the brand front and center. This is the one for chilly sail-aways and airport mornings.",
    badge: "Best Seller",
    price: 7200,
    currency: "usd",
    stripeLabel: "Travelholics Hoodie",
    checkoutMode: "api",
    colors: ["Navy", "Cream", "Forest"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    mockupLabel: "Circle logo",
    imageSrc: "/images/travelholics_lifestyle_compass-tee-backview.png",
  },
  {
    id: "merch-polo",
    zone: "merch",
    name: "Travelholics Polo",
    description:
      "A sharper option with a small embroidered-style chest mark. Easy to wear when you want the brand to feel elevated.",
    badge: "Premium Pick",
    price: 6400,
    currency: "usd",
    stripeLabel: "Travelholics Polo",
    checkoutMode: "api",
    colors: ["Navy", "White", "Forest"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    mockupLabel: "Chest mark",
    imageSrc: "/images/travelholics_lifestyle_linen-shirt-cruise-deck.png",
  },
  {
    id: "merch-bucket-hat",
    zone: "merch",
    name: "Travelholics Bucket Hat",
    description:
      "The signature Travelholics bucket hat. Built for deck days, port stops, and every adventure in between.",
    badge: "Coming Soon",
    price: 3800,
    currency: "usd",
    stripeLabel: "Travelholics Bucket Hat",
    checkoutMode: "api",
    colors: ["Navy", "Sand", "Cream"],
    sizes: ["One Size"],
    mockupLabel: "Bucket hat",
    imageSrc: "/images/Travelholics_merch_bucket_hat.png",
    comingSoon: true,
  },
];

export function formatMerchPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}
