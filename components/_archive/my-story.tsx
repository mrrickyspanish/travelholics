"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const MyStory = () => {
  return (
    <section id="about" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
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

        {/* max-w-5xl mx-auto keeps the two columns from drifting on ultrawide */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
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

          {/* Photo grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="row-span-2 relative aspect-[3/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/about-on-deck.jpg"
                alt="Yolanda on the deck of a cruise ship at sunset"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/images/about-port-of-call.jpg"
                alt="Yolanda at a port of call in Santorini, Greece"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/about-with-travelers.jpg"
                alt="Yolanda with a group of happy travelers on a Mediterranean cruise"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};