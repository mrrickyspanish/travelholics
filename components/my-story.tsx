"use client";

import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

const PhotoPlaceholder = ({
  label,
  aspect = "aspect-[3/4]",
}: {
  label: string;
  aspect?: string;
}) => (
  <div
    className={`${aspect} rounded-2xl overflow-hidden bg-gradient-to-br from-[#059669]/10 via-[#1e3a8a]/5 to-[#f59e0b]/10 border-2 border-dashed border-[#059669]/15 flex flex-col items-center justify-center text-center p-4`}
  >
    <span className="text-sm font-semibold text-[#1e3a8a]">📷 {label}</span>
    <span className="text-[10px] text-slate-400 mt-1">Swap with photo</span>
  </div>
);

export const MyStory = () => {
  return (
    <section id="about" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#059669] font-semibold text-xs uppercase tracking-[2px] mb-3">
            My Story
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1e3a8a] leading-tight max-w-xl mx-auto">
            It Started with{" "}
            <span className="text-[#059669]">One Cruise</span> That Changed
            Everything.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Story text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5 text-lg text-slate-600 leading-relaxed"
          >
            <p>
              I remember standing on the top deck watching the coastline
              disappear, and something clicked —{" "}
              <em className="text-[#1e3a8a] font-semibold not-italic">
                this is what life is supposed to feel like.
              </em>
            </p>
            <p>
              That was over 20 years ago. Since then, I&apos;ve sailed the
              Caribbean, Alaska, the Mediterranean, and the rivers of Europe. I
              know which cabin has the best sunset view on Deck 10. I know the
              shore excursion that skips every tourist trap. I know which upgrade
              window nobody tells you about.
            </p>
            <p>
              I&apos;m not a booking website. I&apos;m a real person who picks
              up the phone, who will call the cruise line at 6 AM to get your
              family reunion group the dining time you actually want. Whether
              it&apos;s a couple celebrating 25 years or a family of 40 taking
              over an entire deck —
            </p>
            <p className="text-xl font-bold text-[#1e3a8a] italic">
              I treat every voyage like it&apos;s my own family boarding that
              ship.
            </p>
          </motion.div>

          {/* Photo grid — 3 swap spots */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="row-span-2">
              <PhotoPlaceholder label="Yolanda on deck" aspect="aspect-[3/5]" />
            </div>
            <PhotoPlaceholder label="At a port of call" aspect="aspect-square" />
            <PhotoPlaceholder label="With travelers" aspect="aspect-[4/3]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
