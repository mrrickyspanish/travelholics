"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PartyPopper, Ship, Sparkles, UsersRound } from "lucide-react";
import { motion } from "framer-motion";

const moments = [
  { src: "/images/about-with-travelers.jpg", alt: "Friends enjoying a cruise together", label: "Your people" },
  { src: "/images/dest-caribbean.jpg", alt: "Caribbean cruise destination", label: "Your sailing" },
  { src: "/images/about-port-of-call.jpg", alt: "Travelers enjoying a port day", label: "Your memories" },
];

export const GroupTrips = () => {
  return (
    <section id="group-trips" className="relative overflow-hidden bg-emerald-deep py-16 text-white sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-coral/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto grid max-w-[92rem] gap-10 px-5 sm:px-6 lg:grid-cols-[0.48fr_0.52fr] lg:items-center lg:px-10 xl:px-12">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white/80"><PartyPopper size={15} className="text-coral" /> Group Cruises</div>
          <h2 className="font-serif text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em]">Bring the crew.<br /><span className="text-coral">We&apos;ll build the cruise.</span></h2>
          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/72">Birthdays. Family reunions. Friends trips. Church groups. Or just because everybody keeps saying, “we need to take a trip.” Yolanda helps turn the idea into an experience.</p>

          <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/[0.07] p-4"><Ship size={19} className="text-coral" /><p className="mt-3 text-sm font-bold">Choose the right sailing</p></div>
            <div className="rounded-2xl bg-white/[0.07] p-4"><UsersRound size={19} className="text-coral" /><p className="mt-3 text-sm font-bold">Keep the group together</p></div>
            <div className="rounded-2xl bg-white/[0.07] p-4"><Sparkles size={19} className="text-coral" /><p className="mt-3 text-sm font-bold">Get your own trip home base</p></div>
          </div>

          <Link href="/group-cruises" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-black/10 transition hover:bg-coral-deep">Start Planning Your Group Cruise <ArrowRight size={18} /></Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }} className="grid grid-cols-3 gap-3 sm:gap-4">
          {moments.map((moment, index) => (
            <article key={moment.label} className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-2xl ${index === 1 ? "mt-8 mb-8" : "mb-16"}`}>
              <div className="relative min-h-[24rem] sm:min-h-[30rem] lg:min-h-[34rem]">
                <Image src={moment.src} alt={moment.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 31vw, 17vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/75 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-4 text-center font-serif text-xl font-semibold sm:p-5 sm:text-2xl">{moment.label}</p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
