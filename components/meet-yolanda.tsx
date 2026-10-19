"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const MeetYolanda = () => {
  const reduceMotion = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="about" className="border-b border-ink/10 bg-[#fbf7ef]">
      <div className="mx-auto max-w-[96rem] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
        {/*
          One DOM order, placed two ways. On phones it reads heading, portrait,
          quote, then the rest; on desktop the portrait and quote move to their
          own column beside the copy. The previous version rendered the same h2
          twice (one copy hidden per breakpoint) and stretched the photo to
          match the copy's height. Explicit row/column placement does it with
          one heading and a photo sized by design.

          The media column spans both rows rather than sitting in row 1. A
          row-spanning item doesn't set either row's height, so row 1 is sized
          by the heading block alone -- otherwise the taller photo would push
          the body copy down and open a gap under the heading.
        */}
        <div className="grid gap-8 lg:grid-cols-[23rem_1fr] lg:items-start lg:gap-x-14 lg:gap-y-7 xl:grid-cols-[26rem_1fr]">
          <motion.div {...rise()} className="lg:col-start-2 lg:row-start-1">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">Your cruise specialist</p>
            <h2 className="mt-4 font-serif text-[clamp(2.6rem,4.2vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-royal-deep">
              Meet Yolanda.
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg leading-8 text-stone">
              The person behind the ship knowledge, cabin strategy, and advice that turns cruise curiosity into confidence.
            </p>
          </motion.div>

          <motion.div
            {...rise(0.05)}
            className="sm:max-w-[26rem] lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:max-w-none lg:self-start"
          >
            {/*
              4:3 is the source photo's own framing. It used to render 4:5 at
              477x672 -- a crop *into* a phone selfie, blown up until it was a
              face and nothing else. Showing the frame as shot keeps the ship
              corridor around her and keeps the photo at a believable size.
            */}
            <figure className="about-portrait relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
              <Image
                src="/images/hero-yolanda.jpg"
                alt="Yolanda Harris, Certified Cruise Specialist, onboard ship"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 26rem"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082d27]/80 via-[#082d27]/15 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <p className="font-serif text-2xl font-semibold tracking-[-0.04em]">Yolanda Harris</p>
                <p className="mt-1 text-sm font-semibold text-white/75">Certified Cruise Specialist</p>
              </figcaption>
            </figure>

            <blockquote className="mt-7 border-l-2 border-coral pl-5 sm:mt-8">
              <p className="max-w-[24ch] font-serif text-2xl font-semibold leading-[1.1] tracking-[-0.04em] text-ink sm:text-[1.75rem]">
                Bring the dream. She&apos;ll help you find the cruise that fits it.
              </p>
            </blockquote>
          </motion.div>

          <motion.div {...rise(0.1)} className="lg:col-start-2 lg:row-start-2">
            <p className="max-w-[52ch] text-lg leading-8 text-stone">
              She has spent years learning how cruise lines, ships, cabin categories, itineraries, and timing actually feel once you are onboard. That experience becomes your shortcut to the cruise that fits you, not just the cruise that showed up first in a search.
            </p>

            {/*
              No stat row here. #proof sits directly below this section and
              carries the same three numbers plus a fourth; running them twice
              within one screen made both look like filler.
            */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className="inline-flex min-h-11 w-fit items-center justify-center rounded-none bg-coral px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Plan with Yolanda
              </Link>
              <Link
                href="/videos"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-none border border-ink/20 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-ink transition hover:border-ink/40 hover:bg-white/60"
              >
                See her cruise advice <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
