"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/button";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Join the Crew", href: "/#contact" },
  { label: "Cruises", href: "/cruises/caribbean" },
  { label: "Live", href: "/live" },
  { label: "Shop", href: "/shop" },
  { label: "Journal", href: "/collaborate" },
  { label: "Our Story", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const SOCIAL_LINKS = [
  { label: "TikTok", href: "https://www.tiktok.com/@rjsmom1" },
  { label: "Instagram", href: "https://www.instagram.com/rjsmom1/" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { count, openDrawer } = useCart();

  // Scroll/solid background logic
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC close and focus trap
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a,button,[tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Lock scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Color swap for logo and nav
  // Solid white background only on /shop-full
  const isShopFull = pathname === "/shop-full";
  const navSolid = isShopFull || isScrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navSolid ? (isShopFull ? "bg-white shadow-sm" : "bg-cream/98 shadow-sm") : "bg-transparent"}`}
        style={{ color: navSolid ? "#0E125C" : "#0E125C" }}
      >
        <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between gap-6 transition-all duration-300 ${navSolid ? 'h-14 py-1' : 'h-20 py-0'}`}>
          {/* Mobile: left logo, right MENU */}
          <div className="flex w-full items-center justify-between sm:hidden">
            <Link href="/" className="flex items-center focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none rounded-lg transition-all duration-300">
              <Image
                src="/images/traveholics%20logos%20(1200%20x%20300%20px).svg"
                alt="Travelholics"
                width={220}
                height={40}
                className={`${navSolid ? 'h-[28px] sm:h-[38px]' : 'h-[40px] sm:h-[60px]'} w-auto transition-all duration-300`}
                priority
              />
            </Link>
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={openDrawer}
                aria-label={`Open cart${count > 0 ? `, ${count} item${count !== 1 ? "s" : ""}` : ""}`}
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-sand transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-[0.6rem] font-black text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="w-auto h-12 flex items-center justify-center rounded-full hover:bg-sand transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none text-lg font-bold tracking-wide px-5 py-2"
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
              >
                <span className="font-serif text-[1.1rem] tracking-wide">MENU</span>
              </button>
            </div>
          </div>
          {/* Desktop: left MENU, center logo, right CTA */}
          <div className="hidden sm:flex w-full items-center justify-between">
            <div className="flex items-center gap-2.5 shrink-0 mr-4">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-sand transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none text-lg font-bold tracking-wide"
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
              >
                <span className="hidden sm:inline font-serif text-[1.1rem] tracking-wide">MENU</span>
              </button>
            </div>
            <Link href="/" className="flex items-center justify-center focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none rounded-lg transition-all duration-300">
              <Image
                src="/images/traveholics%20logos%20(1200%20x%20300%20px).svg"
                alt="Travelholics"
                width={220}
                height={40}
                className={`${navSolid ? 'h-[28px] sm:h-[38px]' : 'h-[40px] sm:h-[60px]'} w-auto transition-all duration-300`}
                priority
              />
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openDrawer}
                aria-label={`Open cart${count > 0 ? `, ${count} item${count !== 1 ? "s" : ""}` : ""}`}
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-sand transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-[0.6rem] font-black text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
              <a
                href="/#contact"
                className="font-serif text-[1.1rem] tracking-wide font-bold text-royal-deep hover:underline hover:text-coral transition-colors duration-200 hidden sm:inline-block"
              >
                Join the Crew
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] flex flex-col bg-navy text-cream"
            style={{ background: "#0E125C" }}
            ref={menuRef}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="flex items-center justify-between px-8 pt-8 pb-2">
              {/* Close */}
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-cream hover:text-coral font-serif text-lg focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
                aria-label="Close menu"
              >
                <X size={28} />
                <span className="hidden sm:inline">CLOSE</span>
              </button>
              {/* Center logo - larger */}
              <Link href="/" className="flex items-center justify-center" tabIndex={menuOpen ? 0 : -1}>
                <Image
                  src="/images/traveholics%20logos%20(1200%20x%20300%20px).svg"
                  alt="Travelholics"
                  width={220}
                  height={60}
                  className="h-[60px] w-auto"
                  priority
                />
              </Link>
              {/* CTA - emerald */}
              <a href="/#contact" className="px-6 py-3 text-base font-semibold text-royal-deep hover:text-emerald-dark focus-visible:underline focus-visible:outline-none transition-colors">
                Join the Crew
              </a>
            </div>
            <nav className="flex-1 flex flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight hover:text-coral focus-visible:text-coral transition-colors duration-150 py-2 px-4 rounded focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col items-center gap-2 pb-10">
              <div className="flex gap-4 mb-2">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/80 hover:text-coral text-lg focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
                    tabIndex={menuOpen ? 0 : -1}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <span className="text-xs text-cream/60">© {new Date().getFullYear()} Travelholics</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

