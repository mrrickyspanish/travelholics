"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Minus, Plus, ShieldCheck, X } from "lucide-react";

import { Footer } from "@/components/footer";
import { ShopHeader } from "@/components/shop-header";
import { RippleButton } from "@/components/ripple-button";
import { MERCH_PRODUCTS, formatMerchPrice, type MerchProduct } from "@/lib/shop-catalog";

/* ─── Phase 1: 3 live Travelholics Originals only ─────────── */

const PHASE_1_IDS = [
  "merch-cruise-card-lanyard-atlantis",
  "merch-magnet-ticket-pacific",
  "merch-magnet-mexican-pacific",
];

const PRODUCT_COPY: Record<string, { badge: string; benefit: string; image: string }> = {
  "merch-cruise-card-lanyard-atlantis": {
    badge: "Travel Essential",
    benefit: "Keeps your cruise card, room key, or travel pass close without sacrificing style.",
    image: "/images/travelholics_lanyard_hero.png",
  },
  "merch-magnet-ticket-pacific": {
    badge: "Cruise Life",
    benefit: "A collectible Travelholics magnet inspired by cruise tickets and made to pop on your stateroom door.",
    image: "/images/travelholics_product_ticket-magnet-pacific.png",
  },
  "merch-magnet-mexican-pacific": {
    badge: "Original",
    benefit: "A bold Travelholics cruise magnet designed to bring color and personality to your stateroom door.",
    image: "/images/travelholics_product_pacific-mexican-door-magnet.png",
  },
};

/* ─── Trust Modal ──────────────────────────────────────────── */

function TrustModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#FDFCF9] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg p-8 shadow-2xl border border-stone-100"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-[#1e3a8a] hover:bg-stone-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-1">Why travelers trust these picks</h2>
          <p className="text-sm font-semibold text-[#c05c2e] mb-4">Our Recommendation Philosophy</p>
          <p className="text-sm text-stone-600 leading-relaxed mb-5">
            Every product or service recommended on Travelholics is chosen based on 20+ years of real cruise experience. We only suggest items we actually use, pack, or would recommend to close friends and family. Our goal is to make your travel easier, safer, and more enjoyable.
          </p>
          <div className="border-t border-stone-100 pt-4">
            <p className="text-xs text-stone-400 leading-relaxed">
              <span className="font-semibold text-stone-500">Disclosure: </span>
              Official Travelholics products are sold directly through this site using secure Stripe checkout. Select recommendations may include affiliate links in the future, which means Travelholics may earn a commission at no additional cost to you.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Product Swipe Card ───────────────────────────────────── */

