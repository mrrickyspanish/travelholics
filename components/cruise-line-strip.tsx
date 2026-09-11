"use client";

import { motion, useReducedMotion } from "framer-motion";

// Preview placeholders only. Replace these text wordmarks with approved official monochrome SVG assets before merging to main.
const cruiseLines = [
  "Royal Caribbean",
  "Celebrity Cruises",
  "Norwegian Cruise Line",
  "Virgin Voyages",
  "MSC Cruises",
  "Carnival Cruise Line",
];

export const CruiseLineStrip = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="overflow-hidden border-y border-ink/10 bg-[#f1ebdf] text-ink">
      <div className="mx-auto max-w-[96rem] px-5 py-9 sm:px-8 sm:py-11 lg:px-12 xl:px-16">
        <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr] lg:items-center lg:gap-10">
          <p className="max-w-[19ch] font-serif text-2xl font-semibold leading-[1.02] tracking-[-0.04em] text-royal-deep sm:text-3xl">
            Different ships. Different personalities. We know the difference.
          </p>

          <div className="relative overflow-hidden lg:overflow-visible">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="-mx-5 flex gap-8 overflow-x-auto px-5 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5 lg:overflow-visible lg:px-0"
            >
              {cruiseLines.map((line) => (
                <div key={line} className="shrink-0 whitespace-nowrap border-l border-ink/14 pl-4 text-sm font-black tracking-[-0.02em] text-royal-deep/72 sm:text-base lg:whitespace-normal">
                  {line}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
