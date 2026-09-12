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
      <style>{`
        @media (max-width: 767px) {
          #group-trips .group-trip-gallery {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.75rem !important;
          }
          #group-trips .group-trip-gallery .group-trip-moment {
            margin: 0 !important;
            width: auto !important;
            min-height: 11rem !important;
          }
          #group-trips .group-trip-gallery .group-trip-moment:nth-child(1) {
            grid-column: 1 / -1 !important;
            min-height: 15rem !important;
          }
          #group-trips .group-trip-gallery .group-trip-moment:nth-child(2) {
            grid-column: 1 !important;
          }
          #group-trips .group-trip-gallery .group-trip-moment:nth-child(3) {
            grid-column: 2 !important;
          }
          #group-trips .group-trip-gallery figcaption {
            padding: 1rem !important;
            font-size: 0.62rem !important;
            line-height: 1.05rem !important;
          }
        }
      `}</style>

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
          <h2 className="mt-5 max-w-[9ch] font-serif text-[clamp(2.6rem,4.2vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
            Bring the people. We&apos;ll build the story.
          </h2>
          <p className="mt-7 max-w-[31rem] text-lg leading-7 text-white/64 sm:leading-8">
            Yolanda shapes the sailing. Your crew gets one place to keep the trip together.
          </p>

          <Link
            href="/group-cruises"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep"
          >
            Explore Group Cruises <ArrowUpRight size={17} />
          </Link>
        </motion.div>

        <div className="group-trip-gallery grid grid-cols-12 gap-3">
          {moments.map((moment, index) => (
            <motion.figure
              key={moment.label}
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={
                `group-trip-moment ${
                  index === 0
                    ? "relative col-span-8 min-h-[31rem] overflow-hidden sm:min-h-[38rem]"
                    : index === 1
                      ? "relative col-span-4 mt-16 min-h-[20rem] overflow-hidden sm:min-h-[25rem]"
                      : "relative col-span-5 col-start-8 -mt-24 min-h-[16rem] overflow-hidden sm:min-h-[20rem]"
                }`
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
