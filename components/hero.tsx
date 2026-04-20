"use client";

import { motion } from "framer-motion";
import { Anchor } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center bg-[#FAF9F6] overflow-hidden">
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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -top-3 -left-3 right-3 bottom-3 border-2 border-[#f59e0b]/20 rounded-[20px] -z-10" />

            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="/images/why-stress-free.jpg"
                alt="Yolanda, founder of Travelholics"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-4 -right-4 lg:-right-6 bg-[#059669] text-white rounded-2xl px-5 py-3 shadow-xl shadow-emerald-900/30"
            >
              <p className="text-3xl font-extrabold leading-none">20+</p>
              <p className="text-xs text-emerald-100 mt-0.5">Years at Sea</p>
            </motion.div>
          </motion.div>

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
              <span className="text-[#059669]">I help you travel better.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg lg:text-xl text-slate-500 leading-relaxed max-w-xl mb-8"
            >
              20 years at sea. Real advice from someone who&apos;s actually been there.
              No booking fees — just a real person who treats your vacation like it&apos;s her own.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid sm:grid-cols-3 gap-3 mb-6"
            >
              <button
                onClick={scrollToContact}
                className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-6 py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Plan My Cruise
              </button>
              <a
                href="/shop"
                className="flex items-center justify-center border-2 border-slate-200 hover:border-[#059669] bg-white text-[#1e3a8a] font-bold px-6 py-4 rounded-xl transition-all hover:-translate-y-0.5"
              >
                Shop My Picks
              </a>
              <a
                href="/collaborate"
                className="flex items-center justify-center border-2 border-slate-200 hover:border-[#1e3a8a] bg-white text-[#1e3a8a] font-bold px-6 py-4 rounded-xl transition-all hover:-translate-y-0.5"
              >
                Collaborate
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm text-slate-400 mb-8"
            >
              Cruise planning. TikTok Live favorites. Brand partnerships.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
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
                <span className="text-[#1e3a8a] font-bold">500+</span> happy travelers
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};