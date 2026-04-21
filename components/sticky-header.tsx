"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Mail, Menu, X, Youtube } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Travel Services", href: "#contact" },
  { label: "Shop", href: "/shop" },
  { label: "Collaborate", href: "/collaborate" },
  { label: "About Yolanda", href: "#about" },
];

export const StickyHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => {
    setMobileOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
            : "bg-[#FAF9F6]/88"
        }`}
      >
        {/* Top utility bar — social icons only */}
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

        <div
          className={`mx-auto max-w-7xl px-6 lg:px-10 ${
            scrolled ? "" : "bg-[#FFFDF8]"
          }`}
        >
          {/* Wordmark — hides on scroll */}
          <div
            className={`hidden items-center justify-center overflow-hidden transition-all duration-300 lg:flex ${
              scrolled
                ? "max-h-0 py-0 opacity-0 pointer-events-none"
                : "max-h-[198px] py-2.5 opacity-100"
            }`}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
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
          <div className="relative hidden lg:block">
            {!scrolled && (
              <>
                <svg
                  viewBox="0 0 1440 22"
                  className="absolute inset-x-0 top-0 h-3.5 w-full"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 11C80 11 80 5 160 5C240 5 240 17 320 17C400 17 400 7 480 7C560 7 560 18 640 18C720 18 720 8 800 8C880 8 880 17 960 17C1040 17 1040 7 1120 7C1200 7 1200 15 1280 15C1360 15 1360 9 1440 9"
                    stroke="#d6cec2"
                    strokeWidth="1.5"
                  />
                </svg>
                <svg
                  viewBox="0 0 120 60"
                  className="pointer-events-none absolute right-4 top-0 h-4 w-9"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 46Q18 44 30 46Q42 48 54 46"
                    stroke="#c9b79a"
                    strokeWidth="1"
                    opacity="0.55"
                  />
                  <path d="M24 40L28 47H44L48 40Z" fill="#1e3a8a" opacity="0.9" />
                  <rect x="29" y="36" width="14" height="4" rx="0.8" fill="#059669" opacity="0.9" />
                  <line x1="41" y1="36" x2="41" y2="29" stroke="#1e3a8a" strokeWidth="0.8" />
                  <path d="M41 29L46 31L41 33Z" fill="#f59e0b" opacity="0.9" />
                </svg>
              </>
            )}
            <nav
              className={`grid grid-cols-5 items-center gap-4 transition-all duration-300 ${
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
              <button
                onClick={scrollToContact}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Plan My Cruise
              </button>
            </nav>
          </div>

          {/* Mobile header row */}
          <div
            className={`flex items-center justify-between transition-all duration-300 lg:hidden ${
              scrolled ? "h-[52px]" : "h-[58px]"
            }`}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center"
            >
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
            className={`fixed inset-x-0 z-40 border-b border-slate-100 bg-white shadow-xl lg:hidden ${
              scrolled ? "top-[96px]" : "top-[102px]"
            }`}
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
                Plan My Cruise
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};