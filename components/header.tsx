"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useLiveStatus } from "@/hooks/useLiveStatus";
import { TIKTOK_LIVE_URL, TIKTOK_PROFILE_URL } from "@/lib/liveSchedule";

const NAV_LINKS = [
  { label: "Join the Crew", href: "/#contact" },
  { label: "Cruises", href: "/cruises/caribbean" },
  { label: "Live", href: "/live" },
  { label: "Shop", href: "/shop" },
  { label: "Journal", href: "/blog" },
  { label: "Our Story", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const SOCIAL_LINKS = [
  { label: "TikTok", href: "https://www.tiktok.com/@rjsmom1" },
  { label: "Instagram", href: "https://www.instagram.com/rjsmom1/" },
];

function PulsingDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 shrink-0 ${className}`} aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 motion-safe:animate-ping" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
    </span>
  );
}

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAlt, setShowAlt] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const liveStatus = useLiveStatus();

  const isLive = liveStatus?.state === "live";
  const isSoon = liveStatus?.state === "soon";
  const isActive = isLive || isSoon;
  const liveHref = isLive ? TIKTOK_LIVE_URL : TIKTOK_PROFILE_URL;

  // Cycle CTA copy between show name and "Watch live →" every 3s
  useEffect(() => {
    if (!isLive) { setShowAlt(false); return; }
    const id = setInterval(() => setShowAlt((v) => !v), 3000);
    return () => clearInterval(id);
  }, [isLive]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isShopFull = pathname === "/shop-full";
  const navSolid = isShopFull || isScrolled || menuOpen;

  // Background: live state overrides scroll state
  const navBg = isLive
    ? "bg-coral shadow-md"
    : isSoon
    ? "bg-ink shadow-md"
    : navSolid
    ? (isShopFull ? "bg-white shadow-sm" : "bg-cream/98 shadow-sm")
    : "bg-transparent";

  // Logo: white version on live/soon (coral/ink bg), default otherwise
  const logoSrc = isActive
    ? "/images/Traveholic_logo_wordmark_white.png"
    : "/images/traveholics%20logos%20(1200%20x%20300%20px).svg";

  // MENU button + icon tints
  const menuBtnHover = isActive ? "hover:bg-white/15" : "hover:bg-sand";
  const menuTextColor = isActive ? "text-white" : "";
  const iconColor = isActive ? "text-white" : "";

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between gap-6 transition-all duration-300 ${navSolid || isActive ? "h-14 py-1" : "h-20 py-0"}`}>

          {/* ── Mobile ─────────────────────────────────────────── */}
          <div className="flex w-full items-center justify-between sm:hidden">
            <Link href="/" className="flex items-center focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none rounded-lg">
              <Image
                src={logoSrc}
                alt="Travelholics"
                width={220}
                height={40}
                className={`${isActive ? "h-[38px]" : navSolid ? "h-[28px]" : "h-[40px]"} w-auto transition-all duration-300`}
                priority
              />
            </Link>

            <div className="flex items-center gap-1 ml-auto">
              {/* Live pill replaces cart icon on mobile when active */}
              {isActive ? (
                <a
                  href={liveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isLive ? "Watch live on TikTok" : `Going live in ${liveStatus?.minutesUntilNext} minutes`}
                  className="flex h-10 items-center gap-2 rounded-full bg-white/20 px-4 text-[0.7rem] font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <PulsingDot />
                  {isLive ? "Live" : `${liveStatus?.minutesUntilNext}m`}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={openDrawer}
                  aria-label={`Open cart${count > 0 ? `, ${count} item${count !== 1 ? "s" : ""}` : ""}`}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none ${menuBtnHover} ${iconColor}`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {count > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-[0.6rem] font-black text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={`w-auto h-12 flex items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none text-lg font-bold tracking-wide px-5 py-2 ${menuBtnHover} ${menuTextColor}`}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
              >
                <span className="font-serif text-[1.1rem] tracking-wide">MENU</span>
              </button>
            </div>
          </div>

          {/* ── Desktop ─────────────────────────────────────────── */}
          <div className="hidden sm:flex w-full items-center justify-between">
            <div className="flex items-center gap-2.5 shrink-0 mr-4">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none ${menuBtnHover} ${menuTextColor}`}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
              >
                <span className="hidden sm:inline font-serif text-[1.1rem] tracking-wide">MENU</span>
              </button>
            </div>

            <Link href="/" className="flex items-center justify-center focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none rounded-lg">
              <Image
                src={logoSrc}
                alt="Travelholics"
                width={220}
                height={40}
                className={`${navSolid ? "h-[28px] sm:h-[38px]" : isActive ? "h-[40px] sm:h-[52px]" : "h-[40px] sm:h-[60px]"} w-auto transition-all duration-300`}
                priority
              />
            </Link>

            <div className="flex items-center gap-3">
              {/* Cart icon — always visible on desktop */}
              <button
                type="button"
                onClick={openDrawer}
                aria-label={`Open cart${count > 0 ? `, ${count} item${count !== 1 ? "s" : ""}` : ""}`}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none ${menuBtnHover} ${iconColor}`}
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-[0.6rem] font-black text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              {/* CTA: live state swaps "Join the Crew" */}
              {isActive ? (
                <a
                  href={liveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isLive ? "Watch live on TikTok" : `Going live in ${liveStatus?.minutesUntilNext} minutes`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 min-w-[148px] justify-center"
                >
                  <PulsingDot />
                  <AnimatePresence mode="wait" initial={false}>
                    {isLive ? (
                      <motion.span
                        key={showAlt ? "alt" : "main"}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.25 }}
                        className="whitespace-nowrap"
                      >
                        {showAlt ? "Watch live →" : (liveStatus?.show?.name ?? "Live now")}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="soon"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.25 }}
                        className="whitespace-nowrap"
                      >
                        Live in {liveStatus?.minutesUntilNext}m →
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              ) : (
                <a
                  href="/#contact"
                  className="font-serif text-[1.1rem] tracking-wide font-bold text-royal-deep hover:underline hover:text-coral transition-colors duration-200 hidden sm:inline-block"
                >
                  Join the Crew
                </a>
              )}
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
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-cream hover:text-coral font-serif text-lg focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
                aria-label="Close menu"
              >
                <X size={28} />
                <span className="hidden sm:inline">CLOSE</span>
              </button>
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
              <a href="/#contact" className="px-6 py-3 text-base font-semibold text-cream/80 hover:text-coral focus-visible:underline focus-visible:outline-none transition-colors">
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
