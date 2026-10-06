"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Hand-drawn underline under "booked.". preserveAspectRatio="none" lets it
// stretch with the word at every clamp() size instead of needing a per-breakpoint
// asset. Drawn rather than imported so it recolors with the token.
const Underline = () => (
  <svg
    className="pointer-events-none absolute -bottom-[0.18em] left-0 h-[0.22em] w-full overflow-visible text-teal"
    viewBox="0 0 300 20"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d="M3 13.5C52 6 108 3.5 164 5c38 1 92 4.5 133 9" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
    <path d="M14 19c46-5.5 104-7.5 157-6.5 30 .6 76 3 118 6.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.72" />
  </svg>
);

// The three accent ticks that sit off the end of the headline.
const Sparkle = () => (
  <svg
    className="pointer-events-none absolute -right-[0.34em] top-[0.1em] h-[0.42em] w-[0.42em] overflow-visible text-teal"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M12 2.5v6" />
      <path d="M21.5 7.5 16.5 11" />
      <path d="M22 17.5 16.5 15.5" />
    </g>
  </svg>
);

export const Hero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-[96svh] overflow-hidden bg-[#071f1b] text-white">
      {/* Phone framing, re-measured against the full-resolution file: the crop
          keeps Yolanda's face clear of the headline and body copy while holding
          the sunset behind them. Shifting further left loses her face entirely,
          which is the point of the photo. Retune by rendering candidates if the
          photo is ever replaced -- this is specific to THIS file's composition. */}
      <Image
        src="/images/hero-golden-hour.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[52%_100%] md:object-center"
      />

      {/* Two scrims, because the copy sits differently at each size.
          DESKTOP: text is a left column, so the scrim runs left-to-right and
          clears by ~62% to keep the sunset and the ships readable.
          MOBILE: text runs full width, so a horizontal scrim leaves the right
          end of every line uncovered -- measured 1.29:1 against white on the
          straw hat. This one runs top-to-bottom instead. Both were set by
          measuring the worst-case background pixel behind each text block;
          re-measure if the photo or the crop changes. */}
      <div
        className="absolute inset-0 hidden md:block"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,22,20,.88) 0%, rgba(4,22,20,.72) 30%, rgba(4,22,20,.34) 52%, rgba(4,22,20,.06) 72%, rgba(4,22,20,.10) 100%)",
        }}
      />
      <div
        className="absolute inset-0 md:hidden"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,18,15,.56) 0%, rgba(4,18,15,.62) 40%, rgba(4,18,15,.52) 62%, rgba(4,18,15,.34) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-[#04120f]/88 via-[#04120f]/26 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-[#04120f]/58 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[96svh] max-w-[96rem] flex-col px-5 pb-12 pt-28 sm:px-8 sm:pb-16 lg:px-12 lg:pb-[4.5rem] xl:px-16">
        <div className="flex-1" />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[62rem]"
        >
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-white/70">
            Certified Cruise Specialist
          </p>

          <h1 className="font-serif text-[clamp(3rem,6.2vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
            <span className="block">From &ldquo;we should go&rdquo;</span>
            <span className="block">
              to{" "}
              <span className="relative inline-block text-coral">
                &ldquo;we&rsquo;re{" "}
                <span className="relative inline-block">
                  booked.
                  <Underline />
                </span>
                &rdquo;
                <Sparkle />
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-[46ch] text-lg leading-7 text-white/85 sm:leading-8">
            Cruise planning with Yolanda Harris. Same price as booking direct — zero planning fees. More clarity, less stress, and a trip that actually feels like you.
          </p>

          <div className="mt-7 flex flex-col gap-5 sm:max-w-[40rem] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/#contact"
                className="group inline-flex min-h-11 w-fit shrink-0 items-center gap-4 rounded-none bg-coral py-2 pl-6 pr-2 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Plan my cruise
                <span className="flex h-8 w-8 items-center justify-center bg-white text-coral transition group-hover:translate-x-0.5">
                  <ArrowRight size={17} strokeWidth={2.75} />
                </span>
              </Link>

              <p className="relative mt-4 w-fit text-sm font-black uppercase tracking-[0.045em] text-white/75 sm:tracking-[0.12em]">
                Same price. More support. Zero fees.
                <span className="absolute -bottom-1.5 left-0 block h-[3px] w-full bg-teal/85" aria-hidden="true" />
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
