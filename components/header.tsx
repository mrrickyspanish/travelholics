"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Menu } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useLiveStatus } from "@/hooks/useLiveStatus";
import { TIKTOK_LIVE_URL, TIKTOK_PROFILE_URL } from "@/lib/liveSchedule";
import wordmarkStyles from "@/components/travelholics-wordmark.module.css";

type NavItem = {
  label: string;
  href: string;
  liveIndicator?: boolean;
};

const DESKTOP_NAV: NavItem[] = [
  { label: "Cruises", href: "/cruises/caribbean" },
  { label: "Group Cruises", href: "/group-cruises" },
  { label: "Live", href: "/live", liveIndicator: true },
  { label: "Videos", href: "/videos" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Our Story", href: "/#about" },
];

const MOBILE_PRIMARY: NavItem[] = [
  { label: "Cruises", href: "/cruises/caribbean" },
  { label: "Group Cruises", href: "/group-cruises" },
  { label: "Live", href: "/live", liveIndicator: true },
  { label: "Shop", href: "/shop" },
];

const MOBILE_SECONDARY: NavItem[] = [
  { label: "Videos", href: "/videos" },
  { label: "Guides", href: "/guides" },
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
  const reduceMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const liveStatus = useLiveStatus();

  const isHome = pathname === "/";
  const hasDarkHero = isHome || pathname === "/group-cruises" || pathname.startsWith("/trips/");
  const isDarkHero = hasDarkHero && !isScrolled && !menuOpen;
  const isLive = liveStatus?.state === "live";
  const isSoon = liveStatus?.state === "soon";
  const isActive = isLive || isSoon;
  const liveHref = isLive ? TIKTOK_LIVE_URL : TIKTOK_PROFILE_URL;

  useEffect(() => {
    if (!isLive || reduceMotion) return;
    const id = setInterval(() => setShowAlt((v) => !v), 3000);
    return () => clearInterval(id);
  }, [isLive, reduceMotion]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
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
    if (!menuOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = menuRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [menuOpen]);

  const isShopFull = pathname === "/shop-full";
  const solidBg = isScrolled || isShopFull || menuOpen;
  const navBg = isDarkHero
    ? "bg-transparent"
    : isLive
    ? "bg-coral shadow-sm"
    : isSoon
    ? "bg-ink shadow-sm"
    : solidBg
    ? (isShopFull ? "bg-white shadow-sm" : "bg-cream/96 backdrop-blur-sm shadow-sm")
    : "bg-cream/96 backdrop-blur-sm shadow-sm";
  const onDark = isSoon || isDarkHero;
  const linkBase = "min-h-11 text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-150";
  const linkColor = onDark ? "text-white/88 hover:text-white hover:bg-white/10" : isLive ? "text-ink hover:text-ink hover:bg-white/20" : "text-ink/70 hover:text-ink hover:bg-sand";
  const linkActive = onDark ? "text-white font-semibold" : "text-ink font-semibold";
  const iconBtn = `relative flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${onDark ? "hover:bg-white/15 text-white" : "hover:bg-sand text-ink"}`;

  return (
    <>
      <header data-home={isHome || undefined} className={`site-header fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${isHome && isScrolled ? "border-b border-ink/10 shadow-sm" : ""} ${navBg}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-[auto_1fr_auto] items-center h-16 gap-2 sm:gap-4">
            <Link href="/" className="flex min-h-11 items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded-md">
              <span className={`${wordmarkStyles.frame} w-[170px] lg:w-[205px]`}>
                <Image
                  src="/images/Traveholic_logo_wordmark_white.png"
                  alt="Travelholics"
                  fill
                  className={`${wordmarkStyles.source} transition-all duration-300 ${onDark ? "" : "brightness-0"}`}
                  sizes="(min-width: 1024px) 205px, 170px"
                  priority
                />
              </span>
            </Link>
            <nav aria-label="Primary navigation" className="hidden xl:flex items-center justify-center gap-0.5">
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
          <div className="col-start-3 flex items-center gap-1 sm:gap-2 justify-end">
            <button type="button" onClick={openDrawer} aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`} className={iconBtn}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[0.6rem] font-black text-ink">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {isActive ? (
              <a href={liveHref} target="_blank" rel="noopener noreferrer" className={`hidden sm:inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 min-w-[140px] justify-center ${onDark ? "bg-white/20 border-white/25 text-white hover:bg-white/30 focus-visible:ring-white" : "bg-white/25 border-ink/20 text-ink hover:bg-white/40 focus-visible:ring-ink"}`}>
                <PulsingDot className={onDark ? "text-white" : "text-ink"} />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={`${isLive}-${showAlt}`} initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="whitespace-nowrap">
                    {isLive ? (showAlt ? "Watch live →" : (liveStatus?.show?.name ?? "Live now")) : `Live in ${liveStatus?.minutesUntilNext}m →`}
                  </motion.span>
                </AnimatePresence>
              </a>
            ) : (
              <Link href="/#contact" className="hidden min-h-11 sm:inline-flex items-center rounded-none bg-coral px-5 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-coral-deep transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2">
                Plan my cruise
              </Link>
            )}

            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-controls="site-navigation-menu" aria-expanded={menuOpen} className={`${iconBtn} site-menu-trigger`}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        {isHome && <noscript><nav aria-label="Navigation without JavaScript" className="flex justify-center gap-4 bg-cream text-ink text-sm font-bold xl:hidden"><Link className="inline-flex min-h-11 items-center" href="/group-cruises">Group Cruises</Link><Link className="inline-flex min-h-11 items-center" href="/#contact">Plan my cruise</Link></nav></noscript>}
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div ref={menuRef} data-home={isHome || undefined} id="site-navigation-menu" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="fixed inset-0 z-[100] flex flex-col" style={{ background: "#0E125C" }} aria-modal="true" aria-label="Site navigation" role="dialog">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-8">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md">
                <span className={`${wordmarkStyles.frame} w-[165px] sm:w-[180px]`}>
                  <Image src="/images/Traveholic_logo_wordmark_white.png" alt="Travelholics" fill className={wordmarkStyles.source} sizes="180px" />
                </span>
              </Link>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
              <nav aria-label="Primary mobile navigation">
                <div className="grid grid-cols-2 border-y border-white/12">
                  {MOBILE_PRIMARY.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.18 }}
                      className={`${i % 2 === 0 ? "border-r border-white/12 pr-4" : "pl-4"} ${i < 2 ? "border-b border-white/12" : ""}`}
                    >
                      <Link href={link.href} onClick={() => setMenuOpen(false)} className="flex min-h-[76px] items-center gap-2 py-4 font-serif text-[1.65rem] font-semibold leading-[1] tracking-[-0.04em] text-white/92 transition-colors hover:text-coral sm:min-h-[88px] sm:text-3xl">
                        {link.label}
                        {link.liveIndicator && isActive && <PulsingDot className="text-coral" />}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 sm:mt-6 sm:grid-cols-3">
                  {MOBILE_SECONDARY.map((link) => (
                    <motion.div key={link.label} initial={false} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
                      <Link href={link.href} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center py-2.5 text-[0.95rem] font-semibold text-white/58 transition-colors hover:text-white sm:text-base">
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              <div className="mt-6 border-t border-white/10 pt-5 sm:mt-7">
                <Link href="/#contact" onClick={() => setMenuOpen(false)} className="flex min-h-12 w-full items-center justify-center rounded-none bg-coral px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-coral-deep sm:w-fit">
                  Plan my cruise
                </Link>
                <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                  <div className="flex gap-5">
                    <a href={TIKTOK_PROFILE_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-white/75 hover:text-white transition-colors">TikTok</a>
                    <a href="https://www.instagram.com/yotravelholic" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-white/75 hover:text-white transition-colors">Instagram</a>
                  </div>
                  <p className="text-xs text-white/22">© {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
