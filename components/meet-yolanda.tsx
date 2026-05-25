"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const credentials = [
  "20+ Years in Travel & Hospitality",
  "Certified Cruise Specialist",
  "Preferred Partner with Top Cruise Lines",
  "Group Travel Expert",
  "Personalized, Hands-On Service",
];

export const MeetYolanda = () => {
  return (
    <section id="about" className="bg-sand py-20 relative overflow-hidden">
      {/* Faint compass watermark — top right corner */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 w-96 h-96 opacity-[0.035] text-emerald-deep"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M100 8 L106 93 L100 100 L94 93 Z" />
          <path d="M100 192 L106 107 L100 100 L94 107 Z" opacity="0.45" />
          <path d="M8 100 L93 106 L100 100 L93 94 Z" opacity="0.45" />
          <path d="M192 100 L107 94 L100 100 L107 106 Z" />
          <text x="100" y="25" textAnchor="middle" fontSize="12" fontWeight="bold">N</text>
          <text x="100" y="183" textAnchor="middle" fontSize="12">S</text>
          <text x="18" y="105" textAnchor="middle" fontSize="12">W</text>
          <text x="183" y="105" textAnchor="middle" fontSize="12">E</text>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[35%_40%_25%] gap-10 lg:gap-12 items-start">

          {/* Left: Photo */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
              {/* TODO: Confirm Yolanda full-body headshot path; about-on-deck.jpg used as placeholder */}
              <Image
                src="/images/about-on-deck.jpg"
                alt="Yolanda Harris, Cruise Curator & Travel Partner"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 35vw"
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
            <p className="type-kicker text-coral mb-3">Meet Yolanda</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-emerald-deep leading-tight mb-6">
              Your Trusted Cruise Curator
            </h2>
            <div className="space-y-4 text-base text-ink/80 leading-relaxed">
              <p>
                I&apos;m Yolanda Harris—cruise lover, travel expert, and your go-to person for
                unforgettable journeys. With over 20 years in travel and hospitality, I&apos;ve
                explored the world, built lasting relationships with top cruise lines, and helped
                hundreds of travelers plan stress-free, joy-filled vacations.
              </p>
              <p>
                Whether you&apos;re cruising for the first time or the fiftieth, I treat every trip
                like it&apos;s my own. From the best cabin with the sunset view to the shore excursion
                that skips every tourist trap—I know the details that make the difference.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 flex-wrap">
              <span className="font-dancing text-[2rem] text-coral leading-none">Let&apos;s travel!</span>
              <span className="font-dancing text-[2rem] text-coral leading-none">Yolanda</span>
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-coral"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </motion.div>

          {/* Right: Credentials card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-cream rounded-2xl p-6 shadow-sm border border-blush">
              <ul className="space-y-4">
                {credentials.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-emerald-mid mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-ink leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
