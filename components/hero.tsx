"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";

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
            "linear-gradient(90deg, rgba(5,28,24,.72) 0%, rgba(5,28,24,.28) 46%, rgba(5,28,24,.05) 72%, rgba(5,28,24,.14) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#061d19]/92 via-[#061d19]/20 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[96svh] max-w-[96rem] flex-col px-5 pb-8 pt-28 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12 xl:px-16">
        <div className="flex-1" />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[72rem]"
        >
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/58 sm:text-[11px]">
            Travelholics
          </p>
          <h1 className="max-w-[9ch] font-serif text-[clamp(4rem,10.5vw,9.5rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-white">
            Your next trip should feel <span className="text-coral">like this.</span>
          </h1>

          <div className="mt-6 flex flex-col gap-5 border-t border-white/20 pt-5 sm:max-w-[38rem] sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[18ch] font-serif text-[clamp(1.55rem,3.2vw,2.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white/88">
              For people who are always between trips.
            </p>
            <Link
              href="/#contact"
              className="inline-flex min-h-13 w-fit shrink-0 items-center justify-center rounded-full bg-coral px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              Plan my next cruise
            </Link>
          </div>
        </motion.div>

        <div className="mt-8 flex items-center justify-between border-t border-white/12 pt-4 text-[10px] font-semibold text-white/42 sm:text-[11px]">
          <span className="italic tracking-wide">travelholic /ˈtra-vəl-hä-lik/</span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" /> Charlotte Amalie · St. Thomas
          </span>
        </div>
      </div>
    </section>
  );
};
