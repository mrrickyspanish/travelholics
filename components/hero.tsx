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
        <div className="relative min-h-[calc(100svh-5rem)] overflow-hidden rounded-[1rem] bg-ink shadow-[0_30px_90px_rgba(26,58,82,0.18)] sm:rounded-[1.25rem] lg:min-h-[calc(100svh-5.5rem)] lg:rounded-[1.375rem]">
          {/* Future video background can replace this media layer without changing the hero structure. */}
          <motion.div
            className="absolute inset-0"
            aria-hidden="true"
            initial={{ scale: 1.01 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: 14, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/Charlotte_Amalie_StThomas.png"
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>

          <div className="absolute left-5 top-5 z-20 rounded-full bg-white/14 px-4 py-2 text-[0.875rem] font-semibold text-white/76 ring-1 ring-white/18 backdrop-blur-sm sm:left-8 sm:top-8 lg:left-10 lg:top-10">
            Charlotte Amalie · St. Thomas
          </div>

          <div className="relative z-10 min-h-[calc(100svh-5rem)] lg:min-h-[calc(100svh-5.5rem)]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-x-5 top-[45%] mx-auto max-w-[66rem] -translate-y-1/2 text-center sm:inset-x-8 lg:inset-x-12"
            >
              <h1 className="font-serif text-[clamp(3.25rem,11.6vw,10.8rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-white drop-shadow-[0_8px_28px_rgba(10,31,44,0.28)]">
                Travelholic
              </h1>
              <p className="mx-auto mt-4 max-w-[22ch] font-serif text-[clamp(1.3rem,3.65vw,3.7rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white drop-shadow-[0_6px_20px_rgba(10,31,44,0.24)] sm:mt-5">
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
              className="absolute inset-x-5 bottom-3 mx-auto max-w-[92rem] sm:inset-x-8 sm:bottom-4 lg:inset-x-10 lg:bottom-5 xl:inset-x-12 xl:bottom-6"
            >
              <p className="max-w-[38ch] text-left text-[0.88rem] font-medium leading-[1.55] text-white/82 sm:text-[0.95rem] lg:text-[0.97rem]">
                Always planning the next getaway? No cure, just better trips, a crew that gets it, and gear to match.
              </p>

              <div className="mt-5 border-t border-dashed border-white/38 pt-2 sm:mt-6 sm:pt-2 lg:pt-3">
                <nav aria-label="Hero quick links" className="grid grid-cols-[1fr_auto_1fr] items-end">
                  {heroLinks.map((link, index) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className={[
                        "inline-flex w-fit flex-col gap-1 rounded-md px-1 py-1 text-[0.68rem] font-medium text-white/82 transition-colors hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral sm:text-[0.72rem] lg:text-[0.78rem]",
                        index === 0 ? "justify-self-start text-left" : "",
                        index === 1 ? "justify-self-center text-center" : "",
                        index === 2 ? "justify-self-end text-right" : "",
                      ].join(" ")}
                    >
                      <span className="inline-flex items-center gap-1">
                        <span>{link.label}</span>
                        <span className="text-[0.75em] leading-none">›</span>
                      </span>
                      <span className="h-px w-full bg-white/42" aria-hidden="true" />
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