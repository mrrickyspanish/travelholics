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
            "linear-gradient(90deg, rgba(5,28,24,.70) 0%, rgba(5,28,24,.28) 46%, rgba(5,28,24,.06) 72%, rgba(5,28,24,.14) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-[#061d19]/88 via-[#061d19]/18 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[96svh] max-w-[96rem] flex-col px-5 pb-8 pt-28 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12 xl:px-16">
        <div className="flex-1" />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[76rem]"
        >
          <h1 className="font-serif text-[clamp(5rem,14vw,12rem)] font-semibold leading-[0.76] tracking-[-0.075em] text-white">
            Travelholic.
          </h1>

          <div className="mt-6 max-w-[38rem] border-t border-white/22 pt-5">
            <p className="text-xs italic tracking-wide text-white/50 sm:text-sm">/ˈtra-vəl-hä-lik/</p>
            <p className="mt-2 max-w-[15ch] font-serif text-[clamp(1.8rem,4.2vw,4rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
              Someone who travels <span className="text-coral">between trips.</span>
            </p>
          </div>

          <Link
            href="/#contact"
            className="mt-7 inline-flex min-h-13 items-center justify-center rounded-full bg-coral px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            Plan with Yolanda
          </Link>
        </motion.div>

        <div className="mt-10 flex justify-end border-t border-white/12 pt-4">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/44">
            <MapPin className="h-3.5 w-3.5" /> Charlotte Amalie · St. Thomas
          </span>
        </div>
      </div>
    </section>
  );
};
