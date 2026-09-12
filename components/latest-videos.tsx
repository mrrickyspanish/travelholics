"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Youtube } from "lucide-react";
import { VideoEmbed } from "@/components/video-embed";
import { SUBSCRIBE_URL, type Video } from "@/lib/youtube";

type LatestVideosProps = {
  featured: Video | null;
  shorts: Video[];
};

export const LatestVideos = ({ featured, shorts }: LatestVideosProps) => {
  const reduceMotion = useReducedMotion();
  if (!featured && shorts.length === 0) return null;

  return (
    <section id="videos" className="overflow-hidden bg-[#0b1530] py-20 text-white sm:py-28 lg:py-32">
      <motion.div
        className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">Travelholics TV</p>
            <h2 className="mt-4 max-w-[9ch] font-serif text-[clamp(2.6rem,4.2vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              Watch before you book.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-lg leading-7 text-white/62 sm:leading-8">
              Ship rankings, cruise pricing, packing calls, port days, and the little things Yolanda wishes somebody had told you before embarkation.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-black text-white transition hover:bg-coral-deep"
              >
                <Youtube size={16} /> Subscribe
              </a>
              <Link
                href="/videos"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/18 px-5 py-2.5 text-sm font-bold text-white transition hover:border-white/38 hover:bg-white/6"
              >
                All videos <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.55fr_.45fr] lg:gap-10">
          {featured && (
            <div>
              <div className="overflow-hidden bg-black shadow-[0_38px_100px_rgba(0,0,0,0.28)]">
                <VideoEmbed
                  id={featured.id}
                  title={featured.title}
                  format="long"
                  sizes="(max-width: 1024px) 100vw, 68vw"
                  priority
                />
              </div>
              <div className="mt-5 border-t border-white/14 pt-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-coral">Latest episode</p>
                <h3 className="mt-2 max-w-3xl font-serif text-3xl font-semibold leading-[1] tracking-[-0.045em] sm:text-4xl">
                  {featured.title}
                </h3>
                {featured.blurb && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/54 sm:text-base sm:leading-7">{featured.blurb}</p>}
              </div>
            </div>
          )}

          {shorts.length > 0 && (
            <div className="border-t border-white/14 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/42">Quick hits this week</p>
              <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-6">
                {shorts.map((short, index) => (
                  <div key={short.id} className={index > 0 ? "lg:border-t lg:border-white/12 lg:pt-6" : ""}>
                    <div className="overflow-hidden bg-black">
                      <VideoEmbed
                        id={short.id}
                        title={short.title}
                        format="short"
                        sizes="(max-width: 1024px) 31vw, 14vw"
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-white/72 sm:text-sm">{short.title}</p>
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
