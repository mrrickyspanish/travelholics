"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, Plane } from "lucide-react";

const credentials = [
  "Certified Cruise Specialist with real ship and port experience",
  "No planning fees, same price as booking direct",
  "Cruises, family trips, romantic getaways, groups, and all-inclusive stays",
  "A real person to call when the details get confusing",
];

export const MeetYolanda = () => {
  return (
    <section id="about" className="relative overflow-hidden bg-cream py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sand/40 to-transparent" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid items-center gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-[35rem] lg:mx-0 lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-[2.25rem] bg-cream p-2 shadow-[0_26px_70px_rgba(26,58,82,0.14)] ring-1 ring-white/70">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:aspect-[5/6] lg:aspect-[4/5]">
                <Image
                  src="/images/about-on-deck.jpg"
                  alt="Yolanda Harris on a cruise ship deck"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 92vw, 42vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/84 via-ink/26 to-transparent p-5 text-white sm:p-6">
                  <p className="font-script text-[2.55rem] font-semibold leading-none text-coral">No regrets.</p>
                  <p className="mt-1 max-w-[24ch] text-[1rem] font-semibold leading-snug text-white/90">
                    Just better trips, better decisions, and a plan you&apos;ll actually enjoy.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 top-8 hidden w-[12.5rem] rotate-3 rounded-[1.5rem] bg-white/92 p-4 shadow-[0_20px_48px_rgba(26,58,82,0.12)] ring-1 ring-stone/10 sm:block lg:-right-8">
              <Plane className="mb-3 text-coral" size={24} strokeWidth={2} />
              <p className="font-serif text-[1.35rem] font-semibold leading-tight text-[#0E125C]">20+ years planning the good kind of chaos.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto max-w-[45rem] text-center lg:mx-0 lg:text-left"
          >
            <p className="font-script text-[2.65rem] font-semibold leading-none text-coral sm:text-[3rem]">
              Hi, I&apos;m Yolanda
            </p>
            <h2 className="type-homepage-h2 mt-3 font-serif text-ink">
              Your cruise person before, during, and after booking.
            </h2>
            <div className="mx-auto mt-6 max-w-[45ch] space-y-4 text-[1.05rem] font-medium leading-[1.78] text-ink/78 sm:text-[1.15rem] lg:mx-0">
              <p>
                I help travelers pick the ship, cabin, destination, timing, and little details that make a trip feel easy. Booking direct gives you a confirmation number. Booking with me gives you a person who cares how the whole thing actually turns out.
              </p>
              <p>
                Whether it&apos;s your first cruise or your fifteenth, a family trip or a girls&apos; getaway, there&apos;s a version of this that&apos;s built for you. I know the difference, and I&apos;ll help you find it.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {credentials.map((item) => (
                <div key={item} className="flex items-start gap-2.5 rounded-[1.25rem] bg-cream/85 p-3 text-left shadow-sm ring-1 ring-white/70 sm:p-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/12 text-coral sm:h-6 sm:w-6">
                    <CheckCircle size={13} strokeWidth={2.4} />
                  </span>
                  <p className="text-[0.88rem] font-semibold leading-snug text-ink/82 sm:text-[0.98rem]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/#contact"
                className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-coral px-6 py-3 text-[1rem] font-semibold text-white shadow-md transition-colors hover:bg-coral-deep"
              >
                Book With Yolanda
              </Link>
              <a
                href="https://www.tiktok.com/@rjsmom1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[1rem] font-semibold text-emerald-mid shadow-md ring-1 ring-emerald-mid/12 transition-colors hover:bg-cream"
              >
                <MessageCircle size={18} strokeWidth={2.2} />
                Follow the lifestyle
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};