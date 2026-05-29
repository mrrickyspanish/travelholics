"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, HelpCircle, Minus, Plus, ShieldCheck, Sparkles, Tag } from "lucide-react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RippleButton } from "@/components/ripple-button";
import {
  MERCH_PRODUCTS,
  formatMerchPrice,
  type MerchProduct,
} from "@/lib/shop-catalog";

type MerchSelectionState = Record<string, { size: string; color: string; quantity: number }>;

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

/* ─── Coming Soon Panel ──────────────────────────────────── */

function ComingSoonPanel() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 50%, #d4622a 100%)" }}
    >
      <div className="px-8 py-16 md:py-20 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
          <Sparkles className="h-3 w-3" />
          More drops incoming
        </span>
        <h2 className="type-section-title text-white mb-3">
          Curated finds.{" "}
          <em className="font-serif italic font-light text-[#f59e0b]">Coming soon.</em>
        </h2>
        <p className="type-body text-blue-100/70 mb-8">
          Yolanda&apos;s hand-picked TikTok and Amazon travel essentials are on their way. Be the first to know when they drop.
        </p>
        {submitted ? (
          <div className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl">
            <ShieldCheck className="h-4 w-4 text-[#f59e0b]" />
            You&apos;re on the list — we&apos;ll be in touch!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-white/50 transition-colors"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              Notify Me <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    </motion.div>
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

        {/* ── Shop Transparency Disclosure ─────────────────── */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#E87722] flex items-center justify-center">
                <Tag className="h-2.5 w-2.5 text-white" />
              </span>
              <div>
                <p className="type-kicker text-[#E87722] mb-1">Shop Transparency</p>
                <p className="type-caption text-stone-600 max-w-2xl">
                  Official Travelholics merch is sold through this site using secure Stripe checkout. Curated affiliate finds — TikTok Shop and Amazon — are coming soon.
                </p>
              </div>
            </div>
            {/* Two-column breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-4 w-4 text-[#059669] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Official merch checkout</p>
                  <p className="type-caption text-stone-500">Travelholics products are sold through Stripe checkout. Final shipping, timelines, taxes, and fulfillment status are confirmed during checkout or in follow-up order communication.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <HelpCircle className="h-4 w-4 text-[#059669] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Need help with an order?</p>
                  <p className="type-caption text-stone-500">For merch questions, use the site contact form.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky tab bar ───────────────────────────────── */}
        <div className="sticky top-[44px] z-30 bg-white border-b border-stone-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "official-merch", label: "Merch" },
                { id: "more-drops", label: "More Drops" },
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

        {/* ── Official Merch ───────────────────────────────── */}
        <section id="official-merch" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Wear the"
              accent="brand."
              description="Official Travelholics gear. Built for the airport, the deck, and everywhere in between."
            />
            <p className="type-caption italic text-stone-400 mb-6 text-center">
              Official merch is sold by Travelholics. The bucket hat, magnets, and apparel use the same secure checkout path. Final shipping, returns, and fulfillment details should be confirmed within your Stripe order communication.
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

        {/* ── Coming Soon ──────────────────────────────────── */}
        <section id="more-drops" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <ComingSoonPanel />
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
