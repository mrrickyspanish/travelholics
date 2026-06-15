"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";
import { Ship, Users, Globe, MapPin } from "lucide-react";

const stats = [
  { icon: Ship,   numeric: 6,    suffix: "+",  label: "cruise lines sailed"   },
  { icon: Globe,  numeric: 15,   suffix: "+",  label: "countries visited"     },
  { icon: Users,  numeric: 17.2, suffix: "k+", label: "crew members strong"   },
  { icon: MapPin, numeric: 4,    suffix: "+",  label: "group trips booked"    },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const [text, setText] = useState("0");
  const inView = useInView(ref, { once: true });
  const hasDecimal = !Number.isInteger(to);

  useEffect(() => {
    if (!inView) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setText(hasDecimal ? to.toFixed(1) : String(to));
      return;
    }

    const controls = animate(motionVal, to, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) =>
        setText(hasDecimal ? v.toFixed(1) : String(Math.floor(v))),
    });

    return () => controls.stop();
  }, [inView]); // motionVal and to are stable

  return (
    <span
      ref={ref}
      className="font-serif text-[2rem] font-semibold leading-none text-navy sm:text-[2.25rem] md:text-[2.5rem]"
    >
      {text}{suffix}
    </span>
  );
}

export const StatsStrip = () => {
  return (
    <section className="relative overflow-hidden bg-cream py-6 sm:py-8 md:py-10">
      <div className="mx-auto w-full max-w-[92rem] px-4 sm:px-6 lg:px-14 xl:px-20">
        <div className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-3 md:grid-cols-4 md:gap-0 md:divide-x md:divide-stone/20">
          {stats.map(({ icon: Icon, numeric, suffix, label }) => (
            <div
              key={label}
              className="flex h-full flex-col items-start gap-2 rounded-2xl border border-stone/10 bg-white/65 px-4 py-4 shadow-[0_6px_16px_rgba(26,58,82,0.06)] backdrop-blur-[1px] sm:px-5 sm:py-5 md:rounded-none md:border-0 md:bg-transparent md:px-6 md:py-3 md:shadow-none md:backdrop-blur-0"
            >
              <Icon className="shrink-0 text-coral" size={20} strokeWidth={2} />
              <CountUp to={numeric} suffix={suffix} />
              <span className="text-[15px] leading-snug text-stone/90">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
