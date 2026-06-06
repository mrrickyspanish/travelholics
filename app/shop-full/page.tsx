"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  X,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { RippleButton } from "@/components/ripple-button";
import { MERCH_PRODUCTS, formatMerchPrice, type MerchProduct } from "@/lib/shop-catalog";

/* ─── Product data ─────────────────────────────────────────── */

const PHASE1_IDS = [
  "merch-cruise-card-lanyard-atlantis",
  "merch-magnet-ticket-pacific",
  "merch-magnet-mexican-pacific",
];

type ProductMeta = {
  badge: string;
  subtitle: string;
  description: string;
  image: string;
  gallery: string[];
  promo?: string;
};

const PRODUCT_META: Record<string, ProductMeta> = {
  "merch-cruise-card-lanyard-atlantis": {
    badge: "Travel Essential",
    subtitle: "Atlantis Travelholics Edition",
    description:
      "Keeps your cruise card, room key, or travel pass close without sacrificing style.",
    image: "/images/travelholics_lanyard_transparent.png",
    gallery: [
      "/images/travelholics_lanyard_transparent.png",
      "/images/01-travelholics-cruise-card-lanyard-flatlay-passport.png",
      "/images/02-travelholics-cruise-card-lanyard-front-back-view.png",
      "/images/03-travelholics-cruise-card-lanyard-closeup-logo.png",
      "/images/04-travelholics-cruise-card-lanyard-hero.png",
      "/images/01-travelholics-lanyard-alana-beach.png",
      "/images/02-travelholics-lanyard-alana-cruise-room.png",
      "/images/03-travelholics-lanyard-alana-packing.png",
      "/images/04-travelholics-lanyard-alana-resort.png",
      "/images/05-travelholics-lanyard-alana-port-shopping.png",
      "/images/travelholics_lanyard_clip_detail.png",
      "/images/travelholics_lanyard_lifestyle.png",
    ],
    promo: "Bundle: 2 for $18.00",
  },
  "merch-magnet-ticket-pacific": {
    badge: "Cruise Life",
    subtitle: "Boarding Pass Edition",
    description:
      "A collectible Travelholics door magnet inspired by cruise tickets and built to stand out on your stateroom door.",
    image: "/images/travelholics_product_ticket-magnet-pacific.png",
    gallery: [
      "/images/travelholics_product_ticket-magnet-pacific.png",
      "/images/travelholic_ticket_magnent_pacific.png",
      "/images/travelholics_mockup_cruise-life-magnet-flatlay.png",
      "/images/travelholics_product_cruise-life-door-magnet.png",
      "/images/travelholics_product_cruise-life-magnet-on-journal.png",
    ],
  },
  "merch-magnet-mexican-pacific": {
    badge: "Original",
    subtitle: "Voyage Edition",
    description:
      "A bold, colorful Travelholics magnet made to bring personality and cruise energy to your stateroom door.",
    image: "/images/travelholics_product_pacific-mexican-door-magnet.png",
    gallery: [
      "/images/travelholics_product_pacific-mexican-door-magnet.png",
      "/images/pacific_mexican_door_magnent.png",
      "/images/travelholics_mockup_pacific-mexican-door-magnet.png",
      "/images/travelholics_product_pacific-mexican-voyage-2026-magnet.png",
    ],
  },
};

/* ─── Image Gallery Modal ──────────────────────────────────── */

