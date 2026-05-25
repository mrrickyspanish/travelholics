"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export const SplashScreen = () => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sessionStorage.getItem("th_splash")) {
      sessionStorage.setItem("th_splash", "1");
      setVisible(true);
      const t = setTimeout(() => setExiting(true), 1300);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  // Reduced motion: instant fade instead of slide
  if (prefersReducedMotion) {
    return (
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0d4a3a]"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
        onAnimationComplete={() => {
          if (exiting) setVisible(false);
        }}
      >
        <Image
          src="/images/travelholics_logo_wordmark.svg"
          alt="Travelholics"
          width={440}
          height={118}
          className="h-24 w-auto"
          style={{ filter: "brightness(0) invert(1)" }}
          priority
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0d4a3a]"
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={
        exiting
          ? { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
          : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (exiting) setVisible(false);
      }}
    >
      {/* Wavy bottom edge — travels up with the overlay */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-[99%] pointer-events-none">
        <svg
          viewBox="0 0 1440 64"
          className="w-full h-16"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,0 Q180,64 360,0 Q540,64 720,0 Q900,64 1080,0 Q1260,64 1440,0 L1440,64 L0,64 Z"
            fill="#0d4a3a"
          />
        </svg>
      </div>

      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.25 }}
      >
        <Image
          src="/images/travelholics_logo_wordmark.svg"
          alt="Travelholics"
          width={440}
          height={118}
          className="h-24 w-auto"
          style={{ filter: "brightness(0) invert(1)" }}
          priority
        />
      </motion.div>
    </motion.div>
  );
};