function ProductCard({
  product,
  quantity,
  isPending,
  onQuantityChange,
  onCheckout,
}: {
  product: MerchProduct;
  quantity: number;
  isPending: boolean;
  onQuantityChange: (q: number) => void;
  onCheckout: () => void;
}) {
  const copy = PRODUCT_COPY[product.id];

  return (
    <div className="flex flex-col h-full">
      {/* Image zone */}
      <div className="relative flex-1 min-h-0 bg-[#F3F1EC] overflow-hidden rounded-t-[28px]">
        {copy.image && (
          <Image
            src={copy.image}
            alt={product.name}
            fill
            className="object-contain object-center p-8 md:p-10"
            sizes="(max-width: 640px) 90vw, 440px"
            priority
          />
        )}
        {/* Badge */}
        <span className="absolute top-4 left-4 bg-[#1e3a8a] text-white text-[0.62rem] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm">
          {copy.badge}
        </span>
        {/* Price */}
        <div className="absolute top-4 right-4 text-right">
          {product.compareAtPrice && (
            <p className="text-[0.62rem] font-semibold text-stone-400 line-through leading-none">
              {formatMerchPrice(product.compareAtPrice)}
            </p>
          )}
          <p className="text-base font-bold text-[#1e3a8a]">{formatMerchPrice(product.price)}</p>
        </div>
      </div>

      {/* Content zone */}
      <div className="bg-white rounded-b-[28px] px-6 py-5 flex flex-col gap-4 border-t border-stone-100">
        <div>
          <h2 className="text-lg font-bold text-[#1a3a5c] leading-snug">{product.name}</h2>
          {product.subtitle && (
            <p className="text-xs font-semibold text-[#1e3a8a]/60 mt-0.5 tracking-wide">{product.subtitle}</p>
          )}
          <p className="text-sm text-stone-500 leading-relaxed mt-2">{copy.benefit}</p>
        </div>

        {/* Bundle tag — lanyard only */}
        {product.bundlePrice && product.bundleQuantity && (
          <p className="inline-flex rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-xs font-bold text-amber-700 w-fit">
            Bundle: {product.bundleQuantity} for {formatMerchPrice(product.bundlePrice)}
          </p>
        )}

        {/* Qty + Buy Now */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-stone-200 rounded-xl px-3 py-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={isPending}
              aria-label="Decrease quantity"
              className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-[#1e3a8a] transition-colors disabled:opacity-40"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-[#1a3a5c]">{quantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
              disabled={isPending}
              aria-label="Increase quantity"
              className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-[#1e3a8a] transition-colors disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <RippleButton
            onClick={onCheckout}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Opening…" : "Buy Now"}
            {!isPending && <ArrowRight className="h-3.5 w-3.5" />}
          </RippleButton>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function ShopFullPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [trustOpen, setTrustOpen] = useState(false);
  const [pendingCheckoutId, setPendingCheckoutId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    () => PHASE_1_IDS.reduce<Record<string, number>>((acc, id) => { acc[id] = 1; return acc; }, {})
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  // Pull only the 3 Phase 1 products in defined order
  const products = MERCH_PRODUCTS
    .filter((p) => PHASE_1_IDS.includes(p.id))
    .sort((a, b) => PHASE_1_IDS.indexOf(a.id) - PHASE_1_IDS.indexOf(b.id));

  // Track which card is centered to update dots
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const i = Array.from(container.children).indexOf(visible.target);
          if (i >= 0) setActiveIndex(i);
        }
      },
      { root: container, threshold: 0.55 }
    );
    Array.from(container.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    setActiveIndex(index);
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
      <ShopHeader />
      {trustOpen && <TrustModal onClose={() => setTrustOpen(false)} />}

      <main className="min-h-screen bg-[#FAF9F6] mt-[152px] md:mt-[140px]">

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative bg-[#f0e2cf]">
          <div className="relative mx-auto aspect-[2752/1536] w-full max-w-[1600px] overflow-hidden">
            <Image
              src="/images/travelholic_shop_hero.png"
              alt="The Travelholics Shop"
              fill
              priority
              sizes="100vw"
              className="object-contain object-top"
            />
          </div>
        </section>

        {/* ── Intro ─────────────────────────────────────────── */}
        <section className="py-10 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <p className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-stone-400 mb-3">
              The Travelholics Shop
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a3a5c] leading-tight mb-3">
              What I use. What I love.<br />
              <span className="font-serif italic font-light text-[#1e3a8a]">What I recommend.</span>
            </h1>
            <p className="text-sm text-stone-500 leading-relaxed mb-4 max-w-sm mx-auto">
              20+ years of cruising experience distilled into the things I actually pack, use, and recommend.
            </p>
            <button
              onClick={() => setTrustOpen(true)}
              className="text-xs font-semibold text-[#059669] hover:underline underline-offset-2 transition-colors"
            >
              Why travelers trust these picks →
            </button>
          </div>
        </section>

        {/* ── Product Swipe Deck ─────────────────────────────── */}
        <section
          className="pb-16 pt-2"
          style={{
            background: "linear-gradient(180deg, #FAF9F6 0%, #e8f4f0 30%, #dff0ea 60%, #f0ede4 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto">

            {/* Progress label */}
            <p className="text-center text-[0.62rem] font-bold tracking-[0.22em] uppercase text-[#1e3a8a]/40 mb-5 px-6">
              Travelholics Originals &nbsp;·&nbsp; {activeIndex + 1} / {products.length}
            </p>

            {/* Swipe shelf */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-0 px-4 sm:px-6 md:px-0 md:justify-center"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="snap-center shrink-0 w-[min(86vw,420px)] md:w-[420px] rounded-[28px] shadow-xl shadow-stone-200/60 overflow-hidden"
                  style={{ height: "clamp(480px, 78vh, 620px)" }}
                >
                  <ProductCard
                    product={product}
                    quantity={quantities[product.id] ?? 1}
                    isPending={pendingCheckoutId === product.id}
                    onQuantityChange={(q) =>
                      setQuantities((prev) => ({ ...prev, [product.id]: q }))
                    }
                    onCheckout={() => void handleCheckout(product)}
                  />
                </div>
              ))}
            </div>

            {/* Nav: arrows + dots */}
            <div className="flex items-center justify-center gap-5 mt-6 px-6">
              <button
                onClick={() => goTo(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                aria-label="Previous product"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors disabled:opacity-25 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`View product ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "w-7 h-2.5 bg-[#1e3a8a]"
                        : "w-2.5 h-2.5 bg-stone-200 hover:bg-stone-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => goTo(Math.min(products.length - 1, activeIndex + 1))}
                disabled={activeIndex === products.length - 1}
                aria-label="Next product"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors disabled:opacity-25 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Error state */}
            {checkoutError && (
              <div className="mt-5 mx-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 text-center max-w-sm mx-auto">
                {checkoutError}
              </div>
            )}

            {/* Stripe badge */}
            <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-[#047857] font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure checkout via Stripe
            </div>
          </div>
        </section>

        {/* ── Trip Planning CTA ──────────────────────────────── */}
        <section className="py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl px-8 py-12 text-center text-white overflow-hidden"
              style={{
                backgroundImage: "url('/images/travelholics_brand-hero_cruise-ship.png')",
                backgroundSize: "cover",
                backgroundPosition: "center 90%",
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e3a5c]/80 to-[#1e3a5c]/55" aria-hidden />
              <div className="relative z-10">
                <p className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/50 mb-3">
                  Plan the whole trip
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Need help planning{" "}
                  <em className="font-serif italic font-light text-[#f59e0b]">the trip too?</em>
                </h2>
                <p className="text-sm text-white/70 mb-6 max-w-xs mx-auto leading-relaxed">
                  Shop the gear, then let Travelholics help plan the experience.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-white text-[#1a3a5c] font-bold px-7 py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm"
                >
                  Plan My Trip <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
