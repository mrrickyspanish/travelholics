"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, HelpCircle, Minus, Plus, ShieldCheck, Tag } from "lucide-react";

import { Footer } from "@/components/footer";
import { ShopHeader } from "@/components/shop-header";
import { RippleButton } from "@/components/ripple-button";
import { ShopHeroHeadline } from "@/components/ShopHeroHeadline";
import {
  AMAZON_PRODUCTS,
  MERCH_PRODUCTS,
  TIKTOK_PRODUCTS,
  formatMerchPrice,
  type AffiliateProduct,
  type MerchProduct,
} from "@/lib/shop-catalog";

type MerchSelectionState = Record<string, { size: string; color: string; quantity: number }>;
type FindFilter = "all" | "tiktok" | "amazon";

/* ─── Icons ─────────────────────────────────────────────── */

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

/* ─── TikTok Card ────────────────────────────────────────── */

function TikTokCard({ product, index }: { product: AffiliateProduct; index: number }) {
  const [isOpening, setIsOpening] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="flex flex-col bg-white rounded-2xl border border-stone-100 overflow-hidden"
    >
      {/* Image area */}
      <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center">
          <p className="type-kicker text-stone-300">{product.category}</p>
          <p className="text-base font-semibold text-stone-200 leading-snug">{product.name}</p>
        </div>
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
          <TikTokIcon className="h-2.5 w-2.5" />
          {product.badge}
        </span>
        <span className="absolute top-3 right-3 text-sm font-bold text-stone-400">{product.price}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="font-semibold text-ink leading-snug">{product.name}</p>
        <p className="type-caption text-stone-400 italic line-clamp-2 flex-1">
          &ldquo;{product.caption}&rdquo;
        </p>
      </div>

      {/* Full-width CTA pinned to bottom */}
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { setIsOpening(true); setTimeout(() => setIsOpening(false), 1600); }}
        aria-busy={isOpening}
        className="mx-4 mb-4 flex items-center justify-center gap-1.5 bg-black hover:bg-zinc-800 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors"
      >
        <TikTokIcon className="h-3.5 w-3.5" />
        {isOpening ? "Opening TikTok…" : "Shop on TikTok"}
        {!isOpening && <ExternalLink className="h-3 w-3 opacity-60" />}
      </a>
    </motion.article>
  );
}

/* ─── Amazon Card ────────────────────────────────────────── */

function AmazonCard({ product, index }: { product: AffiliateProduct; index: number }) {
  const [isOpening, setIsOpening] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="flex flex-col bg-white rounded-2xl border border-stone-100 overflow-hidden"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-stone-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-5 text-center">
          <p className="text-sm font-semibold text-stone-200 leading-snug">{product.name}</p>
        </div>
        <span className="absolute top-3 right-3 bg-white/90 text-xs font-bold uppercase tracking-wide text-stone-500 px-2 py-0.5 rounded-full">
          {product.visualLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-1.5">
        <p className="type-kicker text-[#059669]">{product.category}</p>
        <p className="font-semibold text-ink leading-snug">{product.name}</p>
        <p className="type-caption text-stone-400 italic line-clamp-2 flex-1">
          &ldquo;{product.caption}&rdquo;
        </p>
        <p className="text-sm font-bold text-[#1e3a8a] mt-1">{product.price}</p>
      </div>

      {/* Full-width CTA pinned to bottom */}
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { setIsOpening(true); setTimeout(() => setIsOpening(false), 1600); }}
        aria-busy={isOpening}
        className="mx-4 mb-4 flex items-center justify-center gap-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors"
      >
        <AmazonIcon className="h-3.5 w-3.5" />
        {isOpening ? "Opening…" : "Get it on Amazon"}
        {!isOpening && <ExternalLink className="h-3 w-3 opacity-60" />}
      </a>
    </motion.article>
  );
}

