"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Quick-nav off the hero. This deliberately shares destinations with the
// editorial "Where should we wake up next?" section further down -- that one is
// the considered browse, this is the fast jump-off. They use DIFFERENT imagery
// imagery so the repeat reads as a shortcut rather than a duplicated section:
// real photographs from Yolanda's own sailings here, the rendered hero art
// there. Pick tile images by LOOKING at them -- the dest-*.jpg filenames
// describe destinations but the files are traveller portraits.
const tiles = [
  {
    label: "Caribbean",
    href: "/cruises/caribbean",
    image: "/images/Charlotte_Amalie_StThomas.jpg",
    alt: "Aerial view of Charlotte Amalie harbour in St. Thomas with cruise ships docked",
  },
  {
    label: "Alaska",
    href: "/cruises/alaska",
    image: "/images/dest-alaska-glaciers.jpg",
    alt: "Snow-capped mountains above still water on an Alaska cruise route",
  },
  {
    label: "Mediterranean",
    href: "/cruises/mediterranean",
    image: "/images/about-port-of-call.jpg",
    alt: "A traveller looking out over a whitewashed Mediterranean hillside village",
  },
  {
    label: "Group Trips",
    href: "/group-cruises",
    image: "/images/about-with-travelers.jpg",
    alt: "A Travelholics group in matching shirts on board together",
  },
];

const ArrowDoodle = () => (
  <svg className="mt-2 h-6 w-16 text-teal-deep" viewBox="0 0 70 26" fill="none" aria-hidden="true">
    <path d="M2 6c14 12 36 16 60 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M52 13.5c4.5 2 7.5 3.5 10 5.5M55 23c3-2.5 5-4.5 7-9.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const AdventureShelf = () => {
  const scroller = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  // The next button only earns its place when the rail actually overflows --
  // with four tiles it does not on a wide desktop.
  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const more = el.scrollWidth - el.clientWidth > 8 && el.scrollLeft + el.clientWidth < el.scrollWidth - 8;
    setCanScroll((prev) => (prev === more ? prev : more));
  }, []);

  // ResizeObserver rather than a measure() call in the effect body: observing
  // fires its first callback asynchronously, so the initial measurement happens
  // without a synchronous setState and the cascading render it causes. It also
  // catches the rail changing width without a window resize.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const next = () => scroller.current?.scrollBy({ left: Math.round(scroller.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <section id="adventure-shelf" className="relative z-10 -mt-8 sm:-mt-12 lg:-mt-14">
      <div className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="relative flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_22px_60px_rgba(5,28,24,0.22)] lg:flex-row lg:items-stretch">
          <div className="shrink-0 bg-teal/15 px-6 py-5 lg:flex lg:w-[16rem] lg:flex-col lg:justify-center lg:px-8 lg:py-7">
            <p className="font-script text-[1.75rem] leading-none text-royal-deep">Find your</p>
            <p className="mt-1 font-black uppercase tracking-[0.1em] text-royal-deep">Next adventure</p>
            <ArrowDoodle />
          </div>

          <div className="relative min-w-0 flex-1">
          <div
            ref={scroller}
            className="flex gap-3 overflow-x-auto scroll-smooth px-5 py-5 [scrollbar-width:none] sm:gap-4 lg:px-6 [&::-webkit-scrollbar]:hidden"
          >
            {tiles.map((tile) => (
              <Link
                key={tile.label}
                href={tile.href}
                className="group w-[13.5rem] shrink-0 snap-start overflow-hidden rounded-lg border border-ink/12 transition hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral sm:w-[14.5rem]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={tile.image}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 640px) 14rem, 15rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="truncate text-sm font-black uppercase tracking-[0.08em] text-ink">{tile.label}</span>
                  <ChevronRight size={17} className="shrink-0 text-stone transition group-hover:translate-x-0.5 group-hover:text-coral" />
                </div>
              </Link>
            ))}
          </div>

          {/* Touch devices get a fade instead of a control -- swiping is the
              native affordance there, and an overlaid arrow just covers a tile
              on a narrow rail. The button appears from lg, and only when the
              rail actually overflows. */}
          {canScroll && (
            <>
              <div
                className="pointer-events-none absolute inset-y-5 right-0 w-10 bg-gradient-to-l from-white to-transparent lg:hidden"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={next}
                aria-label="Show more destinations"
                className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/12 bg-white text-ink shadow-[0_6px_20px_rgba(5,28,24,0.18)] transition hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral lg:flex"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          </div>
        </div>
      </div>
    </section>
  );
};
