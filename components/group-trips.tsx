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
    <section id="group-trips" className="bg-sand py-10 md:py-12">
      <div className="mx-auto max-w-[980px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 max-w-xl text-center"
        >
          <p className="text-eyebrow mb-2 text-coral">GROUP CRUISE EXPERIENCES</p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink lg:text-5xl">
            Travel Better Together
          </h2>
          <p className="mx-auto mt-4 max-w-[38ch] text-card-body text-stone">
            Join curated group sailings built around good people, shared moments, and stress-free planning from start to finish.
          </p>
        </motion.div>

        {/* Desktop grid */}
        <div className="hidden lg:grid grid-cols-[44%_1fr] gap-8 mx-auto max-w-[980px] items-stretch" style={{maxHeight:'420px'}}>
          <article className="group relative overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(14,34,56,0.13)]" style={{height:'100%'}}>
            <div className="relative w-full h-full min-h-[380px] max-h-[420px] aspect-[4/5]">
              <Image
                src={featuredTile.src}
                alt={featuredTile.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1279px) 44vw, 44vw"
                style={{objectPosition:'center'}}
              />
            </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-5">
                  <p className="text-card-body font-semibold tracking-wide text-white/95">{featuredTile.caption}</p>
            </div>
          </article>

          <div className="grid grid-cols-2 grid-rows-2 gap-5 h-full">
            {supportingTiles.map(({ caption, src, alt }) => (
              <article
                key={caption}
                className="group relative overflow-hidden rounded-2xl shadow-[0_8px_20px_rgba(14,34,56,0.10)] flex flex-col justify-end"
                style={{height:'100%'}}
              >
                <div className="relative w-full h-full min-h-[180px] max-h-[200px] aspect-[4/3]">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1279px) 22vw, 18vw"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent p-3">
                  <p className="text-card-body font-medium text-white/95">{caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden">
          <article className="group relative overflow-hidden rounded-2xl shadow-[0_10px_24px_rgba(14,34,56,0.13)] mb-4">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={featuredTile.src}
                alt={featuredTile.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-4">
              <p className="text-sm font-semibold tracking-wide text-white/95">{featuredTile.caption}</p>
            </div>
          </article>

          <div className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
            {supportingTiles.map(({ caption, src, alt }) => (
              <article
                key={caption}
                className="group relative w-[82vw] max-w-xs flex-none snap-start overflow-hidden rounded-2xl shadow-[0_8px_20px_rgba(14,34,56,0.10)]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="82vw"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent p-3">
                  <p className="text-sm font-medium text-white/95">{caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-7 text-center">
          <Link
            href="/#contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-base font-semibold text-white shadow-md shadow-coral/15 transition-colors hover:bg-coral-deep sm:w-auto"
            style={{marginTop:'28px'}}
          >
            Join the Next Sailing →
          </Link>
        </div>
      </div>
    </section>
  );
};
