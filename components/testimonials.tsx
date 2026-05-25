// ⚠️ PLACEHOLDER TESTIMONIALS — MUST BE REPLACED BEFORE LAUNCH
// RENDER_TESTIMONIALS is set to true so the layout pattern is visible during development.
// The 3 testimonials below use [PLACEHOLDER] prefix — they are FABRICATED and must be
// replaced with real quotes from Yolanda's clients before this goes live.
// Per Ricky's no-fake-content policy: zero fabricated testimonials in production.
// Steps to go live: replace TESTIMONIALS array entries, remove [PLACEHOLDER] prefixes.

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RENDER_TESTIMONIALS = true; // flip false to hide section; flip true once real quotes arrive

interface Testimonial {
  quote: string;
  name: string;
  trip: string;
}

// ⚠️ THESE ARE PLACEHOLDER QUOTES — REPLACE WITH REAL TESTIMONIALS BEFORE LAUNCH
const TESTIMONIALS: Testimonial[] = [
  {
    quote: "[PLACEHOLDER] Yolanda planned the most perfect birthday cruise for us! Every detail was taken care of and we felt so special the entire trip.",
    name: "Tiffany R.",
    trip: "Bahamas Cruise",
  },
  {
    quote: "[PLACEHOLDER] Traveling with a group was such an amazing experience. I met new friends and can't wait for the next trip!",
    name: "Marcus L.",
    trip: "Alaska Group Trip",
  },
  {
    quote: "[PLACEHOLDER] Yolanda is the real deal—professional, knowledgeable, and truly cares about her travelers. Absolutely recommend.",
    name: "Angela P.",
    trip: "Caribbean Cruise",
  },
];

const Stars = () => (
  <div className="flex gap-0.5 mb-4" aria-label="5 stars">
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
    <section id="testimonials" className="bg-sand py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="type-kicker text-coral mb-3">What Travelers Are Saying</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ink tracking-tight">
            Real People. Real Memories.
          </h2>
        </motion.div>

        {/* Desktop: all 3 visible */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ quote, name, trip }) => (
            <div key={name} className="bg-cream rounded-2xl p-6 shadow-sm border border-blush/60">
              <Stars />
              <p className="text-[14px] text-ink/75 leading-relaxed mb-4 italic">&ldquo;{quote}&rdquo;</p>
              <p className="text-[13px] font-semibold text-ink">— {name}</p>
              <p className="text-[12px] text-coral mt-0.5">{trip}</p>
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(calc(-${offset * 100}% - ${offset * 16}px))` }}
            >
              {TESTIMONIALS.map(({ quote, name, trip }) => (
                <div key={name} className="flex-shrink-0 w-full bg-cream rounded-2xl p-5 shadow-sm border border-blush/60">
                  <Stars />
                  <p className="text-[14px] text-ink/75 leading-relaxed mb-4 italic">&ldquo;{quote}&rdquo;</p>
                  <p className="text-[13px] font-semibold text-ink">— {name}</p>
                  <p className="text-[12px] text-coral mt-0.5">{trip}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-5">
            <button type="button" onClick={() => setOffset((o) => Math.max(0, o - 1))} disabled={offset === 0}
              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-ink hover:text-coral disabled:opacity-30" aria-label="Previous">
              <ChevronLeft size={16} />
            </button>
            <button type="button" onClick={() => setOffset((o) => Math.min(TESTIMONIALS.length - 1, o + 1))} disabled={offset === TESTIMONIALS.length - 1}
              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-ink hover:text-coral disabled:opacity-30" aria-label="Next">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
