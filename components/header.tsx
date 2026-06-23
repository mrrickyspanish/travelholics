"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useLiveStatus } from "@/hooks/useLiveStatus";
import { TIKTOK_LIVE_URL, TIKTOK_PROFILE_URL } from "@/lib/liveSchedule";

type NavItem = {
  label: string;
  href: string;
  liveIndicator?: boolean;
};

const DESKTOP_NAV: NavItem[] = [
  { label: "Cruises", href: "/cruises/caribbean" },
  { label: "Live", href: "/live", liveIndicator: true },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Our Story", href: "/#about" },
];

const MOBILE_NAV: NavItem[] = [
  { label: "Cruises", href: "/cruises/caribbean" },
  { label: "Live", href: "/live" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Our Story", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

function PulsingDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 shrink-0 ${className}`} aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-70 motion-safe:animate-ping" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
    </span>
  );
}

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAlt, setShowAlt] = useState(false);
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const liveStatus = useLiveStatus();

  const isHome = pathname === "/";
  const isHeroArrival = isHome && !isScrolled && !menuOpen;
  const isLive = liveStatus?.state === "live";
  const isSoon = liveStatus?.state === "soon";
  const isActive = isLive || isSoon;
  const liveHref = isLive ? TIKTOK_LIVE_URL : TIKTOK_PROFILE_URL;

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => setShowAlt((v) => !v), 3000);
    return () => clearInterval(id);
  }, [isLive]);

  useEffect(() => {
    const onScroll = () => {
      const threshold = pathname === "/" ? Math.max(window.innerHeight * 0.82, 520) : 40;
      setIsScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isShopFull = pathname === "/shop-full";
  const solidBg = isScrolled || isShopFull || menuOpen;
  const navBg = isHeroArrival
    ? "bg-transparent"
    : isLive
    ? "bg-coral shadow-sm"
    : isSoon
    ? "bg-ink shadow-sm"
    : solidBg
    ? (isShopFull ? "bg-white shadow-sm" : "bg-cream/96 backdrop-blur-sm shadow-sm")
    : "bg-transparent";
  const onDark = isActive || isHeroArrival;
  const linkBase = "text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-150";
  const linkColor = onDark ? "text-white/88 hover:text-white hover:bg-white/10" : "text-ink/70 hover:text-ink hover:bg-sand";
  const linkActive = onDark ? "text-white font-semibold" : "text-ink font-semibold";
  const iconBtn = `relative flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${onDark ? "hover:bg-white/15 text-white" : "hover:bg-sand text-ink"}`;

  return (
    <>
      <header className={`fixed ${isHeroArrival ? "top-3 sm:top-4 lg:top-5" : "top-0"} inset-x-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className={`${isHeroArrival ? "mx-auto grid h-12 max-w-[calc(100%-1.5rem)] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 sm:h-16 sm:max-w-[calc(100%-2rem)] sm:gap-4 sm:px-4 lg:max-w-[calc(100%-2.5rem)]" : "max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-[auto_1fr_auto] items-center h-16 gap-4"}`}>
          {!isHeroArrival && (
            <Link href="/" className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded-md">
              <Image src="/images/traveholics%20logos%20(1200%20x%20300%20px).svg" alt="Travelholics" width={180} height={44} className={`h-9 lg:h-[54px] w-auto transition-all duration-300 ${onDark ? "brightness-0 invert" : ""}`} priority />
            </Link>
          )}

          {!isHeroArrival && (
            <nav className="hidden lg:flex items-center justify-center gap-0.5">
              {DESKTOP_NAV.map((link) => {
                const active = !link.href.includes("#") && (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0])));
                return (
                  <Link key={link.label} href={link.href} className={`${linkBase} ${linkColor} ${active ? linkActive : ""} flex items-center gap-1.5 drop-shadow-[0_2px_10px_rgba(10,31,44,0.22)]`}>
                    {link.label}
                    {link.liveIndicator && isActive && <PulsingDot className={onDark ? "text-white" : "text-coral"} />}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className={`${isHeroArrival ? "hidden" : "flex items-center gap-1 sm:gap-2 justify-end"}`}>
            <button type="button" onClick={openDrawer} aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`} className={iconBtn}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[0.6rem] font-black text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {isActive && !isHeroArrival ? (
              <a href={liveHref} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white/20 border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-w-[140px] justify-center">
                <PulsingDot className="text-white" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={`${isLive}-${showAlt}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="whitespace-nowrap">
                    {isLive ? (showAlt ? "Watch live →" : (liveStatus?.show?.name ?? "Live now")) : `Live in ${liveStatus?.minutesUntilNext}m →`}
                  </motion.span>
                </AnimatePresence>
              </a>
            ) : (
              <Link href="/#contact" className="hidden sm:inline-flex items-center rounded-xl bg-coral px-5 py-2 text-sm font-semibold text-white hover:bg-coral-deep transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2">
                Join the Crew
              </Link>
            )}

            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen} className={iconBtn}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[100] flex flex-col" style={{ background: "#0E125C" }} aria-modal="true" role="dialog">
            <div className="flex items-center justify-between px-5 sm:px-8 h-16 border-b border-white/10">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md">
                <Image src="/images/traveholics%20logos%20(1200%20x%20300%20px).svg" alt="Travelholics" width={160} height={40} className="h-9 w-auto brightness-0 invert" />
              </Link>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-8 sm:px-16 gap-1">
              {MOBILE_NAV.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.2 }}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className="block font-serif text-[2.5rem] sm:text-5xl font-semibold tracking-tight text-white/90 hover:text-coral transition-colors py-1">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-8 sm:px-16 pb-10 space-y-4">
              <Link href="/#contact" onClick={() => setMenuOpen(false)} className="inline-flex items-center rounded-xl bg-coral px-6 py-3 text-sm font-semibold text-white hover:bg-coral-deep transition-colors">
                Join the Crew
              </Link>
              <div className="flex gap-5">
                <a href={TIKTOK_PROFILE_URL} target="_blank" rel="noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">TikTok</a>
                <a href="https://www.instagram.com/rjsmom1/" target="_blank" rel="noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">Instagram</a>
              </div>
              <p className="text-xs text-white/25">© {new Date().getFullYear()} Travelholics</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};