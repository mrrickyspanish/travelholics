"use client";

import { motion } from "framer-motion";
import { Anchor } from "lucide-react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

const destinations = [
  {
    title: "Mediterranean",
    subtitle: "Greece \u2022 Italy \u2022 Seaside charm",
    image: "/images/dest-mediterranean.jpg",
  },
  {
    title: "Alaska",
    subtitle: "Glacier views \u2022 Scenic sailing",
    image: "/images/dest-alaska.jpg",
  },
  {
    title: "Caribbean",
    subtitle: "Warm water \u2022 Easy luxury",
    image: "/images/dest-caribbean.jpg",
  },
];

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6]">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #16324d 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative wave line */}
      <div className="absolute inset-x-0 bottom-8 hidden h-16 opacity-30 lg:block">
        <svg viewBox="0 0 1440 120" className="h-full w-full" fill="none">
          <path
            d="M0 62C88 62 88 28 176 28C264 28 264 76 352 76C440 76 440 38 528 38C616 38 616 89 704 89C792 89 792 52 880 52C968 52 968 92 1056 92C1144 92 1144 44 1232 44C1320 44 1320 72 1408 72C1424 72 1432 70 1440 68"
            stroke="#16324d"
            strokeOpacity="0.12"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-14 px-6 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-20">
        {/* ── Left column: copy + CTAs ── */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 rounded-full border border-[#059669]/25 bg-white/70 px-4 py-2 text-sm font-semibold tracking-[0.16em] text-[#059669] shadow-sm backdrop-blur"
          >
            <Anchor size={14} />
            <span className="uppercase text-xs">
              Certified Cruise Specialist &bull; 20+ Years at Sea
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 space-y-5"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#16324d]/45">
              Personal cruise planning, with real experience behind it
            </p>
            <h1
              className={`${playfair.className} text-5xl lg:text-[4.6rem] font-semibold text-[#16324d] leading-[1.03] tracking-[0.01em]`}
            >
              I&apos;m Yolanda.
              <span className="mt-4 block text-[0.92em] font-normal text-[#16324d]/82">
                I help you cruise smarter.
              </span>
            </h1>
            <div className="h-1 w-20 rounded-full bg-[#f59e0b]" />
            <p className="max-w-lg text-lg leading-9 text-slate-600 md:text-xl">
              Real advice from someone who&apos;s actually lived it. No booking
              fees, no pressure — just a warmer, smarter way to plan your next
              voyage.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={scrollToContact}
              className="inline-flex items-center rounded-2xl bg-[#059669] px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-[#047857] hover:-translate-y-0.5 active:translate-y-0"
            >
              Plan My Cruise
            </button>
            <a
              href="/shop"
              className="inline-flex items-center rounded-2xl border-2 border-slate-200 bg-white px-7 py-4 text-base font-bold text-[#16324d] transition-all hover:border-[#059669] hover:-translate-y-0.5"
            >
              Shop My Picks
            </a>
            <a
              href="/collaborate"
              className="text-sm font-bold text-[#16324d]/70 underline-offset-4 transition hover:text-[#16324d] hover:underline"
            >
              Collaborate
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <div className="flex -space-x-3">
              {[
                { bg: "#059669", label: "YT" },
                { bg: "#f59e0b", label: "MR" },
                { bg: "#1e3a8a", label: "SJ" },
                { bg: "#e11d48", label: "ED" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#FAF9F6] text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: item.bg }}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xl font-bold text-[#16324d]">
                500+ happy travelers
              </p>
              <p className="text-sm text-slate-400">
                Mediterranean &bull; Caribbean &bull; Alaska &bull; River cruises
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Right column: bento grid ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[38px] border border-[#16324d]/8 bg-[#16324d] p-4 shadow-[0_30px_70px_rgba(22,50,77,0.18)] lg:p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_32%)]" />
            <div className="absolute inset-0 opacity-25">
              <svg viewBox="0 0 1200 600" className="h-full w-full" fill="none">
                <path
                  d="M0 410C120 410 120 372 240 372C360 372 360 438 480 438C600 438 600 396 720 396C840 396 840 452 960 452C1080 452 1080 420 1200 420"
                  stroke="#f59e0b"
                  strokeOpacity="0.18"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="pointer-events-none absolute right-[37%] top-6 bottom-6 hidden w-px bg-gradient-to-b from-transparent via-[#f59e0b]/30 to-transparent lg:block" />

            <div className="relative grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Yolanda portrait card */}
              <div className="relative min-h-[560px] overflow-hidden rounded-[30px] bg-[#173450]">
                <Image
                  src="/images/hero-yolanda.jpg"
                  alt="Yolanda, founder of Travelholics"
                  fill
                  className="object-cover object-[center_24%]"
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102538]/85 via-[#16324d]/22 to-[#f3d8a6]/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_22%,rgba(255,236,204,0.16),transparent_36%)]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                  Travel better with Yolanda
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-white/60">
                    Trusted cruise guidance
                  </p>
                  <p className="mt-2 max-w-xs text-2xl font-semibold leading-tight text-white">
                    Personal planning with lived experience behind every
                    recommendation.
                  </p>
                </div>
              </div>

              {/* Right stack */}
              <div className="flex flex-col gap-3 pl-1 lg:border-l lg:border-white/10 lg:pl-4">
                {/* Header card */}
                <div className="rounded-[22px] bg-white/8 p-5 text-white ring-1 ring-white/8 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">
                        Where I&apos;ve sailed
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Curated by experience
                      </h2>
                    </div>
                    <div className="h-10 w-10 rounded-full border border-[#f59e0b]/50 bg-[#f59e0b]/15" />
                  </div>
                </div>

                {/* Destination cards */}
                {destinations.map((item, index) => (
                  <div
                    key={item.title}
                    className={`group relative overflow-hidden border border-white/5 bg-white/[0.06] p-3 transition duration-300 hover:-translate-y-0.5 ${
                      index === 0 ? "rounded-[24px]" : "rounded-[20px]"
                    } ${
                      index === 0 ? "min-h-[180px]" : "min-h-[138px]"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-45 transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102538] via-[#16324d]/60 to-[#16324d]/28" />
                    <div className="relative flex h-full flex-col justify-end">
                      <div className="mb-3 h-1 w-12 rounded-full bg-[#f59e0b]" />
                      <h3 className="text-2xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-white/70">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[22px] bg-white/[0.08] p-5 text-white ring-1 ring-white/8 backdrop-blur">
                    <p className="text-4xl font-bold">20+</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/55">
                      Years at sea
                    </p>
                  </div>
                  <div className="rounded-[26px] bg-white/[0.08] p-5 text-white ring-1 ring-white/8 backdrop-blur">
                    <p className="text-lg font-semibold">@rjsmom1</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/55">
                      TikTok community
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating trust card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute -bottom-7 -left-4 hidden rounded-[24px] border border-[#16324d]/10 bg-white/95 px-5 py-4 shadow-[0_18px_50px_rgba(22,50,77,0.12)] backdrop-blur md:block"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#16324d]/45">
              Why people book with her
            </p>
            <p className="mt-2 text-lg font-semibold text-[#16324d]">
              Real insight. No pressure. Better-fit cruise recommendations.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};