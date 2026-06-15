"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

// ─── Tunable: increase to slow the drift, decrease to speed it up ──────────
const SCROLL_DURATION = 50; // seconds for one full loop

const RENDER_TESTIMONIALS = true;

// ─── Data — owner replaces quote / name / trip; photo = repo image path ────
type Testimonial = {
  quote: string;   // Short caption, ≤120 chars — owner replaces
  name: string;    // Owner replaces
  trip: string;    // e.g. "Bahamas Cruise" — owner replaces
  photo: string;   // 4:5 portrait already in /public/images/
  rating?: number; // defaults to 5
};

const testimonials: Testimonial[] = [
  {
    quote: "[Club member testimonial — replace]",
    name: "[Member name]",
    trip: "[Trip / Sailing]",
    photo: "/images/about-on-deck.jpg",
    rating: 5,
  },
  {
    quote: "[Club member testimonial — replace]",
    name: "[Member name]",
    trip: "[Trip / Sailing]",
    photo: "/images/about-port-of-call.jpg",
    rating: 5,
  },
  {
    quote: "[Club member testimonial — replace]",
    name: "[Member name]",
    trip: "[Trip / Sailing]",
    photo: "/images/about-with-travelers.jpg",
    rating: 5,
  },
  {
    quote: "[Club member testimonial — replace]",
    name: "[Member name]",
    trip: "[Trip / Sailing]",
    photo: "/images/why-custom-planning.jpg",
    rating: 5,
  },
  {
    quote: "[Club member testimonial — replace]",
    name: "[Member name]",
    trip: "[Trip / Sailing]",
    photo: "/images/why-insider-secrets.jpg",
    rating: 5,
  },
  {
    quote: "[Club member testimonial — replace]",
    name: "[Member name]",
    trip: "[Trip / Sailing]",
    photo: "/images/why-stress-free.jpg",
    rating: 5,
  },
];

// ─── Stars ───────────────────────────────────────────────────────────────────
const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5 flex-none" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <svg
        key={i}
        className="w-3 h-3 text-coral fill-current"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

// ─── Card ───────────────────────────────────────────────────────────────────
function TestimonialCard({ quote, name, trip, photo, rating = 5 }: Testimonial) {
  return (
    <article
      className="flex-none rounded-2xl border border-blush/60 bg-cream shadow-sm overflow-hidden"
      style={{ width: "clamp(240px, 72vw, 300px)" }}
    >
      {/* Photo — dominant element, 4:5 portrait, ~80-85% of card height */}
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={photo}
          alt={`${name} — ${trip}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 72vw, 300px"
          loading="lazy"
        />
      </div>

      {/* Caption strip — compact, ~15-20% of card height */}
      <div className="px-3 pt-2.5 pb-3">
        <div className="flex items-center gap-1.5 mb-1 overflow-hidden">
          <Stars count={rating} />
          <span className="text-eyebrow text-coral leading-none truncate">{trip}</span>
        </div>
        <p className="text-[12.5px] italic leading-snug text-ink/80 line-clamp-2 mb-1.5">
          &ldquo;{quote}&rdquo;
        </p>
        <p className="font-serif text-[13px] font-semibold text-ink leading-none">
          — {name}
        </p>
      </div>
    </article>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export const Testimonials = () => {
  if (!RENDER_TESTIMONIALS) return null;

  // SSR-safe: starts false so server renders animated layout without mismatch;
  // useEffect updates to the real preference after hydration.
  const [prefersReduced, setPrefersReduced] = useState(false);
  // trackWidth = width of ONE card set (half the doubled track)
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const animRef = useRef<{ stop: () => void } | null>(null);
  const loopRef = useRef<(from: number) => void>(() => {});
  const hoverPaused = useRef(false);
  const dragActive = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Measure the single-set width after the doubled track mounts
  useEffect(() => {
    if (prefersReduced || !trackRef.current) return;
    const w = trackRef.current.scrollWidth / 2;
    if (w > 0) setTrackWidth(w);
  }, [prefersReduced]);

  // Animation loop — restarts from any x position to support resume after drag
  useEffect(() => {
    if (prefersReduced || trackWidth === 0) return;

    let cancelled = false;

    const loop = (from: number) => {
      if (cancelled) return;
      const distance = Math.abs(-trackWidth - from);
      const duration = (distance / trackWidth) * SCROLL_DURATION;

      animRef.current = animate(x, -trackWidth, {
        duration,
        ease: "linear",
        onComplete: () => {
          if (!cancelled) {
            x.set(0);
            loop(0);
          }
        },
      });
    };

    // Expose loop so pause/resume handlers can restart from any position
    loopRef.current = loop;
    loop(x.get());

    return () => {
      cancelled = true;
      animRef.current?.stop();
    };
  }, [prefersReduced, trackWidth]); // x is a stable MotionValue — intentionally omitted

  const pauseAnim = () => { animRef.current?.stop(); };

  const resumeAnim = () => {
    if (hoverPaused.current || dragActive.current) return;
    loopRef.current(x.get());
  };

  const header = (
    <div className="max-w-7xl mx-auto px-6 mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-eyebrow text-coral mb-3">What Travelers Are Saying</p>
        <h2 className="font-serif text-[1.9rem] font-semibold tracking-tight text-ink lg:text-4xl">
          Real People. Real Memories.
        </h2>
      </motion.div>
    </div>
  );

  // ── Reduced-motion fallback: static horizontal snap-scroll row ──
  if (prefersReduced) {
    return (
      <section id="testimonials" className="bg-sand py-14 md:py-16">
        {header}
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
          role="region"
          aria-label="Traveler testimonials — scroll to explore"
        >
          {testimonials.map((t, i) => (
            <div key={i} className="snap-start flex-none">
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── Animated lazy-river marquee ──
  return (
    <section
      id="testimonials"
      className="bg-sand py-14 md:py-16 overflow-hidden"
      aria-label="Traveler testimonials"
    >
      {header}
      <motion.div
        ref={trackRef}
        className="flex gap-4 cursor-grab active:cursor-grabbing select-none"
        style={{ x, width: "max-content", willChange: "transform" }}
        drag="x"
        dragConstraints={{ left: trackWidth > 0 ? -trackWidth : 0, right: 0 }}
        dragElastic={0.04}
        onDragStart={() => {
          dragActive.current = true;
          pauseAnim();
        }}
        onDragEnd={() => {
          dragActive.current = false;
          // Clamp within one-set bounds then resume drift from that position
          const clamped = Math.max(trackWidth > 0 ? -trackWidth : 0, Math.min(0, x.get()));
          x.set(clamped);
          resumeAnim();
        }}
        onHoverStart={() => {
          hoverPaused.current = true;
          pauseAnim();
        }}
        onHoverEnd={() => {
          hoverPaused.current = false;
          resumeAnim();
        }}
      >
        {/* Duplicated set — same srcs so browser serves from cache, no payload cost */}
        {[...testimonials, ...testimonials].map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </motion.div>
    </section>
  );
};
