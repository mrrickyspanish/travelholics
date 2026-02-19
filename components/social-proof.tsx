"use client";

import { motion } from "framer-motion";
import { Star, Quote, Anchor } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    initials: "SJ",
    color: "bg-[#059669]",
    trip: "7-Day Eastern Caribbean · Royal Caribbean",
    text: "Yolanda found us the perfect balcony cabin on Wonder of the Seas — the sunset views were unreal. Her shore excursion picks saved us from every tourist trap. We're already planning our next one with her.",
  },
  {
    name: "Michael R.",
    initials: "MR",
    color: "bg-[#f59e0b]",
    trip: "Alaska Glacier Cruise · Celebrity",
    text: "I coordinated a 30-person family reunion cruise and Yolanda handled everything — cabin blocks, group dining, excursions, the whole thing. Stress-free from start to finish. I'll never book on my own again.",
  },
  {
    name: "Elena D.",
    initials: "ED",
    color: "bg-[#1e3a8a]",
    trip: "European River Cruise · Viking",
    text: "She recommended a specific cabin that made all the difference in our Rhine Valley views. The level of detail and personal attention is something you just can't get from a booking site.",
  },
];

export const SocialProof = () => {
  return (
    <section id="testimonials" className="bg-[#FAF9F6] py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-[#059669] font-semibold text-xs uppercase tracking-[2px] mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1e3a8a] mb-4">
            Real Stories from the Water
          </h2>
        </motion.div>

        {/* Yolanda Pull Quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-14"
        >
          <div className="relative bg-white rounded-3xl px-8 py-8 text-center border border-slate-100 shadow-sm">
            {/* Quote badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#f59e0b] flex items-center justify-center shadow-lg">
              <Quote size={12} className="text-white" />
            </div>

            <p className="text-xl lg:text-2xl text-[#1e3a8a] italic leading-relaxed mb-6">
              &ldquo;I treat every trip like it&apos;s my own family boarding
              that ship. That&apos;s not a tagline — that&apos;s how I was
              raised, and it&apos;s how I run my business.&rdquo;
            </p>

            <div className="flex items-center justify-center gap-3">
              {/*
                REPLACE with Yolanda's headshot:
                <Image src="/images/yolanda-headshot.jpg" alt="Yolanda"
                  width={44} height={44} className="rounded-full object-cover" />
              */}
              <div className="w-11 h-11 rounded-full bg-[#059669] flex items-center justify-center text-white shrink-0">
                <Anchor size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-[#1e3a8a] text-sm">Yolanda</p>
                <p className="text-xs text-[#059669] font-medium">
                  Founder, Travelholics · Certified Cruise Specialist
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Client Testimonials */}
        <div className="grid md:grid-cols-3 gap-5 relative">
          {/* Background decoration */}
          <div className="absolute -top-8 -left-8 text-[#059669]/[0.03] pointer-events-none">
            <Quote size={200} />
          </div>

          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="bg-white p-7 rounded-3xl border border-slate-100 relative z-10 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4 text-[#f59e0b]">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#1e3a8a]/80 text-[15px] leading-relaxed mb-7 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                <div
                  className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[#1e3a8a] text-sm">{t.name}</p>
                  <p className="text-[11px] text-[#059669] font-medium">
                    {t.trip}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
