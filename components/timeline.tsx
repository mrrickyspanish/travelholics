"use client";

import { motion } from "framer-motion";
import { Mail, PhoneCall, CalendarCheck, Ship } from "lucide-react";

const steps = [
  {
    icon: Mail,
    num: "01",
    title: "Tell Me Your Dream",
    description:
      "Tell me where you've always wanted to go — your group, your occasion, your must-haves. I take it from there.",
  },
  {
    icon: PhoneCall,
    num: "02",
    title: "We Talk It Through",
    description:
      "A quick 15-minute call to get the details right — budget, vibe, pace, the excursions worth doing and the ones to skip.",
  },
  {
    icon: CalendarCheck,
    num: "03",
    title: "You Choose, I Build",
    description:
      "I put together 2–3 itineraries tailored to you — real cabin options, honest pricing, and the insider picks that make the difference.",
  },
  {
    icon: Ship,
    num: "04",
    title: "Just Show Up and Sail",
    description:
      "I handle everything else — transfers, dining, shore excursions, group coordination. You board ready to enjoy every moment.",
  },
];

export const Timeline = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="process" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#059669] font-semibold text-xs uppercase tracking-[2px] mb-3">
            How It Works
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1e3a8a] mb-4">
            From Inquiry to{" "}
            <span className="text-[#059669]">Open Water</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Four simple steps between you and the vacation of a lifetime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#059669]/20 to-transparent hidden md:block z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-full bg-[#059669] text-white flex items-center justify-center shadow-xl shadow-emerald-900/20 border-4 border-white">
                  <step.icon size={28} />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#f59e0b] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                  {step.num}
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-[220px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button
            onClick={scrollToContact}
            className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold px-10 py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            I&apos;m Ready — Let&apos;s Plan My Trip
          </button>
        </motion.div>
      </div>
    </section>
  );
};