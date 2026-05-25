"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SailingShipSVG = () => (
  <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
    {/* Water lines */}
    <path
      d="M0 45 Q30 40 60 45 Q90 50 120 45"
      stroke="#059669"
      strokeWidth="1"
      opacity="0.3"
    />
    <path
      d="M0 50 Q30 45 60 50 Q90 55 120 50"
      stroke="#059669"
      strokeWidth="0.8"
      opacity="0.2"
    />
    {/* Hull */}
    <path d="M30 42 L35 52 L85 52 L90 42 Z" fill="#1e3a8a" />
    {/* Deck */}
    <rect x="38" y="36" width="44" height="6" rx="1" fill="#059669" />
    {/* Cabin */}
    <rect x="42" y="28" width="36" height="8" rx="1" fill="white" />
    {/* Windows */}
    {[46, 52, 58, 64, 70].map((x, i) => (
      <rect
        key={i}
        x={x}
        y="30"
        width="3"
        height="3"
        rx="0.5"
        fill="#1e3a8a"
        opacity="0.6"
      />
    ))}
    {/* Funnel */}
    <rect x="55" y="18" width="10" height="10" rx="1" fill="#f59e0b" />
    <rect x="57" y="14" width="6" height="4" rx="0.5" fill="#1e3a8a" />
    {/* Smoke puffs */}
    <circle cx="62" cy="10" r="3" fill="#1e3a8a" opacity="0.08">
      <animate
        attributeName="cx"
        values="62;55;48"
        dur="4s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="cy"
        values="10;6;3"
        dur="4s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="r"
        values="3;5;7"
        dur="4s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.08;0.04;0"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="60" cy="8" r="2" fill="#1e3a8a" opacity="0.06">
      <animate
        attributeName="cx"
        values="60;52;44"
        dur="5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="cy"
        values="8;4;1"
        dur="5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="r"
        values="2;4;6"
        dur="5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.06;0.03;0"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>
    {/* Flag */}
    <line x1="75" y1="18" x2="75" y2="8" stroke="#1e3a8a" strokeWidth="0.8" />
    <path d="M75 8 L82 11 L75 14 Z" fill="#f59e0b">
      <animate
        attributeName="d"
        values="M75 8 L82 11 L75 14 Z;M75 8 L81 10.5 L75 14 Z;M75 8 L82 11 L75 14 Z"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

export const ShipDivider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative bg-white py-4 overflow-hidden"
    >
      {/* Ocean line */}
      <div className="absolute top-[55%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#059669]/25 to-transparent" />

      {/* Ship — slides across viewport */}
      <motion.div
        initial={{ x: "-140px" }}
        animate={isInView ? { x: "calc(100vw - 180px)" } : { x: "-140px" }}
        transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-[140px] relative z-10"
      >
        <SailingShipSVG />
      </motion.div>

      {/* Wake trail */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: "calc(100vw - 200px)" } : { width: 0 }}
        transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-[58%] left-0 h-0.5 bg-gradient-to-r from-transparent to-[#059669]/10"
      />
    </div>
  );
};
