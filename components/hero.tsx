"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/button";

export const Hero = () => {
  return (
    <section className="relative flex items-start overflow-hidden bg-gradient-to-b from-hero-sky via-cream to-sand pt-16 lg:min-h-[90vh] lg:items-center">
      {/* Full hero background image */}
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
        className="absolute inset-0 bg-[radial-gradient(circle_at_14%_34%,rgba(252,250,245,0.78)_0%,rgba(252,250,245,0.54)_22%,rgba(252,250,245,0.22)_44%,rgba(252,250,245,0.08)_62%,rgba(252,250,245,0)_80%),linear-gradient(110deg,rgba(252,250,245,0.62)_0%,rgba(252,250,245,0.32)_26%,rgba(252,250,245,0.12)_48%,rgba(252,250,245,0)_68%)] lg:bg-[radial-gradient(circle_at_18%_34%,rgba(252,250,245,0.62)_0%,rgba(252,250,245,0.38)_24%,rgba(252,250,245,0.18)_44%,rgba(252,250,245,0.06)_60%,rgba(252,250,245,0)_78%),linear-gradient(110deg,rgba(252,250,245,0.48)_0%,rgba(252,250,245,0.22)_24%,rgba(252,250,245,0.08)_46%,rgba(252,250,245,0)_66%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[88rem] px-5 pt-8 pb-[26px] sm:px-6 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-[56%_44%] gap-12 lg:gap-8 items-center">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto flex w-full max-w-[29rem] flex-col items-center pt-4 sm:pt-8 lg:mx-0 lg:max-w-none lg:items-start lg:pt-0"
          >
            <div className="mx-auto inline-block w-full max-w-[34rem] rounded-[1.75rem] border border-white/80 bg-[rgba(252,250,245,0.82)] px-5 py-5 text-center shadow-[0_18px_45px_rgba(26,58,82,0.1)] ring-1 ring-white/55 backdrop-blur-0 sm:px-6 sm:py-6 sm:backdrop-blur-[2px] lg:mx-0 lg:max-w-2xl lg:rounded-[2rem] lg:bg-white/84 lg:px-8 lg:py-7 lg:text-left lg:shadow-2xl lg:shadow-ink/20">
              <div className="mb-5 space-y-3.5 lg:space-y-4">
                <div className="flex flex-wrap items-end justify-center gap-x-3 gap-y-1 lg:justify-start">
                  <h1 className="font-serif text-[clamp(2.95rem,10vw,3.35rem)] font-semibold leading-[0.96] tracking-[-0.02em] text-[#0E125C] lg:text-[4.5rem] xl:text-[4.9rem]">
                    Travelholic.
                  </h1>
                  <span className="mb-2 text-[1.35rem] italic leading-none text-[#0E125C] lg:text-[1.9rem]">(noun)</span>
                </div>
                <p className="text-eyebrow text-stone/85 lg:text-[13px]">/ˈtra-vəl-hä-lik/</p>
                <p className="mx-auto max-w-[24ch] text-[1.3rem] leading-[1.12] font-medium text-[#0E125C] lg:mx-0 lg:max-w-none lg:text-[2rem] xl:text-[2.2rem]">
                  Someone who travels{" "}
                  <span className="relative inline-block rounded-full bg-cream/92 px-2 pb-1 pt-0.5 font-script text-[1.72rem] font-semibold leading-none text-[#D84E59] shadow-[0_4px_12px_rgba(252,250,245,0.45)] align-baseline lg:bg-cream/80 lg:text-[2.1rem] xl:text-[2.3rem]">
                    between trips.
                    <svg
                      className="absolute -bottom-1 left-0 w-full text-coral"
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
              </div>

              <p className="mx-auto text-[1.3rem] leading-[1.65] font-medium text-royal-deep [text-shadow:0_1px_2px_rgba(255,255,255,0.18)] lg:mx-0 lg:max-w-[40ch]">
                Always planning the next getaway. No cure, just better trips, a crew that gets it, and gear to match.
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mx-auto mt-3 border-t border-blush/70 pt-3 text-[1.3rem] leading-[1.65] font-semibold text-ink lg:mx-0 lg:max-w-[44ch]"
              >
                Certified Cruise Specialist · 20+ years · every major line. Same price as booking direct — no fees.
              </motion.p>
            </div>

            <div className="mt-5 flex w-full max-w-[34rem] flex-col items-center gap-3 sm:flex-row sm:justify-center lg:max-w-none lg:items-start lg:justify-start">
              <Button
                variant="coral"
                className="w-full sm:w-auto"
                onClick={() => window.location.href = '/#contact'}
              >
                Plan My Cruise
              </Button>
              <a
                href="/shop"
                className="py-2 text-[15px] font-medium text-royal-deep/55 underline underline-offset-2 transition-colors hover:text-royal-deep"
              >
                shop the merch
              </a>
            </div>
          </motion.div>

          {/* Right column — compact Yolanda polaroid + intro card */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex flex-col items-end gap-0 lg:pr-3"
          >
            {/* Polaroid card: white border, slight rotation, shadow */}
            <div
              className="bg-white p-[7px] pb-8 shadow-2xl shadow-ink/15 w-[320px] xl:w-[340px]"
              style={{ transform: "rotate(-1deg)" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-blush">
                {/* Hero card image */}
                <Image
                  src="/images/why-stress-free.jpg"
                  alt="Yolanda, Your Cruise Curator & Travel Partner"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1280px) 340px, 320px"
                  priority
                />
              </div>
            </div>

            {/* Floating intro card — overlaps bottom of polaroid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/97 backdrop-blur rounded-2xl shadow-xl p-6 w-[320px] xl:w-[340px] border border-blush/80"
              style={{ marginTop: "-2.4rem", marginRight: "1rem" }}
            >
              <p className="font-script text-[2.2rem] text-coral leading-none mb-2">Hi, I&apos;m Yolanda</p>
              <p className="text-[24px] font-semibold text-royal-deep leading-snug mb-3">Travelholic in Chief</p>
              <p className="text-[18px] font-medium text-royal-deep/90 leading-relaxed">
                20+ years addicted to ports, decks, and packing lists.
              </p>
              <p className="font-script text-[1.55rem] text-coral leading-none text-right mt-4">No regrets.</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
