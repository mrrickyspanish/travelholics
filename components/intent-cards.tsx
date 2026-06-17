"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Cruises",
    description: "The big-ship life: cabins, ports, decks, dining, excursions, and the details that make the trip feel easy.",
    cta: "Plan a cruise",
    href: "/cruises/caribbean",
    image: "/images/hero_th_background.png",
    imageAlt: "Cruise ship deck at sunset",
  },
  {
    title: "Caribbean",
    description: "Warm water, quick flights, island days, and the kind of trip your group chat actually commits to.",
    cta: "Explore Caribbean",
    href: "/cruises/caribbean",
    image: "/images/dest-caribbean.jpg",
    imageAlt: "Caribbean destination with turquoise water",
  },
  {
    title: "Alaska",
    description: "Glaciers, balcony views, cool-weather packing, and a completely different kind of cruise memory.",
    cta: "Explore Alaska",
    href: "/cruises/alaska",
    image: "/images/dest-alaska-glaciers.jpg",
    imageAlt: "Alaska glaciers and mountain landscape",
  },
  {
    title: "Mediterranean",
    description: "Ancient cities, blue coastlines, port-heavy days, and a trip that feels like a story you will keep retelling.",
    cta: "Explore Europe",
    href: "/cruises/mediterranean",
    image: "/images/dest-mediterranean.jpg",
    imageAlt: "Mediterranean travel destination",
  },
];

export const IntentCards = () => {
  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-coral/8 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid items-center gap-9 lg:grid-cols-[0.66fr_1.34fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-[36rem]"
          >
            <p className="mb-4 inline-flex rounded-full bg-sand px-4 py-2 text-[0.875rem] font-bold text-coral shadow-sm ring-1 ring-stone/10">
              Where we&apos;ll take you
            </p>
            <h2 className="font-serif text-[clamp(2.65rem,8vw,5.7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-ink">
              Going places, with someone who knows the way.
            </h2>
            <p className="mt-5 max-w-[39ch] text-[1.05rem] font-medium leading-[1.75] text-ink/76 sm:text-[1.15rem]">
              Browse the kind of trips Travelholics is built around, then let Yolanda help you choose the ship, stay, room, and rhythm that actually fits your people.
            </p>
            <a
              href="/#contact"
              className="mt-7 inline-flex min-h-[46px] items-center justify-center rounded-full bg-ink px-6 py-3 text-[1rem] font-semibold text-white shadow-md transition-colors hover:bg-emerald-deep"
            >
              Start planning
            </a>
          </motion.div>

          <div className="-mx-5 overflow-x-auto px-5 pb-5 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mr-10 lg:ml-0 lg:pl-0 xl:-mr-12">
            <div className="flex snap-x snap-mandatory gap-5 lg:gap-6">
              {cards.map((card, i) => (
                <motion.a
                  key={card.title}
                  href={card.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="group relative min-h-[27rem] w-[82vw] max-w-[24rem] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_22px_52px_rgba(26,58,82,0.12)] ring-1 ring-stone/10 transition-transform duration-300 hover:-translate-y-1 sm:w-[24rem] lg:min-h-[33rem] lg:w-[30rem] lg:max-w-none xl:w-[33rem]"
                >
                  <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-sand">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 82vw, 33rem"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/86 via-ink/28 to-transparent" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6 lg:p-7">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="font-serif text-[2.35rem] font-semibold leading-none tracking-[-0.04em] sm:text-[2.65rem]">{card.title}</p>
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/92 text-ink shadow-md transition-transform duration-300 group-hover:rotate-12">
                          <ArrowUpRight size={21} strokeWidth={2.2} />
                        </span>
                      </div>
                      <p className="max-w-[30ch] text-[1rem] font-medium leading-snug text-white/88 sm:text-[1.08rem]">{card.description}</p>
                      <p className="mt-5 text-[1rem] font-bold text-white underline decoration-white/40 underline-offset-4">{card.cta}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
            <div className="mt-5 hidden items-center justify-between pr-10 text-[0.95rem] font-semibold text-stone/70 lg:flex xl:pr-12">
              <span>Drag or scroll to explore the trip lanes.</span>
              <span>4 destination lanes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
