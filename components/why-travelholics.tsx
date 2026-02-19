"use client";

import { motion } from "framer-motion";
import { Map, HeartHandshake, Compass } from "lucide-react";

const benefits = [
  {
    icon: Map,
    title: "Your Trip, Your Way",
    description:
      "No cookie-cutter packages. I design itineraries around your pace, your passions, and your people — down to the cabin deck and dinner reservation.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Pristine tropical beach with turquoise water",
  },
  {
    icon: Compass,
    title: "Secrets Only Insiders Know",
    description:
      "The best balcony on Deck 10. The shore excursion that skips the tourist traps. The upgrade window nobody tells you about. I know because I've been there.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Stunning coastal cliff views from a cruise",
  },
  {
    icon: HeartHandshake,
    title: "You Pack. I Handle Everything Else.",
    description:
      "Transfers, dining, excursions, cabin upgrades, group coordination — from the moment you say 'yes' to the moment you step on deck, I've got you.",
    image:
      "https://images.unsplash.com/photo-1559599746-8823b38544c6?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Couple relaxing on cruise ship deck at sunset",
  },
];

export const WhyTravelholics = () => {
  return (
    <section id="why" className="bg-[#FAF9F6] py-24 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[#059669] font-semibold text-sm uppercase tracking-wider mb-3">
            Why Travelholics
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-4">
            I Don&apos;t Just Book Cruises.
            <br />
            <span className="text-[#059669]">I Craft Experiences.</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            The difference between a good trip and an unforgettable one is
            someone who&apos;s been there, knows the waters, and cares about
            every detail.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={benefit.image}
                  alt={benefit.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-[#f59e0b] flex items-center justify-center text-white shadow-lg">
                  <benefit.icon size={24} />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
