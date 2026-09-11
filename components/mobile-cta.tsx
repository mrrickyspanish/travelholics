"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const MobileCTA = () => {
  const [pastHero, setPastHero] = useState(false);
  const [nearContact, setNearContact] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.getElementById("contact");
    const observer = contact
      ? new IntersectionObserver(([entry]) => setNearContact(entry.isIntersecting), { rootMargin: "180px 0px 0px" })
      : null;
    if (contact && observer) observer.observe(contact);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  const visible = pastHero && !nearContact;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? false : { y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: 70, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <button
            onClick={scrollToContact}
            className="mx-auto flex min-h-13 w-full max-w-md items-center justify-between rounded-full border border-white/18 bg-[#082d27]/96 px-5 py-3.5 text-left text-white shadow-[0_18px_45px_rgba(7,31,27,0.28)] backdrop-blur-xl"
          >
            <span>
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-coral">Ready when you are</span>
              <span className="mt-0.5 block text-sm font-bold">Plan my next cruise</span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white">
              <ArrowUpRight size={17} />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
