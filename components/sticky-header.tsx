"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Mail, Menu, X, Youtube } from "lucide-react";
import Image from "next/image";
import { RippleButton } from "@/components/ripple-button";

const navLinks = [
  { label: "About Yolanda", href: "#about" },
  { label: "What Travelers Say", href: "#testimonials" },
  { label: "How It Works", href: "#process" },
  { label: "Shop", href: "/shop" },
];

export const StickyHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? y / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => {
    setMobileOpen(false);
    if (window.location.pathname !== "/") {
      window.location.href = "/#contact";
      return;
    }
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    if (href.startsWith("#") && window.location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 relative transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
            : "bg-[#FFFDF8]"
        }`}
      >
        {/* Scroll progress wave bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] z-10 bg-slate-100/50">
          <div
            className="h-full wave-progress transition-none"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Social bar */}
        <div className="w-full border-b border-slate-200/60 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex h-11 items-center gap-3">
              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-[#1e3a8a]"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-[#1e3a8a]"
                >
                  <Facebook size={15} />
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-[#1e3a8a]"
                >
                  <Youtube size={15} />
                </a>
                <a
                  href="mailto:yo@travelholics.com"
                  aria-label="Email Travelholics"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-[#1e3a8a]"
                >
                  <Mail size={15} />
                </a>
              </div>
              <div className="ml-auto">
                <a
                  href="https://www.tiktok.com/@rjsmom1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-500 hover:text-[#1e3a8a] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
                  </svg>
                  <span className="text-xs font-semibold">@rjsmom1</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Wordmark — collapses on scroll */}
          <div
            className={`hidden items-center justify-center overflow-hidden transition-all duration-300 lg:flex ${
              scrolled
                ? "max-h-0 py-0 opacity-0 pointer-events-none"
                : "max-h-[198px] py-2.5 opacity-100 border-b border-[#d6cec2]/60"
            }`}
          >
            <a
              href="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="inline-flex items-center"
            >
              <Image
                src="/images/travelholics_logo_wordmark.svg"
                alt="Travelholics"
                width={900}
                height={240}
                className="h-[6.3rem] w-auto object-contain"
                priority
              />
            </a>
          </div>

          {/* Desktop nav */}
          <nav
            className={`hidden lg:grid grid-cols-5 items-center gap-4 transition-all duration-300 ${
              scrolled ? "py-2" : "pt-4 pb-2.5"
            }`}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-center text-sm font-semibold text-slate-500 transition-colors hover:text-[#1e3a8a]"
              >
                {link.label}
              </button>
            ))}
            <RippleButton
              onClick={scrollToContact}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Plan My Cruise
            </RippleButton>
          </nav>

          {/* Mobile header row */}
          <div
            className={`flex items-center justify-between transition-all duration-300 lg:hidden ${
              scrolled ? "h-[52px]" : "h-[58px]"
            }`}
          >
            <a href="/" className="inline-flex items-center">
              <Image
                src="/images/travelholics_logo_wordmark.svg"
                alt="Travelholics"
                width={260}
                height={70}
                className="h-8 w-auto object-contain"
                priority
              />
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={22} className="text-[#1e3a8a]" />
              ) : (
                <Menu size={22} className="text-[#1e3a8a]" />
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
            className="fixed inset-x-0 z-40 border-b border-slate-100 bg-white shadow-xl lg:hidden"
            style={{ top: scrolled ? "96px" : "102px" }}
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
              <RippleButton
                onClick={scrollToContact}
                className="mt-3 w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl text-[15px] transition-all"
              >
                Plan My Cruise
              </RippleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
