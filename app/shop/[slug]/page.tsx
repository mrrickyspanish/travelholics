"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  X,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { RippleButton } from "@/components/ripple-button";
import { MERCH_PRODUCTS, formatMerchPrice, type MerchProduct } from "@/lib/shop-catalog";

/* ─── Product image data per slug ──────────────────────────── */

type ProductImages = {
  hero: string;
  gallery: string[];
};

const PRODUCT_IMAGES: Record<string, ProductImages> = {
  "merch-cruise-card-lanyard-atlantis": {
    hero: "/images/travelholics_lanyard_transparent.png",
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
  },
  "merch-magnet-ticket-pacific": {
    hero: "/images/travelholics_product_ticket-magnet-pacific.png",
    gallery: [
      "/images/travelholics_product_ticket-magnet-pacific.png",
      "/images/travelholic_ticket_magnent_pacific.png",
      "/images/travelholics_mockup_cruise-life-magnet-flatlay.png",
      "/images/travelholics_product_cruise-life-door-magnet.png",
      "/images/travelholics_product_cruise-life-magnet-on-journal.png",
    ],
  },
  "merch-magnet-mexican-pacific": {
    hero: "/images/travelholics_product_pacific-mexican-door-magnet.png",
    gallery: [
      "/images/travelholics_product_pacific-mexican-door-magnet.png",
      "/images/pacific_mexican_door_magnent.png",
      "/images/travelholics_mockup_pacific-mexican-door-magnet.png",
      "/images/travelholics_product_pacific-mexican-voyage-2026-magnet.png",
    ],
  },
};

/* ─── Fullscreen gallery modal ─────────────────────────────── */

function GalleryModal({
  images,
  startIndex,
  productName,
  onClose,
}: {
  images: string[];
  startIndex: number;
  productName: string;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
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
    >
      <div className="relative flex items-center justify-between px-4 py-3">
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

      <div className="flex flex-col items-center gap-3 pb-8 pt-4">
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
                  i === current ? "h-2 w-6 bg-white" : "h-2 w-2 bg-white/30 hover:bg-white/55"
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

/* ─── Page ─────────────────────────────────────────────────── */

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = MERCH_PRODUCTS.find((p) => p.id === slug);

  if (!product) return <div className="flex min-h-screen items-center justify-center text-stone-400">Product not found.</div>;

  const images = PRODUCT_IMAGES[product.id];
  const gallery = images?.gallery ?? (product.imageSrc ? [product.imageSrc] : []);
  const hero = images?.hero ?? product.imageSrc ?? "";

  const [activeImage, setActiveImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutError(null);
    setIsPending(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          color: product.colors[0],
          size: product.sizes[0],
          quantity,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Unable to start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Unable to start checkout.");
    } finally {
      setIsPending(false);
    }
  };

  const displayImage = gallery[activeImage] ?? hero;

  return (
    <>
      <AnimatePresence>
        {galleryOpen && (
          <GalleryModal
            images={gallery}
            startIndex={activeImage}
            productName={product.name}
            onClose={() => setGalleryOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-stone-100 bg-[#FDFCF9]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/shop-full"
            className="flex items-center gap-1.5 text-sm font-semibold text-stone-500 transition-colors hover:text-[#1e3a8a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
          <Link href="/">
            <Image
              src="/images/travelholics_logo_wordmark.svg"
              alt="Travelholics"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="w-24" />
        </div>
      </div>

      <main className="min-h-screen bg-[#FDFCF9]">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-14">
          <div className="grid gap-8 md:grid-cols-2 md:gap-14">

            {/* ── Image column ──────────────────────────────── */}
            <div className="flex flex-col gap-3">
              {/* Hero image */}
              <button
                onClick={() => setGalleryOpen(true)}
                aria-label="View full gallery"
                className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-stone-100 cursor-zoom-in"
              >
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </button>

              {/* Thumbnail strip — max 6 shown, scrollable */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {gallery.slice(0, 6).map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-xl bg-stone-100 transition-all ${
                        i === activeImage
                          ? "ring-2 ring-[#1e3a8a] ring-offset-2"
                          : "opacity-55 hover:opacity-90"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="72px"
                      />
                    </button>
                  ))}
                  {gallery.length > 6 && (
                    <button
                      onClick={() => setGalleryOpen(true)}
                      className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-xl bg-stone-100 text-[0.65rem] font-bold text-stone-500 transition-colors hover:bg-stone-200"
                    >
                      +{gallery.length - 6} more
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ── Details column ────────────────────────────── */}
            <div className="flex flex-col">
              {/* Badge */}
              <div className="mb-3 text-center">
                <span className="inline-flex rounded-full bg-[#1e3a8a] px-3 py-[5px] text-[0.62rem] font-black uppercase tracking-[0.16em] text-white">
                  {product.badge}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-center text-[1.6rem] font-black leading-tight text-[#111d30] md:text-[1.85rem]">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-3 flex items-baseline justify-center gap-2">
                <span className="text-[1.5rem] font-black text-[#1e3a8a]">
                  {formatMerchPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm font-semibold text-stone-400 line-through">
                    {formatMerchPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mx-auto mt-5 max-w-sm text-center text-[0.92rem] leading-relaxed text-stone-500">
                {product.description}
              </p>

              {/* Divider */}
              <div className="my-6 border-t border-stone-100" />

              {/* Details list */}
              {product.details && product.details.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-stone-400">
                    Details
                  </p>
                  <ul className="flex flex-col gap-2">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[0.88rem] text-stone-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#059669]" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qty + Buy */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isPending}
                    aria-label="Decrease quantity"
                    className="flex h-5 w-5 items-center justify-center text-stone-400 transition-colors hover:text-[#1e3a8a] disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-[#111d30]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={isPending}
                    aria-label="Increase quantity"
                    className="flex h-5 w-5 items-center justify-center text-stone-400 transition-colors hover:text-[#1e3a8a] disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <RippleButton
                  onClick={handleCheckout}
                  disabled={isPending || product.comingSoon}
                  className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#059669] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {product.comingSoon ? "Coming Soon" : isPending ? "Opening…" : "Buy Now"}
                  {!isPending && !product.comingSoon && <ArrowRight className="h-3.5 w-3.5" />}
                </RippleButton>
              </div>

              {checkoutError && (
                <p className="mt-2 text-xs font-semibold text-rose-500">{checkoutError}</p>
              )}

              {/* Trust signals */}
              <div className="mt-6 flex flex-col gap-2 border-t border-stone-100 pt-5">
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" />
                  Secure checkout via Stripe
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <Truck className="h-3.5 w-3.5 text-[#059669]" />
                  Free shipping on orders over $50
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <RotateCcw className="h-3.5 w-3.5 text-[#059669]" />
                  Questions?{" "}
                  <a
                    href="mailto:hello@yotravelholic.com"
                    className="underline underline-offset-2 hover:text-[#1e3a8a]"
                  >
                    hello@yotravelholic.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
