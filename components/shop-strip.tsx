// ⚠️ PLACEHOLDER PRICES AND PRODUCT DATA
// Product prices and TikTok Shop affiliate URLs below are PLACEHOLDERS pending final data.
// Rendering approved by Ricky — do NOT launch real checkout from these links until confirmed.
// When real product images and URLs arrive, update each entry in the products array.
// Product images currently reuse existing assets as visual stand-ins.

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VISIBLE = 3;

const products = [
  {
    name: "Pacific Mexico Cruise Door Magnet",
    price: "$18.99",
    image: "/images/pacific_mexican_door_magnent.png",
    href: "/shop",
    imageAlt: "Pacific Mexican Cruise door magnet with cruise ship and coastal artwork",
  },
  {
    name: "Cruise Life Ticket Door Magnet",
    price: "$16.99",
    image: "/images/travelholic_ticket_magnent_pacific.png",
    href: "/shop",
    imageAlt: "Cruise Life ticket-style door magnet",
  },
  {
    name: "Travelholics Bucket Hat",
    price: "$25.00",
    image: "/images/Travelholics_merch_bucket_hat.png",
    href: "/shop",
    imageAlt: "Travelholics beige bucket hat with embroidered logo",
  },
];

export const ShopStrip = () => {
  const [offset, setOffset] = useState(0);
  const maxOffset = products.length - VISIBLE;

  return (
    <section className="bg-cream py-12 md:py-16 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-6">
        {/* Mobile-only layout */}
        <div className="md:hidden">
          <div className="mx-auto w-full max-w-[38rem] text-center">
            <p className="text-eyebrow text-coral mb-3">Travel Picks + Merch</p>
            <h2 className="mx-auto max-w-[20ch] font-serif text-3xl font-semibold text-ink leading-tight tracking-tight mb-3">
              Shop Our Favorite Finds
            </h2>
            <p className="mb-5 mx-auto max-w-[38ch] text-card-body text-ink/82">
              Cruise-tested essentials and merch picks you will actually use.
            </p>
            <Link
              href="/shop"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-emerald-mid bg-white px-6 py-3 text-sm font-semibold text-emerald-mid transition-colors hover:bg-emerald-mid hover:text-white"
            >
              Shop All Picks →
            </Link>
          </div>

          <div className="mt-6 mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone/65">Swipe to explore</p>
            <p className="text-[11px] font-medium text-stone/60">3 picks</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-1 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {products.map(({ name, price, image, href, imageAlt }) => (
              <Link
                key={name}
                href={href}
                className="group flex-shrink-0 flex flex-col gap-2 snap-start"
                style={{ flex: "0 0 min(78vw, 320px)" }}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-sand">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 78vw, 320px"
                  />
                </div>
                <p className="text-card-body font-semibold text-ink leading-snug">{name}</p>
                <p className="text-card-body font-semibold text-coral">{price}</p>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-emerald-mid underline underline-offset-4"
            >
              View all picks
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Tablet/Desktop layout */}
        <div className="hidden md:grid lg:grid-cols-[30%_70%] gap-10 items-center">
          <div>
            <p className="type-kicker text-coral mb-3">Travel Picks + Merch</p>
            <h2 className="font-serif text-3xl font-semibold text-ink leading-tight tracking-tight mb-3">
              Shop Our Favorite Finds
            </h2>
            <p className="mb-6 max-w-[38ch] text-[17px] font-medium leading-[1.65] text-ink/82">
              Cruise-tested essentials and merch picks you will actually use.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-mid bg-white px-6 py-3 text-sm font-semibold text-emerald-mid transition-colors hover:bg-emerald-mid hover:text-white"
            >
              Shop All Picks →
            </Link>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${offset * (100 / VISIBLE)}% - ${offset * 24 / VISIBLE}px))`,
                }}
              >
                {products.map(({ name, price, image, href, imageAlt }) => (
                  <Link
                    key={name}
                    href={href}
                    className="flex-shrink-0 flex flex-col gap-2 group"
                    style={{ width: `calc(${100 / VISIBLE}% - ${24 * (VISIBLE - 1) / VISIBLE}px)` }}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-sand">
                      <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                    <p className="text-[13px] font-semibold text-ink leading-snug">{name}</p>
                    <p className="text-[13px] font-semibold text-coral">{price}</p>
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOffset((o) => Math.max(0, o - 1))}
              disabled={offset === 0}
              className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-ink hover:text-coral transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous product"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
              disabled={offset === maxOffset}
              className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-ink hover:text-coral transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next product"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
