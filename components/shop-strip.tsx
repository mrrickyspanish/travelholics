// ⚠️ PLACEHOLDER PRICES AND PRODUCT DATA
// Product prices and TikTok Shop affiliate URLs below are PLACEHOLDERS pending final data.
// Rendering approved by Ricky — do NOT launch real checkout from these links until confirmed.

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const products = [
  {
    name: "Premium Atlantis Lanyard",
    price: "$12.00",
    image: "/images/travelholics_lanyard_transparent.png",
    href: "/shop-full",
    imageAlt: "Travelholics Atlantis lanyard",
  },
  {
    name: "Cruise Life Door Magnet",
    price: "$19.99",
    image: "/images/travelholics_product_ticket-magnet-pacific.png",
    href: "/shop-full",
    imageAlt: "Cruise Life ticket-style door magnet",
  },
  {
    name: "Pacific Mexican Door Magnet",
    price: "$19.99",
    image: "/images/travelholics_product_pacific-mexican-door-magnet.png",
    href: "/shop-full",
    imageAlt: "Pacific Mexican cruise door magnet with coastal artwork",
  },
  {
    name: "Travelholics Bucket Hat",
    price: "$38.00",
    image: "/images/Travelholics_merch_bucket_hat.png",
    href: "/shop-full",
    imageAlt: "Travelholics beige bucket hat with embroidered logo",
  },
];

const lazyRiverProducts = [...products, ...products];

export const ShopStrip = () => {
  return (
    <section className="relative overflow-hidden bg-cream py-12 sm:py-16 lg:py-20">
      <style>{`
        @keyframes shopLazyRiver {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .shop-lazy-river {
          animation: shopLazyRiver 34s linear infinite;
        }
        .shop-river-shell:hover .shop-lazy-river,
        .shop-river-shell:focus-within .shop-lazy-river {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .shop-lazy-river { animation: none; }
        }
      `}</style>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-sand" aria-hidden="true" />
      <motion.div
        className="relative z-10 mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <div className="overflow-hidden rounded-[2.5rem] bg-[#0E125C] p-5 text-white shadow-[0_30px_80px_rgba(14,18,92,0.18)] sm:p-7 lg:p-10">
          <div className="grid gap-9 lg:grid-cols-[0.42fr_0.58fr] lg:items-center xl:gap-12">
            <div className="max-w-[34rem]">
              <p className="font-script text-[2.65rem] font-semibold leading-none text-coral sm:text-[3rem]">
                Travelholics Originals
              </p>
              <h2 className="type-homepage-h2 mt-3 font-serif text-white">
                Gear for people already packing.
              </h2>
              <p className="mt-5 max-w-[36ch] text-[1.05rem] font-medium leading-[1.7] text-white/76 sm:text-[1.14rem]">
                Cruise-tested pieces, cabin-door personality, and travel lifestyle goods made for the crew that is already thinking about the next one.
              </p>
              <Link
                href="/shop-full"
                className="mt-7 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-[1rem] font-semibold text-white shadow-md transition-colors hover:bg-coral-deep"
              >
                Shop the collection
                <ArrowUpRight size={18} strokeWidth={2.2} />
              </Link>
            </div>

            <div className="shop-river-shell -mx-5 overflow-hidden px-5 pb-2 lg:mx-0 lg:px-0">
              <div className="shop-lazy-river flex w-max gap-5 pr-5">
                {lazyRiverProducts.map((product, index) => (
                  <Link
                    key={`${product.name}-${index}`}
                    href={product.href}
                    aria-label={`Shop ${product.name}`}
                    className="group block w-[74vw] max-w-[23rem] shrink-0 overflow-hidden rounded-[2rem] bg-white p-3 text-ink shadow-[0_22px_50px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-1 sm:w-[22rem]"
                    aria-hidden={index >= products.length ? true : undefined}
                    tabIndex={index >= products.length ? -1 : undefined}
                  >
                    <div className="relative aspect-[1.05/1] overflow-hidden rounded-[1.55rem] bg-sand">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        className="object-contain p-7 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 74vw, 23rem"
                      />
                    </div>
                    <div className="flex items-end justify-between gap-4 px-1 pb-1 pt-4">
                      <div>
                        <h3 className="font-serif text-[1.55rem] font-semibold leading-tight tracking-[-0.03em] text-ink">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-[1rem] font-bold text-coral">{product.price}</p>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-12">
                        <ArrowUpRight size={17} strokeWidth={2.2} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};