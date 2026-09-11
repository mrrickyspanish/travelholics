"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[96svh] overflow-hidden bg-[#071f1b] text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/Charlotte_Amalie_StThomas.jpg"
      >
        <source
          src="https://bnjcpfocmgtmutfbanhs.supabase.co/storage/v1/object/public/Images/travel_updated_hero_vid_2.mp4"
          type="video/mp4"
        />
      </video>

      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,28,24,.88) 0%, rgba(5,28,24,.48) 46%, rgba(5,28,24,.10) 72%, rgba(5,28,24,.26) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#061d19] via-[#061d19]/48 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[96svh] max-w-[96rem] flex-col px-5 pb-8 pt-28 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12 xl:px-16">
        <div className="flex-1" />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[82rem]"
        >
          <div className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/62 sm:text-[11px]">
            <span className="h-px w-10 bg-coral" />
            Cruise life with Yolanda
          </div>

          <h1 className="font-serif text-[clamp(4.9rem,14vw,12rem)] font-semibold leading-[0.76] tracking-[-0.075em] text-white">
            Travelholic.
          </h1>

          <div className="mt-7 grid gap-6 border-t border-white/20 pt-6 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="text-sm italic tracking-wide text-white/54">/ˈtra-vəl-hä-lik/</p>
              <p className="mt-2 max-w-[16ch] font-serif text-[clamp(2rem,4.6vw,4.7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                Someone who travels <span className="text-coral">between trips.</span>
              </p>
            </div>

            <div className="lg:justify-self-end lg:text-right">
              <p className="max-w-xl text-base font-medium leading-7 text-white/72 sm:text-lg sm:leading-8">
                Cruise smarter. Travel better. Come back with stories worth telling. Yolanda helps you choose the right trip and enjoy the planning almost as much as the sailing.
              </p>
              <p className="mt-4 text-sm font-semibold text-white/48">20K+ travelers already in the crew.</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/#contact"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-coral px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              Find my next cruise
            </Link>
            <Link
              href="/#about"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/24 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/45 hover:bg-white/8"
            >
              Meet Yolanda
            </Link>
          </div>
        </motion.div>

        <div className="mt-10 flex items-end justify-between gap-6 border-t border-white/14 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/46">
          <span className="inline-flex items-center gap-2 normal-case tracking-normal text-white/54">
            <MapPin className="h-3.5 w-3.5" /> Charlotte Amalie · St. Thomas
          </span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.94, behavior: reduceMotion ? "auto" : "smooth" })}
            className="hidden items-center gap-2 rounded-full px-2 py-1 transition hover:text-white sm:inline-flex"
          >
            Enter Travelholics <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
