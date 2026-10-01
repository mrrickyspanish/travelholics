"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// The page's explanation of the actual service. Nothing above this section
// tells a cold visitor what the mechanics of working with Yolanda are, or that
// it costs them nothing over booking direct. Keep it high in app/page.tsx —
// it is the spine, not a nice-to-have.
const steps = [
  {
    number: "01",
    title: "Tell her where your mind keeps going.",
    body:
      "No ship, no cabin number, no perfect dates required. A destination and a rough season is enough to start.",
  },
  {
    number: "02",
    title: "She matches the sailing to how you travel.",
    body:
      "Cruise line, ship, cabin category, itinerary, timing. Twenty years of knowing which ones actually feel the way the brochure says they do.",
  },
  {
    number: "03",
    title: "You book it and she stays with you.",
    body:
      "Through deposits, dining, excursions and sail day — one person who already knows your trip, instead of a call center.",
  },
];

export const HowItWorks = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-[#082d27] py-20 text-white sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-8 lg:grid-cols-[0.46fr_0.54fr] lg:items-end"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">How it works</p>
            <h2 className="mt-4 max-w-[17ch] font-serif text-[clamp(2.6rem,4.2vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              A cruise specialist, not a booking site.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-lg leading-7 text-white/68 sm:leading-8">
              Yolanda is a Certified Cruise Specialist. She plans the whole thing with you — and because cruise lines pay her, not you, the trip costs the same as booking it yourself.
            </p>
          </div>
        </motion.div>

        <ol className="mt-12 grid gap-px border-t border-white/14 sm:mt-14 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-white/14 py-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-10 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <p className="font-serif text-4xl font-semibold leading-none tracking-[-0.05em] text-coral sm:text-5xl">
                {step.number}
              </p>
              <h3 className="mt-5 max-w-[22ch] font-serif text-2xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[1.75rem]">
                {step.title}
              </h3>
              <p className="mt-4 max-w-[36ch] text-lg leading-7 text-white/62">{step.body}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/14 pt-8 sm:mt-12 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[26ch] font-serif text-2xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:max-w-[34ch] sm:text-3xl">
            Same price as booking direct. <span className="text-coral">Zero planning fees.</span>
          </p>
          <Link
            href="/#contact"
            className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            Plan my cruise <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};
