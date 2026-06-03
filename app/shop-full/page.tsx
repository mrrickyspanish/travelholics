"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink, Minus, Plus, ShieldCheck, X } from "lucide-react";

import { Footer } from "@/components/footer";
import { ShopHeader } from "@/components/shop-header";
import { RippleButton } from "@/components/ripple-button";
import {
  AMAZON_PRODUCTS,
  MERCH_PRODUCTS,
  TIKTOK_PRODUCTS,
  formatMerchPrice,
  type AffiliateProduct,
  type MerchProduct,
} from "@/lib/shop-catalog";

type MerchSelectionState = Record<string, { size: string; color: string; quantity: number }>;

type FilterId =
  | "all"
  | "originals"
  | "cruise"
  | "packing"
  | "beach"
  | "family"
  | "amazon"
  | "tiktok";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "originals", label: "Travelholics Originals" },
  { id: "cruise", label: "Cruise Essentials" },
  { id: "packing", label: "Packing" },
  { id: "beach", label: "Beach & Resort" },
  { id: "family", label: "Family Travel" },
  { id: "amazon", label: "Amazon Finds" },
  { id: "tiktok", label: "TikTok Finds" },
];

const COLOR_HEX: Record<string, string> = {
  Navy: "#1e3a8a",
  Sand: "#c9a96e",
  Cream: "#f5f0e8",
  Forest: "#166534",
  White: "#f8fafc",
  Standard: "#1e3a8a",
  "Atlantis Gradient": "#0f766e",
};

/* ─── Filter tags per product ─────────────────────────────── */

function getTikTokFilters(id: string): FilterId[] {
  const base: FilterId[] = ["tiktok"];
  if (id === "tiktok-luggage-tags") return [...base, "cruise"];
  if (id === "tiktok-toiletry-organizer") return [...base, "packing"];
  if (id === "tiktok-packing-cubes") return [...base, "packing"];
  if (id === "tiktok-magnetic-hooks") return [...base, "cruise"];
  return base;
}

function getAmazonFilters(id: string): FilterId[] {
  const base: FilterId[] = ["amazon"];
  if (id === "amazon-dry-bag") return [...base, "beach"];
  if (id === "amazon-water-shoes") return [...base, "beach"];
  if (id === "amazon-neck-pillow") return [...base, "cruise", "packing"];
  if (id === "amazon-carry-on-organizer") return [...base, "packing"];
  if (id === "amazon-wrinkle-free-set") return [...base, "packing"];
  if (id === "amazon-packable-flats") return [...base, "beach"];
  if (id === "amazon-reef-safe-sunscreen") return [...base, "beach", "cruise"];
  if (id === "amazon-compression-cubes") return [...base, "packing", "cruise"];
  return base;
}

function getMerchFilters(id: string): FilterId[] {
  const base: FilterId[] = ["originals"];
  if (id === "merch-cruise-card-lanyard-atlantis") return [...base, "cruise"];
  if (id === "merch-magnet-ticket-pacific") return [...base, "cruise"];
  if (id === "merch-magnet-mexican-pacific") return [...base, "cruise"];
  return base;
}

/* ─── Icons ───────────────────────────────────────────────── */

function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3Z" />
    </svg>
  );
}

function AmazonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.23 10.56v-.38c-.96.1-1.94.1-2.91.1-.75 0-1.5-.04-2.18-.25-1.81-.54-2.93-1.95-2.93-3.93C5.21 3.66 7.2 2 9.87 2c1.45 0 2.67.41 3.57 1.22.89.8 1.35 1.95 1.35 3.38v.14c0 .26-.01.51-.04.75h-1.53v-.14c0-.96-.28-1.74-.82-2.3-.54-.56-1.31-.85-2.27-.85-1.87 0-3.05 1.07-3.05 2.67 0 1.22.7 2.06 1.89 2.41.46.14.96.2 1.57.2.62 0 1.29-.06 2.08-.15v-.77h1.61zM20.9 17.3c-2.3 1.63-5.63 2.5-8.49 2.5-4.01 0-7.63-1.5-10.36-3.98-.21-.19-.02-.46.24-.31 2.95 1.72 6.6 2.76 10.37 2.76 2.54 0 5.34-.53 7.92-1.63.39-.17.71.25.32.66zm.92-1.05c-.3-.38-1.97-.18-2.72-.09-.23.03-.26-.17-.06-.32 1.33-.94 3.52-.67 3.77-.35.25.32-.07 2.56-1.32 3.63-.19.16-.38.08-.29-.14.28-.72.91-2.35.62-2.73z" />
    </svg>
  );
}

