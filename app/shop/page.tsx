"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { StickyHeader } from "@/components/sticky-header";
import {
  AMAZON_PRODUCTS,
  MERCH_PRODUCTS,
  SHOP_TABS,
  TIKTOK_PRODUCTS,
  formatMerchPrice,
  type AffiliateProduct,
  type MerchProduct,
} from "@/lib/shop-catalog";

type MerchSelectionState = Record<
  string,
  {
    size: string;
    color: string;
    quantity: number;
  }
>;

const amazonCardHeights = [260, 320, 300, 240, 340, 260, 300, 240];

function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3Z" />
    </svg>
  );
}

function AmazonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.5 15.6c2.9 1.8 8.1 2.1 11.8-.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.1 16.6c.9-.1 1.8.1 2.5.7-.2-.9-.7-1.8-1.5-2.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.1 12.2V7.7c0-1.8 1.4-3 3.5-3 1.7 0 3.3.6 3.3 2.6 0 1.2-.8 2-1.8 2.4.8.3 1.4.8 1.6 1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10.8c.5-.3 1.2-.5 1.9-.5h1.3v1.2c0 1.3-.9 2-2.1 2-1 0-1.8-.6-1.8-1.5 0-.5.2-.9.7-1.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ZoneHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-[1.5px] w-6 bg-[#f59e0b]" />
        <p className="text-xs font-bold uppercase tracking-[2px] text-[#1e3a8a]">
          {eyebrow}
        </p>
      </div>
      <h2 className="text-3xl font-extrabold leading-tight text-[#1e3a8a] md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

function AffiliateVisual({
  product,
  mode,
  heightClassName,
}: {
  product: AffiliateProduct;
  mode: "tiktok" | "amazon";
  heightClassName: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${heightClassName}`}
      style={{
        background: `linear-gradient(145deg, ${product.accentFrom}, ${product.accentTo})`,
      }}
    >
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }} />
      <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-white backdrop-blur">
        {product.visualLabel}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-white/70">
          {mode === "tiktok" ? "Shop the videos" : product.category}
        </p>
        <p className="mt-2 text-2xl font-black leading-tight">
          {product.name}
        </p>
      </div>
    </div>
  );
}

function TikTokProductCard({
  product,
  index,
}: {
  product: AffiliateProduct;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      <AffiliateVisual product={product} mode="tiktok" heightClassName="aspect-[4/5]" />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-white">
              <TikTokIcon className="h-3.5 w-3.5" />
              {product.badge}
            </span>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              {product.name}
            </h3>
          </div>
          <span className="text-lg font-bold text-[#1e3a8a]">{product.price}</span>
        </div>
        <p className="text-sm italic leading-7 text-slate-500">“{product.caption}”</p>
        <a
          href={product.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          <TikTokIcon className="h-4 w-4" />
          Shop on TikTok
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}

function AmazonProductCard({
  product,
  index,
}: {
  product: AffiliateProduct;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="mb-6 break-inside-avoid overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_18px_54px_rgba(15,23,42,0.06)]"
    >
      <AffiliateVisual
        product={product}
        mode="amazon"
        heightClassName="w-full"
      />
      <div
        className="-mt-px"
        style={{ height: amazonCardHeights[index % amazonCardHeights.length] }}
      >
        <div className="flex h-full flex-col justify-between p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f59e0b]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#9a6700]">
                {product.category}
              </span>
              <span className="rounded-full bg-[#059669]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#047857]">
                {product.badge}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-bold leading-tight text-slate-900">
              {product.name}
            </h3>
            <p className="mt-3 text-base italic leading-7 text-slate-500">“{product.caption}”</p>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-100 pt-5">
            <span className="text-xl font-bold text-[#1e3a8a]">{product.price}</span>
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1e3a8a] px-4 py-2.5 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              <AmazonIcon className="h-4 w-4" />
              Get it on Amazon
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MerchMockup({
  product,
  color,
}: {
  product: MerchProduct;
  color: string;
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-stone-100">
      <div className="absolute inset-0 opacity-[0.18]" style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(30,58,138,0.16) 1px, transparent 0)",
        backgroundSize: "20px 20px",
      }} />
      <div className="absolute inset-x-8 top-8 rounded-[28px] border border-slate-300 bg-white/90 px-8 py-10 text-center shadow-lg">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">
          {color}
        </p>
        <p className="mt-4 text-2xl font-black tracking-[0.24em] text-[#1e3a8a]">
          YOTRAVELHOLIC
        </p>
        <p className="mt-3 text-sm font-semibold text-[#059669]">{product.mockupLabel}</p>
      </div>
      <div className="absolute bottom-5 left-5 rounded-full bg-[#1e3a8a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-white">
        Official merch
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [merchSelections, setMerchSelections] = useState<MerchSelectionState>(() =>
    MERCH_PRODUCTS.reduce<MerchSelectionState>((accumulator, product) => {
      accumulator[product.id] = {
        size: product.sizes[0],
        color: product.colors[0],
        quantity: 1,
      };

      return accumulator;
    }, {}),
  );
  const [pendingCheckoutId, setPendingCheckoutId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const updateMerchSelection = (
    productId: string,
    nextSelection: Partial<MerchSelectionState[string]>,
  ) => {
    setMerchSelections((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        ...nextSelection,
      },
    }));
  };

  const handleCheckout = async (product: MerchProduct) => {
    const selection = merchSelections[product.id];

    if (!selection) {
      return;
    }

    setCheckoutError(null);
    setPendingCheckoutId(product.id);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          color: selection.color,
          size: selection.size,
          quantity: selection.quantity,
        }),
      });

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Unable to start checkout right now.");
      }

      window.location.href = result.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Unable to start checkout right now.",
      );
    } finally {
      setPendingCheckoutId(null);
    }
  };

  return (
    <>
      <StickyHeader />
      <main className="min-h-screen bg-[#FAF9F6] pt-16">
        <section className="relative overflow-hidden border-b border-slate-700 bg-gradient-to-br from-slate-950 via-[#0f254f] to-[#1e3a8a] px-6 pb-20 pt-16 md:pt-24">
          <div className="absolute inset-0 opacity-[0.12]" style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }} />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <ShoppingBag className="h-4 w-4 text-[#f59e0b]" />
                Yotravelholic Shop
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
                What I use. What I love.
                <span className="block text-[#f59e0b]">And the gear that says Yotravelholic.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/75">
                This page should feel like scrolling Yolanda&apos;s favorites, not wandering through a cold catalog. Shop the videos, catch the Amazon finds, and grab the official brand drop.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#tiktok-shop"
                  className="inline-flex items-center gap-2 rounded-full bg-[#059669] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  Start with TikTok
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="#official-merch"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Browse merch
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["Zone 1", "TikTok Shop Picks"],
                  ["Zone 2", "Amazon Finds"],
                  ["Zone 3", "Official Merch"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[1.8px] text-blue-100/45">{label}</p>
                    <p className="mt-2 text-base font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="relative mx-auto w-full max-w-[480px]"
            >
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[#059669]/35 blur-3xl" />
              <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-[#f59e0b]/30 blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-[0_30px_90px_rgba(2,6,23,0.35)] backdrop-blur">
                <div className="relative aspect-[4/4.6]">
                  <Image
                    src="/images/hero-yolanda.jpg"
                    alt="Yolanda for Yotravelholic shop"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[1.8px] text-white/65">
                      Curated by Yolanda
                    </p>
                    <p className="mt-2 text-2xl font-black leading-tight">
                      Cruise-ready favorites with real personality.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="sticky top-16 z-30 border-b border-stone-200 bg-[#FAF9F6]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-6 py-4">
            {SHOP_TABS.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-[#059669] hover:text-[#059669]"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>

        <section id="tiktok-shop" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <ZoneHeader
              eyebrow="Zone 1 · TikTok Shop Picks"
              title="Shop the videos."
              description="These are the items Yolanda keeps talking about because they genuinely make the trip easier. The energy here is social, direct, and personal — like you caught the recommendation in a live and came here to grab it."
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {TIKTOK_PRODUCTS.map((product, index) => (
                <TikTokProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="amazon-finds" className="border-y border-stone-200 bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <ZoneHeader
              eyebrow="Zone 2 · Amazon Finds"
              title="My Amazon picks."
              description="This is the Pinterest-board side of the shop — travel categories, everyday crossover, and the kind of practical things Yolanda actually reaches for. The layout is intentionally editorial so it feels discovered, not stacked."
            />
            <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
              {AMAZON_PRODUCTS.map((product, index) => (
                <AmazonProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="official-merch" className="bg-[#FAF9F6] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <ZoneHeader
              eyebrow="Zone 3 · Official Merch"
              title="Wear the brand."
              description="Official Yotravelholic gear. Wear it on your next sailing. This section is intentionally cleaner and more premium than the affiliate zones so it lands like a real brand drop."
            />

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#059669]/15 bg-[#059669]/8 px-4 py-2 text-sm font-medium text-[#047857]">
              <ShieldCheck className="h-4 w-4" />
              Stripe Checkout flow ready for V1 direct-to-checkout purchases.
            </div>

            {checkoutError ? (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {checkoutError}
              </div>
            ) : null}

            <div className="grid gap-8 xl:grid-cols-3">
              {MERCH_PRODUCTS.map((product, index) => {
                const selection = merchSelections[product.id];

                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="rounded-full bg-[#1e3a8a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-white">
                          {product.badge}
                        </span>
                        <span className="text-xl font-bold text-[#1e3a8a]">
                          {formatMerchPrice(product.price)}
                        </span>
                      </div>

                      <div className="mt-5">
                        <MerchMockup product={product} color={selection.color} />
                      </div>

                      <div className="mt-6">
                        <h3 className="text-2xl font-bold text-slate-900">{product.name}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-500">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-6 space-y-5">
                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-900">Color</p>
                          <div className="flex flex-wrap gap-2">
                            {product.colors.map((color) => {
                              const isActive = selection.color === color;

                              return (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => updateMerchSelection(product.id, { color })}
                                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                                    isActive
                                      ? "border-[#059669] bg-[#059669] text-white"
                                      : "border-stone-200 bg-stone-50 text-slate-600 hover:border-[#059669] hover:text-[#059669]"
                                  }`}
                                >
                                  {color}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-900">Size</p>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => {
                              const isActive = selection.size === size;

                              return (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => updateMerchSelection(product.id, { size })}
                                  className={`min-w-12 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                                    isActive
                                      ? "border-[#1e3a8a] bg-[#1e3a8a] text-white"
                                      : "border-stone-200 bg-white text-slate-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                                  }`}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Quantity</p>
                            <p className="text-xs text-slate-400">Direct to Stripe checkout</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateMerchSelection(product.id, {
                                  quantity: Math.max(1, selection.quantity - 1),
                                })
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-slate-600 transition-colors hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                              aria-label={`Decrease ${product.name} quantity`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center text-base font-bold text-slate-900">
                              {selection.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateMerchSelection(product.id, {
                                  quantity: Math.min(10, selection.quantity + 1),
                                })
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-slate-600 transition-colors hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                              aria-label={`Increase ${product.name} quantity`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            void handleCheckout(product);
                          }}
                          disabled={pendingCheckoutId === product.id}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#059669] px-5 py-4 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Package className="h-4 w-4" />
                          {pendingCheckoutId === product.id ? "Opening Stripe Checkout..." : "Add to Cart"}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[32px] bg-gradient-to-br from-emerald-800 to-teal-900 px-8 py-12 text-center text-white"
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-300">
                Ready to sail?
              </p>
              <h2 className="text-3xl font-bold">Want me to plan the whole trip?</h2>
              <p className="mx-auto mt-3 max-w-md text-emerald-100">
                The gear is fun, but the real flex is a trip built around you. Let&apos;s talk about your next cruise.
              </p>
              <Link
                href="/#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-emerald-800 transition-colors hover:bg-emerald-50"
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
