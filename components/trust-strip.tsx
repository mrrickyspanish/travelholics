"use client";

import { motion } from "framer-motion";

const cruiseLines = [
  "Royal Caribbean",
  "Carnival",
  "Norwegian",
  "Celebrity",
  "Disney",
  "Viking",
];

export const TrustStrip = () => {
  return (
    <section className="bg-[#1e3a8a] py-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6"
      >
        <div className="flex items-center justify-center gap-6 lg:gap-10 flex-wrap">
          <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[2px]">
            Experienced Across 6 Cruise Lines
          </span>
          <div className="hidden sm:block h-4 w-px bg-white/20" />
          {cruiseLines.map((line) => (
            <span
              key={line}
              className="text-xs lg:text-sm font-bold text-white/45 tracking-wide whitespace-nowrap"
            >
              {line}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};