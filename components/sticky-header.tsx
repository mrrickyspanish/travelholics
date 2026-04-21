"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Mail, Menu, Search, X, Youtube } from "lucide-react";
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
        <div className="w-full border-b border-slate-200/60 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex h-11 items-center gap-3">
              <div className="hidden items-center gap-2 sm:flex">
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
              </div>

              <a
                href="mailto:yo@travelholics.com"
                aria-label="Email Travelholics"
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-[#1e3a8a]"
              >
                <Mail size={15} />
              </a>

              <div className="ml-auto flex w-full max-w-[320px] items-center rounded-full border border-slate-200 bg-white px-3 py-1.5">
                <Search size={14} className="text-slate-400" />
                <input
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="w-full bg-transparent px-2 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          <div
            className={`hidden items-center justify-center overflow-hidden transition-all duration-300 lg:flex ${
              scrolled
                ? "max-h-0 py-0 opacity-0 pointer-events-none"
                : "max-h-[220px] py-3 opacity-100"
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
                className="h-28 w-auto object-contain"
                priority
              />
            </a>
          </div>

          <div className="relative hidden lg:block">
            {!scrolled && (
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
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
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
