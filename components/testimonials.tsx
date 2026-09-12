"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "Yolanda helped us plan a honeymoon cruise that felt easy from start to finish. She matched the ship, excursions, and details to the trip we wanted, and we cannot wait to book with Travelholics again.",
    name: "RJ Barnes",
    trip: "Caribbean Cruise · Royal Caribbean",
    photo: "/images/testimonials/barnes_cruise_travelholic.JPG",
  },
  {
    quote:
      "For years, Yolanda has planned my cruise vacations, and every trip has been exceptional. She matches the sailing, stateroom, and details to exactly what I love, taking all the stress out of planning.",
    name: "Tijuana Willis",
    trip: "Mediterranean Cruise · Repeat Guest",
    photo: "/images/testimonials/willis_cruise_travelholic.jpg",
  },
];

export const Testimonials = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="testimonials" className="bg-[#f4efe4] py-20 sm:py-28 lg:py-32" aria-label="Traveler testimonials">
      <div className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">From the crew</p>
            <h2 className="mt-4 max-w-[9ch] font-serif text-[clamp(3.5rem,6vw,6.6rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-royal-deep">
              The trip should feel good before you even leave.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-7 text-stone lg:justify-self-end sm:leading-8">
            The proof is not just the itinerary. It is whether people felt taken care of, understood the plan, and came home ready to do it again.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={index === 0 ? "lg:col-span-7" : "lg:col-span-5 lg:mt-20"}
            >
              <div className={`grid overflow-hidden bg-[#fbf7ef] ${index === 0 ? "sm:grid-cols-[0.48fr_0.52fr]" : ""}`}>
                <div className={`relative ${index === 0 ? "min-h-[28rem] sm:min-h-[34rem]" : "min-h-[24rem]"}`}>
                  <Image
                    src={testimonial.photo}
                    alt={`${testimonial.name} on ${testimonial.trip}`}
                    fill
                    className="object-cover"
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 34vw" : "(max-width: 1024px) 100vw, 32vw"}
                  />
                </div>
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-9">
                  <div>
                    <p className="text-5xl font-serif leading-none text-coral">“</p>
                    <blockquote className="-mt-2 font-serif text-2xl font-semibold leading-[1.12] tracking-[-0.035em] text-ink sm:text-3xl">
                      {testimonial.quote}
                    </blockquote>
                  </div>
                  <div className="mt-8 border-t border-ink/12 pt-5">
                    <p className="text-sm font-black text-ink">{testimonial.name}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone/70">{testimonial.trip}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/#contact" className="inline-flex items-center gap-2 text-sm font-black text-ink underline decoration-coral decoration-2 underline-offset-4 transition hover:text-coral-deep">
            Start my trip <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};
