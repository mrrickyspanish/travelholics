// ⚠️ PLACEHOLDER CONTENT
// Real group trip photography and data are pending from Yolanda.
// This component renders with reused existing images as visual stand-ins.
// Replace the src/alt values in the tiles array with real group trip photos when available.
// CTA links to /#contact until a /group-trips page exists.

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Show all 5 tiles at xl, 3-4 at smaller — narrow tile + 4:3 aspect
const VISIBLE_XL = 5;
const VISIBLE_MD = 3;

const tiles = [
  { caption: "Amazing Destinations",  src: "/images/dest-caribbean.jpg",       alt: "Cruise ship at a beautiful Caribbean destination" },
  { caption: "Fun & Connection",       src: "/images/about-with-travelers.jpg", alt: "Group of travelers enjoying their cruise together" },
  { caption: "Unforgettable Moments",  src: "/images/dest-alaska.jpg",          alt: "Stunning Alaska glacial landscape" },
  { caption: "Epic Adventures",        src: "/images/dest-mediterranean.jpg",   alt: "Mediterranean coastal adventure" },
  { caption: "Lifelong Memories",      src: "/images/about-port-of-call.jpg",   alt: "Travelers at a scenic port of call" },
];

export const GroupTrips = () => {
  const [offset, setOffset] = useState(0);

  // On desktop show all 5 at once — no arrows needed at full width
  const maxOffset = Math.max(0, tiles.length - VISIBLE_MD);

  return (
    <section id="group-trips" className="bg-sand py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="type-kicker text-coral mb-3">Group Cruise Experiences</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ink tracking-tight">
            Travel Better Together
          </h2>
        </motion.div>

        {/* Desktop: show all 5 tiles in a row */}
        <div className="hidden xl:grid xl:grid-cols-5 gap-4">
          {tiles.map(({ caption, src, alt }) => (
            <div key={caption} className="flex flex-col gap-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl group">
                <Image
                  src={src} alt={alt} fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="20vw"
                />
              </div>
              <p className="text-[13px] font-medium text-stone text-center">{caption}</p>
            </div>
          ))}
        </div>

        {/* Tablet / mobile: 3-visible carousel */}
        <div className="xl:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(calc(-${offset * (100 / VISIBLE_MD)}% - ${offset * 16 / VISIBLE_MD}px))` }}
            >
              {tiles.map(({ caption, src, alt }) => (
                <div
                  key={caption}
                  className="flex-shrink-0 flex flex-col gap-2"
                  style={{ width: `calc(${100 / VISIBLE_MD}% - ${16 * (VISIBLE_MD - 1) / VISIBLE_MD}px)` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl group">
                    <Image
                      src={src} alt={alt} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 80vw, 33vw"
                    />
                  </div>
                  <p className="text-[13px] font-medium text-stone text-center">{caption}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 -translate-x-5 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center text-ink hover:text-coral transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
            disabled={offset === maxOffset}
            className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 translate-x-5 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center text-ink hover:text-coral transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-coral hover:bg-coral-deep text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-md shadow-coral/15 text-[15px]"
          >
            View Upcoming Group Trips →
          </a>
        </div>
      </div>
    </section>
  );
};
