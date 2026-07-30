"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, Plane } from "lucide-react";

const credentials = [
  "Certified Cruise Specialist",
  "Real ship and port experience",
  "No planning fees",
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
            className="mx-auto max-w-[45rem] lg:mx-0"
          >
            <div className="text-center lg:text-left">
              <p className="font-script text-[2.65rem] font-semibold leading-none text-coral sm:text-[3rem]">
                Hi, I&apos;m Yolanda
              </p>
              <h2 className="type-homepage-h2 mt-3 font-serif text-ink">
                Your cruise person before, during, and after booking.
              </h2>
            </div>

            <div className="mt-6 space-y-5 text-left">
              <p className="text-[1.05rem] font-medium leading-[1.72] text-ink/78 sm:text-[1.15rem]">
                I help you choose the right ship, cabin, destination, and timing—then handle the details that make the whole trip feel easier.
              </p>

              <div className="rounded-[1.5rem] border border-coral/15 bg-sand px-5 py-5 shadow-[0_12px_30px_rgba(26,46,42,0.06)] sm:px-6">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-coral">The difference</p>
                <p className="mt-2 font-serif text-[1.35rem] font-semibold leading-[1.35] text-ink sm:text-[1.55rem]">
                  Booking direct gives you a confirmation number. Booking with me gives you a person who cares how the trip actually turns out.
                </p>
              </div>

              <p className="text-[1rem] font-medium leading-[1.7] text-ink/72 sm:text-[1.08rem]">
                First cruise or fifteenth, family trip or girls&apos; getaway—I&apos;ll help you find the version built for you.
              </p>

              <div className="flex items-start gap-3 rounded-[1.5rem] bg-emerald-deep px-5 py-5 text-white shadow-[0_14px_34px_rgba(13,74,58,0.18)] sm:px-6">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/12 text-coral">
                  <MessageCircle size={20} strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-[1rem] font-bold leading-tight sm:text-[1.08rem]">20K+ travelers learn with Yolanda every day</p>
                  <p className="mt-1 text-[0.9rem] leading-relaxed text-white/72 sm:text-[0.96rem]">
                    Daily TikTok cruise tips, real travel advice, and firsthand ship experience before you ever book, pack, or board.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
              {credentials.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-[1.1rem] bg-cream/88 px-3.5 py-3 text-left shadow-sm ring-1 ring-white/70">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/12 text-coral">
                    <CheckCircle size={13} strokeWidth={2.4} />
                  </span>
                  <p className="text-[0.82rem] font-semibold leading-snug text-ink/82 sm:text-[0.86rem]">{item}</p>
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
              <Link
                href="/live"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[1rem] font-semibold text-emerald-mid shadow-md ring-1 ring-emerald-mid/12 transition-colors hover:bg-cream"
              >
                <MessageCircle size={18} strokeWidth={2.2} />
                Get Daily Cruise Tips
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
