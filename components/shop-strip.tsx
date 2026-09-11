// ⚠️ PLACEHOLDER PRICES AND PRODUCT DATA
// Product prices and URLs below are placeholders pending final data.

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const products = [
  {
    name: "Atlantis Lanyard",
    price: "$12.00",
    image: "/images/travelholics_lanyard_transparent.png",
    href: "/shop-full",
    imageAlt: "Travelholics Atlantis lanyard",
  },
  {
    name: "Cruise Life Magnet",
    price: "$19.99",
    image: "/images/travelholics_product_ticket-magnet-pacific.png",
    href: "/shop-full",
    imageAlt: "Cruise Life ticket-style magnet",
  },
  {
    name: "Pacific Coast Magnet",
    price: "$19.99",
    image: "/images/travelholics_product_pacific-mexican-door-magnet.png",
    href: "/shop-full",
    imageAlt: "Pacific Mexican cruise magnet with coastal artwork",
  },
  {
    name: "Travelholics Bucket Hat",
    price: "$38.00",
    image: "/images/Travelholics_merch_bucket_hat.png",
    href: "/shop-full",
    imageAlt: "Travelholics beige bucket hat with embroidered logo",
  },
];

export const ShopStrip = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-ink/10 bg-[#fbf7ef] py-20 sm:py-28 lg:py-32">
      <motion.div
        className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">Travelholics Originals</p>
            <h2 className="mt-4 max-w-[18ch] font-serif text-[clamp(3rem,6vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-royal-deep lg:max-w-[10ch] lg:leading-[0.88]">
              Bring a little cruise life home.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-base leading-7 text-stone sm:text-lg sm:leading-8">
              Travel pieces, cabin personality, and small reminders that your next trip is never as far away as it feels.
            </p>
            <Link href="/shop-full" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-ink underline decoration-coral decoration-2 underline-offset-4 transition hover:text-coral-deep">
              Shop the collection <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12 -mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="flex min-w-max gap-4 lg:grid lg:min-w-0 lg:grid-cols-4 lg:gap-0 lg:border-y lg:border-ink/10">
            {products.map((product, index) => (
              <Link
                key={product.name}
                href={product.href}
                aria-label={`Shop ${product.name}`}
                className={`group block w-[72vw] max-w-[20rem] shrink-0 py-5 lg:w-auto lg:max-w-none lg:px-5 lg:py-7 ${index < products.length - 1 ? "lg:border-r lg:border-ink/10" : ""}`}
              >
                <div className="relative aspect-square bg-[#f4efe4]">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    className="object-contain p-7 transition-transform duration-500 group-hover:scale-[1.035]"
                    sizes="(max-width: 1024px) 72vw, 25vw"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold leading-[1] tracking-[-0.04em] text-royal-deep">{product.name}</h3>
                    <p className="mt-2 text-sm font-black text-coral">{product.price}</p>
                  </div>
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition group-hover:rotate-12 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
