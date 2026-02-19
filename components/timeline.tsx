"use client";

import { motion } from "framer-motion";
import { Mail, PhoneCall, CalendarCheck, Ship } from "lucide-react";

const steps = [
  {
    icon: Mail,
    step: "01",
    title: "Tell Me Your Dream",
    description:
      "Fill out the form with your destination wishlist, group size, and any special occasions. No detail is too small.",
  },
  {
    icon: PhoneCall,
    step: "02",
    title: "Let's Talk",
    description:
      "I'll reach out for a quick 15-minute call to learn what matters most — budget, vibe, pace, excursions, dining.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Choose Your Adventure",
    description:
      "I'll present 2–3 tailored itineraries with pricing, cabin options, and insider recommendations for each.",
  },
  {
    icon: Ship,
    step: "04",
    title: "Pack Your Bags",
    description:
      "Once you choose, I handle every last detail — transfers, dining, shore excursions. You just show up and sail.",
  },
];

export const Timeline = () => {
  return (
    <section id="process" className="bg-[#FAF9F6] py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#059669] font-semibold text-sm uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-4">
            From Inquiry to Open Water
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Four simple steps between you and the vacation of a lifetime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector Line — desktop only */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#059669]/20 to-transparent hidden md:block z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              {/* Step circle */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-[#059669] text-white flex items-center justify-center shadow-xl shadow-emerald-900/20 border-4 border-[#FAF9F6]">
                  <step.icon size={28} />
                </div>
                {/* Step number badge */}
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#f59e0b] text-white text-xs font-bold flex items-center justify-center border-2 border-[#FAF9F6]">
                  {step.step}
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold px-10 py-4 rounded-xl shadow-xl shadow-navy-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            I&apos;m Ready — Let&apos;s Plan My Trip
          </button>
        </motion.div>
      </div>
    </section>
  );
};