function ImageGalleryModal({
  images,
  initialIndex,
  productName,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  productName: string;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current?.children[current] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) {
          const i = Array.from(track.children).indexOf(hit.target);
          if (i >= 0) setCurrent(i);
        }
      },
      { root: track, threshold: 0.55 }
    );
    Array.from(track.children).forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex flex-col bg-black"
      onClick={onClose}
    >
      <div
        className="relative z-10 flex items-center justify-between px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/50">
          {current + 1} / {images.length}
        </span>
        <p className="absolute left-1/2 -translate-x-1/2 text-[0.72rem] font-semibold text-white/70">
          {productName}
        </p>
        <button
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((src, i) => (
          <div key={i} className="relative h-full w-full flex-shrink-0 snap-start">
            <Image
              src={src}
              alt={`${productName} — image ${i + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div
        className="flex flex-col items-center gap-3 pb-8 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            aria-label="Previous image"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:opacity-25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "h-2 w-6 bg-white"
                    : "h-2 w-2 bg-white/30 hover:bg-white/55"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent((c) => Math.min(images.length - 1, c + 1))}
            disabled={current === images.length - 1}
            aria-label="Next image"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:opacity-25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Trust Modal ──────────────────────────────────────────── */

function ShopTrustModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-[#FDFCF9] p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-[#1e3a8a]"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="mb-1 text-xl font-bold text-[#1e3a8a]">
          Why travelers trust these picks
        </h2>
        <p className="mb-4 text-sm font-semibold text-[#c05c2e]">
          Our Recommendation Philosophy
        </p>
        <p className="mb-5 text-sm leading-relaxed text-stone-600">
          Every product recommended by Travelholics is chosen based on real cruise
          and travel experience. We only recommend what we actually use, pack, or
          would suggest to close friends and family.
        </p>
        <div className="border-t border-stone-100 pt-4">
          <p className="text-xs leading-relaxed text-stone-400">
            Official Travelholics products are sold directly through this site
            using secure checkout. Select recommendation-based affiliate links may
            be added in the future.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Mobile Nav Drawer ────────────────────────────────────── */

function MobileNavDrawer({
  onClose,
  onTrustOpen,
}: {
  onClose: () => void;
  onTrustOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/50"
      onClick={onClose}
    >
      <motion.nav
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 top-0 flex w-72 flex-col gap-5 bg-[#FDFCF9] p-6 shadow-2xl"
      >
        <div className="mb-2 flex items-center justify-between">
          <Image
            src="/images/travelholics_logo_wordmark.svg"
            alt="Travelholics"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
          <button onClick={onClose} aria-label="Close menu" className="text-stone-400 hover:text-[#1e3a8a]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <Link href="/" className="font-semibold text-[#1e3a8a] transition-colors hover:text-[#059669]" onClick={onClose}>Home</Link>
        <Link href="/shop-full" className="font-semibold text-[#1e3a8a] transition-colors hover:text-[#059669]" onClick={onClose}>Shop</Link>
        <Link href="/#contact" className="font-semibold text-[#1e3a8a] transition-colors hover:text-[#059669]" onClick={onClose}>Plan My Trip</Link>
        <button
          onClick={() => { onTrustOpen(); onClose(); }}
          className="text-left text-sm text-stone-500 transition-colors hover:text-[#1e3a8a]"
        >
          Why travelers trust these picks →
        </button>
      </motion.nav>
    </motion.div>
  );
}

/* ─── Mobile Product Slide ──────────────────────────────────
   Pure mobile layout — no responsive overrides.
── */

function ProductSlide({
  product,
  meta,
  quantity,
  isPending,
  onQuantityChange,
  onCheckout,
  onGalleryOpen,
  isFirst,
  isLast,
  onPrev,
  onNext,
}: {
  product: MerchProduct;
  meta: ProductMeta;
  quantity: number;
  isPending: boolean;
  onQuantityChange: (q: number) => void;
  onCheckout: () => void;
  onGalleryOpen: () => void;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative h-full w-full flex-shrink-0 snap-start">
      {/* Bounded content zone — hard top/bottom constraints prevent header/card overlap */}
      <div
        className="absolute inset-x-0 flex flex-col items-center justify-end gap-3 px-3"
        style={{ top: 56, bottom: 84 }}
      >
        {/* Image row with flanking arrows */}
        <div className="flex w-full items-center justify-center gap-3 px-1">
          <button
            onClick={onPrev}
            aria-label="Previous product"
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/8 text-white/60 backdrop-blur-sm transition-colors hover:bg-white/18 hover:text-white ${isFirst ? "invisible" : ""}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={onGalleryOpen}
            aria-label={`View all photos of ${product.name}`}
            className="cursor-zoom-in focus:outline-none"
            style={{ width: "min(68vw, 300px)" }}
          >
            <div
              className="relative aspect-square w-full"
              style={{ filter: "drop-shadow(0 24px 40px rgba(5,25,38,0.30))" }}
            >
              <Image
                src={meta.image}
                alt={product.name}
                fill
                className="object-contain"
                sizes="68vw"
                priority
              />
            </div>
          </button>

          <button
            onClick={onNext}
            aria-label="Next product"
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/8 text-white/60 backdrop-blur-sm transition-colors hover:bg-white/18 hover:text-white ${isLast ? "invisible" : ""}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Glass purchase panel */}
        <div className="w-full">
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.68)",
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
              border: "1.5px solid rgba(255,255,255,0.55)",
              boxShadow: "0 8px 32px rgba(5,25,38,0.12), 0 2px 8px rgba(5,25,38,0.06)",
            }}
          >
            <span className="mb-3 inline-block rounded-full bg-[#1e3a8a] px-3 py-[5px] text-[0.62rem] font-black uppercase tracking-[0.16em] text-white">
              {meta.badge}
            </span>

            <h2 className="text-[1.45rem] font-black leading-tight text-[#111d30]">
              {product.name}
            </h2>
            <p className="mb-2 text-[0.75rem] font-semibold tracking-wide text-[#1e3a8a]">
              {meta.subtitle}
            </p>

            <p className="mb-3 line-clamp-2 text-[0.84rem] font-medium leading-[1.5] text-[#2d3748]">
              {meta.description}
            </p>

            <Link
              href={`/shop/${product.id}`}
              className="mb-3 inline-block text-[0.72rem] font-semibold text-[#1e3a8a] underline underline-offset-2 hover:text-[#059669] transition-colors"
            >
              View full details →
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none">
                {product.compareAtPrice && (
                  <span className="text-[0.68rem] font-semibold text-stone-400 line-through">
                    {formatMerchPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-[1.25rem] font-black text-[#1e3a8a]">
                  {formatMerchPrice(product.price)}
                </span>
              </div>

              <div
                className="flex items-center gap-2 rounded-xl border px-3 py-[11px]"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  borderColor: "rgba(30,58,138,0.18)",
                }}
              >
                <button
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={isPending}
                  aria-label="Decrease quantity"
                  className="flex h-5 w-5 items-center justify-center text-stone-400 transition-colors hover:text-[#1e3a8a] disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-bold text-[#111d30]">
                  {quantity}
                </span>
                <button
                  onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
                  disabled={isPending}
                  aria-label="Increase quantity"
                  className="flex h-5 w-5 items-center justify-center text-stone-400 transition-colors hover:text-[#1e3a8a] disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <RippleButton
                onClick={onCheckout}
                disabled={isPending}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#059669] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Opening…" : "Buy Now"}
                {!isPending && <ArrowRight className="h-3.5 w-3.5" />}
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

const UTILITY_H = 32;

export default function ShopFullPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [trustOpen, setTrustOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [galleryProduct, setGalleryProduct] = useState<string | null>(null);
  const [pendingCheckoutId, setPendingCheckoutId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    () => PHASE1_IDS.reduce<Record<string, number>>((acc, id) => { acc[id] = 1; return acc; }, {})
  );

  const trackRef = useRef<HTMLDivElement>(null);

  const products = MERCH_PRODUCTS
    .filter((p) => PHASE1_IDS.includes(p.id))
    .sort((a, b) => PHASE1_IDS.indexOf(a.id) - PHASE1_IDS.indexOf(b.id));

  // Reset gallery index when active product changes
  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [activeIndex]);

  // Mobile swipe track observer
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) {
          const i = Array.from(track.children).indexOf(hit.target);
          if (i >= 0) setActiveIndex(i);
        }
      },
      { root: track, threshold: 0.55 }
    );
    Array.from(track.children).forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  // Mobile: scrolls the snap track
  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    (track.children[i] as HTMLElement)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    setActiveIndex(i);
  };

  // Desktop: no scroll needed
  const desktopGoTo = (i: number) => {
    setActiveIndex(i);
  };

  const handleCheckout = async (product: MerchProduct) => {
    setCheckoutError(null);
    setPendingCheckoutId(product.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          color: product.colors[0],
          size: product.sizes[0],
          quantity: quantities[product.id] ?? 1,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Unable to start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Unable to start checkout.");
    } finally {
      setPendingCheckoutId(null);
    }
  };

  const activeProduct = products[activeIndex];
  const activeMeta = activeProduct ? PRODUCT_META[activeProduct.id] : null;

  return (
    <>
      <AnimatePresence>
        {galleryProduct && (
          <ImageGalleryModal
            images={PRODUCT_META[galleryProduct].gallery}
            initialIndex={activeGalleryIndex}
            productName={products.find((p) => p.id === galleryProduct)?.name ?? ""}
            onClose={() => setGalleryProduct(null)}
          />
        )}
        {trustOpen && <ShopTrustModal onClose={() => setTrustOpen(false)} />}
        {navOpen && (
          <MobileNavDrawer
            onClose={() => setNavOpen(false)}
            onTrustOpen={() => setTrustOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* ── Utility Bar ─────────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-[70] flex h-8 items-center justify-center bg-[#059669] text-[0.70rem] font-semibold tracking-wide text-white">
        Free shipping on orders over $50
      </div>

      <div style={{ paddingTop: UTILITY_H }}>

        {/* ════════════════════════════════════════════════════
            MOBILE / TABLET  (hidden on lg+)
        ════════════════════════════════════════════════════ */}
        <div className="lg:hidden">
          <section
            className="relative w-full overflow-hidden"
            style={{ height: `calc(100svh - ${UTILITY_H}px)` }}
          >
            {/* Static background */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/a_bright_tropical_beach_scene_at_golden_hour_sun.png.png"
                alt=""
                aria-hidden
                fill
                className="object-cover"
                style={{ objectPosition: "50% center" }}
                priority
                sizes="100vw"
              />
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 20%, rgba(5,20,38,0.22) 100%)",
                }}
              />
            </div>

            {/* Overlay header */}
            <div className="absolute left-0 right-0 top-0 z-30 flex h-14 items-center justify-between px-4">
              <button
                aria-label="Open menu"
                onClick={() => setNavOpen(true)}
                className="p-2 text-white/85 transition-colors hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <Image
                  src="/images/travelholics_logo_wordmark.svg"
                  alt="Travelholics"
                  width={160}
                  height={36}
                  className="h-9 w-auto object-contain brightness-0 invert"
                  priority
                />
              </Link>
              <div className="flex items-center gap-1">
                <button aria-label="Search" className="p-2 text-white/75 transition-colors hover:text-white">
                  <Search className="h-[18px] w-[18px]" />
                </button>
                <button aria-label="Wishlist" className="p-2 text-white/75 transition-colors hover:text-white">
                  <Heart className="h-[18px] w-[18px]" />
                </button>
                <button aria-label="Cart" className="p-2 text-white/75 transition-colors hover:text-white">
                  <ShoppingCart className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>

            {/* Swipe track */}
            <div
              ref={trackRef}
              className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {products.map((product, i) => (
                <ProductSlide
                  key={product.id}
                  product={product}
                  meta={PRODUCT_META[product.id]}
                  quantity={quantities[product.id] ?? 1}
                  isPending={pendingCheckoutId === product.id}
                  onQuantityChange={(q) =>
                    setQuantities((s) => ({ ...s, [product.id]: q }))
                  }
                  onCheckout={() => void handleCheckout(product)}
                  onGalleryOpen={() => setGalleryProduct(product.id)}
                  isFirst={i === 0}
                  isLast={i === products.length - 1}
                  onPrev={() => goTo(i - 1)}
                  onNext={() => goTo(i + 1)}
                />
              ))}
            </div>

            {/* Bottom controls */}
            <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-30 flex flex-col items-center gap-2">
              {checkoutError && (
                <p className="pointer-events-auto rounded-full bg-rose-500/85 px-4 py-1.5 text-xs font-semibold text-white">
                  {checkoutError}
                </p>
              )}
              <div className="pointer-events-auto flex items-center gap-3">
                <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-white/75">
                  <ShieldCheck className="h-3 w-3" />
                  Secure checkout via Stripe
                </span>
                <span className="text-white/30" aria-hidden>|</span>
                <button
                  onClick={() => setTrustOpen(true)}
                  className="text-[0.65rem] font-semibold text-white/75 underline underline-offset-2 transition-colors hover:text-white"
                >
                  Why we recommend these →
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ════════════════════════════════════════════════════
            DESKTOP  (hidden below lg)
        ════════════════════════════════════════════════════ */}
        {activeProduct && activeMeta && (
          <div
            className="relative hidden lg:flex lg:flex-col"
            style={{ minHeight: `calc(100svh - ${UTILITY_H}px)` }}
          >
            {/* Static background */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/a_bright_tropical_beach_scene_at_golden_hour_sun.png.png"
                alt=""
                aria-hidden
                fill
                className="object-cover"
                style={{ objectPosition: "50% 40%" }}
                priority
                sizes="100vw"
              />
              {/* Dual overlay gradients */}
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,20,40,0.38) 0%, rgba(0,20,40,0.10) 35%, rgba(5,20,38,0.30) 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(105deg, rgba(0,75,68,0.22) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Desktop header — frosted 64px */}
            <header
              className="relative z-30 flex h-16 items-center justify-between px-10"
              style={{
                background: "rgba(0,75,68,0.12)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <nav className="flex items-center gap-7">
                <Link href="/" className="text-sm font-semibold text-white/75 transition-colors hover:text-white">
                  Home
                </Link>
                <Link href="/shop-full" className="text-sm font-bold text-white transition-colors">
                  Shop
                </Link>
                <Link href="/#contact" className="text-sm font-semibold text-white/75 transition-colors hover:text-white">
                  Plan My Trip
                </Link>
              </nav>

              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <Image
                  src="/images/travelholics_logo_wordmark.svg"
                  alt="Travelholics"
                  width={172}
                  height={38}
                  className="h-9 w-auto object-contain brightness-0 invert"
                  priority
                />
              </Link>

              <div className="flex items-center gap-1">
                <button aria-label="Search" className="p-2 text-white/70 transition-colors hover:text-white">
                  <Search className="h-5 w-5" />
                </button>
                <button aria-label="Wishlist" className="p-2 text-white/70 transition-colors hover:text-white">
                  <Heart className="h-5 w-5" />
                </button>
                <button aria-label="Cart" className="p-2 text-white/70 transition-colors hover:text-white">
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Two-column grid content area */}
            <div className="relative z-10 flex flex-1 items-center justify-center px-12 py-16">
              <div
                className="grid w-full"
                style={{
                  maxWidth: "1240px",
                  gridTemplateColumns: "minmax(0, 58%) minmax(420px, 42%)",
                  gap: "clamp(32px, 5vw, 72px)",
                }}
              >
                {/* ── Left column: image + thumbnails + carousel controls ── */}
                <div className="flex flex-col items-center gap-5">
                  {/* Main product image */}
                  <button
                    onClick={() => setGalleryProduct(activeProduct.id)}
                    aria-label={`View all photos of ${activeProduct.name}`}
                    className="cursor-zoom-in focus:outline-none"
                    style={{ width: "clamp(440px, 44vw, 660px)", maxWidth: "100%" }}
                  >
                    <div
                      className="relative w-full"
                      style={{
                        aspectRatio: "1 / 1",
                        maxHeight: "460px",
                        filter: "drop-shadow(0 32px 64px rgba(5,25,38,0.40))",
                      }}
                    >
                      <Image
                        src={activeMeta.gallery[activeGalleryIndex] ?? activeMeta.image}
                        alt={activeProduct.name}
                        fill
                        className="object-contain transition-opacity duration-200"
                        sizes="clamp(440px, 44vw, 660px)"
                        priority
                      />
                    </div>
                  </button>

                  {/* Frosted thumbnail strip */}
                  {activeMeta.gallery.length > 1 && (
                    <div
                      className="flex items-center gap-2 rounded-2xl px-3 py-2"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                    >
                      {activeMeta.gallery.slice(0, 6).map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveGalleryIndex(i)}
                          aria-label={`View image ${i + 1}`}
                          className="relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200"
                          style={{
                            width: 72,
                            height: 72,
                            outline: i === activeGalleryIndex
                              ? "2.5px solid rgba(255,255,255,0.9)"
                              : "2px solid rgba(255,255,255,0.18)",
                            outlineOffset: "2px",
                            opacity: i === activeGalleryIndex ? 1 : 0.65,
                          }}
                        >
                          <Image
                            src={src}
                            alt={`Thumbnail ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        </button>
                      ))}
                      {activeMeta.gallery.length > 6 && (
                        <button
                          onClick={() => setGalleryProduct(activeProduct.id)}
                          className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-xl text-[0.72rem] font-bold text-white/80 transition-colors hover:text-white"
                          style={{
                            background: "rgba(0,0,0,0.28)",
                            border: "2px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          +{activeMeta.gallery.length - 6}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Carousel controls: ← dots → */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => desktopGoTo(activeIndex - 1)}
                      disabled={activeIndex === 0}
                      aria-label="Previous product"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-25"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {products.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => desktopGoTo(i)}
                          aria-label={`Product ${i + 1}`}
                          className={`rounded-full transition-all duration-300 ${
                            i === activeIndex
                              ? "h-2 w-7 bg-white"
                              : "h-2 w-2 bg-white/35 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => desktopGoTo(activeIndex + 1)}
                      disabled={activeIndex === products.length - 1}
                      aria-label="Next product"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-25"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* ── Right column: frosted purchase card ── */}
                <div className="flex items-center">
                  <div
                    className="w-full"
                    style={{
                      maxWidth: "540px",
                      borderRadius: "28px",
                      padding: "32px",
                      background: "rgba(255,255,255,0.72)",
                      backdropFilter: "blur(18px) saturate(160%)",
                      WebkitBackdropFilter: "blur(18px) saturate(160%)",
                      border: "1.5px solid rgba(255,255,255,0.60)",
                      boxShadow: "0 16px 48px rgba(5,25,38,0.16), 0 4px 12px rgba(5,25,38,0.08)",
                    }}
                  >
                    {/* Badge */}
                    <span className="mb-4 inline-block rounded-full bg-[#1e3a8a] px-3.5 py-[6px] text-[0.62rem] font-black uppercase tracking-[0.16em] text-white">
                      {activeMeta.badge}
                    </span>

                    {/* Product name */}
                    <h2 className="mb-1 text-[1.9rem] font-black leading-tight text-[#111d30]">
                      {activeProduct.name}
                    </h2>
                    <p className="mb-3 text-[0.78rem] font-semibold tracking-wide text-[#1e3a8a]">
                      {activeMeta.subtitle}
                    </p>

                    {/* Description */}
                    <p className="mb-4 text-[0.88rem] font-medium leading-[1.6] text-[#2d3748]">
                      {activeMeta.description}
                    </p>

                    {/* View full details */}
                    <Link
                      href={`/shop/${activeProduct.id}`}
                      className="mb-5 inline-block text-[0.74rem] font-semibold text-[#1e3a8a] underline underline-offset-2 transition-colors hover:text-[#059669]"
                    >
                      View full details →
                    </Link>

                    {/* Price */}
                    <div className="mb-5 flex items-baseline gap-2">
                      <span className="text-[2rem] font-black text-[#1e3a8a]">
                        {formatMerchPrice(activeProduct.price)}
                      </span>
                      {activeProduct.compareAtPrice && (
                        <span className="text-[0.88rem] font-semibold text-stone-400 line-through">
                          {formatMerchPrice(activeProduct.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    {/* Qty + Buy */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center gap-2 rounded-xl border px-4 py-3"
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          borderColor: "rgba(30,58,138,0.20)",
                        }}
                      >
                        <button
                          onClick={() =>
                            setQuantities((s) => ({
                              ...s,
                              [activeProduct.id]: Math.max(1, (s[activeProduct.id] ?? 1) - 1),
                            }))
                          }
                          disabled={pendingCheckoutId === activeProduct.id}
                          aria-label="Decrease quantity"
                          className="flex h-5 w-5 items-center justify-center text-stone-400 transition-colors hover:text-[#1e3a8a] disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-[#111d30]">
                          {quantities[activeProduct.id] ?? 1}
                        </span>
                        <button
                          onClick={() =>
                            setQuantities((s) => ({
                              ...s,
                              [activeProduct.id]: Math.min(10, (s[activeProduct.id] ?? 1) + 1),
                            }))
                          }
                          disabled={pendingCheckoutId === activeProduct.id}
                          aria-label="Increase quantity"
                          className="flex h-5 w-5 items-center justify-center text-stone-400 transition-colors hover:text-[#1e3a8a] disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <RippleButton
                        onClick={() => void handleCheckout(activeProduct)}
                        disabled={pendingCheckoutId === activeProduct.id}
                        className="flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#059669] text-[0.9rem] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pendingCheckoutId === activeProduct.id ? "Opening…" : "Buy Now"}
                        {pendingCheckoutId !== activeProduct.id && <ArrowRight className="h-4 w-4" />}
                      </RippleButton>
                    </div>

                    {checkoutError && (
                      <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600">
                        {checkoutError}
                      </p>
                    )}

                    {/* Trust footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-stone-200/70 pt-4">
                      <span className="flex items-center gap-1.5 text-[0.68rem] font-semibold text-stone-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" />
                        Secure checkout via Stripe
                      </span>
                      <button
                        onClick={() => setTrustOpen(true)}
                        className="text-[0.68rem] font-semibold text-stone-400 underline underline-offset-2 transition-colors hover:text-[#1e3a8a]"
                      >
                        Why we recommend these →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Post-Shop Trip CTA ────────────────────────────── */}
        <section className="bg-[#FAF9F6] px-5 py-10">
          <div className="mx-auto max-w-[920px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden px-8 py-12 text-center text-white"
              style={{
                borderRadius: "28px",
                backgroundImage: "url('/images/travelholics_brand-hero_cruise-ship.png')",
                backgroundSize: "cover",
                backgroundPosition: "center 90%",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: "28px",
                  background: "linear-gradient(135deg, rgba(30,58,92,0.82), rgba(30,58,92,0.58))",
                }}
                aria-hidden
              />
              <div className="relative z-10">
                <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">
                  Plan the whole trip
                </p>
                <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                  Need help planning{" "}
                  <em className="font-serif font-light italic text-[#f59e0b]">the trip too?</em>
                </h2>
                <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-white/70">
                  Shop the gear, then let Travelholics help plan the experience.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-[#1a3a5c] transition-colors hover:bg-orange-50"
                >
                  Plan My Trip <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <Footer />
      </div>
    </>
  );
}
