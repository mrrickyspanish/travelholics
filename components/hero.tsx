"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16 bg-gradient-to-b from-hero-sky via-cream to-sand">
      {/* Full hero background image with no overlay */}
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

      <div className="relative z-10 max-w-[88rem] mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-[56%_44%] gap-12 lg:gap-8 items-center">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block lg:max-w-2xl mb-10 px-0 py-0 lg:rounded-[2rem] lg:bg-white/88 lg:backdrop-blur-sm lg:shadow-2xl lg:shadow-ink/25 lg:border lg:border-white/85 lg:ring-1 lg:ring-white/45 lg:px-8 lg:py-7">
              <div className="mb-4">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-1">
                  <h1 className="font-serif text-[3.2rem] lg:text-[4.5rem] xl:text-[4.9rem] font-semibold leading-[0.98] tracking-[-0.02em] text-[#0E125C]">
                    Travelholic.
                  </h1>
                  <span className="text-[#0E125C] italic text-[1.35rem] lg:text-[1.9rem] leading-none mb-2">(noun)</span>
                </div>
                <p className="text-stone/80 text-[12px] lg:text-[13px] tracking-wide mb-2">/ˈtra-vəl-hä-lik/</p>
                <p className="text-[#0E125C] text-[1.55rem] lg:text-[2rem] xl:text-[2.2rem] font-medium leading-tight">
                  Someone who travels{" "}
                  <span className="relative inline-block font-script text-coral text-[1.7rem] lg:text-[2.1rem] xl:text-[2.3rem] font-semibold leading-none align-baseline">
                    between trips
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
                  .
                </p>
              </div>

              <p className="text-base lg:text-lg text-royal-deep/80 leading-relaxed lg:max-w-xl">
                Symptoms include: planning the next trip before you&apos;ve unpacked the last one, screenshotting cruise deals at 1 a.m., and packing a carry-on that&apos;s secretly checked-bag-sized. No cure. Just better trips, a group that gets it, and the gear to prove it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/#group-trips"
                className="inline-flex items-center justify-center gap-1.5 bg-coral hover:bg-coral-deep text-white font-semibold px-7 py-4 rounded-full transition-colors shadow-lg shadow-coral/20 text-[15px] group"
              >
                <span>Reserve a Cabin · Caribbean 2027</span>
                <span className="inline-block text-[12px] translate-x-0 group-hover:translate-x-[2px] transition-transform duration-200" aria-hidden="true">↗</span>
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center bg-white border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold px-7 py-4 rounded-full transition-colors shadow-sm text-[15px]"
              >
                Join the Crew
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
