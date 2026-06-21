"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-cream pt-2 text-white sm:pt-4 lg:pt-5">
      <div className="mx-auto w-full px-2 pb-2 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
        <div className="relative min-h-[calc(100svh-1rem)] overflow-hidden rounded-[1rem] bg-ink shadow-[0_30px_90px_rgba(26,58,82,0.18)] sm:min-h-[calc(100svh-2rem)] sm:rounded-[1.25rem] lg:rounded-[1.375rem]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/Charlotte_Amalie_StThomas.jpg"
          >
            <source src="https://bnjcpfocmgtmutfbanhs.supabase.co/storage/v1/object/public/Images/travel_updated_hero_vid_2.mp4" type="video/mp4" />
          </video>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[40%] bg-gradient-to-t from-ink/80 via-ink/20 to-transparent sm:h-[34%]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[6]"
            style={{
              background:
                "radial-gradient(ellipse 68% 44% at 50% 46%, rgba(8,20,28,0.5) 0%, rgba(8,20,28,0.22) 50%, rgba(8,20,28,0) 78%)",
            }}
          />

          <div className="relative z-10 flex min-h-[calc(100svh-1rem)] flex-col items-center px-4 sm:min-h-[calc(100svh-2rem)] sm:px-8 lg:px-12">
            <div className="flex-[1.3]" aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-[23.5rem] text-center sm:max-w-[66rem]"
            >
              <h1
                className="font-serif text-[clamp(3.35rem,15.6vw,4.65rem)] font-semibold leading-[0.86] tracking-[-0.06em] text-white sm:text-[clamp(3.25rem,11.6vw,10.8rem)] sm:leading-[0.82] sm:tracking-[-0.075em]"
                style={{ filter: "drop-shadow(0 2px 6px rgba(8,20,28,0.55)) drop-shadow(0 16px 38px rgba(8,20,28,0.34))" }}
              >
                Travelholic
              </h1>
              <p
                className="mt-2 text-[0.85rem] italic tracking-wide text-white/70 sm:mt-3 sm:text-[1.1rem]"
                style={{ filter: "drop-shadow(0 2px 4px rgba(8,20,28,0.5))" }}
              >
                /ˈtra-vəl-hä-lik/
              </p>
              <p
                className="mx-auto mt-3 max-w-[23rem] font-serif text-[clamp(1.48rem,7vw,2.12rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:mt-4 sm:max-w-[22ch] sm:text-[clamp(1.3rem,3.65vw,3.7rem)] sm:leading-[0.98] sm:tracking-[-0.05em]"
                style={{ filter: "drop-shadow(0 2px 5px rgba(8,20,28,0.5)) drop-shadow(0 10px 28px rgba(8,20,28,0.3))" }}
              >
                <span className="block whitespace-nowrap sm:inline">Someone who travels</span>{" "}
                <span className="relative mt-1.5 inline-block whitespace-nowrap font-script text-[1.08em] font-semibold tracking-normal text-coral sm:mt-0">
                  between trips.
                  <svg
                    className="absolute -bottom-1 left-0 h-3 w-full text-coral"
                    viewBox="0 0 210 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3 7 C44 3, 84 8.3, 126 5.4 C159 3.3, 186 6.8, 207 4.8"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </p>
            </motion.div>

            <div className="flex-1" aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center justify-center gap-1.5 text-[0.72rem] font-medium tracking-wide text-white/58 drop-shadow-[0_4px_14px_rgba(10,31,44,0.22)] sm:gap-2 sm:text-[0.82rem]"
            >
              <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span>Charlotte Amalie · St. Thomas</span>
            </motion.div>

            <div className="flex-1" aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 2.6 }}
              className="pb-8 sm:pb-10 lg:pb-12"
            >
              <button
                type="button"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                className="group flex flex-col items-center gap-2 rounded-md px-2 py-1 text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <span className="text-[0.84rem] font-semibold uppercase tracking-[0.25em] sm:text-[0.78rem]">
                  Let&apos;s go
                </span>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-[1.2rem] w-[1.2rem] sm:h-5 sm:w-5" />
                </motion.span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};