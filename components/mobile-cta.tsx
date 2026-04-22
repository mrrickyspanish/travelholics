"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ship, ShoppingBag, Handshake } from "lucide-react";

export const MobileCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 z-50 lg:hidden"
        >
          <div className="h-4 bg-gradient-to-t from-white to-transparent" />
          <div className="bg-white border-t border-slate-100 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={scrollToContact}
                className="bg-[#059669] hover:bg-[#047857] text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/20 flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98] text-sm"
              >
                <Ship size={16} />
                Plan
              </button>
              <a
                href="/shop"
                className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 flex flex-col items-center justify-center gap-1 transition-all text-sm"
              >
                <ShoppingBag size={16} />
                Shop
              </a>
              <a
                href="/collaborate"
                className="bg-[#0f766e] hover:bg-[#0d5f58] text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-900/20 flex flex-col items-center justify-center gap-1 transition-all text-sm"
              >
                <Handshake size={16} />
                Collab
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};