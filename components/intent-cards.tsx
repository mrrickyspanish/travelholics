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
    height: "25rem",
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
            <p className="mb-4 text-[0.9rem] font-bold uppercase tracking-[0.08em] text-coral">
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
            className="relative hidden min-h-[35rem] overflow-visible lg:block"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            {desktopSlots.map((slot, slotIndex) => {
              const card = cards[(activeIndex + slotIndex) % cards.length];
              const isActiveSlot = slotIndex === 0;

              return (
                <motion.div
                  key={`${card.title}-${slotIndex}`}
                  className="absolute"
                  initial={false}
                  animate={slot}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={card.href}
                    className="group block h-full overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_24px_60px_rgba(26,58,82,0.14)] ring-1 ring-stone/10"
                  >
                    <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-sand">
                      <Image
                        src={card.image}
                        alt={card.imageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={isActiveSlot ? "44vw" : "30vw"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/64 via-ink/12 to-transparent" aria-hidden="true" />

                      <div className="absolute inset-x-0 bottom-0 p-5 text-white lg:p-6">
                        <p className="max-w-[9ch] font-serif text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-none tracking-[-0.05em]">
                          {card.title}
                        </p>
                        <p className="absolute bottom-5 right-5 text-right text-[0.66rem] font-bold uppercase tracking-[0.12em] text-white/76 lg:bottom-6 lg:right-6">
                          {card.location}
                        </p>
                      </div>
                    </div>
                  </a>

                  {isActiveSlot && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
                      className="mt-4 max-w-[34rem]"
                    >
                      <p className="text-[1.02rem] font-medium leading-[1.62] text-ink/78">
                        {card.description}
                      </p>
                      <a
                        href={card.href}
                        className="mt-3 inline-flex items-center gap-2 text-[1rem] font-bold text-ink underline decoration-ink/28 underline-offset-4 transition-colors hover:text-coral"
                      >
                        {card.cta}
                        <ArrowUpRight size={18} strokeWidth={2.2} />
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="-mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            <div className="flex snap-x snap-mandatory gap-4">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="w-[82vw] max-w-[24rem] shrink-0 snap-start"
                >
                  <a
                    href={card.href}
                    className="group relative block min-h-[24rem] overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_22px_52px_rgba(26,58,82,0.12)] ring-1 ring-stone/10"
                  >
                    <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-sand">
                      <Image
                        src={card.image}
                        alt={card.imageAlt}
                        fill
                        className="object-cover"
                        sizes="82vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/68 via-ink/14 to-transparent" aria-hidden="true" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <p className="font-serif text-[2.25rem] font-semibold leading-none tracking-[-0.04em]">{card.title}</p>
                        <p className="absolute bottom-5 right-5 text-right text-[0.66rem] font-bold uppercase tracking-[0.12em] text-white/76">
                          {card.location}
                        </p>
                      </div>
                    </div>
                  </a>
                  <p className="mt-4 text-[1rem] font-medium leading-[1.6] text-ink/78">{card.description}</p>
                  <a
                    href={card.href}
                    className="mt-3 inline-flex items-center gap-2 text-[1rem] font-bold text-ink underline decoration-ink/28 underline-offset-4"
                  >
                    {card.cta}
                    <ArrowUpRight size={18} strokeWidth={2.2} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
