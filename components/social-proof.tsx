"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    trip: "7-Day Eastern Caribbean",
    text: "Yolanda found us the perfect balcony room on Wonder of the Seas. Her shore excursion tips were a game changer!",
    rating: 5
  },
  {
    name: "Michael R.",
    trip: "Alaska Glacier Cruise",
    text: "Stress-free from start to finish. I'll never book a cruise on my own again. The group coordination was seamless.",
    rating: 5
  },
  {
    name: "Elena D.",
    trip: "European River Cruise",
    text: "Incredible attention to detail. Yolanda recommended a specific cabin that made all the difference in our views.",
    rating: 5
  }
];

export const SocialProof = () => {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Happy Travelers</h2>
          <p className="text-lg text-slate-500">Real reviews from our growing Travelholics community.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Decorative Quote Icon */}
          <div className="absolute top-0 left-0 text-[#059669]/5 -translate-x-12 -translate-y-12">
            <Quote size={200} />
          </div>

          {testimonials.map((t, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#FAF9F6] p-8 rounded-3xl border border-slate-100 relative z-10"
            >
              <div className="flex gap-1 mb-4 text-[#f59e0b]">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-lg text-[#1e3a8a] italic mb-6 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-bold text-[#1e3a8a]">{t.name}</p>
                <p className="text-sm text-[#059669] font-medium">{t.trip}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
