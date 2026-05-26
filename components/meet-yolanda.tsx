"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const YOLANDA_SEATED_PHOTO = "/images/dest-mediterranean.jpg";
const YOLANDA_SEATED_FALLBACK = "/images/about-port-of-call.jpg";

const credentials = [
  "20+ years across cruise, all-inclusive, and custom travel",
  "Certified Cruise Specialist (CLIA)",
  "Preferred Partner - Royal Caribbean, Norwegian, Celebrity",
  "Built and led 4+ group sailings (and counting)",
  "Yes, I actually answer my phone",
];

export const MeetYolanda = () => {
  return (
    <section id="about" className="bg-cream pt-20 pb-14 lg:pb-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[35%_40%_25%] gap-10 lg:gap-12 items-start">

          {/* Left: Photo */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={YOLANDA_SEATED_PHOTO}
                alt="Yolanda Harris, Cruise Curator & Travel Partner"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 35vw"
                onError={(e) => {
                  // Fallback until placeholder is replaced with real photo
                  (e.target as HTMLImageElement).src = YOLANDA_SEATED_FALLBACK;
                }}
              />
            </div>
          </motion.div>

          {/* Middle: Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="type-kicker text-coral mb-3">THE TRAVELHOLIC IN CHIEF</p>
            <h2 className="font-serif text-3xl lg:text-[2.45rem] font-semibold text-ink leading-tight tracking-tight mb-5">
              Yolanda Harris, founder and chronic packer.
            </h2>
            <div className="space-y-4 text-[16px] lg:text-[17px] font-medium text-ink/80 leading-relaxed">
              <p>
                Travel is the whole personality. Has been since I booked my first cruise in my twenties and immediately started planning the next one.
              </p>
              <p>
                Twenty years in, I&apos;ve sailed every major line, scouted the all-inclusives worth the flight, and figured out which "deals" are actually deals. I treat every trip I book like I&apos;m going on it myself - because half the time I have. Best cabins, the excursions that aren&apos;t tourist traps, the ports where you skip the cruise terminal and find where locals actually eat.
              </p>
              <p>
                Booking through me costs you the same as booking direct. The difference is who picks up the phone when something goes sideways at sea.
              </p>
            </div>
            <div className="mt-7">
              <p className="font-script text-[1.9rem] text-coral leading-none">Let&apos;s travel.</p>
              <p className="font-script text-[1.9rem] text-coral leading-none">- Yolanda ♡</p>
            </div>
          </motion.div>

          {/* Right: Floating credentials card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pt-8 h-full flex flex-col gap-4"
          >
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-coral/30" style={{ borderWidth: "0.5px" }}>
              <ul className="space-y-3.5">
                {credentials.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-coral mt-0.5 shrink-0" />
                    <span className="text-[14px] font-semibold text-ink leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 bg-emerald-mid rounded-2xl p-5 lg:p-6 text-[#FAF9F6] flex flex-col justify-between min-h-[220px]">
              <div>
                <p className="type-kicker text-[#FAF9F6]/78 mb-3">BETWEEN TRIPS</p>
                <h3 className="font-serif text-[1.7rem] lg:text-[2rem] font-semibold leading-tight mb-4">
                  Follow Yolanda where the lifestyle lives.
                </h3>
                <div className="flex items-center justify-start text-left text-[15px] lg:text-[16px] text-[#FAF9F6]/85 font-medium">
                  <span>@rjsmom1 · 20K+ on TikTok</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="https://www.tiktok.com/@rjsmom1"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-emerald-mid font-semibold text-[14px] shadow-sm transition-colors hover:bg-[#FAF9F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.12v12.36a2.67 2.67 0 1 1-2.67-2.67c.24 0 .47.03.69.09V8.62a5.78 5.78 0 0 0-.69-.04A5.79 5.79 0 1 0 15.82 14V7.93a7.9 7.9 0 0 0 4.64 1.5V6.31c-.3 0-.59-.03-.87-.09Z" />
                  </svg>
                  <span>Follow along</span>
                  <span className="inline-block translate-x-0 group-hover:translate-x-[2px] transition-transform duration-200" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
