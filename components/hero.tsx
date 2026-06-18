"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const heroLinks = [
  { label: "Plan My Cruise", href: "/#contact" },
  { label: "Meet Yolanda", href: "/#about" },
  { label: "Shop Gear", href: "/shop-full" },
];

export const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-cream pt-16 text-white">
      <div className="mx-auto w-full px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
        <div className="relative min-h-[calc(100svh-5rem)] overflow-hidden rounded-[2rem] bg-ink shadow-[0_30px_90px_rgba(26,58,82,0.18)] sm:rounded-[2.5rem] lg:min-h-[calc(100svh-5.5rem)] lg:rounded-[2.75rem]">
          {/* Future video background can replace this media layer without changing the hero structure. */}
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

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,31,44,0.18)_0%,rgba(10,31,44,0.08)_38%,rgba(10,31,44,0.62)_100%),linear-gradient(90deg,rgba(10,31,44,0.30)_0%,rgba(10,31,44,0.04)_46%,rgba(10,31,44,0.20)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(252,250,245,0.12)_0%,rgba(252,250,245,0)_36%),radial-gradient(circle_at_18%_78%,rgba(242,106,117,0.14)_0%,rgba(242,106,117,0)_30%)]" aria-hidden="true" />

          <div className="absolute left-5 top-5 z-20 rounded-full bg-white/14 px-4 py-2 text-[0.875rem] font-semibold text-white/76 ring-1 ring-white/18 backdrop-blur-sm sm:left-8 sm:top-8 lg:left-10 lg:top-10">
            Charlotte Amalie · St. Thomas
          </div>

          <div className="relative z-10 min-h-[calc(100svh-5rem)] lg:min-h-[calc(100svh-5.5rem)]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-x-5 top-1/2 mx-auto max-w-[82rem] -translate-y-1/2 text-center sm:inset-x-8 lg:inset-x-12"
            >
              <h1 className="font-serif text-[clamp(4.1rem,14.5vw,13.6rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-white drop-shadow-[0_8px_28px_rgba(10,31,44,0.28)]">
                Travelholic
              </h1>
              <p className="mx-auto mt-5 max-w-[22ch] font-serif text-[clamp(1.65rem,4.6vw,4.65rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white drop-shadow-[0_6px_20px_rgba(10,31,44,0.24)] sm:mt-6">
                Someone who travels{" "}
                <span className="relative inline-block whitespace-nowrap font-script text-[1.08em] font-semibold tracking-normal text-coral">
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
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="absolute inset-x-5 bottom-6 mx-auto max-w-[92rem] sm:inset-x-8 sm:bottom-8 lg:inset-x-10 lg:bottom-10 xl:inset-x-12"
            >
              <p className="max-w-[42ch] text-left text-[0.98rem] font-medium leading-[1.55] text-white/82 sm:text-[1.05rem] lg:text-[1.08rem]">
                Always planning the next getaway? No cure, just better trips, a crew that gets it, and gear to match.
              </p>

              <div className="mt-5 border-t border-dashed border-white/38 pt-5 sm:mt-6 sm:pt-6">
                <nav aria-label="Hero quick links" className="grid grid-cols-3 gap-3 text-center">
                  {heroLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="rounded-full px-2 py-2 text-[0.95rem] font-semibold text-white/88 transition-colors hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral sm:text-[1.02rem] lg:text-[1.08rem]"
                    >
                      {link.label} →
                    </a>
                  ))}
                </nav>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};