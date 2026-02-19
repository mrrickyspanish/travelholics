"use client";

import { motion } from "framer-motion";

const destinations = [
  { name: "Caribbean", span: "col-span-1 md:col-span-1 md:row-span-2", accent: "from-[#059669]/15 to-[#1e3a8a]/10" },
  { name: "Alaska", span: "col-span-1", accent: "from-[#1e3a8a]/15 to-[#059669]/10" },
  { name: "Mediterranean", span: "col-span-1", accent: "from-[#f59e0b]/15 to-[#059669]/10" },
  { name: "European River", span: "col-span-1", accent: "from-[#1e3a8a]/10 to-[#f59e0b]/15" },
  { name: "Bahamas", span: "col-span-1", accent: "from-[#059669]/10 to-[#f59e0b]/10" },
];

export const DestinationMosaic = () => {
  return (
    <section className="bg-[#FAF9F6] py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#059669] font-semibold text-xs uppercase tracking-[2px] mb-3">
            Where I&apos;ve Sailed
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1e3a8a] mb-4">
            I Don&apos;t Just Book Destinations.{" "}
            <span className="text-[#059669]">I&apos;ve Lived Them.</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Every recommendation comes from firsthand experience on the water.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] lg:auto-rows-[200px] gap-3"
        >
          {destinations.map((d, i) => (
            <div
              key={i}
              className={`${d.span} rounded-2xl overflow-hidden bg-gradient-to-br ${d.accent} border-2 border-dashed border-[#059669]/15 flex flex-col items-center justify-center text-center p-4 hover:border-[#059669]/30 transition-colors`}
            >
              {/*
                REPLACE each with destination image:
                <Image src={`/images/dest-${d.name.toLowerCase()}.jpg`}
                  alt={d.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-bold text-lg">{d.name}</span>
              */}
              <span className="text-sm font-semibold text-[#1e3a8a]">
                📷 {d.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Swap with destination photo
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
