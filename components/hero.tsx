"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Anchor, Users } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      {/* Background — use Travelholics_background.png as the deck shot */}
      <div className="absolute inset-0">
        <Image
          src="/images/Travelholics_background.png"
          alt="Cruise ship deck at sunset"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Warm cream/peach gradient overlay — NOT dark emerald */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/80 to-cream/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-sand/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-[60%_40%] gap-12 lg:gap-6 items-center">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold leading-[1.04] text-emerald-deep mb-1">
              Curated Cruises.
            </h1>
            <h1 className="text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold leading-[1.04] text-emerald-deep mb-2">
              Real Experience.
            </h1>
            <div className="relative inline-block mb-7">
              <span className="font-dancing text-4xl lg:text-5xl xl:text-[3.25rem] text-coral leading-tight">
                Stress-Free Planning.
              </span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 320 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 7 C55 3, 110 8.5, 160 5.5 C210 2.5, 265 7.5, 317 4"
                  stroke="#F26A75"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-base lg:text-lg text-ink/70 leading-relaxed max-w-lg mb-10">
              Personalized cruise planning, unforgettable group trips, and hand-picked travel picks—so you can travel more and worry less.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 bg-coral hover:bg-coral-deep text-white font-bold px-7 py-4 rounded-full transition-colors shadow-lg shadow-coral/20 text-[15px]"
              >
                <Anchor size={17} />
                Plan My Cruise
              </a>
              <a
                href="/#group-trips"
                className="inline-flex items-center gap-2 border-2 border-emerald-mid text-emerald-mid hover:bg-emerald-mid hover:text-white font-bold px-7 py-4 rounded-full transition-colors text-[15px]"
              >
                <Users size={17} />
                Explore Group Trips
              </a>
            </div>
          </motion.div>

          {/* Right column — Yolanda card overlay */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex flex-col items-end gap-0"
          >
            {/* Polaroid-feel photo card */}
            <div
              className="bg-white p-3 pb-8 shadow-2xl rounded-sm w-60 xl:w-68"
              style={{ transform: "rotate(2.5deg)" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-blush">
                {/* TODO: Confirm correct Yolanda headshot path; hero-yolanda.jpg used here */}
                <Image
                  src="/images/hero-yolanda.jpg"
                  alt="Yolanda, Your Cruise Curator & Travel Partner"
                  fill
                  className="object-cover object-top"
                  sizes="272px"
                  priority
                />
              </div>
            </div>

            {/* Floating intro card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/97 backdrop-blur rounded-2xl shadow-xl p-5 w-72 border border-blush relative"
              style={{ marginTop: "-2.5rem", marginRight: "0.5rem" }}
            >
              <p className="font-dancing text-2xl text-coral leading-none mb-1">Hi, I&apos;m Yolanda!</p>
              <p className="text-sm font-bold text-ink mb-3">Your Cruise Curator &amp; Travel Partner</p>
              <div className="flex items-center gap-2 bg-sand rounded-full px-3 py-1.5 w-fit mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-mid shrink-0" />
                <span className="text-xs font-semibold text-emerald-deep">20+ Years in Travel &amp; Hospitality</span>
              </div>
              <p className="text-xs text-stone leading-relaxed">
                Helping travelers create memories that last a lifetime.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
