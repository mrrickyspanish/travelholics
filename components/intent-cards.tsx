"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Cruises",
    location: "At sea",
    description: "The big-ship life: cabins, ports, decks, dining, excursions, and the details that make the trip feel easy.",
    cta: "Plan a cruise",
    href: "/cruises/caribbean",
    image: "/images/hero_th_background.png",
    imageAlt: "Cruise ship deck at sunset",
  },
  {
    title: "Caribbean",
    location: "Island routes",
    description: "Warm water, quick flights, island days, and the kind of trip your group chat actually commits to.",
    cta: "Explore Caribbean",
    href: "/cruises/caribbean",
    image: "/images/dest-caribbean.jpg",
    imageAlt: "Caribbean destination with turquoise water",
  },
  {
    title: "Alaska",
    location: "Glacier sailings",
    description: "Glaciers, balcony views, cool-weather packing, and a completely different kind of cruise memory.",
    cta: "Explore Alaska",
    href: "/cruises/alaska",
    image: "/images/dest-alaska-glaciers.jpg",
    imageAlt: "Alaska glaciers and mountain landscape",
  },
  {
    title: "Mediterranean",
    location: "European ports",
    description: "Ancient cities, blue coastlines, port-heavy days, and a trip that feels like a story you will keep retelling.",
    cta: "Explore Europe",
    href: "/cruises/mediterranean",
    image: "/images/dest-mediterranean.jpg",
    imageAlt: "Mediterranean travel destination",
  },
];

const desktopSlots = [
  {
    left: "0%",
    top: "2rem",
    width: "52%",
    height: "27.5rem",
    zIndex: 30,
    opacity: 1,
  },
  {
    left: "47%",
    top: "5.2rem",
    width: "35%",
    height: "22rem",
    zIndex: 20,
    opacity: 0.98,
  },
  {
    left: "76%",
    top: "8rem",
    width: "24%",
    height: "17rem",
    zIndex: 10,
    opacity: 0.92,
  },
];

export const IntentCards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % cards.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-coral/8 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-[58rem] text-center"
        >
          <h2 className="font-serif text-[clamp(3.25rem,8.5vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-ink">
            Going places, with someone who knows the way.
          </h2>
        </motion.div>

        <div className="mt-12 grid items-center gap-10 lg:mt-14 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-[34rem] lg:self-center"
          >
            <p className="mb-4 inline-flex rounded-full bg-sand px-4 py-2 text-[0.875rem] font-bold text-coral shadow-sm ring-1 ring-stone/10">
              Where we&apos;ll take you
            </p>
            <p className="max-w-[39ch] text-[1.05rem] font-medium leading-[1.75] text-ink/76 sm:text-[1.15rem]">
              Browse the kind of trips Travelholics is built around, then let Yolanda help you choose the ship, stay, room, and rhythm that actually fits your people.
            </p>
            <a
              href="/#contact"
              className="mt-7 inline-flex min-h-[46px] items-center justify-center rounded-full bg-ink px-6 py-3 text-[1rem] font-semibold text-white shadow-md transition-colors hover:bg-emerald-deep"
            >
              Start planning
            </a>
          </motion.div>

          <div
            className="relative hidden min-h-[33rem] overflow-hidden lg:block"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            {desktopSlots.map((slot, slotIndex) => {
              const card = cards[(activeIndex + slotIndex) % cards.length];
              const isActiveSlot = slotIndex === 0;

              return (
                <motion.a
                  key={`${card.title}-${slotIndex}`}
                  href={card.href}
                  className="group absolute overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_24px_60px_rgba(26,58,82,0.14)] ring-1 ring-stone/10"
                  initial={false}
                  animate={slot}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-sand">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={isActiveSlot ? "44vw" : "30vw"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/86 via-ink/24 to-transparent" aria-hidden="true" />

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white lg:p-6">
                      <div className="mb-3 flex items-end justify-between gap-4">
                        <p className="font-serif text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-none tracking-[-0.05em]">
                          {card.title}
                        </p>
                        <span className="rounded-full bg-white/16 px-3 py-1.5 text-[0.86rem] font-bold text-white/88 ring-1 ring-white/20 backdrop-blur-sm">
                          {card.location}
                        </span>
                      </div>

                      {isActiveSlot && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
                        >
                          <p className="max-w-[32ch] text-[1.04rem] font-medium leading-snug text-white/88">
                            {card.description}
                          </p>
                          <p className="mt-5 inline-flex items-center gap-2 text-[1rem] font-bold text-white underline decoration-white/40 underline-offset-4">
                            {card.cta}
                            <ArrowUpRight size={18} strokeWidth={2.2} />
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>

          <div className="-mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            <div className="flex snap-x snap-mandatory gap-4">
              {cards.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  className="group relative min-h-[26rem] w-[82vw] max-w-[24rem] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_22px_52px_rgba(26,58,82,0.12)] ring-1 ring-stone/10"
                >
                  <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-sand">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-cover"
                      sizes="82vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/86 via-ink/28 to-transparent" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <div className="mb-3 flex items-end justify-between gap-4">
                        <p className="font-serif text-[2.25rem] font-semibold leading-none tracking-[-0.04em]">{card.title}</p>
                        <span className="rounded-full bg-white/16 px-3 py-1.5 text-[0.86rem] font-bold text-white/88 ring-1 ring-white/20 backdrop-blur-sm">
                          {card.location}
                        </span>
                      </div>
                      <p className="max-w-[30ch] text-[1rem] font-medium leading-snug text-white/88">{card.description}</p>
                      <p className="mt-5 inline-flex items-center gap-2 text-[1rem] font-bold text-white underline decoration-white/40 underline-offset-4">
                        {card.cta}
                        <ArrowUpRight size={18} strokeWidth={2.2} />
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
