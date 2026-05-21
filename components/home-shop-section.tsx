"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HomeShopSection() {
  return (
    <section className="bg-[#FAF9F6] py-16 lg:py-20 border-b border-slate-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">
              Shop Spotlight
            </p>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-[#1e3a8a] leading-tight mb-4">
              Cruise Life magnets are now in the shop.
            </h3>
            <p className="text-slate-600 text-base lg:text-lg leading-relaxed mb-6">
              Found the duck onboard? You can still claim your gift. Loved the design? Both magnet styles are available to buy in our shop.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop#official-merch"
                className="inline-flex items-center justify-center bg-[#10553C] text-[#FAF9F6] px-6 py-3 rounded-xl font-bold hover:bg-[#0c422f] transition-colors"
              >
                Shop Magnets
              </Link>
              <Link
                href="/duck-hunt"
                className="inline-flex items-center justify-center border border-[#1e3a8a] text-[#1e3a8a] px-6 py-3 rounded-xl font-bold hover:bg-[#1e3a8a] hover:text-white transition-colors"
              >
                Claim a Duck Hunt Gift
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-black">
            <video
              src="/videos/traveholic_pacific_door_magnent.mp4"
              poster="/images/travelholic_ticket_magnent_pacific.png"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              className="w-full h-full object-cover aspect-video"
              aria-label="Travelholics Pacific cruise door magnet video"
            >
              Sorry, your browser does not support embedded videos.
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
