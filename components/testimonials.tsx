"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import { X } from "lucide-react";

const SCROLL_DURATION = 50;
const VISUAL_TESTIMONIAL_COUNT = 10;

const RENDER_TESTIMONIALS = true;

type Testimonial = {
  quote: string;
  name: string;
  trip: string;
  photo: string;
  rating?: number;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Planning me and my wife\'s honeymoon cruise with Yolanda & Travelholics was the best decision of my life after marrying my wife. She was helpful from beginning to end. Destination planning, cruise ship amenity alignment, excursion breakdowns, travel hacks, everything. She is the best, and we cannot wait to work with Travelholics again for a family cruise in 2027.",
    name: "RJ Barnes",
    trip: "Caribbean Cruise · 2017 · Royal Caribbean",
    photo: "/images/testimonials/barnes_cruise_travelholic.JPG",
    rating: 5,
  },
];

const visualTestimonials = testimonials.length > 0
  ? Array.from(
      { length: VISUAL_TESTIMONIAL_COUNT },
      (_, index) => testimonials[index % testimonials.length],
    )
  : [];
const loopedTestimonials = [...visualTestimonials, ...visualTestimonials];

const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5 flex-none" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-3 h-3 text-coral fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

function TestimonialLightbox({ testimonial, onClose }: { testimonial: Testimonial; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Testimonial from ${testimonial.name}`}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ duration: 0.22, ease: "easeOut" }} className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-blush/60 bg-cream shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral" aria-label="Close testimonial">
          <X className="h-4 w-4" />
        </button>

        <div className="relative aspect-[4/5] w-full max-h-[50vh]">
          <Image src={testimonial.photo} alt={`${testimonial.name} — ${testimonial.trip}`} fill className="object-cover" sizes="(max-width: 512px) 100vw, 512px" priority />
        </div>

        <div className="max-h-[40vh] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="mb-3 flex items-center gap-2">
            <Stars count={testimonial.rating} />
            <span className="text-eyebrow text-coral leading-none">{testimonial.trip}</span>
          </div>
          <blockquote className="font-serif text-[1.05rem] italic leading-relaxed text-ink/85">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <p className="mt-4 font-serif text-[15px] font-semibold text-ink">— {testimonial.name}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TestimonialCard({ quote, name, trip, photo, rating = 5, onExpand }: Testimonial & { onExpand: () => void }) {
  return (
    <article className="flex-none rounded-2xl border border-blush/60 bg-cream shadow-sm overflow-hidden" style={{ width: "clamp(240px, 72vw, 300px)" }}>
      <button type="button" onClick={onExpand} className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-inset" aria-label={`Read full testimonial from ${name}`}>
        <div className="relative aspect-[4/5] w-full">
          <Image src={photo} alt={`${name} — ${trip}`} fill className="object-cover" sizes="(max-width: 768px) 72vw, 300px" loading="lazy" />
        </div>

        <div className="px-3 pt-2.5 pb-3">
          <div className="mb-1 flex items-center gap-1.5 overflow-hidden">
            <Stars count={rating} />
            <span className="truncate text-eyebrow leading-none text-coral">{trip}</span>
          </div>
          <p className="mb-1.5 line-clamp-2 text-[12.5px] italic leading-snug text-ink/80">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="font-serif text-[13px] font-semibold leading-none text-ink">— {name}</p>
          <span className="mt-1.5 inline-block text-[11px] font-semibold text-coral">Read more</span>
        </div>
      </button>
    </article>
  );
}

function TestimonialsCTA() {
  return (
    <div className="mt-10 px-6 text-center">
      <a href="/#contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-coral px-8 py-4 text-base font-semibold text-white shadow-md shadow-coral/15 transition-colors hover:bg-coral-deep sm:w-auto">
        Start Planning My Trip →
      </a>
    </div>
  );
}

export const Testimonials = () => {
  const [expanded, setExpanded] = useState<Testimonial | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const animRef = useRef<{ stop: () => void } | null>(null);
  const loopRef = useRef<(from: number) => void>(() => {});
  const hoverPaused = useRef(false);
  const dragActive = useRef(false);

  const openTestimonial = useCallback((t: Testimonial) => { setExpanded(t); }, []);
  const closeTestimonial = useCallback(() => { setExpanded(null); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReduced || !trackRef.current) return;
    const w = trackRef.current.scrollWidth / 2;
    if (w > 0) setTrackWidth(w);
  }, [prefersReduced]);

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

    loopRef.current = loop;
    loop(x.get());

    return () => {
      cancelled = true;
      animRef.current?.stop();
    };
  }, [prefersReduced, trackWidth]);

  const pauseAnim = () => { animRef.current?.stop(); };
  const resumeAnim = () => {
    if (hoverPaused.current || dragActive.current) return;
    loopRef.current(x.get());
  };

  const header = (
    <div className="mx-auto mb-10 max-w-7xl px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
        <p className="mb-3 text-eyebrow text-coral">What Travelers Are Saying</p>
        <h2 className="font-serif text-[1.9rem] font-semibold tracking-tight text-ink lg:text-4xl">
          Real People. Real Memories.
        </h2>
      </motion.div>
    </div>
  );

  const lightbox = (
    <AnimatePresence>
      {expanded && <TestimonialLightbox testimonial={expanded} onClose={closeTestimonial} />}
    </AnimatePresence>
  );

  if (!RENDER_TESTIMONIALS || testimonials.length === 0) return null;

  if (prefersReduced) {
    return (
      <section id="testimonials" className="bg-sand py-14 md:py-16">
        {header}
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" } as React.CSSProperties} role="region" aria-label="Traveler testimonials — scroll to explore">
          {visualTestimonials.map((t, index) => (
            <div key={`${t.name}-static-${index}`} className="flex-none snap-start">
              <TestimonialCard {...t} onExpand={() => openTestimonial(t)} />
            </div>
          ))}
        </div>
        <TestimonialsCTA />
        {lightbox}
      </section>
    );
  }

  return (
    <section id="testimonials" className="overflow-hidden bg-sand py-14 md:py-16" aria-label="Traveler testimonials">
      {header}
      <motion.div
        ref={trackRef}
        className="flex cursor-grab gap-4 active:cursor-grabbing select-none pl-[18vw] pr-6 lg:pl-[8vw]"
        style={{ x, width: "max-content", willChange: "transform" }}
        drag="x"
        dragConstraints={{ left: trackWidth > 0 ? -trackWidth : 0, right: 0 }}
        dragElastic={0.04}
        onDragStart={() => { dragActive.current = true; pauseAnim(); }}
        onDragEnd={() => {
          dragActive.current = false;
          const clamped = Math.max(trackWidth > 0 ? -trackWidth : 0, Math.min(0, x.get()));
          x.set(clamped);
          resumeAnim();
        }}
        onHoverStart={() => { hoverPaused.current = true; pauseAnim(); }}
        onHoverEnd={() => { hoverPaused.current = false; resumeAnim(); }}
      >
        {loopedTestimonials.map((t, i) => (
          <TestimonialCard key={`${t.name}-loop-${i}`} {...t} onExpand={() => openTestimonial(t)} />
        ))}
      </motion.div>
      <TestimonialsCTA />
      {lightbox}
    </section>
  );
};