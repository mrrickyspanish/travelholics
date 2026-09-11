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
      <div className="mx-auto grid max-w-[96rem] lg:grid-cols-[0.44fr_0.56fr]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[34rem] overflow-hidden lg:min-h-[48rem]"
        >
          <Image
            src="/images/hero-yolanda.jpg"
            alt="Yolanda Harris of Travelholics"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 44vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#082d27]/74 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-coral">Yolanda Harris · Travelholics</p>
            <p className="mt-3 max-w-[18ch] font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-4xl">
              The woman behind the advice, the bookings, and the group chat saves.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-16 xl:px-16"
        >
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">Meet your cruise person</p>
            <h2 className="mt-5 max-w-[11ch] font-serif text-[clamp(3.3rem,6vw,6.8rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-royal-deep">
              Experience is better when it comes with a person.
            </h2>

            <blockquote className="mt-9 max-w-2xl border-l-2 border-coral pl-5 sm:pl-7">
              <p className="font-serif text-2xl font-semibold leading-[1.15] tracking-[-0.035em] text-ink sm:text-3xl">
                “Booking direct gives you a confirmation number. Booking with me gives you someone who cares how the trip turns out.”
              </p>
            </blockquote>

            <p className="mt-7 max-w-xl text-base leading-7 text-stone sm:text-lg sm:leading-8">
              Yolanda helps you choose the right ship, cabin, destination, and timing, then stays close to the details that can make a good trip feel effortless. First cruise or fifteenth, this is planning with an actual human in your corner.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-3 border-y border-ink/12 py-6">
              {proof.map(([value, label]) => (
                <div key={label} className="border-r border-ink/12 px-3 first:pl-0 last:border-r-0 last:pr-0 sm:px-6">
                  <p className="font-serif text-3xl font-semibold tracking-[-0.045em] text-royal-deep sm:text-4xl">{value}</p>
                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.13em] text-stone/72 sm:text-[11px]">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep"
              >
                Plan with Yolanda
              </Link>
              <Link
                href="/live"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold text-ink transition hover:border-ink/30 hover:bg-white/60"
              >
                Get daily cruise tips <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
