"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Dancing_Script, Playfair_Display } from "next/font/google";
import Image from "next/image";
import { RippleButton } from "@/components/ripple-button";

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  display: "swap",
});

const destinations = [
  {
    name: "Caribbean",
    tag: "Royal Caribbean",
    image: "/images/dest-caribbean.jpg",
    alt: "Yolanda at sunset on a Caribbean cruise",
  },
  {
    name: "Alaska",
    tag: "Glacier views · Scenic sailing",
    image: "/images/dest-alaska.jpg",
    alt: "Yolanda in Alaska with glacial mountains behind her",
  },
  {
    name: "Mediterranean",
    tag: "Greece · Italy · Seaside charm",
    image: "/images/dest-mediterranean.jpg",
    alt: "Yolanda at the Parthenon in Athens, Greece",
  },
  {
    name: "Bahamas",
    tag: "Nassau · Paradise Island",
    image: "/images/dest-bahamas.jpg",
    alt: "Welcome sign at a Bahamas cruise port",
  },
];

const avatars = [
  { bg: "#059669", text: "YT" },
  { bg: "#f59e0b", text: "MR" },
  { bg: "#1e3a8a", text: "SJ" },
  { bg: "#e11d48", text: "ED" },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "18%"]);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % destinations.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => {
    if (i !== current && !isAnimating) {
      setIsAnimating(true);
      setCurrent(i);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <section className="relative min-h-[82vh] flex items-start overflow-hidden bg-[#0d4a3a] lg:min-h-[86vh]">

      {/* Full-bleed background photo with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -inset-x-0 -top-[10%] -bottom-[10%]"
          style={{ y: bgY }}
        >
          <Image
            src="/images/Travelholics_background.png"
            alt="Yolanda, founder of Travelholics"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#0d4a3a]/48" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,42,30,0.72) 0%, rgba(8,42,30,0.50) 42%, rgba(8,42,30,0.18) 72%, rgba(8,42,30,0.05) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,42,30,0.42) 0%, transparent 38%)",
          }}
        />
      </div>

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Wave line decorations */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full z-0 pointer-events-none"
        viewBox="0 0 1440 60"
        fill="none"
        preserveAspectRatio="none"
        style={{ opacity: 0.055 }}
      >
        <path
          d="M0 30 Q180 10 360 30 Q540 50 720 30 Q900 10 1080 30 Q1260 50 1440 30"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0 44 Q180 24 360 44 Q540 64 720 44 Q900 24 1080 44 Q1260 64 1440 44"
          stroke="white"
          strokeWidth="0.6"
          fill="none"
        />
      </svg>

      {/* Anchor watermark */}
      <svg
        className="absolute z-0 pointer-events-none"
        style={{
          right: "30%",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.038,
          width: "280px",
          height: "280px",
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="22" r="9" stroke="white" strokeWidth="1.2" />
        <circle cx="50" cy="22" r="3.5" fill="white" />
        <line x1="50" y1="31" x2="50" y2="82" stroke="white" strokeWidth="1.2" />
        <path
          d="M28 56 Q18 68 28 76 Q38 84 50 82 Q62 84 72 76 Q82 68 72 56"
          stroke="white"
          strokeWidth="1.2"
          fill="none"
        />
        <line x1="26" y1="56" x2="74" y2="56" stroke="white" strokeWidth="1.2" />
      </svg>

      {/* Vertical edge text */}
      <div
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 -rotate-90 whitespace-nowrap pointer-events-none"
        style={{
          fontSize: "9px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.20)",
          letterSpacing: "0.22em",
        }}
      >
        First time here? Start with Yolanda
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-8 lg:px-12 relative z-10 pt-6 pb-8 lg:pt-8 lg:pb-10">

        {/*
          FIX: Replaced justify-between (stretches to container edges on ultrawide)
          with a controlled gap + max-w-5xl cap so the two columns stay together.
          Right column is flex-none so the card stays 320px wide and doesn't drift.
        */}
        <div className="flex items-start gap-16 lg:gap-24 max-w-7xl mx-auto w-full">

          {/* LEFT: hero copy */}
          <div className="flex-1 max-w-[620px]">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-6 h-[1.5px] bg-[#059669] flex-shrink-0" />
              <span
                className="font-bold text-emerald-300 uppercase"
                style={{ fontSize: "12px", letterSpacing: "0.18em" }}
              >
                Certified Cruise Specialist · 20 Years at Sea
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`${dancing.className} text-white leading-[1.0] mb-1`}
              style={{ fontSize: "clamp(54px, 7.5vw, 80px)" }}
            >
              I&apos;m Yolanda.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className={`${playfair.className} text-white/75 leading-tight mb-6`}
              style={{ fontSize: "clamp(20px, 2.8vw, 30px)" }}
            >
              I help you travel better.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ transformOrigin: "left" }}
              className="w-11 h-[3px] bg-[#f59e0b] rounded-full mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/70 leading-relaxed mb-8 max-w-[420px]"
              style={{ fontSize: "clamp(16px, 1.4vw, 18px)", lineHeight: "1.8" }}
            >
              Real advice from someone who&apos;s actually been there. 20 years
              at sea, no booking fees — just a real person who treats your
              vacation like her own.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <RippleButton
                onClick={scrollToContact}
                className="bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  fontSize: "15px",
                  letterSpacing: "0.04em",
                  padding: "13px 24px",
                  boxShadow: "0 8px 24px rgba(5,150,105,0.35)",
                }}
              >
                Plan My Cruise
              </RippleButton>
              <a
                href="/shop"
                className="font-semibold text-white/75 hover:text-white rounded-lg transition-all hover:-translate-y-0.5"
                style={{
                  fontSize: "15px",
                  padding: "13px 20px",
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                Shop My Picks
              </a>
              <a
                href="/collaborate"
                className="font-semibold text-white/65 hover:text-white rounded-lg transition-all hover:-translate-y-0.5"
                style={{
                  fontSize: "15px",
                  padding: "13px 20px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                Collaborate
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.72 }}
              className="flex items-center gap-3"
            >
              <div className="flex">
                {avatars.map((a, i) => (
                  <div
                    key={i}
                    className="rounded-full border-[2px] border-[#0d4a3a] flex items-center justify-center text-white font-bold"
                    style={{
                      width: "30px",
                      height: "30px",
                      background: a.bg,
                      fontSize: "10px",
                      marginLeft: i === 0 ? 0 : "-6px",
                    }}
                  >
                    {a.text}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-bold" style={{ fontSize: "15px" }}>
                  500+ happy travelers
                </p>
                <p className="text-white/50" style={{ fontSize: "12px", marginTop: "3px" }}>
                  Mediterranean · Caribbean · Alaska · River cruises
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: destination gallery — flex-none keeps it at 320px, never stretches */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="hidden lg:flex flex-none flex-col items-center"
          >
            <div
              className="relative overflow-hidden"
              style={{
                width: "380px",
                height: "460px",
                borderRadius: "3px",
                border: "1.5px solid rgba(245,158,11,0.32)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={destinations[current].image}
                    alt={destinations[current].alt}
                    fill
                    className="object-cover"
                    sizes="380px"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 52%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p
                      className="text-white font-bold"
                      style={{ fontSize: "16px", letterSpacing: "0.01em" }}
                    >
                      {destinations[current].name}
                    </p>
                    <p
                      className="text-white/65"
                      style={{ fontSize: "12px", marginTop: "3px" }}
                    >
                      {destinations[current].tag}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots sit directly under the card — no flex-1 gap pulling them away */}
            <div className="flex items-center gap-[5px] mt-3">
              {destinations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${destinations[i].name}`}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    width: i === current ? "16px" : "5px",
                    height: "5px",
                    borderRadius: i === current ? "3px" : "50%",
                    background: i === current ? "#f59e0b" : "rgba(255,255,255,0.22)",
                    border: "none",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 pointer-events-none">
        <div className="w-6 h-px bg-white/18" />
        <span
          className="text-white/40 uppercase font-bold"
          style={{ fontSize: "11px", letterSpacing: "0.14em" }}
        >
          Scroll to explore
        </span>
        <div className="w-6 h-px bg-white/18" />
      </div>
    </section>
  );
};