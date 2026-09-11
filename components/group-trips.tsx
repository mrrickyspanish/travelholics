"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const moments = [
  { src: "/images/about-with-travelers.jpg", alt: "Friends enjoying a cruise together", label: "Your people" },
  { src: "/images/about-port-of-call.jpg", alt: "Travelers enjoying a port day", label: "Your memories" },
  { src: "/images/dest-caribbean.jpg", alt: "Caribbean cruise destination", label: "Your sailing" },
];

export const GroupTrips = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="group-trips" className="relative overflow-hidden bg-[#082d27] py-20 text-white sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute -right-8 top-0 font-serif text-[18vw] font-semibold leading-none tracking-[-0.08em] text-white/[0.025]" aria-hidden="true">
        TOGETHER
      </div>

      <div className="relative mx-auto grid max-w-[96rem] gap-12 px-5 sm:px-8 lg:grid-cols-[0.44fr_0.56fr] lg:items-center lg:px-12 xl:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">Group Cruises</p>
          <h2 className="mt-5 max-w-[9ch] font-serif text-[clamp(3.7rem,7vw,7.6rem)] font-semibold leading-[0.84] tracking-[-0.07em]">
            Bring the people. We&apos;ll build the story.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/64 sm:text-lg sm:leading-8">
            Birthdays, family reunions, church groups, friends trips, or the trip everybody keeps saying they should take. Yolanda helps shape the sailing and keeps the planning from becoming the main event.
          </p>

          <div className="mt-8 border-y border-white/14 py-5">
            <p className="max-w-lg font-serif text-2xl font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-3xl">
              Once the cruise is set, your group gets one personalized place to keep the trip together.
            </p>
          </div>

          <Link
            href="/group-cruises"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep"
          >
            Explore Group Cruises <ArrowUpRight size={17} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-12 gap-3">
          {moments.map((moment, index) => (
            <motion.figure
              key={moment.label}
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={
                index === 0
                  ? "relative col-span-8 min-h-[31rem] overflow-hidden sm:min-h-[38rem]"
                  : index === 1
                    ? "relative col-span-4 mt-16 min-h-[20rem] overflow-hidden sm:min-h-[25rem]"
                    : "relative col-span-5 -mt-24 ml-auto min-h-[16rem] overflow-hidden sm:min-h-[20rem]"
              }
            >
              <Image
                src={moment.src}
                alt={moment.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 70vw, 38vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061d19]/72 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/72 sm:p-6">
                {moment.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
