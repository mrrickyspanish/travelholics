"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const tiles = [
  { label: "Caribbean", note: "Warm water, big ships, easy yes.", href: "/cruises/caribbean", image: "/images/Charlotte_Amalie_StThomas.jpg", alt: "Charlotte Amalie harbour with cruise ships docked" },
  { label: "Alaska", note: "Glaciers, wildlife, and the kind of quiet you remember.", href: "/cruises/alaska", image: "/images/dest-alaska-glaciers.jpg", alt: "Snow-capped mountains above still water in Alaska" },
  { label: "Mediterranean", note: "Wake up somewhere different every morning.", href: "/cruises/mediterranean", image: "/images/about-port-of-call.jpg", alt: "A traveller overlooking a Mediterranean hillside village" },
  { label: "Group Trips", note: "Your people. More support. No planning fees.", href: "/group-cruises", image: "/images/about-with-travelers.jpg", alt: "A Travelholics group in matching shirts on board" },
];

export const AdventureShelf = () => {
  const rail = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const measure = () => {
    const el = rail.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const left = el.getBoundingClientRect().left;
    const index = cards.reduce((best, card, i) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? i : best, 0);
    setActive(index);
  };
  const move = (direction: number) => {
    const next = Math.max(0, Math.min(tiles.length - 1, active + direction));
    const el = rail.current;
    const card = el?.children[next] as HTMLElement | undefined;
    if (el && card) el.scrollBy({ left: card.getBoundingClientRect().left - el.getBoundingClientRect().left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return (
    <section id="adventure-shelf" className="home-shelf" aria-labelledby="destinations-title">
      <div id="destination-discovery" className="home-container home-destinations">
        <div className="home-section-heading">
          <div><p className="home-eyebrow">Start with a feeling</p><h2 id="destinations-title" className="home-heading">Where should we wake up next?</h2></div>
          <div>
            <p className="home-body">You do not need to know the ship yet. Pick the kind of trip you want to feel, then let Yolanda help narrow down the sailing that actually fits.</p>
            <Link href="/#contact" className="home-text-link">Help me choose <ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <ul ref={rail} id="destination-rail" className="home-destination-rail" onScroll={measure} aria-label="Cruise destinations and group trips">
          {tiles.map(tile => (
            <li key={tile.label}>
              <Link href={tile.href} className="home-destination-card">
                <Image src={tile.image} alt={tile.alt} fill sizes="(min-width: 1024px) 24vw, 78vw" className="object-cover" />
                <div className="home-card-scrim" />
                <div className="home-destination-caption"><h3>{tile.label}</h3><p>{tile.note}</p></div>
                <ArrowUpRight className="home-card-arrow" size={20} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="home-rail-controls">
          <span aria-live="polite" aria-atomic="true">{active + 1} / {tiles.length}</span>
          <div>
            <button type="button" aria-label="Previous destination" aria-controls="destination-rail" onClick={() => move(-1)} disabled={active === 0}><ArrowLeft size={18} /></button>
            <button type="button" aria-label="Next destination" aria-controls="destination-rail" onClick={() => move(1)} disabled={active === tiles.length - 1}><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};