/* ─── Trust Modal ─────────────────────────────────────────── */

function TrustModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-stone-400 hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-ink mb-1">Why travelers trust these picks</h2>
          <p className="text-sm font-semibold text-[#1e3a8a] mb-4">Our Recommendation Philosophy</p>
          <p className="text-sm text-stone-600 leading-relaxed mb-5">
            Every product or service recommended on Travelholics is chosen based on 20+ years of real cruise experience. We only suggest items we actually use, pack, or would recommend to close friends and family. Our goal is to make your travel easier, safer, and more enjoyable.
          </p>
          <div className="border-t border-stone-100 pt-4">
            <p className="text-xs text-stone-400 leading-relaxed">
              <span className="font-semibold text-stone-500">Disclosure: </span>
              Some links on this page are affiliate links. If you purchase through them, Travelholics may earn a commission at no additional cost to you. Affiliate purchases are handled by the outside retailer. Official Travelholics merch is sold through this site using secure Stripe checkout.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Affiliate Card (Amazon + TikTok unified) ────────────── */

function FindsCard({ product, index }: { product: AffiliateProduct; index: number }) {
  const [isOpening, setIsOpening] = useState(false);
  const isTikTok = product.zone === "tiktok";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="flex flex-col bg-[#FDFCF9] rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
    >
      {/* Image / placeholder */}
      <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 px-5 text-center">
          <p className="text-xs font-bold tracking-widest text-stone-200 uppercase">{product.category}</p>
          <p className="text-sm font-semibold text-stone-200 leading-snug">{product.name}</p>
        </div>
        {/* Source badge */}
        {isTikTok ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
            <TikTokIcon className="h-2.5 w-2.5" />
            TikTok Find
          </span>
        ) : (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#f59e0b] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            <AmazonIcon className="h-2.5 w-2.5" />
            Amazon Find
          </span>
        )}
        <span className="absolute top-3 right-3 text-sm font-bold text-stone-300">{product.price}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs font-bold tracking-widest text-stone-400 uppercase">{product.badge}</p>
        <p className="font-semibold text-ink leading-snug">{product.name}</p>
        <p className="text-xs text-stone-400 italic line-clamp-2 flex-1">
          &ldquo;{product.caption}&rdquo;
        </p>
        <p className="text-sm font-bold text-[#1e3a8a] mt-1">{product.price}</p>
      </div>

      {/* CTA */}
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { setIsOpening(true); setTimeout(() => setIsOpening(false), 1600); }}
        className={`mx-4 mb-4 flex items-center justify-center gap-1.5 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors ${
          isTikTok
            ? "bg-black hover:bg-zinc-800"
            : "bg-[#f59e0b] hover:bg-[#d97706]"
        }`}
      >
        {isTikTok ? <TikTokIcon className="h-3.5 w-3.5" /> : <AmazonIcon className="h-3.5 w-3.5" />}
        {isOpening ? "Opening…" : "View Item"}
        {!isOpening && <ExternalLink className="h-3 w-3 opacity-60" />}
      </a>
    </motion.article>
  );
}

/* ─── Originals Card (merch) ──────────────────────────────── */

