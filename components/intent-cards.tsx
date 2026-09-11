"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const destinations = [
  {
    title: "Caribbean",
    note: "Warm water, big ships, easy yes.",
    href: "/cruises/caribbean",
    image: "/images/destinations/caribbean-hero.png",
    imageAlt: "Cruise ship docked at a Caribbean port with turquoise water",
    className: "lg:col-span-7 lg:row-span-2",
  },
  {
    title: "Alaska",
    note: "Glaciers, wildlife, and the kind of quiet you remember.",
    href: "/cruises/alaska",
    image: "/images/destinations/alaska-hero.png",
    imageAlt: "Glacier and mountain landscape on an Alaska cruise route",
    className: "lg:col-span-5",
  },
  {
    title: "Mediterranean",
    note: "Wake up somewhere different every morning.",
    href: "/cruises/mediterranean",
    image: "/images/destinations/mediterranean-hero.png",
    imageAlt: "Mediterranean coastal town seen from a cruise ship",
    className: "lg:col-span-5",
  },
];

export const IntentCards = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#f4efe4] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">Start with a feeling</p>
            <h2 className="mt-4 max-w-[10ch] font-serif text-[clamp(3.4rem,6.5vw,6.8rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-royal-deep">
              Where should we wake up next?
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-base leading-7 text-stone sm:text-lg sm:leading-8">
              You do not need to know the ship yet. Pick the kind of trip you want to feel, then let Yolanda help narrow down the sailing that actually fits.
            </p>
            <Link href="/#contact" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-ink underline decoration-coral decoration-2 underline-offset-4 transition hover:text-coral-deep">
              Help me choose <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid auto-rows-[20rem] gap-3 lg:grid-cols-12 lg:auto-rows-[17rem]">
          {destinations.map((destination, index) => (
            <motion.article
              key={destination.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden ${destination.className}`}
            >
              <Link href={destination.href} className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-coral">
                <Image
                  src={destination.image}
                  alt={destination.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7 lg:p-8">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <h3 className="font-serif text-4xl font-semibold leading-none tracking-[-0.05em] sm:text-5xl">{destination.title}</h3>
                      <p className="mt-3 max-w-md text-sm leading-6 text-white/68 sm:text-base">{destination.note}</p>
                    </div>
                    <span className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/24 bg-black/10 text-white backdrop-blur-sm transition group-hover:rotate-12 group-hover:bg-white group-hover:text-ink">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
