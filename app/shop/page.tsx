"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Info, Minus, PackageCheck, Plus, ShieldCheck } from "lucide-react";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Product visual — placeholder until real images are added */}
      <div
        className="h-44 relative overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${product.accentFrom}, ${product.accentTo})` }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="type-kicker text-white/60">{product.category}</p>
          <p className="text-base font-bold text-white leading-snug mt-0.5">{product.name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
            <TikTokIcon className="h-2.5 w-2.5" />
            {product.badge}
          </span>
          <span className="ml-auto text-sm font-bold text-[#1e3a8a]">{product.price}</span>
        </div>
        <p className="type-caption italic text-slate-500 line-clamp-2 mb-3">
          &ldquo;{product.caption}&rdquo;
        </p>
        <a
          href={product.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setIsOpening(true);
            setTimeout(() => setIsOpening(false), 1600);
          }}
          aria-busy={isOpening}
          className="inline-flex w-full items-center justify-center gap-1.5 bg-black hover:bg-zinc-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <TikTokIcon className="h-3.5 w-3.5" />
          {isOpening ? "Opening TikTok..." : "Shop on TikTok"}
          {!isOpening && <ExternalLink className="h-3 w-3 opacity-70" />}
        </a>
      </div>
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
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group mb-4 break-inside-avoid bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Visual */}
      <div
        className="h-36 relative"
        style={{ background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})` }}
      >
        <span className="absolute top-2.5 right-2.5 bg-white/90 text-xs font-bold uppercase tracking-wide text-slate-700 px-2 py-0.5 rounded-full">
          {product.visualLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="type-kicker text-[#059669] mb-1">{product.category}</p>
        <h3 className="text-base font-semibold text-slate-900 leading-snug mb-1">{product.name}</h3>
        <p className="type-caption italic text-slate-400 line-clamp-2 mb-3">
          &ldquo;{product.caption}&rdquo;
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-[#1e3a8a]">{product.price}</span>
          <a
            href={product.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setIsOpening(true);
              setTimeout(() => setIsOpening(false), 1600);
            }}
            aria-busy={isOpening}
            className="inline-flex items-center gap-1 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            <AmazonIcon className="h-3 w-3" />
            {isOpening ? "Opening..." : "Get it"}
            {!isOpening && <ExternalLink className="h-2.5 w-2.5 opacity-70" />}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Merch Card ─────────────────────────────────────────── */

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
  const colorMap: Record<string, string> = {
    Navy: "#1e3a8a",
    Sand: "#c9a96e",
    Cream: "#f5f0e8",
    Forest: "#166534",
    White: "#f8fafc",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
    >
      {/* Mockup */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-stone-100 border-b border-stone-100 flex items-center justify-center">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="text-center px-6">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ background: colorMap[selection.color] ?? "#1e3a8a" }}
            />
            <p className="type-kicker text-slate-400 mb-1">{selection.color}</p>
            <p className="text-base font-black tracking-[0.2em] text-[#1e3a8a]">TRAVELHOLICS</p>
            <p className="text-xs text-[#059669] font-semibold mt-1">{product.mockupLabel}</p>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-[#1e3a8a] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {product.badge}
        </span>
        <span className="absolute top-3 right-3 text-base font-bold text-[#1e3a8a]">
          {formatMerchPrice(product.price)}
        </span>
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">{product.name}</h3>
        <p className="type-caption text-slate-500 mb-4">{product.description}</p>

        {/* Color */}
        {product.colors.length > 1 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Color</p>
            <div className="flex flex-wrap gap-1.5">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdate({ color: c })}
                  disabled={isPending}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    selection.color === c
                      ? "border-[#059669] bg-[#059669] text-white"
                      : "border-stone-200 text-slate-600 hover:border-[#059669] hover:text-[#059669]"
                  } disabled:cursor-not-allowed disabled:opacity-55`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size */}
        {product.sizes.length > 1 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Size</p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ size: s })}
                  disabled={isPending}
                  className={`w-10 py-1 text-xs font-semibold rounded-lg border transition-colors text-center ${
                    selection.size === s
                      ? "border-[#1e3a8a] bg-[#1e3a8a] text-white"
                      : "border-stone-200 text-slate-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                  } disabled:cursor-not-allowed disabled:opacity-55`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-stone-200 rounded-xl px-2 py-1">
            <button
              onClick={() => onUpdate({ quantity: Math.max(1, selection.quantity - 1) })}
              disabled={isPending}
              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-[#1e3a8a] transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-slate-900">{selection.quantity}</span>
            <button
              onClick={() => onUpdate({ quantity: Math.min(10, selection.quantity + 1) })}
              disabled={isPending}
              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-[#1e3a8a] transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <RippleButton
            onClick={onCheckout}
            disabled={isPending}
            className="flex-1 bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold py-2.5 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? "Opening..." : "Buy Now"}
            {!isPending && <ArrowRight className="h-3.5 w-3.5" />}
          </RippleButton>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Trust + Compliance Helpers ─────────────────────────── */

function DisclosureBanner() {
  return (
    <section className="-mt-8 px-6 relative z-10">
      <div className="max-w-6xl mx-auto rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden">
        <div className="grid gap-4 p-5 md:grid-cols-[auto_1fr] md:p-6">
          <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <p className="type-kicker text-amber-700 mb-2">Shop transparency</p>
            <h2 className="text-xl font-black text-slate-900 mb-2">A clear split between recommended finds and official Travelholics merch.</h2>
            <p className="type-body text-slate-600 max-w-3xl">
              Some links on this page may be affiliate links, which means Travelholics may earn a commission if you purchase through them. Affiliate purchases are handled by the outside retailer. Official Travelholics merch is sold through this site using secure Stripe checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionDisclosure({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
      {children}
    </div>
  );
}

function PolicyTrustPanel() {
  const items = [
    {
      title: "Affiliate recommendations",
      body: "TikTok and Amazon finds may open an outside retailer. Their prices, availability, shipping, and return policies may change and are controlled by that retailer.",
    },
    {
      title: "Official merch checkout",
      body: "Travelholics merch uses secure Stripe checkout. Final shipping timelines, taxes, and fulfillment details are confirmed during checkout or in follow-up order communication.",
    },
    {
      title: "Need help with an order?",
      body: "For official Travelholics merch questions, use the site contact form. For affiliate purchases, contact the retailer where the item was purchased.",
    },
  ];

  return (
    <section className="px-6 pb-4">
      <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <PackageCheck className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
            <p className="type-caption text-slate-500">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Section Header ─────────────────────────────────────── */

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8">
      <p className="type-kicker text-[#059669] mb-2">{eyebrow}</p>
      <h2 className="type-section-title text-[#1e3a8a] mb-3">{title}</h2>
      <p className="type-body text-slate-500 max-w-xl">{description}</p>
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
          className="pt-32 pb-12 px-6"
          style={{
            background:
              "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 40%, #d4622a 75%, #E87722 100%)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <p className="type-kicker text-[#059669] mb-4">
                Yolanda&apos;s Shop
              </p>
              <h1 className="type-page-title text-white mb-4">
                What I use.<br />
                <span className="text-[#f59e0b]">What I love.</span>
              </h1>
              <p className="type-body-lg text-blue-100/75 max-w-lg">
                20 years of cruise experience distilled into the things I actually reach for — plus the brand we built for travelers like you.
              </p>
            </motion.div>
          </div>
        </section>

        <DisclosureBanner />
        <PolicyTrustPanel />

        {/* ── Sticky tab bar ───────────────────────────────── */}
        <div className="sticky top-[44px] lg:top-[44px] z-30 bg-white border-b border-stone-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {[
                { id: "tiktok-shop", label: "TikTok Shop" },
                { id: "amazon-finds", label: "Amazon Finds" },
                { id: "official-merch", label: "Merch" },
              ].map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className="whitespace-nowrap text-sm font-semibold px-4 py-1.5 rounded-full text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-100 transition-colors"
                >
                  {tab.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── TikTok Shop ──────────────────────────────────── */}
        <section id="tiktok-shop" className="py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              eyebrow="Zone 1 · Affiliate recommendations"
              title="Shop the videos."
              description="Items Yolanda keeps talking about because they genuinely make the trip easier. Caught the rec in a video — grab it here."
            />
            <SectionDisclosure>
              TikTok links may open Yolanda&apos;s TikTok presence or a TikTok Shop destination. If a link becomes affiliate-enabled, Travelholics may earn a commission from qualifying purchases at no extra cost to you.
            </SectionDisclosure>

            {/* Mobile: swipe shelf (1 card + peek) */}
            <div className="md:hidden -mx-6 px-6">
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {TIKTOK_PRODUCTS.map((p, i) => (
                  <div key={p.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start">
                    <TikTokCard product={p} index={i} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet */}
            <div className="hidden md:grid md:grid-cols-4 gap-4">
              {TIKTOK_PRODUCTS.map((p, i) => (
                <TikTokCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6"><div className="border-t border-stone-200" /></div>

        {/* ── Amazon Finds ─────────────────────────────────── */}
        <section id="amazon-finds" className="py-14 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              eyebrow="Zone 2 · Affiliate recommendations"
              title="My Amazon picks."
              description="The Pinterest-board side of the shop. Travel essentials, style on the go, and the everyday carries Yolanda actually reaches for."
            />
            <SectionDisclosure>
              Amazon links may be affiliate links. Product prices, availability, shipping, and return options are controlled by Amazon or the listed seller and may change after you leave Travelholics.
            </SectionDisclosure>

            {/* Mobile: swipe shelf (1 card + peek) */}
            <div className="md:hidden -mx-6 px-6">
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {AMAZON_PRODUCTS.map((p, i) => (
                  <div key={p.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start">
                    <AmazonCard product={p} index={i} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet masonry */}
            <div className="hidden md:columns-3 xl:columns-4 gap-4 md:block">
              {AMAZON_PRODUCTS.map((p, i) => (
                <AmazonCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6"><div className="border-t border-stone-200" /></div>

        {/* ── Official Merch ───────────────────────────────── */}
        <section id="official-merch" className="py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              eyebrow="Zone 3 · Official Travelholics products"
              title="Wear the brand."
              description="Official Travelholics gear. Built for the airport, the deck, and everywhere in between."
            />

            <div className="mb-6 grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-[#047857]">
                <ShieldCheck className="h-4 w-4" />
                Secure checkout via Stripe for official merch
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-600">
                Official merch is sold by Travelholics. Shipping, returns, and fulfillment details should be confirmed before large-scale promotion.
              </div>
            </div>

            {checkoutError && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {checkoutError}
              </div>
            )}

            {pendingCheckoutId && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status" aria-live="polite">
                Redirecting to secure Stripe checkout...
              </div>
            )}

            {/* Mobile: swipe shelf (1 card + peek) */}
            <div className="md:hidden -mx-6 px-6">
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {MERCH_PRODUCTS.map((p) => (
                  <div key={p.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start">
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

            {/* Desktop/Tablet */}
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
              className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl px-8 py-10 text-center text-white"
            >
              <p className="type-kicker text-emerald-300 mb-3">Ready to sail?</p>
              <h2 className="type-section-title mb-3">Want me to plan the whole trip?</h2>
              <p className="type-body text-emerald-100/80 mb-6 max-w-sm mx-auto">
                The gear is a start. Let&apos;s build a trip around you.
              </p>
              <p className="type-caption text-emerald-100/70 mb-6 max-w-lg mx-auto">
                Travelholics product recommendations and official merch are here to support the trip, but the real win is having the right cruise plan from the beginning.
              </p>
              <Link
                href="/#contact"
                className="type-cta inline-flex items-center gap-2 bg-white text-emerald-800 px-7 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Plan My Trip ✦
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