function OriginalsCard({
  product,
  selection,
  isPending,
  onUpdate,
  onCheckout,
}: {
  product: MerchProduct;
  selection: MerchSelectionState[string];
  isPending: boolean;
  onUpdate: (next: Partial<MerchSelectionState[string]>) => void;
  onCheckout: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="flex flex-col bg-[#FDFCF9] rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-stone-50 flex items-center justify-center overflow-hidden">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div
              className="w-12 h-12 rounded-full border-2 border-stone-200"
              style={{ background: COLOR_HEX[selection.color] ?? "#1e3a8a" }}
            />
            <p className="text-xs font-bold tracking-[0.18em] text-stone-300 uppercase">Travelholics</p>
            <p className="text-xs font-semibold text-stone-300">{product.mockupLabel}</p>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-[#1e3a8a] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          Travelholics Original
        </span>
        <span className="absolute top-3 right-3 text-right text-base font-bold text-[#1e3a8a]">
          {product.compareAtPrice && (
            <span className="block text-xs font-semibold text-stone-400 line-through">
              {formatMerchPrice(product.compareAtPrice)}
            </span>
          )}
          {formatMerchPrice(product.price)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div>
          {product.category && (
            <p className="text-xs font-bold tracking-widest text-[#c05c2e] uppercase mb-1">{product.category}</p>
          )}
          <h3 className="font-bold text-ink text-base leading-snug">{product.name}</h3>
          {product.subtitle && (
            <p className="text-sm font-semibold text-[#1e3a8a] mt-0.5">{product.subtitle}</p>
          )}
          <p className="text-xs text-stone-400 mt-1">{product.description}</p>
          {product.bundlePrice && product.bundleQuantity && (
            <p className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              Launch: {formatMerchPrice(product.price)} · {product.bundleQuantity} for {formatMerchPrice(product.bundlePrice)}
            </p>
          )}
        </div>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 mb-2">Color — <span className="text-ink">{selection.color}</span></p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdate({ color: c })}
                  disabled={isPending}
                  title={c}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selection.color === c ? "border-[#059669] scale-110" : "border-stone-200 hover:border-stone-400"
                  } disabled:cursor-not-allowed`}
                  style={{ background: COLOR_HEX[c] ?? "#1e3a8a" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size pills */}
        {product.sizes.length > 1 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 mb-2">Size</p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ size: s })}
                  disabled={isPending}
                  className={`w-10 py-1.5 text-xs font-semibold rounded-lg border transition-colors text-center ${
                    selection.size === s
                      ? "border-[#1e3a8a] bg-[#1e3a8a] text-white"
                      : "border-stone-200 text-stone-500 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.gallery && product.gallery.length > 1 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 mb-2">Gallery</p>
            <div className="grid grid-cols-5 gap-1.5">
              {product.gallery.map((img) => (
                <div key={img.imageSrc} className="relative aspect-square overflow-hidden rounded-lg border border-stone-100 bg-stone-50" title={img.label}>
                  <Image src={img.imageSrc} alt={img.alt} fill className="object-cover" sizes="72px" />
                </div>
              ))}
            </div>
          </div>
        )}

        {product.details && product.details.length > 0 && (
          <ul className="grid gap-1.5 text-xs leading-relaxed text-stone-500">
            {product.details.slice(0, 4).map((detail) => (
              <li key={detail} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#059669] shrink-0" aria-hidden />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Quantity stepper */}
        <div className="flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-1.5 w-fit">
          <button
            onClick={() => onUpdate({ quantity: Math.max(1, selection.quantity - 1) })}
            disabled={isPending}
            className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-ink transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-5 text-center text-sm font-bold text-ink">{selection.quantity}</span>
          <button
            onClick={() => onUpdate({ quantity: Math.min(10, selection.quantity + 1) })}
            disabled={isPending}
            className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-ink transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* CTA */}
      <RippleButton
        onClick={onCheckout}
        disabled={isPending}
        className="mx-4 mb-4 flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Opening…" : "Buy Now"}
        {!isPending && <ArrowRight className="h-3.5 w-3.5" />}
      </RippleButton>
    </motion.article>
  );
}

/* ─── Page ────────────────────────────────────────────────── */

export default function ShopFullPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [trustModalOpen, setTrustModalOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pendingCheckoutId, setPendingCheckoutId] = useState<string | null>(null);
  const [merchSelections, setMerchSelections] = useState<MerchSelectionState>(() =>
    MERCH_PRODUCTS.reduce<MerchSelectionState>((acc, p) => {
      acc[p.id] = { size: p.sizes[0], color: p.colors[0], quantity: 1 };
      return acc;
    }, {})
  );

  const updateMerchSelection = (productId: string, next: Partial<MerchSelectionState[string]>) => {
    setMerchSelections((cur) => ({ ...cur, [productId]: { ...cur[productId], ...next } }));
  };

  const handleCheckout = async (product: MerchProduct) => {
    const selection = merchSelections[product.id];
    if (!selection) return;
    setCheckoutError(null);
    setPendingCheckoutId(product.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, color: selection.color, size: selection.size, quantity: selection.quantity }),
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

  // Build unified Finds list (TikTok + Amazon interleaved)
  const allFinds: AffiliateProduct[] = useMemo(() => {
    const merged: AffiliateProduct[] = [];
    const maxLen = Math.max(TIKTOK_PRODUCTS.length, AMAZON_PRODUCTS.length);
    for (let i = 0; i < maxLen; i++) {
      if (AMAZON_PRODUCTS[i]) merged.push(AMAZON_PRODUCTS[i]);
      if (TIKTOK_PRODUCTS[i]) merged.push(TIKTOK_PRODUCTS[i]);
    }
    return merged;
  }, []);

  // Filter originals
  const visibleOriginals = useMemo(() => {
    if (activeFilter === "all" || activeFilter === "originals") return MERCH_PRODUCTS;
    const tags = getMerchFilters(""); // generic
    // filter per product
    return MERCH_PRODUCTS.filter((p) => getMerchFilters(p.id).includes(activeFilter));
  }, [activeFilter]);

  // Filter finds
  const visibleFinds = useMemo(() => {
    if (activeFilter === "all") return allFinds;
    return allFinds.filter((p) => {
      const tags = p.zone === "tiktok" ? getTikTokFilters(p.id) : getAmazonFilters(p.id);
      return tags.includes(activeFilter);
    });
  }, [activeFilter, allFinds]);

  const showOriginals = activeFilter === "all" || activeFilter === "originals" || activeFilter === "cruise";
  const showFinds = activeFilter !== "originals";

  return (
    <>
      <ShopHeader />
      {trustModalOpen && <TrustModal onClose={() => setTrustModalOpen(false)} />}

      <main className="min-h-screen bg-[#FAF9F6] mt-28 md:mt-[152px]">

        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          className="relative pt-32 pb-20 px-6 bg-cover bg-center min-h-[470px] md:min-h-[640px] lg:min-h-[760px] flex items-end"
          style={{ backgroundImage: "url('/images/travelholic_shop_hero.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight mb-4">
                wander more.
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
                Cruise-tested favorites, original Travelholics pieces, and travel finds worth packing.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#shop-the-picks"
                  className="inline-flex items-center gap-2 bg-white text-[#1a3a5c] font-bold px-7 py-3.5 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  Shop the Picks <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setTrustModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Why We Recommend These
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Under-Hero Intro ──────────────────────────────── */}
        <section id="shop-the-picks" className="py-14 px-6 bg-[#FAF9F6]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
                What I use. What I love. What I recommend.
              </h2>
              <p className="text-base text-stone-500 leading-relaxed mb-6">
                20+ years of cruising experience distilled into the things I actually pack, use, and recommend.
              </p>
              <p className="text-xs text-stone-400 italic mb-2">
                Some links on this page are affiliate links. If you purchase through them, Travelholics may earn a commission at no additional cost to you.
              </p>
              <button
                onClick={() => setTrustModalOpen(true)}
                className="text-xs font-semibold text-[#1e3a8a] hover:underline"
              >
                Why travelers trust these picks →
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── Filter Chips ──────────────────────────────────── */}
        <div className="sticky top-[72px] z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-stone-100 py-3 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                    activeFilter === f.id
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-white border border-stone-200 text-stone-500 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 1: Travelholics Originals ────────────── */}
        {showOriginals && visibleOriginals.length > 0 && (
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
                  Travelholics <em className="font-serif not-italic italic font-normal text-[#1e3a8a]">Originals</em>
                </h2>
                <p className="text-stone-400 max-w-md mx-auto">
                  Made for cruise doors, travel bags, group trips, and the memories that come home with you.
                </p>
              </motion.div>

              <div className="flex items-center justify-center gap-2 mb-6 text-sm font-medium text-[#047857]">
                <ShieldCheck className="h-4 w-4" />
                Secure checkout via Stripe
              </div>

              {checkoutError && (
                <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 max-w-xl mx-auto">
                  {checkoutError}
                </div>
              )}
              {pendingCheckoutId && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 max-w-xl mx-auto" role="status" aria-live="polite">
                  Redirecting to secure Stripe checkout…
                </div>
              )}

              {/* Mobile swipe shelf */}
              <div className="md:hidden -mx-6 px-6">
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {visibleOriginals.map((p) => (
                    <div key={p.id} className="w-[82vw] max-w-[340px] shrink-0 snap-start">
                      <OriginalsCard
                        product={p}
                        selection={merchSelections[p.id]}
                        isPending={pendingCheckoutId === p.id}
                        onUpdate={(next) => updateMerchSelection(p.id, next)}
                        onCheckout={() => void handleCheckout(p)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop grid */}
              <div className="hidden md:grid md:grid-cols-3 gap-6">
                {visibleOriginals.map((p) => (
                  <OriginalsCard
                    key={p.id}
                    product={p}
                    selection={merchSelections[p.id]}
                    isPending={pendingCheckoutId === p.id}
                    onUpdate={(next) => updateMerchSelection(p.id, next)}
                    onCheckout={() => void handleCheckout(p)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Nautical divider */}
        {showOriginals && showFinds && visibleOriginals.length > 0 && visibleFinds.length > 0 && (
          <div className="w-full h-16 md:h-20 bg-repeat-x" style={{ backgroundImage: "url('/images/travelholics_pattern_nautical-background.png')" }} />
        )}

        {/* ── Section 2: Travelholics Finds ────────────────── */}
        {showFinds && visibleFinds.length > 0 && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
                  Travelholics <em className="font-serif not-italic italic font-normal text-[#c05c2e]">Finds</em>
                </h2>
                <p className="text-stone-400 max-w-md mx-auto">
                  Smart travel picks, cruise essentials, packing helpers, and vacation favorites curated by Travelholics.
                </p>
              </motion.div>

              <p className="text-xs italic text-stone-400 text-center mb-8">
                Affiliate links may earn Travelholics a small commission at no extra cost to you. You&apos;ll be sent to TikTok Shop or Amazon to complete your purchase.
              </p>

              {/* Mobile swipe shelf */}
              <div className="md:hidden -mx-6 px-6">
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {visibleFinds.map((p, i) => (
                    <div key={p.id} className="w-[72vw] max-w-[280px] shrink-0 snap-start">
                      <FindsCard product={p} index={i} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop grid */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-5">
                {visibleFinds.map((p, i) => (
                  <FindsCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!showOriginals && visibleFinds.length === 0 && (
          <section className="py-24 px-6 text-center">
            <p className="text-stone-400">No products match this filter yet — try another category.</p>
          </section>
        )}

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl px-8 py-12 text-center text-white overflow-hidden bg-cover"
              style={{ backgroundImage: "url('/images/travelholics_brand-hero_cruise-ship.png')", backgroundPosition: "center 90%" }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e3a5c]/70 to-[#1e3a5c]/40" aria-hidden="true" />
              <div className="relative z-10">
                <p className="text-xs font-bold tracking-widest text-white/50 uppercase mb-4">Plan the whole trip</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Need help planning the trip too?
                </h2>
                <p className="text-white/70 mb-8 max-w-sm mx-auto">
                  Shop the gear, then let Travelholics help plan the experience.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-white text-[#1a3a5c] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors"
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
