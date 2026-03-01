"use client";

import { motion } from "framer-motion";
import { Map, Compass, HeartHandshake } from "lucide-react";
import Image from "next/image";

const benefits = [
  {
    icon: Map,
    title: "Your Trip, Your Way",
    description:
      "No cookie-cutter packages. I design around your pace, your people, and your passions — down to the cabin deck and dinner reservation.",
    image: "/images/why-custom-planning.jpg",
    alt: "Yolanda and her partner dressed elegantly on the cruise deck at sunset",
  },
  {
    icon: Compass,
    title: "Secrets Only Insiders Know",
    description:
      "The best balcony on Deck 10. The excursion that skips tourist traps. The upgrade window nobody tells you about. I know because I've been there.",
    image: "/images/why-insider-secrets.jpg",
    alt: "Yolanda and her partner at a formal evening aboard a cruise ship",
  },
  {
    icon: HeartHandshake,
    title: "You Pack. I Handle the Rest.",
    description:
      "Transfers, dining, excursions, cabin upgrades, group coordination — from 'yes' to stepping on deck, I've got every detail covered.",
    image: "/images/why-stress-free.jpg",
    alt: "Yolanda smiling in her cruise cabin, ready for the voyage",
  },
];

export const WhyTravelholics = () => {
  return (
    <section id="why" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <p className="text-[#059669] font-semibold text-xs uppercase tracking-[2px] mb-3">
            Why Work With Me
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1e3a8a] leading-tight">
            I Don&apos;t Just Book Cruises.
            <br />
            <span className="text-[#059669]">I Craft Experiences.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-[#FAF9F6] rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="h-44 relative overflow-hidden">
                <Image
                  src={b.image}
                  alt={b.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b] mb-4">
                  <b.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
