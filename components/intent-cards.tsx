"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const cards = [
  { title: "Cruises", location: "At sea", detailLabel: "Cruise Deck, At Sea", description: "Ship views, cabin tips, and easier cruise days.", href: "/cruises/caribbean", image: "/images/hero_th_background.png", imageAlt: "Cruise ship deck at sunset" },
  { title: "Caribbean", location: "Island routes", detailLabel: "Caribbean Sea, Islands", description: "Warm beaches, quick flights, easy group getaways.", href: "/cruises/caribbean", image: "/images/dest-caribbean.jpg", imageAlt: "Caribbean destination with turquoise water" },
  { title: "Alaska", location: "Glacier sailings", detailLabel: "Alaska, USA", description: "Glacier views, balcony mornings, cool-weather memories.", href: "/cruises/alaska", image: "/images/dest-alaska-glaciers.jpg", imageAlt: "Alaska glaciers and mountain landscape" },
  { title: "Mediterranean", location: "European ports", detailLabel: "Mediterranean, Greece", description: "Ancient cities, blue coasts, unforgettable port days.", href: "/cruises/mediterranean", image: "/images/dest-mediterranean.jpg", imageAlt: "Mediterranean travel destination" },
];

const desktopSlots = [
  { left: "0%", top: "2rem", width: "52%", height: "25rem", zIndex: 30, opacity: 1, scale: 1, rotate: 0 },
  { left: "47%", top: "5.2rem", width: "35%", height: "22rem", zIndex: 20, opacity: 0.98, scale: 1, rotate: -1.2 },
  { left: "76%", top: "8rem", width: "24%", height: "17rem", zIndex: 10, opacity: 0.92, scale: 1, rotate: 1.5 },
  { left: "104%", top: "9.5rem", width: "19%", height: "14rem", zIndex: 0, opacity: 0, scale: 0.92, rotate: 3 },
];

export const IntentCards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeCard = cards[activeIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const interval = window.setInterval(() => setActiveIndex((index) => (index + 1) % cards.length), 4200);
    return () => window.clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  return (
    <section className="relative overflow-hidden bg-cream py-10 sm:py-20 lg:py-28">
      <style>{`
        @keyframes travelholicsDotPulse {
          0%, 100% { transform: scale(1); opacity: 0.78; box-shadow: 0 0 0 0 rgba(16,117,90,0.34), 0 0 10px rgba(16,117,90,0.58); }
          50% { transform: scale(1.18); opacity: 1; box-shadow: 0 0 0 4px rgba(16,117,90,0.10), 0 0 16px rgba(16,117,90,0.76); }
        }
      `}</style>
      <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-coral/8 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
        <div className="mt-0 grid items-center gap-10 sm:mt-12 lg:mt-14 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12 xl:gap-16">
          <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="relative max-w-[34rem] lg:flex lg:min-h-[35rem] lg:flex-col lg:justify-center">
            <span className="mb-3 hidden self-start items-center gap-2 rounded-full border border-white/40 bg-white/20 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ink shadow-[0_10px_26px_rgba(26,58,82,0.08)] backdrop-blur-md lg:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-mid" style={{ animation: "travelholicsDotPulse 2.1s ease-in-out infinite" }} aria-hidden="true" />
              Wander Freely
            </span>
            <h3 className="mb-4 font-serif text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-ink lg:text-6xl">Not Your Boring<br />Travel Agent</h3>
            <p className="max-w-[39ch] text-[1.05rem] font-medium leading-[1.75] text-ink/76 sm:text-[1.15rem]">Browse the kind of trips Travelholics is built around, then let Yolanda help you choose the ship, stay, room, and rhythm that actually fits your people.</p>
            <a href="/#contact" className="mt-7 inline-flex min-h-[46px] w-fit items-center justify-center rounded-xl bg-ink px-6 py-3 text-[1rem] font-semibold text-white shadow-md transition-colors hover:bg-emerald-deep">Start planning</a>
          </motion.div>

          <div className="relative hidden min-h-[35rem] overflow-visible lg:block" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocusCapture={() => setIsPaused(true)} onBlurCapture={() => setIsPaused(false)}>
            {cards.map((card, index) => {
              const slotIndex = (index - activeIndex + cards.length) % cards.length;
              const slot = desktopSlots[slotIndex];
              return (
                <motion.a key={card.title} href={card.href} className="group absolute block overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_24px_60px_rgba(26,58,82,0.14)] ring-1 ring-stone/10" aria-label={card.title} initial={false} animate={slot} transition={{ duration: prefersReducedMotion ? 0 : 0.78, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-sand">
                    <Image src={card.image} alt={card.imageAlt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes={slotIndex === 0 ? "44vw" : "30vw"} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/26 via-transparent to-transparent" aria-hidden="true" />
                    <p className="absolute bottom-4 right-4 text-right text-[0.56rem] font-bold uppercase leading-none tracking-[0.14em] text-white/70 lg:bottom-5 lg:right-5">{card.location}</p>
                  </div>
                </motion.a>
              );
            })}

            <div className="absolute left-0 bottom-[1.25rem] max-w-[34rem]">
              <AnimatePresence mode="wait">
                <motion.div key={activeCard.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: prefersReducedMotion ? 0 : 0.32, exit: { duration: 0.12 } }}>
                  <p className="text-[0.85rem] font-bold uppercase tracking-[0.12em] text-coral">{activeCard.detailLabel}</p>
                  <p className="mt-2 max-w-[32rem] text-[1.02rem] font-medium leading-[1.62] text-ink/78">{activeCard.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="-mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            <div className="flex snap-x snap-mandatory gap-4">
              {cards.map((card) => (
                <div key={card.title} className="w-[82vw] max-w-[24rem] shrink-0 snap-start">
                  <a href={card.href} className="group relative block h-[24rem] overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_22px_52px_rgba(26,58,82,0.12)] ring-1 ring-stone/10" aria-label={card.title}>
                    <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-sand">
                      <Image src={card.image} alt={card.imageAlt} fill className="object-cover" sizes="82vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/26 via-transparent to-transparent" aria-hidden="true" />
                      <p className="absolute bottom-4 right-4 text-right text-[0.56rem] font-bold uppercase leading-none tracking-[0.14em] text-white/70">{card.location}</p>
                    </div>
                  </a>
                  <p className="mt-4 text-[0.85rem] font-bold uppercase tracking-[0.12em] text-coral">{card.detailLabel}</p>
                  <p className="mt-2 text-[1rem] font-medium leading-[1.6] text-ink/78">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};