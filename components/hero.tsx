"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/button";

const featureCards = [
  {
    title: "Caribbean",
    note: "Cruises, ports, and warm-water escapes",
    image: "/images/dest-caribbean.jpg",
    alt: "Caribbean cruise destination with turquoise water",
    href: "/cruises/caribbean",
  },
  {
    title: "Alaska",
    note: "Glaciers, balcony views, and bucket-list sailings",
    image: "/images/dest-alaska.jpg",
    alt: "Alaska cruise destination with glacial scenery",
    href: "/cruises/alaska",
  },
  {
    title: "Mediterranean",
    note: "History, coastlines, and once-in-a-lifetime ports",
    image: "/images/dest-mediterranean.jpg",
    alt: "Mediterranean travel destination",
    href: "/cruises/mediterranean",
  },
];

const trustChips = ["Certified Cruise Specialist", "No planning fees", "20+ years of travel experience"];

export const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-cream pt-16 text-ink lg:min-h-[94vh] lg:pt-0">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero_th_background.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,250,245,0.60)_0%,rgba(252,250,245,0.30)_34%,rgba(245,239,228,0.95)_100%),radial-gradient(circle_at_20%_20%,rgba(252,250,245,0.72)_0%,rgba(252,250,245,0.24)_34%,rgba(252,250,245,0)_64%)] lg:bg-[linear-gradient(90deg,rgba(10,31,44,0.42)_0%,rgba(10,31,44,0.14)_38%,rgba(10,31,44,0)_66%),linear-gradient(180deg,rgba(252,250,245,0.24)_0%,rgba(245,239,228,0.12)_48%,rgba(245,239,228,0.92)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[92rem] flex-col px-5 pb-8 pt-7 sm:px-6 sm:pb-10 lg:min-h-[94vh] lg:px-10 lg:pb-12 lg:pt-24 xl:px-12">
        <div className="grid flex-1 items-center gap-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(34rem,1.08fr)] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto w-full max-w-[39rem] lg:mx-0 lg:max-w-[45rem]"
          >
            <div className="rounded-[2rem] border border-white/75 bg-cream/91 p-5 shadow-[0_22px_60px_rgba(26,58,82,0.16)] sm:p-7 lg:rounded-[2.35rem] lg:p-8 xl:p-9">
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <h1 className="font-serif text-[clamp(3.25rem,17vw,5.55rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#0E125C] lg:text-[clamp(5.25rem,7.9vw,8.2rem)]">
                  Travelholic.
                </h1>
                <span className="mb-2 font-serif text-[1.35rem] italic text-[#0E125C] sm:text-[1.6rem] lg:mb-4 lg:text-[2rem]">
                  (noun)
                </span>
              </div>

              <p className="mt-3 text-[15px] font-medium tracking-[0.02em] text-stone/80 lg:mt-4">
                /ˈtra-vəl-hä-lik/
              </p>

              <div className="mt-5 h-px w-14 bg-coral/70" aria-hidden="true" />

              <p className="mt-5 max-w-[17ch] font-serif text-[clamp(1.85rem,8vw,2.85rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#0E125C] sm:max-w-[21ch] lg:max-w-[22ch] lg:text-[clamp(2.85rem,3.8vw,4.15rem)]">
                Someone who travels{" "}
                <span className="relative inline-block whitespace-nowrap font-script text-[1.18em] font-semibold tracking-normal text-coral">
                  between trips.
                  <svg
                    className="absolute -bottom-1 left-0 h-3 w-full text-coral"
                    viewBox="0 0 210 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3 7 C44 3, 84 8.3, 126 5.4 C159 3.3, 186 6.8, 207 4.8"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </p>

              <p className="mt-5 max-w-[42ch] text-[1.05rem] font-medium leading-[1.7] text-ink/84 sm:text-[1.1rem] lg:text-[1.18rem]">
                Always planning the next getaway. No cure, just better trips, a crew that gets it, and gear to match.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-stone/12 pt-5">
                {trustChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white/82 px-3.5 py-2 text-[0.875rem] font-semibold text-ink/76 shadow-sm ring-1 ring-stone/10"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-6">
              <Button
                variant="coral"
                className="w-full sm:w-auto sm:min-w-[11.5rem]"
                onClick={() => { window.location.href = "/#contact"; }}
              >
                Plan My Cruise
              </Button>
              <a
                href="/shop-full"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white/84 px-6 py-3 text-[16px] font-semibold text-emerald-mid shadow-md ring-1 ring-emerald-mid/16 transition-colors hover:bg-white"
              >
                Shop Travel Gear
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative hidden min-h-[35rem] lg:block"
          >
            <div className="absolute left-[7%] top-[6%] w-[18rem] rotate-[-2deg] overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_28px_70px_rgba(10,31,44,0.22)] xl:w-[20rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
                <Image
                  src="/images/hero-yolanda.jpg"
                  alt="Yolanda Harris, Travelholic in Chief"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="320px"
                />
              </div>
              <div className="px-3 pb-3 pt-4">
                <p className="font-script text-[2.25rem] font-semibold leading-none text-coral">Hi, I&apos;m Yolanda</p>
                <p className="mt-2 font-serif text-[1.55rem] font-semibold leading-tight text-[#0E125C]">Travelholic in Chief</p>
                <p className="mt-2 text-[1rem] font-medium leading-relaxed text-ink/78">20+ years addicted to ports, decks, and packing lists.</p>
              </div>
            </div>

            <div className="absolute bottom-[3%] right-0 flex w-[78%] items-end gap-4 xl:w-[82%]">
              {featureCards.map((card, index) => (
                <a
                  key={card.title}
                  href={card.href}
                  className={`group relative block overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-[0_24px_58px_rgba(10,31,44,0.2)] ring-1 ring-white/65 transition-transform duration-300 hover:-translate-y-1 ${index === 1 ? "mb-14 w-[15.5rem] xl:w-[17.5rem]" : "w-[13.5rem] xl:w-[15rem]"}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="280px"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/82 via-ink/24 to-transparent p-4 text-white">
                      <p className="font-serif text-[1.45rem] font-semibold leading-none">{card.title}</p>
                      <p className="mt-1 text-[0.9rem] font-medium leading-snug text-white/86">{card.note}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 lg:hidden">
          <div className="flex gap-4 overflow-x-auto pb-2 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {featureCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group relative min-h-[21rem] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_20px_50px_rgba(26,58,82,0.14)]"
                style={{ flexBasis: "min(78vw, 21rem)" }}
              >
                <div className="relative h-full overflow-hidden rounded-[1.55rem]">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-cover"
                    sizes="78vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/86 via-ink/34 to-transparent p-5 text-white">
                    <p className="font-serif text-[2rem] font-semibold leading-none">{card.title}</p>
                    <p className="mt-2 max-w-[23ch] text-[1rem] font-medium leading-snug text-white/88">{card.note}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
