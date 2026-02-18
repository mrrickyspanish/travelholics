"use client";

import { motion } from "framer-motion";
import { Sparkles, Map, HeartHandshake, Compass } from "lucide-react";

const benefits = [
  {
    icon: Map,
    title: "Custom Itineraries",
    description: "Every traveler is unique. I craft bespoke travel plans that match your pace, interests, and budget perfectly."
  },
  {
    icon: Compass,
    title: "Insider Knowledge",
    description: "I know the best ships, the quietest decks, and the hidden shore excursions that general booking sites won't tell you."
  },
  {
    icon: HeartHandshake,
    title: "Stress-Free Planning",
    description: "From booking to boarding, I handle all the logistics so you can focus on making memories."
  }
];

export const WhyTravelholics = () => {
  return (
    <section className="bg-[#FAF9F6] py-24 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Why Work With Me?</h2>
          <p className="text-lg text-slate-500">I'm more than just a booking agent. I'm your personal travel partner, ensuring every detail of your voyage is handled with care.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-navy-900/5 border border-slate-100 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b] mb-6">
                <benefit.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
