"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MotionLink = motion(Link);

const menuLinks = [
  { label: "Plan a Trip", href: "/#contact" },
  { label: "Join the Crew", href: "/#contact" },
  { label: "Shop", href: "/shop" },
  { label: "Journal", href: "/collaborate" },
  { label: "Our Story", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Email", href: "mailto:hello@travelholics.com" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`sticky top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled || menuOpen ? "bg-[#fcfaf5]/95 backdrop-blur border-b border-navy/10" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="justify-self-start">
            <button type="button" onClick={() => setMenuOpen(true)} className="inline-flex items-center gap-2 text-navy hover:text-coral transition-colors tracking-[0.12em] uppercase text-sm font-semibold focus-visible:ring-2 focus-visible:ring-coral rounded-md px-2 py-2" aria-label="Open navigation menu" aria-expanded={menuOpen}>
              <Menu size={18} />
              <span>Menu</span>
            </button>
          </div>

          <Link href="/" className="justify-self-center flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-coral rounded-md px-2 py-1">
            <Image src="/images/travelholics_logo_circular.png" alt="Travelholics" width={34} height={34} className="rounded-full" />
            <span className="font-serif text-xl md:text-2xl text-navy">Travelholics</span>
          </Link>

          <div className="justify-self-end flex items-center gap-2">
            <Link href="/#contact" className="hidden md:inline-flex items-center justify-center border border-navy/35 text-navy font-medium text-sm px-4 py-2.5 rounded-full hover:border-coral hover:text-coral transition-colors">
              Plan a Trip
            </Link>
            <Link href="/#contact" className="inline-flex items-center justify-center bg-coral hover:bg-coral-deep text-white font-semibold text-sm px-4 md:px-5 py-2.5 rounded-full transition-colors">
              Join the Crew
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} role="dialog" aria-modal="true" aria-label="Navigation menu" className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-navy/90 md:bg-navy/95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2d4d68_0%,transparent_48%)]" />

            <div className="relative h-full text-cream">
              <div className="h-20 px-5 md:px-8 grid grid-cols-[1fr_auto_1fr] items-center border-b border-cream/20">
                <button type="button" onClick={() => setMenuOpen(false)} className="justify-self-start tracking-[0.12em] uppercase text-sm font-semibold hover:text-coral transition-colors">
                  Close
                </button>

                <Link href="/" onClick={() => setMenuOpen(false)} className="justify-self-center flex items-center gap-2.5">
                  <Image src="/images/travelholics_logo_circular.png" alt="Travelholics" width={32} height={32} className="rounded-full" />
                  <span className="font-serif text-xl md:text-2xl text-cream">Travelholics</span>
                </Link>

                <Link href="/#contact" onClick={() => setMenuOpen(false)} className="justify-self-end inline-flex items-center justify-center bg-coral hover:bg-coral-deep text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-colors">
                  Join the Crew
                </Link>
              </div>

              <div className="max-w-7xl mx-auto h-[calc(100%-5rem)] px-5 md:px-8 py-8 md:py-12 flex flex-col justify-between">
                <nav className="space-y-2 md:space-y-4" aria-label="Full-screen navigation">
                  {menuLinks.map((link, index) => (
                    <MotionLink key={link.label} href={link.href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index, duration: 0.3 }} className="block font-serif text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-tight text-cream hover:text-coral transition-colors">
                      {link.label}
                    </MotionLink>
                  ))}
                </nav>

                <div className="pt-6 border-t border-cream/15 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <p className="text-cream/80 max-w-xl">Cruise planning, group sailings, and travel lifestyle.</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-cream/80">
                    {socialLinks.map((link) => (
                      <a key={link.label} href={link.href} className="hover:text-coral transition-colors" target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
