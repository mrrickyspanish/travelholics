"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import { Compass } from "lucide-react";

// ─────────────────────────────────────────────
// Destination config
// origin = transform-origin of the map zoom (% position of that region on the image)
// scale  = how far in to zoom
// ─────────────────────────────────────────────
const destinations = [
  {
    id: "view-all",
    label: "View All",
    sub: "",
    scale: 1,
    origin: "50% 50%",
    badge: null,
  },
  {
    id: "alaska",
    label: "Alaska",
    sub: "Glacier Bay · Inside Passage",
    scale: 2.5,
    origin: "22% 16%",
    badge: { title: "Alaska", tagline: "Glacier Bay · Inside Passage" },
  },
  {
    id: "east-coast",
    label: "East Coast Ports",
    sub: "NY · Baltimore · FL",
    scale: 2.4,
    origin: "47% 37%",
    badge: { title: "East Coast Ports", tagline: "New York · Baltimore · Florida" },
  },
  {
    id: "bahamas",
    label: "Bahamas",
    sub: "Nassau · Paradise Island",
    scale: 3.2,
    origin: "51% 52%",
    badge: { title: "Bahamas", tagline: "Nassau · Paradise Island" },
  },
  {
    id: "caribbean",
    label: "Caribbean",
    sub: "Royal Caribbean",
    scale: 2.8,
    origin: "43% 66%",
    badge: { title: "Caribbean", tagline: "Royal Caribbean routes" },
  },
  {
    id: "mediterranean",
    label: "Mediterranean",
    sub: "Greece · Italy",
    scale: 3.0,
    origin: "84% 29%",
    badge: { title: "Mediterranean", tagline: "Greece · Italy · Barcelona" },
  },
];

// Mobile photo grid — shown below lg breakpoint
const photos = [
  {
    name: "Caribbean",
    image: "/images/dest-caribbean.jpg",
    alt: "Yolanda and her partner at sunset on a Caribbean cruise",
    span: "col-span-1 row-span-2",
  },
  {
    name: "Alaska",
    image: "/images/dest-alaska.jpg",
    alt: "Yolanda in Alaska with glacial waters and mountains",
    span: "col-span-1",
  },
  {
    name: "Mediterranean",
    image: "/images/dest-mediterranean.jpg",
    alt: "Yolanda and her partner at the Parthenon in Athens",
    span: "col-span-1",
  },
  {
    name: "Alaska Glaciers",
    image: "/images/dest-alaska-glaciers.jpg",
    alt: "Glacial waters and snow-capped mountains in Alaska",
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
  const [activeId, setActiveId] = useState("view-all");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const active = destinations.find((d) => d.id === activeId) ?? destinations[0];

  const handleSelect = (id: string) => {
    if (id === activeId || isTransitioning) return;

    // If going between two zoomed destinations, briefly reset to full view first
    if (activeId !== "view-all" && id !== "view-all") {
      setIsTransitioning(true);
      setActiveId("view-all");
      setTimeout(() => {
        setActiveId(id);
        setIsTransitioning(false);
      }, 420);
    } else {
      setActiveId(id);
    }
  };

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
        {/* ── HEADER ── */}
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
            Every destination Yolanda recommends is one she&apos;s experienced
            firsthand — select a destination to explore the route.
          </p>
        </motion.div>

        {/* ── DESKTOP: Sidebar + Interactive Map ── */}
        <div className="hidden lg:flex gap-6 items-start">
          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-shrink-0 w-52"
          >
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[2.5px] mb-3">
              Destinations
            </p>

            <ul className="space-y-1">
              {destinations.map((dest) => {
                const isActive = activeId === dest.id;
                return (
                  <li key={dest.id}>
                    <button
                      onClick={() => handleSelect(dest.id)}
                      disabled={isTransitioning}
                      className={`
                        w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group
                        ${isActive
                          ? "bg-[#059669] text-white shadow-lg shadow-emerald-900/40"
                          : "text-white/60 hover:text-white hover:bg-white/8"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Dot indicator */}
                        <span
                          className={`
                            w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200
                            ${isActive ? "bg-white" : "bg-white/25 group-hover:bg-white/50"}
                          `}
                        />
                        <div>
                          <p className={`text-sm font-semibold leading-tight ${isActive ? "text-white" : ""}`}>
                            {dest.label}
                          </p>
                          {dest.sub && (
                            <p className={`text-[11px] mt-0.5 leading-tight ${isActive ? "text-emerald-100/80" : "text-white/30"}`}>
                              {dest.sub}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Hint text */}
            <p className="text-white/20 text-[11px] mt-6 leading-relaxed pl-1">
              Select a destination to zoom the map to that region.
            </p>
          </motion.div>

          {/* Right: Map panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            <div
              ref={mapRef}
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "16/7",
                border: "1px solid rgba(245,158,11,0.25)",
                background: "#0f172a",
              }}
            >
              {/* The zoomable map */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `scale(${active.scale})`,
                  transformOrigin: active.origin,
                  transition: isTransitioning
                    ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
                    : "transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0s",
                  willChange: "transform",
                }}
              >
                <Image
                  src="/images/cruise-atlas.png"
                  alt="Nautical chart showing Yolanda's cruise destinations — Caribbean, Alaska, Bahamas, Mediterranean"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              </div>

              {/* Navy vignette overlays — stay fixed, frame the map */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(30,58,138,0.18) 0%, transparent 18%, transparent 82%, rgba(30,58,138,0.22) 100%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, rgba(30,58,138,0.15) 0%, transparent 15%, transparent 85%, rgba(30,58,138,0.15) 100%)",
                }}
              />

              {/* Destination badge — appears when zoomed */}
              <AnimatePresence>
                {active.badge && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                    className="absolute bottom-4 left-4 z-10"
                  >
                    <div
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                      style={{
                        background: "rgba(15, 23, 42, 0.82)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(5, 150, 105, 0.4)",
                      }}
                    >
                      <Compass className="w-4 h-4 text-[#059669] flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm font-bold leading-tight">
                          {active.badge.title}
                        </p>
                        <p className="text-white/50 text-[11px] mt-0.5">
                          {active.badge.tagline}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* "Plan My Cruise" CTA — visible on full view */}
              <AnimatePresence>
                {activeId === "view-all" && (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <a
                      href="#contact"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all duration-200 hover:scale-105"
                      style={{
                        background: "rgba(5, 150, 105, 0.9)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 4px 20px rgba(5, 150, 105, 0.35)",
                      }}
                    >
                      Plan My Cruise
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset hint */}
            {activeId !== "view-all" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleSelect("view-all")}
                className="mt-3 text-white/30 text-xs hover:text-white/60 transition-colors duration-200 pl-1"
              >
                ← Back to full map
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* ── MOBILE: photo grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 auto-rows-[160px] gap-3 lg:hidden"
        >
          {photos.map((d, i) => (
            <div
              key={i}
              className={`${d.span} rounded-2xl overflow-hidden relative group hover:shadow-lg transition-all duration-300`}
            >
              <Image
                src={"/images/cruise-atlas.png"}
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