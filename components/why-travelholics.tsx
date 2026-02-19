"use client";

import { motion } from "framer-motion";
import { Map, Compass, HeartHandshake } from "lucide-react";

const benefits = [
  {
    icon: Map,
    title: "Your Trip, Your Way",
    description:
      "No cookie-cutter packages. I design around your pace, your people, and your passions — down to the cabin deck and dinner reservation.",
    photoLabel: "Custom itinerary planning",
  },
  {
    icon: Compass,
    title: "Secrets Only Insiders Know",
    description:
      "The best balcony on Deck 10. The excursion that skips tourist traps. The upgrade window nobody tells you about. I know because I've been there.",
    photoLabel: "Hidden shore excursion",
  },
  {
    icon: HeartHandshake,
    title: "You Pack. I Handle the Rest.",
    description:
      "Transfers, dining, excursions, cabin upgrades, group coordination — from 'yes' to stepping on deck, I've got every detail covered.",
    photoLabel: "Stress-free boarding",
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
              {/* Image spot */}
              <div className="h-44 bg-gradient-to-br from-[#059669]/10 to-[#f59e0b]/5 border-b border-dashed border-[#059669]/15 flex flex-col items-center justify-center text-center p-4 group-hover:from-[#059669]/15 transition-colors">
                {/*
                  REPLACE with destination/experience photo:
                  <Image src={`/images/benefit-${i+1}.jpg`}
                    alt={b.photoLabel} fill className="object-cover
                    group-hover:scale-105 transition-transform duration-500" />
                */}
                <span className="text-sm font-semibold text-[#1e3a8a]">
                  📷 {b.photoLabel}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Swap with photo
                </span>
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
