"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const benefits = [
  {
    number: "01",
    title: "Your Trip, Your Way",
    description:
      "No cookie-cutter packages. I design around your pace, your people, and your passions — down to the cabin deck and dinner reservation.",
    image: "/images/why-custom-planning.jpg",
    alt: "Yolanda and her partner dressed elegantly on the cruise deck at sunset",
  },
  {
    number: "02",
    title: "Secrets Only Insiders Know",
    description:
      "The best balcony on Deck 10. The excursion that skips tourist traps. The upgrade window nobody tells you about. I know because I've been there.",
    image: "/images/why-insider-secrets.jpg",
    alt: "Yolanda and her partner at a formal evening aboard a cruise ship",
  },
  {
    number: "03",
    title: "You Pack. I Handle the Rest.",
    description:
      "Transfers, dining, excursions, cabin upgrades, group coordination — from 'yes' to stepping on deck, I've got every detail covered.",
    image: "/images/about-with-travelers.jpg",
    alt: "Yolanda with a happy group of travelers ready to board",
  },
];

export const WhyTravelholics = () => {
  return (
    <section id="why" className="bg-[#FAF9F6] py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-[1.5px] bg-[#059669]" />
            <p className="text-[#059669] font-bold text-xs uppercase tracking-[2px]">
              Why Work With Me
            </p>
            <div className="w-6 h-[1.5px] bg-[#059669]" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1e3a8a] leading-tight">
            The Details That Make
            <br />
            <span className="text-[#059669]">Your Trip Different</span>
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
              className="group relative rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              style={{ height: "420px" }}
            >
              {/* Full-bleed photo */}
              <Image
                src={b.image}
                alt={b.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Gradient overlay — bottom-heavy for text legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,25,50,0.92) 0%, rgba(10,25,50,0.55) 45%, rgba(10,25,50,0.08) 100%)",
                }}
              />

              {/* Gold top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f59e0b] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

              {/* Number badge */}
              <div
                className="absolute top-5 left-5 w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-white border border-white/20"
                style={{
                  background: "rgba(245,158,11,0.25)",
                  fontSize: "12px",
                  backdropFilter: "blur(4px)",
                }}
              >
                {b.number}
              </div>

              {/* Text overlay on photo */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                  {b.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed">
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