"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ashley B.",
    initials: "SJ",
    color: "#059669",
    trip: "7-Day Eastern Caribbean · Royal Caribbean",
    text: "Yolanda found us the perfect balcony cabin on Wonder of the Seas — the sunset views were unreal. Her shore excursion picks saved us from every tourist trap. We're already planning our next one with her.",
    rating: 5,
  },
  {
    name: "Michael R.",
    initials: "MR",
    color: "#f59e0b",
    trip: "Alaska Glacier Cruise · Celebrity",
    text: "I coordinated a 30-person family reunion cruise and Yolanda handled everything — cabin blocks, group dining, excursions, the whole thing. Stress-free from start to finish. I'll never book on my own again.",
    rating: 5,
  },
  {
    name: "Elena D.",
    initials: "ED",
    color: "#1e3a8a",
    trip: "European River Cruise · Viking",
    text: "She recommended a specific cabin that made all the difference in our views through the Rhine Valley. The level of detail and personal attention is something you just can't get from a booking site.",
    rating: 5,
  },
];

export const SocialProof = () => {
  return (
    <section id="testimonials" className="bg-white py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#059669] font-semibold text-sm uppercase tracking-wider mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-4">
            Real Stories from the Water
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Don&apos;t take my word for it — hear from travelers who trusted me
            with their dream voyages.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Decorative Quote Icon */}
          <div className="absolute -top-8 -left-8 text-[#059669]/[0.04] pointer-events-none">
            <Quote size={200} />
          </div>

          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#FAF9F6] p-8 rounded-3xl border border-slate-100 relative z-10 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5 text-[#f59e0b]">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#1e3a8a]/80 text-base leading-relaxed mb-8 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-200/60">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[#1e3a8a] text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#059669] font-medium">
                    {t.trip}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
