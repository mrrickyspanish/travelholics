"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/button";

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
          <Image
            src="/images/hero_th_background.png"
            alt="Cruise ship deck at sunset over the ocean"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,31,44,0.30)_0%,rgba(10,31,44,0.08)_34%,rgba(10,31,44,0.68)_100%),linear-gradient(90deg,rgba(10,31,44,0.42)_0%,rgba(10,31,44,0.12)_45%,rgba(10,31,44,0.26)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(252,250,245,0.18)_0%,rgba(252,250,245,0)_36%),radial-gradient(circle_at_18%_78%,rgba(242,106,117,0.18)_0%,rgba(242,106,117,0)_30%)]" />

          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-[92rem] flex-col justify-between px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[calc(100svh-5.5rem)] lg:px-12 lg:py-12 xl:px-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="pt-10 sm:pt-16 lg:pt-20"
            >
              <h1 className="font-serif text-[clamp(4.75rem,17vw,16rem)] font-semibold leading-[0.78] tracking-[-0.075em] text-white drop-shadow-[0_8px_28px_rgba(10,31,44,0.32)]">
                Travelholic.
              </h1>
              <p className="mt-4 max-w-[18ch] font-serif text-[clamp(2rem,6vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:max-w-[20ch] lg:mt-6">
                Someone who travels{" "}
                <span className="relative inline-block whitespace-nowrap font-script text-[1.12em] font-semibold tracking-normal text-coral">
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
              className="grid gap-7 border-t border-white/28 pt-7 lg:grid-cols-[0.74fr_1.26fr] lg:items-end lg:gap-10"
            >
              <div>
                <p className="max-w-[38ch] text-[1.05rem] font-medium leading-[1.7] text-white/88 sm:text-[1.18rem]">
                  Always planning the next getaway. No cure, just better trips, a crew that gets it, and gear to match.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    variant="coral"
                    className="w-full sm:w-auto sm:min-w-[11.5rem]"
                    onClick={() => { window.location.href = "/#contact"; }}
                  >
                    Plan My Cruise
                  </Button>
                  <a
                    href="/shop-full"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white/92 px-6 py-3 text-[16px] font-semibold text-emerald-mid shadow-md transition-colors hover:bg-white"
                  >
                    Shop Travel Gear
                  </a>
                </div>
              </div>

              <div className="hidden items-end justify-between gap-5 text-white/88 lg:flex">
                <p className="max-w-[27ch] text-[1rem] font-medium leading-relaxed">
                  Certified Cruise Specialist. No planning fees. Twenty-plus years of ports, decks, packing lists, and real travel opinions.
                </p>
                <div className="flex min-w-[34rem] items-center justify-between gap-5 border-t border-dashed border-white/34 pt-4">
                  {heroLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[1rem] font-semibold text-white underline decoration-white/35 underline-offset-4 transition-colors hover:text-coral"
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
