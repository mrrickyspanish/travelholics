// Client-approved testimonials used for homepage proof section.

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RENDER_TESTIMONIALS = true;

interface Testimonial {
  quote: string;
  name: string;
  trip: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Yolanda made our birthday cruise feel effortless. From the cabin choice to the little details, everything felt thought through. We just showed up and enjoyed ourselves.",
    name: "Alana Santos",
    trip: "Bahamas Cruise",
  },
  {
    quote:
      "I was nervous about traveling with a group, but this ended up being one of the best trips I've ever taken. Good people, good energy, and everything was organized from start to finish.",
    name: "RJ Barnes",
    trip: "Alaska Group Trip",
  },
  {
    quote:
      "Yolanda knows cruises inside and out. She answered every question, helped us feel prepared, and made the whole process easy. I would absolutely book with her again.",
    name: "Angela P.",
    trip: "Caribbean Cruise",
  },
];

const Stars = () => (
  <div className="mb-3 flex gap-0.5" aria-label="5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className="w-4 h-4 text-coral fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

export const Testimonials = () => {
  const [offset, setOffset] = useState(0);

  if (!RENDER_TESTIMONIALS) return null;

  return (
    <section id="testimonials" className="bg-sand py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-7 text-center md:mb-8"
        >
          <p className="type-kicker text-coral mb-3">What Travelers Are Saying</p>
          <h2 className="font-serif text-[1.9rem] font-semibold tracking-tight text-ink lg:text-4xl">
            Real People. Real Memories.
          </h2>
        </motion.div>

        {/* Desktop: all 3 visible */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ quote, name, trip }) => (
            <div key={name} className="rounded-2xl border border-blush/60 bg-cream p-5 shadow-sm">
              <Stars />
              <p className="mb-3 text-[14px] italic leading-relaxed text-ink/75">&ldquo;{quote}&rdquo;</p>
              <p className="text-[13px] font-semibold text-ink">— {name}</p>
              <p className="text-[12px] text-coral mt-0.5">{trip}</p>
            </div>
          ))}
        </div>

        {/* Mobile: swipeable carousel, no arrows, with swipe label */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(calc(-${offset * 100}% - ${offset * 16}px))` }}
            >
              {TESTIMONIALS.map(({ quote, name, trip }) => (
                <div key={name} className="w-full flex-shrink-0 rounded-2xl border border-blush/60 bg-cream p-4.5 shadow-sm">
                  <Stars />
                  <p className="mb-3 text-[14px] italic leading-relaxed text-ink/75">&ldquo;{quote}&rdquo;</p>
                  <p className="text-[13px] font-semibold text-ink">— {name}</p>
                  <p className="text-[12px] text-coral mt-0.5">{trip}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone/65">Swipe to explore</p>
          </div>
        </div>
      </div>
    </section>
  );
};
