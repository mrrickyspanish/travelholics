"use client";

import { motion } from "framer-motion";
import { Award, MapPin, Users, Calendar } from "lucide-react";

const credentials = [
  {
    icon: Calendar,
    title: "20+ Years Experience",
    description: "Expert cruise planning and travel advisory services since 2004."
  },
  {
    icon: Award,
    title: "Certified Specialist",
    description: "Official certifications from Royal Caribbean, Carnival, and more."
  },
  {
    icon: Users,
    title: "Family & Groups",
    description: "Specializing in large family reunions and corporate group travel."
  },
  {
    icon: MapPin,
    title: "Global Destinations",
    description: "Expertise in Caribbean, Alaska, Europe, and Mediterranean sailings."
  }
];

export const Credentials = () => {
  return (
    <section className="bg-white py-16 border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {credentials.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center md:items-start text-center md:text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-4 group-hover:bg-[#059669] group-hover:text-white transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
