"use client";

import { motion } from "framer-motion";
import { Award, MapPin, Users, Calendar, Ship } from "lucide-react";

const credentials = [
  {
    icon: Calendar,
    stat: "20+",
    label: "Years",
    title: "Seasoned Expertise",
    description:
      "Two decades of navigating cruise lines, negotiating upgrades, and building relationships that benefit my clients.",
  },
  {
    icon: Award,
    stat: "6",
    label: "Lines",
    title: "Certified Specialist",
    description:
      "Official certifications from Royal Caribbean, Carnival, Norwegian, Celebrity, Disney, and Viking.",
  },
  {
    icon: Users,
    stat: "500+",
    label: "Travelers",
    title: "Families & Groups",
    description:
      "From intimate getaways to 40-person family reunions — I coordinate every cabin, every detail.",
  },
  {
    icon: MapPin,
    stat: "30+",
    label: "Destinations",
    title: "Global Waters",
    description:
      "Caribbean, Alaska, Mediterranean, Northern Europe, river cruises — I've sailed them and I know them.",
  },
];

export const Credentials = () => {
  return (
    <section className="relative bg-[#1e3a8a] py-20 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              {/* Stat highlight */}
              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-bold text-[#059669] leading-none">
                  {item.stat}
                </span>
                <span className="text-sm font-medium text-blue-200/60 pb-0.5">
                  {item.label}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-blue-100/50 leading-relaxed">
                {item.description}
              </p>

              {/* Icon accent */}
              <div className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors">
                <item.icon size={32} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
