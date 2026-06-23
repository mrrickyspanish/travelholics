"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const VISUAL_TESTIMONIAL_COUNT = 10;

const testimonials = [
  {
    quote:
      "Yolanda helped us plan a honeymoon cruise that felt easy from start to finish. She matched the ship, excursions, and details to the trip we wanted, and we cannot wait to book with Travelholics again.",
    name: "RJ Barnes",
    trip: "Caribbean Cruise · 2017 · Royal Caribbean",
    photo: "/images/testimonials/barnes_cruise_travelholic.JPG",
    rating: 5,
  },
  {
    quote:
      "For years, Yolanda has planned my cruise vacations, and every trip has been exceptional. She matches the sailing, stateroom, and details to exactly what I love, taking all the stress out of planning. I recommend Travelholics wholeheartedly.",
    name: "Tijuana Willis",
    trip: "Mediterranean Cruise · Repeat Guest",
    photo: "/images/testimonials/willis_cruise_travelholic.jpg",
    rating: 5,
  },
];

const visualTestimonials = Array.from(
  { length: VISUAL_TESTIMONIAL_COUNT },
  (_, index) => testimonials[index % testimonials.length],
);
const riverTestimonials = [...visualTestimonials, ...visualTestimonials];

const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, index) => (
      <svg key={index} className="h-3 w-3 fill-current text-coral" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[number]; index: number }) => (
  <article
    className="flex-none overflow-hidden rounded-2xl border border-blush/60 bg-white shadow-sm"
    style={{ width: "clamp(250px, 72vw, 310px)" }}
    aria-hidden={index >= VISUAL_TESTIMONIAL_COUNT ? true : undefined}
  >
    <div className="relative aspect-[4/5] w-full">
      <Image
        src={testimonial.photo}
        alt={`${testimonial.name} — ${testimonial.trip}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 72vw, 310px"
      />
    </div>
    <div className="px-3 pb-3 pt-2.5">
      <div className="mb-1 flex items-center gap-1.5 overflow-hidden">
        <Stars count={testimonial.rating} />
        <span className="truncate text-eyebrow leading-none text-coral">{testimonial.trip}</span>
      </div>
      <p className="mb-1.5 line-clamp-2 text-[12.5px] italic leading-snug text-ink/80">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="font-serif text-[13px] font-semibold leading-none text-ink">— {testimonial.name}</p>
    </div>
  </article>
);

export const Testimonials = () => {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative overflow-hidden bg-cream pt-12 pb-14 sm:pt-16 sm:pb-18 lg:pt-20 lg:pb-24" aria-label="Traveler testimonials">
      <style>{`
        @keyframes testimonialRiver {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .testimonial-river-track {
          animation: testimonialRiver 52s linear infinite;
        }
        .testimonial-river-shell:hover .testimonial-river-track,
        .testimonial-river-shell:focus-within .testimonial-river-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .testimonial-river-track { animation: none; }
        }
      `}</style>

      <div className="mx-auto mb-10 max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="mb-3 text-eyebrow text-coral">What Travelers Are Saying</p>
          <h2 className="font-serif text-[1.9rem] font-semibold tracking-tight text-ink lg:text-4xl">
            Real People. Real Memories.
          </h2>
        </motion.div>
      </div>

      <div className="testimonial-river-shell overflow-hidden">
        <div className="testimonial-river-track flex w-max gap-4 pl-[18vw] pr-6 lg:pl-[8vw]">
          {riverTestimonials.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.name}-${index}`} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>

      <div className="mt-10 px-6 text-center">
        <Link
          href="/#contact"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-coral px-8 py-4 text-base font-semibold text-white shadow-md shadow-coral/15 transition-colors hover:bg-coral-deep sm:w-auto"
        >
          Start Planning My Trip
        </Link>
      </div>

      {/* Wave — dark emerald (Contact) rises into cream */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block h-14 w-full sm:h-18 lg:h-24 fill-emerald-deep">
          <path d="M0,48 C360,0 720,80 1080,24 C1260,0 1380,48 1440,32 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
};