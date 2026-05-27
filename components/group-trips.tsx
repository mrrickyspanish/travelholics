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

export const GroupTrips = () => {
  return (
    <section id="group-trips" className="bg-sand py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
        >
          <p className="type-kicker mb-3 text-coral">GROUP CRUISE EXPERIENCES</p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink lg:text-5xl">
            Travel Better Together
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone md:text-lg">
            Join curated group sailings built around good people, shared moments, and stress-free
            planning from start to finish.
          </p>
        </motion.div>

        <div className="hidden gap-5 lg:grid lg:grid-cols-2 lg:items-stretch">
          <article className="group relative overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(14,34,56,0.16)]">
            <div className="relative aspect-[4/5] xl:aspect-[5/6]">
              <Image
                src={featuredTile.src}
                alt={featuredTile.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1279px) 45vw, 36vw"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-6">
              <p className="text-sm font-semibold tracking-wide text-white/95">{featuredTile.caption}</p>
            </div>
          </article>

          <div className="grid grid-cols-2 gap-5">
            {supportingTiles.map(({ caption, src, alt }) => (
              <article
                key={caption}
                className="group relative overflow-hidden rounded-2xl shadow-[0_10px_26px_rgba(14,34,56,0.12)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1279px) 22vw, 18vw"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent p-4">
                  <p className="text-sm font-medium text-white/95">{caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:hidden">
          <article className="group relative overflow-hidden rounded-2xl shadow-[0_16px_36px_rgba(14,34,56,0.14)]">
            <div className="relative aspect-[5/4]">
              <Image
                src={featuredTile.src}
                alt={featuredTile.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-5">
              <p className="text-sm font-semibold tracking-wide text-white/95">{featuredTile.caption}</p>
            </div>
          </article>

          <div className="-mr-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-6 pb-1">
            {supportingTiles.map(({ caption, src, alt }) => (
              <article
                key={caption}
                className="group relative w-[84%] max-w-sm flex-none snap-start overflow-hidden rounded-2xl shadow-[0_10px_26px_rgba(14,34,56,0.12)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="84vw"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent p-4">
                  <p className="text-sm font-medium text-white/95">{caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-9 text-center md:mt-10">
          <Link
            href="/#contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-base font-semibold text-white shadow-md shadow-coral/15 transition-colors hover:bg-coral-deep sm:w-auto"
          >
            View Upcoming Group Trips →
          </Link>
        </div>
      </div>
    </section>
  );
};