function TravelholicsFindCard({ product, index }: { product: AffiliateProduct; index: number }) {
  const [isOpening, setIsOpening] = useState(false);
  const isTikTok = product.zone === "tiktok";
  const platformLabel = isTikTok ? "TikTok Shop" : "Amazon";
  const ctaLabel = isTikTok ? "Shop on TikTok" : "Get it on Amazon";
  const Icon = isTikTok ? TikTokIcon : AmazonIcon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm"
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.28),transparent_36%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.34))]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/70">{product.visualLabel}</p>
          <p className="text-lg font-bold leading-tight drop-shadow-sm">{product.name}</p>
        </div>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-[#1e3a8a] shadow-sm">
          <Icon className="h-3 w-3" />
          {platformLabel}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
          {product.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="type-kicker text-[#059669]">{product.category}</p>
          <p className="text-sm font-bold text-[#1e3a8a]">{product.price}</p>
        </div>
        <h3 className="font-bold leading-snug text-ink">{product.name}</h3>
        <p className="type-caption flex-1 text-stone-500 italic line-clamp-3">&ldquo;{product.caption}&rdquo;</p>
      </div>

      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { setIsOpening(true); setTimeout(() => setIsOpening(false), 1600); }}
        aria-busy={isOpening}
        className={`mx-4 mb-4 flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-white transition-colors ${isTikTok ? "bg-black hover:bg-zinc-800" : "bg-[#f59e0b] hover:bg-[#d97706]"}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {isOpening ? "Opening…" : ctaLabel}
        {!isOpening && <ExternalLink className="h-3 w-3 opacity-70" />}
      </a>
    </motion.article>
  );
}

/* ─── Merch Card ─────────────────────────────────────────── */

const COLOR_HEX: Record<string, string> = {
  Navy: "#1e3a8a",
  Sand: "#c9a96e",
  Cream: "#f5f0e8",
  Forest: "#166534",
  White: "#f8fafc",
  Standard: "#1e3a8a",
  "Atlantis Gradient": "#0f766e",
};

function MerchCard({
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
      className="flex flex-col bg-white rounded-2xl border border-stone-100 overflow-hidden"
    >
      {/* Image area */}
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
            <p className="type-kicker text-stone-300">{product.mockupLabel}</p>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-[#1e3a8a] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {product.badge}
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
            <p className="type-kicker text-[#c05c2e] mb-1">{product.category}</p>
          )}
          <h3 className="font-bold text-ink text-base leading-snug">{product.name}</h3>
          {product.subtitle && (
            <p className="text-sm font-semibold text-[#1e3a8a] mt-0.5">{product.subtitle}</p>
          )}
          <p className="type-caption text-stone-400 mt-1">{product.description}</p>
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
            <p className="text-xs font-semibold text-stone-500 mb-2">Image slots ready</p>
            <div className="grid grid-cols-5 gap-1.5">
              {product.gallery.map((image) => (
                <div key={image.imageSrc} className="relative aspect-square overflow-hidden rounded-lg border border-stone-100 bg-stone-50" title={image.label}>
                  <Image src={image.imageSrc} alt={image.alt} fill className="object-cover" sizes="72px" />
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

      {/* Full-width CTA pinned to bottom */}
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

/* ─── Section Header (centered, serif italic accent) ─────── */

function SectionHeader({ title, accent, description }: { title: string; accent: string; description?: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="type-section-title text-ink">
        {title}{" "}
        <em className="font-serif not-italic italic font-normal text-[#1e3a8a]">{accent}</em>
      </h2>
      {description && (
        <p className="type-body text-stone-400 max-w-md mx-auto mt-3">{description}</p>
      )}
    </div>
  );
}

/* ─── Horizontal carousel shell ─────────────────────────── */

function CardRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
      {children}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */

export default function ShopPage() {
  const [merchSelections, setMerchSelections] = useState<MerchSelectionState>(() =>
    MERCH_PRODUCTS.reduce<MerchSelectionState>((acc, p) => {
      acc[p.id] = { size: p.sizes[0], color: p.colors[0], quantity: 1 };
      return acc;
    }, {})
  );
  const [pendingCheckoutId, setPendingCheckoutId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [findFilter, setFindFilter] = useState<FindFilter>("all");

  const originalProducts = MERCH_PRODUCTS.filter((product) =>
    ["merch-cruise-card-lanyard-atlantis", "merch-magnet-ticket-pacific", "merch-magnet-mexican-pacific"].includes(product.id)
  );
  const allFinds = [...TIKTOK_PRODUCTS, ...AMAZON_PRODUCTS];
  const visibleFinds = findFilter === "all" ? allFinds : allFinds.filter((product) => product.zone === findFilter);
  const findFilters: { id: FindFilter; label: string }[] = [
    { id: "all", label: "All Finds" },
    { id: "tiktok", label: "TikTok" },
    { id: "amazon", label: "Amazon" },
  ];

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

  return (
    <>
      <ShopHeader />
      <main className="min-h-screen bg-[#FAF9F6] mt-[152px] md:mt-[140px]">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative bg-[#f0e2cf]">
          <div className="relative mx-auto aspect-[2752/1536] w-full max-w-[1600px] overflow-hidden">
            <Image
              src="/images/travelholic_shop_hero.png"
              alt="The Travelholics Shop Wander More beach hero"
              fill
              priority
              sizes="100vw"
              className="object-contain object-top"
            />
          </div>
        </section>

        {/* Headline and description below hero image */}
        <div className="max-w-6xl mx-auto px-6 mt-10 mb-8">
          <ShopHeroHeadline />
        </div>



        {/* ── Travelholics Originals ─────────────────────── */}
        <section id="travelholics-originals" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Travelholics"
              accent="Originals."
              description="Owned Travelholics products first: the pieces made for the cruise door, the room key, and the travelers already moving like family."
            />
            <p className="type-caption italic text-stone-400 mb-6 text-center">
              Official Travelholics originals are sold directly by Travelholics through secure Stripe checkout. Final shipping, returns, and fulfillment details should be confirmed within your Stripe order communication.
            </p>

            <div className="flex items-center justify-center gap-2 mb-8 text-sm font-medium text-[#047857]">
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

            <div className="md:hidden -mx-6 px-6">
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {originalProducts.map((p) => (
                  <div key={p.id} className="w-[82vw] max-w-[320px] shrink-0 snap-start">
                    <MerchCard
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

            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {originalProducts.map((p) => (
                <MerchCard
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

        <div className="w-full h-16 md:h-24 bg-repeat-x" style={{ backgroundImage: "url('/images/travelholics_pattern_nautical-background.png')" }} />

        {/* ── Travelholics Finds ───────────────────────────── */}
        <section id="travelholics-finds" className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Travelholics"
              accent="Finds."
              description="A single shelf for the travel picks Yolanda recommends across Amazon, TikTok, and future affiliate partners. Use the filters when you want one platform; browse all when you just want the good stuff."
            />
            <p className="type-caption italic text-stone-400 mb-6 text-center">
              Affiliate links may earn Travelholics a small commission at no extra cost to you. Prices, availability, shipping, and return options are controlled by each platform or listed seller and may change after you leave Travelholics.
            </p>

            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              {findFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setFindFilter(filter.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${findFilter === filter.id ? "border-[#1e3a8a] bg-[#1e3a8a] text-white" : "border-stone-200 bg-white text-stone-500 hover:border-[#059669] hover:text-[#059669]"}`}
                  aria-pressed={findFilter === filter.id}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {filter.label}
                </button>
              ))}
            </div>

            <CardRow>
              {visibleFinds.map((p, i) => (
                <div key={p.id} className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-[280px]">
                  <TravelholicsFindCard product={p} index={i} />
                </div>
              ))}
            </CardRow>
          </div>
        </section>

        <div className="w-full h-16 md:h-24 bg-repeat-x" style={{ backgroundImage: "url('/images/travelholics_pattern_nautical-background.png')" }} />

        {/* ── CTA Banner ───────────────────────────────────── */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl px-8 py-12 text-center text-white overflow-hidden bg-cover"
              style={{ backgroundImage: "url('/images/travelholics_brand-hero_cruise-ship.png')", backgroundPosition: 'center 90%' }}
            >
              <div className="absolute inset-0 rounded-2xl" style={{background: 'linear-gradient(90deg,rgba(30,58,92,0.18) 0%,rgba(255,255,255,0.10) 100%)'}} aria-hidden="true"></div>
              <div className="relative z-10">
                <p className="type-kicker text-white/50 mb-4">Ready to sail?</p>
                <h2 className="type-section-title text-white mb-2">
                  Let&apos;s plan the{" "}
                  <em className="font-serif italic font-light text-[#f59e0b]">whole trip.</em>
                </h2>
                <p className="type-body text-white/60 mb-8 max-w-sm mx-auto">
                  The gear is a start. Let&apos;s build a trip around you.
                </p>
                <Link
                  href="/#contact"
                  className="type-cta inline-flex items-center gap-2 bg-white text-[#1a3a5c] px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors"
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
