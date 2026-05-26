"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Anchor, Users } from "lucide-react";

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
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-[4.5rem] font-semibold leading-[1.04] tracking-[-0.02em] text-royal-deep mb-1">
                Curated Cruises.
              </h1>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-[4.5rem] font-semibold leading-[1.04] tracking-[-0.02em] text-royal-deep mb-2">
                Real Experience.
              </h1>

              {/* Script line with coral underline swoosh */}
              <div className="relative inline-block mb-5">
                <span className="font-script text-[2.6rem] lg:text-[3rem] xl:text-[3.4rem] text-coral font-semibold leading-tight">
                  Stress-Free Planning.
                </span>
                <svg
                  className="absolute -bottom-1 left-0 w-full text-emerald-mid"
                  viewBox="0 0 340 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 7 C58 3, 116 8.5, 170 5.5 C224 2.5, 280 7.5, 337 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="text-base lg:text-lg text-ink/90 leading-relaxed lg:max-w-xl">
                Personalized cruise planning, unforgettable group trips, and hand-picked travel picks so you can travel more and worry less.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 bg-coral hover:bg-coral-deep text-white font-semibold px-7 py-4 rounded-full transition-colors shadow-lg shadow-coral/20 text-[15px]"
              >
                <Anchor size={16} />
                Plan My Cruise
              </a>
              <a
                href="/#group-trips"
                className="inline-flex items-center gap-2 bg-white border-2 border-emerald-mid text-emerald-mid hover:bg-emerald-mid hover:text-white font-semibold px-7 py-4 rounded-full transition-colors shadow-sm text-[15px]"
              >
                <Users size={16} />
                Explore Group Trips
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
              <p className="font-script font-bold text-[2.8rem] text-coral leading-none mb-1.5">Hi, I&apos;m Yolanda!</p>
              <p className="text-[20px] font-semibold text-ink leading-snug mb-3">
                Your Cruise Curator &amp; <span className="whitespace-nowrap">Travel Partner</span>
              </p>
              <p className="text-[18px] font-semibold text-emerald-deep leading-snug mb-3">20+ Years in Travel &amp; Hospitality</p>
              <p className="text-[19px] text-stone leading-relaxed">
                Helping travelers create memories that last a lifetime.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
