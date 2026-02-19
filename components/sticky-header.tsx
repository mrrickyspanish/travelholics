"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Menu, X } from "lucide-react";

const navLinks = [
  { label: "About Yolanda", href: "#about" },
  { label: "What Travelers Say", href: "#testimonials" },
  { label: "How It Works", href: "#process" },
];

export const StickyHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => {
    setMobileOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5"
            >
              {/*
                REPLACE with finalized logo:
                <Image src="/images/travelholics-logo.png" alt="Travelholics"
                  width={130} height={28} />
              */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  scrolled ? "bg-[#059669]" : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                <Anchor
                  size={16}
                  className={scrolled ? "text-white" : "text-white"}
                />
              </div>
              <span
                className={`text-[15px] font-extrabold transition-colors ${
                  scrolled ? "text-[#1e3a8a]" : "text-[#1e3a8a]"
                }`}
              >
                Travelholics
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-semibold transition-colors ${
                    scrolled
                      ? "text-slate-500 hover:text-[#1e3a8a]"
                      : "text-slate-500 hover:text-[#1e3a8a]"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={scrollToContact}
                className="bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Plan My Trip
              </button>
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={22} className="text-[#1e3a8a]" />
              ) : (
                <Menu
                  size={22}
                  className={scrolled ? "text-[#1e3a8a]" : "text-[#1e3a8a]"}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-100 shadow-xl lg:hidden"
          >
            <div className="container mx-auto px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-[15px] font-semibold text-slate-600 hover:text-[#1e3a8a] py-3 border-b border-slate-50 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={scrollToContact}
                className="mt-3 w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl text-[15px] transition-all"
              >
                Plan My Trip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
