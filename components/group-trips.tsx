"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const featuredTile = {
  caption: "Amazing Destinations",
  src: "/images/dest-caribbean.jpg",
  alt: "Cruise ship at a beautiful Caribbean destination",
};

const supportingTiles = [
  {
    caption: "Good People",
    src: "/images/about-with-travelers.jpg",
    alt: "Group of travelers enjoying their cruise together",
  },
  {
    caption: "Unforgettable Moments",
    src: "/images/dest-alaska.jpg",
    alt: "Stunning Alaska glacial landscape",
  },
  {
    caption: "Epic Adventures",
    src: "/images/dest-mediterranean.jpg",
    alt: "Mediterranean coastal adventure",
  },
  {
    caption: "Lifelong Memories",
    src: "/images/about-port-of-call.jpg",
    alt: "Travelers at a scenic port of call",
  },
];

const photoLabelClass = "absolute bottom-4 right-4 text-right text-[0.56rem] font-bold uppercase leading-none tracking-[0.14em] text-white/70 lg:bottom-5 lg:right-5";

export const GroupTrips = () => {
  return (
    <section id="group-trips" className="relative overflow-hidden bg-emerald-deep pt-12 pb-14 sm:pt-16 sm:pb-18 lg:pt-20 lg:pb-24">
      <div className="pointer-events-none absolute left-[-7rem] top-12 h-56 w-56 rounded-full bg-coral/12 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:gap-14 xl:gap-18">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-[34rem] text-center lg:mx-0 lg:text-left"
          >
            <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.16em] text-coral">
              GROUP CRUISE EXPERIENCES
            </p>
            <h2 className="type-homepage-h2 font-serif text-white">
              Your people. Your ship. Your sailing.
            </h2>
            <p className="mt-5 max-w-[36ch] text-[1.05rem] font-medium leading-[1.72] text-white/72 sm:text-[1.15rem] lg:mx-0">
              Group trips with Travelholics aren&apos;t just coordinated bookings — they&apos;re the kind of trip people talk about for years. Yolanda handles the logistics so your crew just shows up and goes.
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-[1rem] font-semibold text-white shadow-md shadow-coral/15 transition-colors hover:bg-coral-deep"
            >
              Join the Next Sailing
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="grid gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-5"
          >
            <article className="group relative min-h-[28rem] overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_24px_64px_rgba(26,58,82,0.13)] ring-1 ring-white/70 lg:min-h-[34rem]">
              <div className="relative h-full overflow-hidden rounded-[1.5rem] bg-cream">
                <Image
                  src={featuredTile.src}
                  alt={featuredTile.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 92vw, 38vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/28 via-transparent to-transparent" aria-hidden="true" />
                <p className={photoLabelClass}>{featuredTile.caption}</p>
              </div>
            </article>

            <div className="grid grid-cols-2 gap-4 lg:gap-5">
              {supportingTiles.map(({ caption, src, alt }, index) => (
                <article
                  key={caption}
                  className={`group relative min-h-[12rem] overflow-hidden rounded-[1.65rem] bg-white p-2 shadow-[0_18px_42px_rgba(26,58,82,0.1)] ring-1 ring-white/70 sm:min-h-[15rem] ${index === 1 ? "lg:translate-y-7" : ""} ${index === 2 ? "lg:-translate-y-2" : ""}`}
                >
                  <div className="relative h-full overflow-hidden rounded-[1.2rem] bg-cream">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 45vw, 22vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/28 via-transparent to-transparent" aria-hidden="true" />
                    <p className={photoLabelClass}>{caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave — sand (Destination Map) rises out of dark emerald */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block h-14 w-full sm:h-18 lg:h-24 fill-sand">
          <path d="M0,48 C180,16 360,80 540,32 C720,0 900,64 1080,32 C1260,0 1380,56 1440,32 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
};