"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Minus, Plus, ShieldCheck } from "lucide-react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
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

/* ─── Merch Card ─────────────────────────────────────────── */

const COLOR_HEX: Record<string, string> = {
  Navy:   "#1e3a8a",
  Sand:   "#c9a96e",
  Cream:  "#f5f0e8",
  Forest: "#166534",
  White:  "#f8fafc",
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
        <span className="absolute top-3 right-3 text-base font-bold text-[#1e3a8a]">
          {formatMerchPrice(product.price)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div>
          <h3 className="font-bold text-ink text-base leading-snug">{product.name}</h3>
          <p className="type-caption text-stone-400 mt-1">{product.description}</p>
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
      <Header />
      <main className="min-h-screen bg-[#FAF9F6]">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          className="pt-32 pb-16 px-6"
          style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 40%, #d4622a 75%, #E87722 100%)" }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="type-page-title text-white mb-4">
                What I use.<br />
                <span className="font-serif italic font-light text-[#f59e0b]">What I love.</span>
              </h1>
              <p className="type-body-lg text-blue-100/75 max-w-lg">
                20 years of cruise experience distilled into the things I actually reach for — plus the brand we built for travelers like you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Trust bar ────────────────────────────────────── */}
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {[
              "20 Years Cruise Experience",
              "Certified Cruise Specialist",
              "TikTok Creator Community",
              "Secure Stripe Checkout",
            ].map((item) => (
              <span key={item} className="type-kicker text-stone-400">{item}</span>
            ))}
          </div>
        </div>

        {/* ── Sticky tab bar ───────────────────────────────── */}
        <div className="sticky top-[44px] z-30 bg-white border-b border-stone-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "tiktok-shop", label: "TikTok Shop" },
                { id: "amazon-finds", label: "Amazon Finds" },
                { id: "official-merch", label: "Merch" },
              ].map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className="whitespace-nowrap text-sm font-semibold px-4 py-1.5 rounded-full text-stone-400 hover:text-ink hover:bg-stone-100 transition-colors"
                >
                  {tab.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── TikTok Shop ──────────────────────────────────── */}
        <section id="tiktok-shop" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Cruise-tested"
              accent="picks."
              description="Items Yolanda keeps talking about because they genuinely make the trip easier."
            />
            <CardRow>
              {TIKTOK_PRODUCTS.map((p, i) => (
                <div key={p.id} className="w-[78vw] max-w-[280px] shrink-0 snap-start md:w-[280px]">
                  <TikTokCard product={p} index={i} />
                </div>
              ))}
            </CardRow>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6"><div className="border-t border-stone-200" /></div>

        {/* ── Amazon Finds ─────────────────────────────────── */}
        <section id="amazon-finds" className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Curated Amazon"
              accent="finds."
              description="Travel essentials, style on the go, and the everyday carries Yolanda actually reaches for."
            />
            <CardRow>
              {AMAZON_PRODUCTS.map((p, i) => (
                <div key={p.id} className="w-[72vw] max-w-[260px] shrink-0 snap-start md:w-[260px]">
                  <AmazonCard product={p} index={i} />
                </div>
              ))}
            </CardRow>
          </div>
        </section>

        {/* ── Interstitial ─────────────────────────────────── */}
        <div
          className="h-48 md:h-64 w-full"
          style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 50%, #d4622a 100%)" }}
          aria-hidden="true"
        />

        {/* ── Official Merch ───────────────────────────────── */}
        <section id="official-merch" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Wear the"
              accent="brand."
              description="Official Travelholics gear. Built for the airport, the deck, and everywhere in between."
            />

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

            {/* Mobile: swipe shelf */}
            <div className="md:hidden -mx-6 px-6">
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {MERCH_PRODUCTS.map((p) => (
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

            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {MERCH_PRODUCTS.map((p) => (
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

        {/* ── CTA Banner ───────────────────────────────────── */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl px-8 py-12 text-center text-white overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 50%, #d4622a 100%)" }}
            >
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
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
