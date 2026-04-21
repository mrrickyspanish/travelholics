"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const destinations = [
  {
    name: "Caribbean",
    image: "/images/dest-caribbean.jpg",
    alt: "Yolanda and her partner at sunset on a Caribbean cruise",
    span: "col-span-1 md:col-span-1 md:row-span-2",
  },
  {
    name: "Alaska",
    image: "/images/dest-alaska.jpg",
    alt: "Yolanda in Alaska with glacial waters and mountains behind her",
    span: "col-span-1",
  },
  {
    name: "Mediterranean",
    image: "/images/dest-mediterranean.jpg",
    alt: "Yolanda and her partner at the Parthenon in Athens, Greece",
    span: "col-span-1",
  },
  {
    name: "Alaska Glaciers",
    image: "/images/dest-alaska-glaciers.jpg",
    alt: "Stunning glacial waters and snow-capped mountains in Alaska",
    span: "col-span-1",
  },
  {
    name: "Bahamas",
    image: "/images/dest-bahamas.jpg",
    alt: "Welcome sign at a Bahamas cruise port",
    span: "col-span-1",
  },
];

export const DestinationMosaic = () => {
  return (
    <section className="bg-[#1e3a8a] py-24 relative overflow-hidden">

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[1.5px] bg-[#f59e0b]" />
            <p className="text-[#f59e0b] font-bold text-xs uppercase tracking-[2px]">
              The Voyages
            </p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-2xl">
            Sailed It. Lived It.{" "}
            <span className="text-[#059669]">Now I&apos;ll Book It for You.</span>
          </h2>
          <p className="text-white/45 mt-4 max-w-md text-sm leading-relaxed">
            Every destination Yolanda recommends is one she&apos;s experienced firsthand — on the water, at the ports, and everywhere in between.
          </p>
        </motion.div>

        {/* ── NAUTICAL MAP IMAGE ──
            Replace /images/cruise-atlas.jpg with your AI-generated map.
            Recommended: 1600×900px or wider, landscape orientation.
        ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full rounded-2xl overflow-hidden mb-4 hidden lg:block"
          style={{
            aspectRatio: "16/7",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <Image
            src="/images/cruise-atlas.jpg"
            alt="Nautical chart showing Yolanda's cruise destinations — Caribbean, Alaska, Bahamas, Mediterranean"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          {/* Subtle gold vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(30,58,138,0.12) 0%, transparent 20%, transparent 80%, rgba(30,58,138,0.18) 100%)",
            }}
          />
        </motion.div>

        {/* ── MOBILE: destination photo grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 auto-rows-[160px] gap-3 lg:hidden"
        >
          {destinations.map((d, i) => (
            <div
              key={i}
              className={`${d.span} rounded-2xl overflow-hidden relative group hover:shadow-lg transition-all duration-300`}
            >
              <Image
                src={d.image}
                alt={d.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f59e0b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-base drop-shadow-md">
                {d.name}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};