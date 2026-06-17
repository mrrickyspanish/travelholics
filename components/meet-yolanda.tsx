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
    <section id="about" className="relative overflow-hidden bg-cream pb-10 pt-14 sm:pt-16 lg:pb-16 lg:pt-20">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid items-start gap-7 sm:gap-8 lg:grid-cols-[7fr_8fr_5fr] lg:gap-10">

          {/* Left: Photo */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[35rem] overflow-hidden rounded-2xl shadow-xl lg:mx-0 lg:aspect-square lg:max-w-none">
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
            className="order-1 text-center lg:order-2 lg:text-left"
          >
            <p className="text-eyebrow text-coral mb-3">THE TRAVELHOLIC IN CHIEF</p>
            <h2 className="mx-auto mb-4 max-w-[20ch] font-serif text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.15rem] lg:mx-0 lg:mb-5 lg:max-w-none lg:text-[2.45rem]">
              Yolanda Harris, founder and chronic packer.
            </h2>
            <div className="mx-auto max-w-[46ch] space-y-3.5 text-card-body text-ink/82 sm:max-w-[48ch] lg:mx-0 lg:max-w-none lg:space-y-4 lg:text-[17px] lg:leading-relaxed">
              <p>
                Twenty years in, I&apos;ve sailed every major line, scouted the all-inclusives worth the flight, and figured out which "deals" are actually deals. I treat every trip I book like I&apos;m going on it myself - because half the time I have. Best cabins, the excursions that aren&apos;t tourist traps, the ports where you skip the cruise terminal and find where locals actually eat.
              </p>
              <p>
                Booking through me costs you the same as booking direct. The difference is who picks up the phone when something goes sideways at sea.
              </p>
            </div>
            <div className="mt-6 lg:mt-7">
              <p className="font-script text-[1.9rem] text-coral leading-none">Let&apos;s travel.</p>
              <p className="font-script text-[1.9rem] text-coral leading-none">- Yolanda ♡</p>
              <a
                href="/#contact"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-coral px-6 py-3 text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 lg:w-auto"
              >
                Book With Yolanda
              </a>
            </div>
          </motion.div>

          {/* Right: Floating credentials card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-3 mx-auto flex h-full w-full max-w-[35rem] flex-col gap-3 lg:mx-0 lg:max-w-none lg:gap-4 lg:pt-8"
          >
            <div className="rounded-2xl border border-coral/30 bg-white p-5 shadow-sm" style={{ borderWidth: "0.5px" }}>
              <p className="text-eyebrow text-center text-coral/90 mb-3 lg:text-left">
                Why Book With Yolanda
              </p>
              <ul className="space-y-3">
                {credentials.map((item, index) => (
                  <li
                    key={item}
                    className={`mx-auto flex w-full max-w-[31rem] items-start gap-2.5 text-left lg:mx-0 lg:max-w-none ${index >= 4 ? "hidden lg:flex" : "flex"}`}
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/10">
                      <CheckCircle size={13} className="text-coral/85" />
                    </span>
                    <span className="text-footer-body font-semibold leading-snug text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-h-[205px] flex-col justify-between rounded-2xl bg-emerald-mid p-5 text-[#FAF9F6] sm:min-h-[220px] lg:flex-1 lg:min-h-[232px] lg:p-6">
              <div>
                <p className="text-eyebrow mb-2 text-center text-[#FAF9F6]/78 lg:text-left">BETWEEN TRIPS</p>
                <h3 className="mb-3 mx-auto w-full text-center font-serif text-[clamp(1.22rem,3.4vw,1.56rem)] font-semibold leading-[1.18] lg:mx-0 lg:text-left">
                  Follow Yolanda where the lifestyle lives.
                </h3>
              </div>

              <div className="mt-4 flex flex-col items-center gap-2 lg:items-start">
                <a
                  href="https://www.tiktok.com/@rjsmom1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-emerald-mid shadow-sm transition-colors hover:bg-[#FAF9F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.12v12.36a2.67 2.67 0 1 1-2.67-2.67c.24 0 .47.03.69.09V8.62a5.78 5.78 0 0 0-.69-.04A5.79 5.79 0 1 0 15.82 14V7.93a7.9 7.9 0 0 0 4.64 1.5V6.31c-.3 0-.59-.03-.87-.09Z" />
                  </svg>
                  <span>rjsmom1</span>
                </a>
                <p className="text-center text-[13px] font-medium text-[#FAF9F6]/86 lg:text-left">20K+ on TikTok</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
