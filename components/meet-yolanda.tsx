"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const proof = [
  ["20+", "Years traveling"],
  ["6+", "Cruise lines sailed"],
  ["20K+", "Travelers in the community"],
];

export const MeetYolanda = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="border-b border-ink/10 bg-[#fbf7ef]">
      <div className="mx-auto grid max-w-[96rem] lg:grid-cols-[0.42fr_0.58fr] lg:items-stretch">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="px-5 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:py-16 xl:px-16"
        >
          <div className="mb-6 lg:hidden">
            <h2 className="font-serif text-[2.65rem] font-semibold leading-[0.92] tracking-[-0.055em] text-royal-deep sm:text-5xl">Meet Yolanda.</h2>
            <p className="mt-3 max-w-[30rem] text-lg leading-7 text-stone">The person behind the ship knowledge, cabin strategy, and advice that turns cruise curiosity into confidence.</p>
          </div>

          <div className="relative h-[20rem] overflow-hidden sm:h-[28rem] lg:h-full lg:min-h-[42rem]">
            <Image src="/images/hero-yolanda.jpg" alt="Yolanda Harris of Travelholics" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 42vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#082d27]/58 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
              <p className="font-serif text-2xl font-semibold tracking-[-0.04em]">Yolanda Harris</p>
              <p className="mt-1 text-xs font-semibold text-white/72">Certified Cruise Specialist · Travelholics</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16 xl:px-16"
        >
          <div>
            <div className="hidden lg:block">
              <h2 className="font-serif text-[clamp(3rem,5vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-royal-deep">Meet Yolanda.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-stone">The person behind the ship knowledge, cabin strategy, and advice that turns cruise curiosity into confidence.</p>
            </div>

            <p className="max-w-xl text-lg leading-7 text-stone sm:leading-8 lg:mt-7">She has spent years learning how cruise lines, ships, cabin categories, itineraries, and timing actually feel once you are onboard. That experience becomes your shortcut to the cruise that fits you, not just the cruise that showed up first in a search.</p>

            <div className="mt-7 border-y border-ink/12 py-5 sm:mt-8 sm:py-6">
              <p className="max-w-[24ch] font-serif text-2xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-3xl">Bring the dream. She&apos;ll help you find the cruise that fits it.</p>
            </div>
          </div>

          <div className="mt-8 sm:mt-9">
            <div className="grid grid-cols-3 border-b border-ink/12 pb-6">
              {proof.map(([value, label]) => (
                <div key={label} className="border-r border-ink/12 px-3 first:pl-0 last:border-r-0 last:pr-0 sm:px-6">
                  <p className="font-serif text-3xl font-semibold tracking-[-0.045em] text-royal-deep sm:text-4xl">{value}</p>
                  <p className="mt-2 text-[11px] font-black uppercase tracking-[0.13em] text-stone/72 sm:text-xs">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep">Plan with Yolanda</Link>
              <Link href="/live" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold text-ink transition hover:border-ink/30 hover:bg-white/60">See her cruise advice <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
