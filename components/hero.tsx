"use client";

import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center bg-[#FAF9F6] overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1e3a8a 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-6 py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Yolanda's Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            {/* Decorative frame offset */}
            <div className="absolute -top-3 -left-3 right-3 bottom-3 border-2 border-[#f59e0b]/20 rounded-[20px] -z-10" />

            {/* Main photo container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#059669]/10 via-[#1e3a8a]/5 to-[#f59e0b]/10 border-2 border-dashed border-[#059669]/20">
              {/*
                REPLACE with Yolanda's actual photo:
                <Image
                  src="/images/yolanda-hero.jpg"
                  alt="Yolanda — Certified Cruise Specialist and founder of Travelholics"
                  fill
                  className="object-cover"
                  priority
                />
              */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-[#059669]/15 flex items-center justify-center mb-4">
                  <Anchor size={36} className="text-[#059669]" />
                </div>
                <p className="text-[#1e3a8a] font-bold text-lg mb-1">
                  Yolanda&apos;s Photo
                </p>
                <p className="text-slate-400 text-sm">
                  Hero portrait — cruise, port, or professional shot
                </p>
              </div>
            </div>

            {/* Floating years badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-4 -right-4 lg:-right-6 bg-[#059669] text-white rounded-2xl px-5 py-3 shadow-xl shadow-emerald-900/30"
            >
              <p className="text-3xl font-extrabold leading-none">20+</p>
              <p className="text-xs text-emerald-100 mt-0.5">
                Years at Sea
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Intro Copy */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#059669]/10 text-[#059669] text-sm font-semibold mb-6"
            >
              <Anchor size={14} />
              <span className="uppercase tracking-wider text-xs">
                Certified Cruise Specialist
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] leading-[1.05] tracking-tight mb-6"
            >
              I&apos;m Yolanda.
              <br />
              <span className="text-[#059669]">I plan dream cruises.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg lg:text-xl text-slate-500 leading-relaxed max-w-lg mb-8"
            >
              For over two decades, I&apos;ve been the person families call when
              they want a cruise that&apos;s actually unforgettable — not just
              okay. I handle every detail so you can focus on making memories.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <button
                onClick={scrollToContact}
                className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Plan My Trip ✦
              </button>
              <a
                href="https://www.tiktok.com/@rjsmom1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-[#059669] bg-white text-[#1e3a8a] font-bold px-6 py-4 rounded-xl transition-all hover:-translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
                </svg>
                Follow @rjsmom1
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  { bg: "bg-[#059669]", text: "YT" },
                  { bg: "bg-[#f59e0b]", text: "MR" },
                  { bg: "bg-[#1e3a8a]", text: "SJ" },
                  { bg: "bg-rose-500", text: "ED" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${a.bg} border-2 border-[#FAF9F6] flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {a.text}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-[#1e3a8a] font-bold">500+</span> happy
                travelers
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
