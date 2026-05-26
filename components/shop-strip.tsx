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
  { name: "Pacific Mexican Cruise Door Magnent", price: "$18.99", image: "/images/pacific_mexican_door_magnent.png", href: "/shop", imageClassName: "scale-[1.8]" },
  { name: "Cruise Life Ticket Door Magnent",     price: "$16.99", image: "/images/travelholic_ticket_magnent_pacific.png", href: "/shop" },
  { name: "Travelholicss Bucket Hat", price: "$25.00", image: "/images/Travelholics_merch_bucket_hat.png", href: "/shop", imageClassName: "is-full-bleed" },
];

export const ShopStrip = () => {
  const [offset, setOffset] = useState(0);
  const maxOffset = products.length - VISIBLE;

  return (
    <section className="bg-cream py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[30%_70%] gap-10 items-center">

          {/* Left */}
          <div>
            <p className="type-kicker text-coral mb-3">Travel Picks + Merch</p>
            <h2 className="font-serif text-3xl font-semibold text-ink leading-tight tracking-tight mb-3">
              Shop Our Favorite Finds
            </h2>
            <p className="mb-6 max-w-[38ch] text-[17px] font-medium leading-[1.65] text-ink/82">
              Travel-tested, creator-approved, and perfect for your next adventure.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border-2 border-emerald-mid text-emerald-mid hover:bg-emerald-mid hover:text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
            >
              Shop All Picks →
            </Link>
          </div>

          {/* Right: minimal product carousel — no card chrome */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${offset * (100 / VISIBLE)}% - ${offset * 24 / VISIBLE}px))`,
                }}
              >
                {products.map(({ name, price, image, href, imageClassName }) => {
                  const isFullBleed = imageClassName === "is-full-bleed";

                  return (
                    <Link
                      key={name}
                      href={href}
                      className="flex-shrink-0 flex flex-col gap-2 group"
                      style={{ width: `calc(${100 / VISIBLE}% - ${24 * (VISIBLE - 1) / VISIBLE}px)` }}
                    >
                    {/* Just a photo, name, price — no card border */}
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-sand">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        className={
                          isFullBleed
                            ? "object-cover p-0 scale-[1.16] transition-transform duration-300 group-hover:scale-[1.2]"
                            : `object-contain p-4 transition-transform duration-300 group-hover:scale-105 ${imageClassName ?? ""}`
                        }
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    </div>
                    <p className="text-[13px] font-semibold text-ink leading-snug">{name}</p>
                    <p className="text-[13px] font-semibold text-coral">{price}</p>
                    </Link>
                  );
                })}
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
