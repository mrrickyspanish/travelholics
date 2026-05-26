"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Trips", href: "/#group-trips" },
  { label: "Shop", href: "/shop" },
  { label: "Journal", href: "/collaborate" },
  { label: "Story", href: "/#about" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
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
        className="sticky top-0 inset-x-0 z-50 bg-[#FAF9F6]"
        style={isScrolled ? { borderBottom: "0.5px solid rgba(26,46,42,0.16)" } : undefined}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Mobile left cluster: hamburger + logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-sand transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={20} className="text-ink" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none rounded-lg">
              <Image
                src="/images/travelholics_logo_circular.png"
                alt="Travelholics"
                width={34}
                height={34}
                className="rounded-full"
              />
              <span className="font-bold text-ink text-[17px] hidden sm:block">Travelholics</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative px-4 py-2 text-sm font-medium text-ink/80 rounded-lg min-h-12 flex items-center focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
              >
                <span>{link.label}</span>
                <span className="pointer-events-none absolute left-4 right-4 -bottom-[1px] h-[1.5px] bg-coral scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>
            ))}
          </nav>

          {/* CTA cluster */}
          <div className="flex items-center gap-2.5">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center bg-coral hover:bg-coral-deep text-white font-semibold text-sm px-4 sm:px-5 py-2.5 rounded-full transition-colors min-h-10 focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
            >
              Join the Crew
            </a>
            <a
              href="/#contact"
              className="hidden lg:inline-flex items-center gap-1.5 border border-ink/20 bg-transparent text-ink font-medium text-sm px-4 py-2.5 rounded-full min-h-10 hover:border-coral/60 transition-colors group focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
            >
              <span>Plan a Trip</span>
              <span className="inline-block text-[12px] translate-x-0 group-hover:translate-x-[2px] transition-transform duration-200" aria-hidden="true">↗</span>
            </a>
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
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-[#FAF9F6] flex flex-col shadow-2xl lg:hidden"
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
                  className="flex items-center justify-center gap-2 w-full border border-ink/20 bg-transparent text-ink font-medium py-3.5 rounded-full transition-colors group"
                >
                  <span>Plan a Trip</span>
                  <span className="inline-block text-[12px] translate-x-0 group-hover:translate-x-[2px] transition-transform duration-200" aria-hidden="true">↗</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
