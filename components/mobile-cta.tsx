"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ship, ShoppingBag, Handshake } from "lucide-react";

export const MobileCTA = ({ community = false }: { community?: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!community) return;
    const section = document.getElementById("crew");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setJoining(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect();
  }, [community]);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && !joining && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 z-50 lg:hidden"
        >
          <div className="h-4 bg-gradient-to-t from-white to-transparent" />
          <div className="bg-white border-t border-slate-100 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            {community ? <div className="flex items-center gap-3"><a href="#crew" className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-coral px-5 text-base font-bold text-ink">Join the Crew</a><a href="#contact" className="inline-flex min-h-12 items-center px-3 text-sm font-semibold text-ink">Plan a cruise</a></div> : <div className="grid grid-cols-3 gap-2">
              <button
                onClick={scrollToContact}
                className="min-h-12 bg-coral hover:bg-coral-deep text-white font-bold py-3 rounded-xl shadow-lg shadow-coral/20 flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98] text-sm"
              >
                <Ship size={16} />
                Plan
              </button>
              <a
                href="/shop"
                className="min-h-12 bg-emerald-mid hover:bg-emerald-deep text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-deep/20 flex flex-col items-center justify-center gap-1 transition-all text-sm"
              >
                <ShoppingBag size={16} />
                Shop
              </a>
              <a
                href="/collaborate"
                className="min-h-12 bg-navy hover:bg-ink text-white font-bold py-3 rounded-xl shadow-lg shadow-navy/20 flex flex-col items-center justify-center gap-1 transition-all text-sm"
              >
                <Handshake size={16} />
                Collab
              </a>
            </div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
