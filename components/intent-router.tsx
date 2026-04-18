"use client";

import { motion } from "framer-motion";
import { Ship, ShoppingBag, Handshake, ArrowRight } from "lucide-react";

const cards = [
  {
    title: "Plan Your Cruise",
    description:
      "Work directly with Yolanda for cruise planning, group trips, and stress-free travel support.",
    href: "#contact",
    icon: Ship,
    accent: "from-[#1e3a8a] to-[#2563eb]",
    action: "Book travel help",
  },
  {
    title: "Shop Yolanda's Picks",
    description:
      "Browse the products and cruise essentials Yolanda talks about during TikTok Lives.",
    href: "/shop",
    icon: ShoppingBag,
    accent: "from-[#059669] to-[#10b981]",
    action: "Shop favorites",
  },
  {
    title: "Collaborate With Travelholics",
    description:
      "Explore partnerships for brands, destinations, hospitality, and travel-related campaigns.",
    href: "/collaborate",
    icon: Handshake,
    accent: "from-[#0f766e] to-[#14b8a6]",
    action: "Start a collaboration",
  },
];

export const IntentRouter = () => {
  const handleClick = (href: string) => {
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white py-16 lg:py-20 border-y border-slate-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">
            Choose your next move
          </p>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1e3a8a] leading-tight mb-4">
            Travel help, trusted picks, and partnership opportunities.
          </h2>
          <p className="text-slate-500 text-base lg:text-lg leading-relaxed">
            Travelholics is built to help you book smarter, pack better, and work with a voice travelers already trust.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.title}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                onClick={() => handleClick(card.href)}
                className="group text-left bg-[#FAF9F6] hover:bg-white border border-slate-200 rounded-3xl p-6 lg:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} text-white flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-3 leading-snug">
                  {card.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6 min-h-[72px]">
                  {card.description}
                </p>
                <span className="inline-flex items-center gap-2 text-[#059669] font-bold text-sm">
                  {card.action}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
