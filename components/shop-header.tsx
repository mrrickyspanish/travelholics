

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaSearch, FaHeart, FaShoppingCart, FaUser, FaTimes } from "react-icons/fa";

export function ShopHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBands, setShowBands] = useState(true);
  const sections = [
    { id: "travelholics-originals", label: "Originals" },
    { id: "travelholics-finds", label: "Finds" },
  ];
  React.useEffect(() => {
    let lastScroll = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY;
          if (current <= 0) {
            setShowBands(true);
          } else if (current > lastScroll) {
            setShowBands(false);
          } else {
            setShowBands(true);
          }
          lastScroll = current;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header className="w-full">
      {/* Top Promo Bar (fixed above nav) */}
      <div className={`header-top bg-emerald-mid text-white text-sm h-8 flex items-center justify-center font-semibold transition-all duration-300 ${showBands ? 'opacity-100 fixed left-0 right-0 z-[61] top-0' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
        Free shipping on orders over $50
      </div>
      {/* Main Navigation Bar (fixed below top bar) */}
      <div className="header-main bg-white shadow h-20 px-4 md:px-8 text-lg flex items-center justify-between fixed left-0 right-0 z-[60]" style={{top: showBands ? '2rem' : 0}}>
        {/* Left: Logo (left on md+, center on mobile) */}
        <div className="flex items-center gap-2 flex-1">
          <button
            aria-label="Open navigation menu"
            className="p-2 text-emerald-deep md:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <FaBars size={22} />
          </button>
          <Link href="/" className="hidden md:flex items-center">
            <Image src="/images/travelholics_logo_wordmark.svg" alt="Travelholics logo" height={44} width={220} className="h-11 w-auto object-contain" priority />
          </Link>
        </div>
        {/* Center: Logo (mobile only) */}
        <Link href="/" className="flex md:hidden flex-1 justify-center items-center">
          <Image src="/images/travelholics_logo_wordmark.svg" alt="Travelholics logo" height={44} width={220} className="h-11 w-auto object-contain" priority />
        </Link>
        {/* Center: Section nav (desktop only) */}
        <nav className="hidden md:flex flex-1 justify-center gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-3 py-1.5 rounded-full text-emerald-deep font-semibold hover:bg-sand hover:text-coral transition-colors text-base"
            >
              {section.label}
            </a>
          ))}
        </nav>
        {/* Right: Icons */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <button aria-label="Search" className="p-2 text-emerald-deep">
            <FaSearch size={22} />
          </button>
          <button aria-label="Wishlist" className="p-2 text-emerald-deep">
            <FaHeart size={22} />
          </button>
          <button aria-label="Cart" className="p-2 text-emerald-deep">
            <FaShoppingCart size={22} />
          </button>
          <button aria-label="Account" className="p-2 text-emerald-deep hidden md:inline-flex">
            <FaUser size={22} />
          </button>
        </div>
        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex">
            <nav className="bg-white w-64 h-full shadow-lg p-6 flex flex-col gap-4">
              <button
                aria-label="Close navigation menu"
                className="self-end mb-4 text-emerald-deep"
                onClick={() => setMobileNavOpen(false)}
              >
                <FaTimes size={24} />
              </button>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="px-3 py-2 rounded text-emerald-deep font-semibold hover:bg-sand hover:text-coral transition-colors text-lg"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {section.label}
                </a>
              ))}
            </nav>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}
      </div>
      {/* Bottom Trust/Info Bar (fixed below nav) */}
      <div
        className={`header-sub bg-sand text-emerald-deep text-xs h-10 md:h-7 flex items-center justify-center transition-all duration-300 ${showBands ? 'opacity-100 fixed left-0 right-0 z-[59]' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}
        style={{ top: showBands ? '7rem' : '5rem' }}
      >
        <div className="flex w-full items-center justify-between gap-3 px-3 leading-tight md:w-auto md:justify-center md:gap-4 md:px-0 md:leading-none">
          <span className="font-semibold text-[0.68rem] md:text-xs whitespace-nowrap">Trusted by 5,000+ travelers</span>
          <span className="hidden md:inline">|</span>
          <Link href="/shop-full#travelholics-finds" className="text-right text-[0.68rem] underline underline-offset-2 hover:text-coral md:text-sm md:text-left">
            New here? Browse Travelholics Finds
          </Link>
        </div>
      </div>
    </header>
  );
}
