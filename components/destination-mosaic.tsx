"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const destinations = [
  {
    name: "Caribbean",
    image: "/images/dest-caribbean.jpg",
    alt: "Yolanda and her partner at sunset on a Caribbean cruise",
    span: "col-span-1 md:col-span-1 md:row-span-2",
  },
  {
    name: "Alaska",
    image: "/images/dest-alaska.jpg",
    alt: "Yolanda in Alaska with glacial waters and mountains behind her",
    span: "col-span-1",
  },
  {
    name: "Mediterranean",
    image: "/images/dest-mediterranean.jpg",
    alt: "Yolanda and her partner at the Parthenon in Athens, Greece",
    span: "col-span-1",
  },
  {
    name: "Alaska Glaciers",
    image: "/images/dest-alaska-glaciers.jpg",
    alt: "Stunning glacial waters and snow-capped mountains in Alaska",
    span: "col-span-1",
  },
  {
    name: "Bahamas",
    image: "/images/dest-bahamas.jpg",
    alt: "Welcome sign at a Bahamas cruise port",
    span: "col-span-1",
  },
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
              className={`${d.span} rounded-2xl overflow-hidden relative group hover:shadow-lg transition-all duration-300`}
            >
              <Image
                src={d.image}
                alt={d.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-md">
                {d.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
