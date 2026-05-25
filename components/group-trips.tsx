// ⚠️ PLACEHOLDER CONTENT
// Real group trip photography and data are pending from Yolanda.
// This component renders with reused existing images as visual stand-ins.
// To update: replace the src/alt values in the tiles array with real group trip photos.
// CTA links to /#contact until a /group-trips page exists.

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VISIBLE = 3;

const tiles = [
  { caption: "Amazing Destinations",    src: "/images/dest-caribbean.jpg",       alt: "Cruise ship at a beautiful Caribbean destination" },
  { caption: "Fun & Connection",        src: "/images/about-with-travelers.jpg", alt: "Group of travelers enjoying their cruise together" },
  { caption: "Unforgettable Moments",   src: "/images/dest-alaska.jpg",          alt: "Stunning Alaska glacial landscape" },
  { caption: "Epic Adventures",         src: "/images/dest-mediterranean.jpg",   alt: "Mediterranean coastal adventure" },
  { caption: "Lifelong Memories",       src: "/images/about-port-of-call.jpg",   alt: "Travelers at a scenic port of call" },
];

export const GroupTrips = () => {
  const [offset, setOffset] = useState(0);
  const maxOffset = tiles.length - VISIBLE;
  const itemWidth = 100 / VISIBLE;

  return (
    <section id="group-trips" className="bg-sand py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="type-kicker text-coral mb-3">Group Cruise Experiences</p>
          <h2 className="type-section-title text-emerald-deep">Travel Better Together</h2>
        </motion.div>

        <div className="relative">
          {/* Track */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(calc(-${offset * (itemWidth + (16 * offset) / tiles.length)}% - ${offset * 16 / VISIBLE}px))` }}
            >
              {tiles.map(({ caption, src, alt }) => (
                <div
                  key={caption}
                  className="flex-shrink-0"
                  style={{ width: `calc(${itemWidth}% - ${16 * (VISIBLE - 1) / VISIBLE}px)` }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl group">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 80vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                    <p className="absolute bottom-4 left-0 right-0 text-center text-sm font-semibold text-white px-3">
                      {caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-ink hover:text-coral transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
            disabled={offset === maxOffset}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-ink hover:text-coral transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-coral hover:bg-coral-deep text-white font-bold px-8 py-4 rounded-full transition-colors shadow-md shadow-coral/20 text-[15px]"
          >
            View Upcoming Group Trips →
          </a>
        </div>
      </div>
    </section>
  );
};
