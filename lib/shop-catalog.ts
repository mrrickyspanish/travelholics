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
}

export interface MerchOptionSet {
  colors: string[];
  sizes: string[];
}

export interface MerchProduct {
  id: string;
  zone: "merch";
  name: string;
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

export const TIKTOK_PRODUCTS: AffiliateProduct[] = [
  {
    id: "tiktok-luggage-tags",
    zone: "tiktok",
    name: "Cruise Luggage Tag Holders",
    category: "In my videos",
    price: "$12.99",
    badge: "As seen on TikTok",
    href: "https://www.tiktok.com/@rjsmom1",
    caption:
      "I keep these in my carry-on because they save me from the paper-tag mess every single time.",
    visualLabel: "Port-day essential",
    accentFrom: "#0f172a",
    accentTo: "#111827",
  },
  {
    id: "tiktok-toiletry-organizer",
    zone: "tiktok",
    name: "Hanging Toiletry Organizer",
    category: "Shop the videos",
    price: "$24.99",
    badge: "TikTok Fave",
    href: "https://www.tiktok.com/@rjsmom1",
    caption:
      "Cruise bathrooms are tiny. This is one of those buys you appreciate the second you unpack.",
    visualLabel: "Cabin upgrade",
    accentFrom: "#1f2937",
    accentTo: "#0f766e",
  },
  {
    id: "tiktok-packing-cubes",
    zone: "tiktok",
    name: "Packing Cubes Set",
    category: "In my videos",
    price: "$29.99",
    badge: "Best Seller",
    href: "https://www.tiktok.com/@rjsmom1",
    caption:
      "This is how I keep family packing from turning into chaos. One set per person and you're good.",
    visualLabel: "Cruise reset",
    accentFrom: "#164e63",
    accentTo: "#1e3a8a",
  },
  {
    id: "tiktok-magnetic-hooks",
    zone: "tiktok",
    name: "Magnetic Hooks Set",
    category: "Shop the videos",
    price: "$9.99",
    badge: "Under $10",
    href: "https://www.tiktok.com/@rjsmom1",
    caption:
      "If you know cruise cabins, you know these hooks earn their spot every trip.",
    visualLabel: "Small but clutch",
    accentFrom: "#14532d",
    accentTo: "#065f46",
  },
];

export const AMAZON_PRODUCTS: AffiliateProduct[] = [
  {
    id: "amazon-dry-bag",
    zone: "amazon",
    name: "Waterproof Dry Bag",
    category: "Beach & Excursion Gear",
    price: "$19.99",
    badge: "Amazon's Choice",
    href: "https://www.amazon.com/s?k=waterproof+dry+bag",
    caption:
      "I always keep one of these for beach days and rainy excursions. It keeps the important stuff safe.",
    visualLabel: "Beach day",
    accentFrom: "#f59e0b",
    accentTo: "#fb923c",
  },
  {
    id: "amazon-water-shoes",
    zone: "amazon",
    name: "Water Shoes",
    category: "Beach & Excursion Gear",
    price: "$26.00",
    badge: "Travel Day Pick",
    href: "https://www.amazon.com/s?k=water+shoes+women+travel",
    caption:
      "Rocky beaches will humble you fast. These make excursion days way easier.",
    visualLabel: "Shore day",
    accentFrom: "#2563eb",
    accentTo: "#0ea5e9",
  },
  {
    id: "amazon-neck-pillow",
    zone: "amazon",
    name: "Memory Foam Neck Pillow",
    category: "Airport & Transit",
    price: "$32.00",
    badge: "Carry-On Staple",
    href: "https://www.amazon.com/s?k=memory+foam+neck+pillow+travel",
    caption:
      "Long airport days feel shorter when your neck isn't fighting for its life.",
    visualLabel: "Airport mode",
    accentFrom: "#334155",
    accentTo: "#475569",
  },
  {
    id: "amazon-carry-on-organizer",
    zone: "amazon",
    name: "Carry-On Organizer",
    category: "Airport & Transit",
    price: "$21.99",
    badge: "Get the look",
    href: "https://www.amazon.com/s?k=carry+on+organizer+travel",
    caption:
      "This is what keeps my tech, snacks, and documents from disappearing in the middle of the trip.",
    visualLabel: "Seat pocket energy",
    accentFrom: "#0f766e",
    accentTo: "#14b8a6",
  },
  {
    id: "amazon-wrinkle-free-set",
    zone: "amazon",
    name: "Wrinkle-Free Travel Set",
    category: "Style on the Go",
    price: "$44.00",
    badge: "Style Pick",
    href: "https://www.amazon.com/s?k=wrinkle+free+travel+outfit+women",
    caption:
      "I love pieces that still look polished after a full day of travel. This is that vibe.",
    visualLabel: "Dinner-ready",
    accentFrom: "#7c3aed",
    accentTo: "#a855f7",
  },
  {
    id: "amazon-packable-flats",
    zone: "amazon",
    name: "Packable Flats",
    category: "Style on the Go",
    price: "$29.50",
    badge: "Closet Hero",
    href: "https://www.amazon.com/s?k=packable+flats+for+travel",
    caption:
      "These save my suitcase space and still work when I want to look put together.",
    visualLabel: "Easy glam",
    accentFrom: "#be185d",
    accentTo: "#ec4899",
  },
  {
    id: "amazon-reef-safe-sunscreen",
    zone: "amazon",
    name: "Reef-Safe Sunscreen",
    category: "Everyday Must-Haves",
    price: "$15.99",
    badge: "Daily Use",
    href: "https://www.amazon.com/s?k=reef+safe+sunscreen",
    caption:
      "This stays in my bag because I want sun protection that travels well and feels good on skin.",
    visualLabel: "Everyday carry",
    accentFrom: "#ca8a04",
    accentTo: "#f59e0b",
  },
  {
    id: "amazon-compression-cubes",
    zone: "amazon",
    name: "Compression Cubes",
    category: "Cruise Essentials",
    price: "$34.99",
    badge: "Space Saver",
    href: "https://www.amazon.com/s?k=compression+packing+cubes",
    caption:
      "If you pack heavy but still want order, these are the move. They buy you real suitcase space.",
    visualLabel: "Packed right",
    accentFrom: "#166534",
    accentTo: "#059669",
  },
];

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: "merch-cruise-card-lanyard-atlantis",
    zone: "merch",
    name: "Travelholics Atlantis Lanyard",
    subtitle: "Atlantis Travelholics Edition",
    description:
      "The Travelholics Cruise Card Lanyard keeps your cruise card, room key, or travel pass close without sacrificing style. Designed in the signature Atlantis colorway with Travelholics branding, cruise-inspired icons, and a silver lobster claw clip.",
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
    name: "Cruise Ticket Door Magnet",
    description:
      "The collectible Travelholics Cruise Life ticket magnet featured in the Pacific duck hunt. Grab one for your next sailing.",
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
    description:
      "The original Pacific Mexican-style cruise magnet design. Built to pop on your stateroom door.",
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
