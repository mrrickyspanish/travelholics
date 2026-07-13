"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Youtube } from "lucide-react";
import { VideoEmbed } from "@/components/video-embed";
import { SUBSCRIBE_URL, type Video } from "@/lib/youtube";

type LatestVideosProps = {
  featured: Video | null;
  shorts: Video[];
};

export const LatestVideos = ({ featured, shorts }: LatestVideosProps) => {
  // Nothing to show (e.g. feed unreachable) — keep the homepage clean.
  if (!featured && shorts.length === 0) return null;

  return (
    <section id="videos" className="relative overflow-hidden bg-sand py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute right-[-7rem] top-16 h-56 w-56 rounded-full bg-coral/8 blur-3xl" aria-hidden="true" />

      <motion.div
        className="relative z-10 mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[38rem]">
            <p className="font-script text-[2.65rem] font-semibold leading-none text-coral sm:text-[3rem]">
              Travelholics TV
            </p>
            <h2 className="type-homepage-h2 mt-3 font-serif text-ink">
              New videos every week.
            </h2>
            <p className="mt-5 max-w-[42ch] text-[1.05rem] font-medium leading-[1.7] text-ink/70 sm:text-[1.14rem]">
              A fresh cruise deep-dive plus quick tips, ship tours, and packing
              hacks — straight from Yolanda. Subscribe so you never miss a drop.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-[1rem] font-semibold text-white shadow-md transition-colors hover:bg-coral-deep"
            >
              <Youtube size={18} />
              Subscribe
            </a>
            <Link
              href="/videos"
              className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-white px-5 py-3 text-[1rem] font-semibold text-ink shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-cream"
            >
              All videos
              <ArrowUpRight size={17} strokeWidth={2.2} />
            </Link>
          </div>
        </div>

        <div className="mt-9 grid gap-6 lg:mt-12 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
          {/* Featured long-form — theater card */}
          {featured && (
            <div className="overflow-hidden rounded-[2rem] bg-[#0E125C] p-3 shadow-[0_30px_80px_rgba(14,18,92,0.18)] sm:p-4">
              <VideoEmbed
                id={featured.id}
                title={featured.title}
                format="long"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="px-2 pb-1 pt-4 sm:px-3">
                <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-coral">
                  Latest episode
                </p>
                <h3 className="mt-2 font-serif text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[1.85rem]">
                  {featured.title}
                </h3>
                {featured.blurb && (
                  <p className="mt-2 text-[1rem] leading-relaxed text-white/70">
                    {featured.blurb}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Shorts rail */}
          {shorts.length > 0 && (
            <div className="rounded-[2rem] bg-cream p-4 shadow-[0_22px_60px_rgba(26,58,82,0.08)] ring-1 ring-white/70 sm:p-5">
              <p className="text-eyebrow mb-4 font-bold uppercase tracking-[0.12em] text-stone">
                This week&apos;s Shorts
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {shorts.map((short) => (
                  <div key={short.id}>
                    <VideoEmbed
                      id={short.id}
                      title={short.title}
                      format="short"
                      sizes="(max-width: 640px) 30vw, 160px"
                    />
                    <p className="mt-2 line-clamp-2 text-[0.9rem] font-semibold leading-snug text-ink">
                      {short.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
