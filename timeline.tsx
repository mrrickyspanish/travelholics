"use client";

import { motion } from "framer-motion";
import { Mail, PhoneCall, CalendarCheck, Ship } from "lucide-react";

const steps = [
  {
    icon: Mail,
    title: "Step 1: Inquire",
    description: "Fill out the form above with your basic travel details and preferences."
  },
  {
    icon: PhoneCall,
    title: "Step 2: Connect",
    description: "I'll reach out via email or phone for a quick 15-minute consultation."
  },
  {
    icon: CalendarCheck,
    title: "Step 3: Plan",
    description: "I'll present 2-3 tailored itineraries designed specifically for your group."
  },
  {
    icon: Ship,
    title: "Step 4: Voyage",
    description: "Once booked, I'll handle all the logistics so you can simply pack and sail!"
  }
];

export const Timeline = () => {
  return (
    <section className="bg-[#FAF9F6] py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">What Happens Next?</h2>
          <p className="text-lg text-slate-500">From first inquiry to your final destination, here's how we work together.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 hidden md:block -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-[#059669] text-white flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/20 border-4 border-white">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold px-10 py-4 rounded-xl shadow-xl transition-all"
          >
            Ready to Start Planning?
          </button>
        </div>
      </div>
    </section>
  );
};
