"use client";

import { motion, useReducedMotion } from "framer-motion";

export const BrandThesis = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-ink/10 bg-[#fbf7ef] text-ink">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-[96rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-24 xl:px-16"
      >
        <div className="grid gap-6 lg:grid-cols-[0.62fr_0.38fr] lg:items-end lg:gap-12">
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.7rem,6.5vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-royal-deep">
            <span className="block">From “we should go”</span>
            <span className="block">to <span className="text-coral">“we&apos;re booked.”</span></span>
          </h2>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-lg leading-7 text-stone sm:leading-8">
              First cruise. Honeymoon. Cruise number 90. Or bringing the whole crew. If you&apos;re thinking about a cruise, you landed in the right place.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
