"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ship } from "lucide-react";

export const MobileCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past ~80% of the viewport (past hero)
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
          {/* Gradient fade so content doesn't hard-clip */}
          <div className="h-4 bg-gradient-to-t from-white to-transparent" />
          <div className="bg-white border-t border-slate-100 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <button
              onClick={scrollToContact}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-[15px]"
            >
              Plan My Trip <Ship size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
