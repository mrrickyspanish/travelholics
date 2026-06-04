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
  promo?: string;
};

const PRODUCT_META: Record<string, ProductMeta> = {
  "merch-cruise-card-lanyard-atlantis": {
    badge: "Travel Essential",
    subtitle: "Atlantis Travelholics Edition",
    description:
      "Keeps your cruise card, room key, or travel pass close without sacrificing style.",
    image: "/images/travelholics_lanyard_transparent.png",
    promo: "Bundle: 2 for $18.00",
  },
  "merch-magnet-ticket-pacific": {
    badge: "Cruise Life",
    subtitle: "Boarding Pass Edition",
    description:
      "A collectible Travelholics door magnet inspired by cruise tickets and built to stand out on your stateroom door.",
    image: "/images/travelholics_product_ticket-magnet-pacific.png",
  },
  "merch-magnet-mexican-pacific": {
    badge: "Original",
    subtitle: "Voyage Edition",
    description:
      "A bold, colorful Travelholics magnet made to bring personality and cruise energy to your stateroom door.",
    image: "/images/travelholics_product_pacific-mexican-door-magnet.png",
  },
};

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

/* ─── Product Slide ─────────────────────────────────────────
   Background is intentionally NOT here — it lives in the parent
   section so it stays fixed while only the product content swipes.
── */

function ProductSlide({
  product,
  meta,
  quantity,
  isPending,
  onQuantityChange,
  onCheckout,
}: {
  product: MerchProduct;
  meta: ProductMeta;
  quantity: number;
  isPending: boolean;
  onQuantityChange: (q: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="relative h-full w-full flex-shrink-0 snap-start">

      {/* ── Product image — floats in the scene, bleeds into card top ── */}
      <div
        className="absolute left-1/2 z-20 -translate-x-1/2"
        style={{ top: "8%", width: "min(84vw, 370px)" }}
      >
        <div
          className="relative aspect-square"
          style={{ filter: "drop-shadow(0 28px 48px rgba(5,25,38,0.30))" }}
        >
          <Image
            src={meta.image}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 80vw, 350px"
            priority
          />
        </div>
      </div>

      {/* ── Glass purchase panel ── */}
      <div
        className="absolute left-3 right-3 z-[15]"
        style={{ bottom: 60 }}
      >
        <div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            border: "1.5px solid rgba(255,255,255,0.70)",
            boxShadow:
              "0 8px 32px rgba(5,25,38,0.14), 0 2px 8px rgba(5,25,38,0.08)",
          }}
        >
          {/* Badge */}
          <span className="mb-3 inline-block rounded-full bg-[#1e3a8a] px-3 py-[5px] text-[0.62rem] font-black uppercase tracking-[0.16em] text-white">
            {meta.badge}
          </span>

          {/* Title — dominant anchor */}
          <h2 className="text-[1.45rem] font-black leading-tight text-[#111d30]">
            {product.name}
          </h2>
          <p className="mb-2 text-[0.75rem] font-semibold tracking-wide text-[#1e3a8a]">
            {meta.subtitle}
          </p>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-[0.84rem] font-medium leading-[1.5] text-[#2d3748]">
            {meta.description}
          </p>

          {/* Promo tag — lanyard only */}
          {meta.promo && (
            <p className="mb-3 inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-[5px] text-[0.72rem] font-bold text-amber-700">
              {meta.promo}
            </p>
          )}

          {/* Bottom action row: price + qty + buy */}
          <div className="flex items-center gap-3">
            {/* Price block */}
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

            {/* Qty stepper */}
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
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

const UTILITY_H = 32;

export default function ShopFullPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [trustOpen, setTrustOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [pendingCheckoutId, setPendingCheckoutId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    () => PHASE1_IDS.reduce<Record<string, number>>((acc, id) => { acc[id] = 1; return acc; }, {})
  );

  const trackRef = useRef<HTMLDivElement>(null);

  const products = MERCH_PRODUCTS
    .filter((p) => PHASE1_IDS.includes(p.id))
    .sort((a, b) => PHASE1_IDS.indexOf(a.id) - PHASE1_IDS.indexOf(b.id));

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

  return (
    <>
      <AnimatePresence>
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

        {/* ── Fullscreen Swiper ──────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ height: `calc(100svh - ${UTILITY_H}px)` }}
        >

          {/* ── STATIC background — sits behind everything, never swipes ── */}
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
            {/* Light gradient — preserves golden warmth, improves readability */}
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 20%, rgba(5,20,38,0.22) 100%)",
              }}
            />
          </div>

          {/* ── Overlay Header — transparent ── */}
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

          {/* ── Top labels — static, updates via activeIndex ── */}
          <div className="pointer-events-none absolute left-0 right-0 top-[62px] z-10 text-center">
            <p className="text-[0.58rem] font-black uppercase tracking-[0.28em] text-white/65">
              The Travelholics Shop
            </p>
            <p className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white/55">
              Travelholics Originals · {activeIndex + 1} / {products.length}
            </p>
          </div>

          {/* ── Swipe track — ONLY product image + glass panel move ── */}
          <div
            ref={trackRef}
            className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
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
              />
            ))}
          </div>

          {/* ── Bottom controls — above swipe track ── */}
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-30 flex flex-col items-center gap-2">
            {checkoutError && (
              <p className="pointer-events-auto rounded-full bg-rose-500/85 px-4 py-1.5 text-xs font-semibold text-white">
                {checkoutError}
              </p>
            )}

            <div className="pointer-events-auto flex items-center gap-4">
              <button
                onClick={() => goTo(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                aria-label="Previous product"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm transition-colors hover:bg-white/40 disabled:opacity-25"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Product ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "h-2.5 w-7 bg-white shadow-sm"
                        : "h-2.5 w-2.5 bg-white/45 hover:bg-white/65"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => goTo(Math.min(products.length - 1, activeIndex + 1))}
                disabled={activeIndex === products.length - 1}
                aria-label="Next product"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm transition-colors hover:bg-white/40 disabled:opacity-25"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

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

        {/* ── Post-Shop Trip CTA ────────────────────────────── */}
        <section className="bg-[#FAF9F6] px-5 py-10">
          <div className="mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl px-8 py-12 text-center text-white"
              style={{
                backgroundImage: "url('/images/travelholics_brand-hero_cruise-ship.png')",
                backgroundSize: "cover",
                backgroundPosition: "center 90%",
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(30,58,92,0.82), rgba(30,58,92,0.58))" }}
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
