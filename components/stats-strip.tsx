"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

type Stat =
  | { numeric: number; suffix: string; label: string; display?: never }
  | { display: string; label: string; numeric?: never; suffix?: never };

const stats: Stat[] = [
  { numeric: 6, suffix: "+", label: "cruise lines sailed" },
  { numeric: 15, suffix: "+", label: "countries visited" },
  { numeric: 20, suffix: "+", label: "years of travel experience" },
  { display: "No Fees", label: "same price as booking direct" },
];

const valueClass =
  "font-serif text-[2rem] font-semibold leading-none text-navy sm:text-[2.25rem] md:text-[2.5rem]";

function ManifestValue({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const [text, setText] = useState("0");
  const inView = useInView(ref, { once: true });
  const hasDecimal = stat.numeric !== undefined && !Number.isInteger(stat.numeric);

  useEffect(() => {
    if (stat.display !== undefined || stat.numeric === undefined) return;
    if (!inView) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setText(hasDecimal ? stat.numeric.toFixed(1) : String(stat.numeric));
      return;
    }

    const controls = animate(motionVal, stat.numeric, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) =>
        setText(hasDecimal ? v.toFixed(1) : String(Math.floor(v))),
    });

    return () => controls.stop();
  }, [inView, stat, hasDecimal, motionVal]);

  if (stat.display !== undefined) {
    return <span className={valueClass}>{stat.display}</span>;
  }

  return (
    <span ref={ref} className={valueClass}>
      {text}
      {stat.suffix}
    </span>
  );
}

export function VoyageManifest() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
      aria-label="Voyage credentials"
    >
      {/* Horizon wash — photo bleeds through the top of the band */}
      <div
        className="bg-gradient-to-b from-transparent via-[rgba(252,250,245,0.55)] to-[rgba(252,250,245,0.97)] pt-20 pb-7 sm:pt-28 sm:pb-9 md:pt-32 md:pb-10"
      >
        <div className="pointer-events-auto mx-auto w-full max-w-[92rem] px-5 sm:px-6 lg:px-14 xl:px-20">
          <div className="mb-6 flex items-center justify-center gap-4 md:mb-8">
            <span className="hidden h-px flex-1 max-w-[4rem] bg-stone/20 sm:block" aria-hidden="true" />
            <p className="text-eyebrow text-coral">Voyage Credentials</p>
            <span className="hidden h-px flex-1 max-w-[4rem] bg-stone/20 sm:block" aria-hidden="true" />
          </div>

          <dl className="grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-8 sm:gap-y-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-stone/20">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-start gap-2 md:px-6 lg:px-8"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <ManifestValue stat={stat} />
                </dd>
                <dd className="m-0 max-w-[14ch] text-[15px] leading-snug text-stone/90">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use VoyageManifest inside Hero */
export const StatsStrip = VoyageManifest;
