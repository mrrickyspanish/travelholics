"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Anchor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Group Trips", href: "/#group-trips" },
  { label: "Travel Picks", href: "/shop" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none rounded-lg">
            <Image
              src="/images/travelholics_logo_circular.png"
              alt="Travelholics"
              width={38}
              height={38}
              className="rounded-full"
            />
            <span className="font-bold text-ink text-[17px] hidden sm:block">Travelholics</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-ink/75 hover:text-emerald-deep rounded-lg transition-colors min-h-12 flex items-center focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="/#contact"
              className="hidden sm:inline-flex items-center gap-2 bg-coral hover:bg-coral-deep text-white font-bold text-sm px-5 py-2.5 rounded-full transition-colors min-h-11 focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none shadow-sm"
            >
              <Anchor size={15} />
              Plan My Cruise
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-sand transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} className="text-ink" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white flex flex-col shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-blush">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <Image
                    src="/images/travelholics_logo_circular.png"
                    alt="Travelholics"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-bold text-ink">Travelholics</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-sand transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={20} className="text-ink" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-ink/80 hover:text-emerald-deep hover:bg-sand rounded-xl transition-colors min-h-12"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="p-6 border-t border-blush">
                <a
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-coral hover:bg-coral-deep text-white font-bold py-3.5 rounded-full transition-colors"
                >
                  <Anchor size={16} />
                  Plan My Cruise
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
