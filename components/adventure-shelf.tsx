import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const tiles = [
  { label: "Caribbean", note: "Warm water, big ships, easy yes.", href: "/cruises/caribbean", image: "/images/destinations/caribbean-hero.png", alt: "Turquoise Caribbean water and a palm-lined beach at sunset" },
  { label: "Alaska", note: "Glaciers, wildlife, and the kind of quiet you remember.", href: "/cruises/alaska", image: "/images/destinations/alaska-hero.png", alt: "A cruise ship on still water between snow-capped Alaska mountains" },
  { label: "Mediterranean", note: "Wake up somewhere different every morning.", href: "/cruises/mediterranean", image: "/images/destinations/mediterranean-hero.png", alt: "Blue-domed churches overlooking the Mediterranean coast at sunset" },
];

export const AdventureShelf = () => {
  return (
    <section id="adventure-shelf" className="home-shelf" aria-labelledby="destinations-title">
      <div id="destination-discovery" className="home-container home-destinations">
        <div className="home-section-heading">
          <div><p className="home-eyebrow">Start with a feeling</p><h2 id="destinations-title" className="home-heading">Where should we wake up next?</h2></div>
          <div>
            <p className="home-body">Pick the kind of trip you want to feel, then let Yolanda help narrow down the sailing that actually fits.</p>
            <Link href="/#contact" className="home-text-link">Help me choose <ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <ul id="destination-choices" className="home-destination-grid" aria-label="Cruise destinations">
          {tiles.map((tile, index) => (
            <li key={tile.label}>
              <Link href={tile.href} className="home-destination-card" aria-label={`Explore ${tile.label} cruises`}>
                <div className="home-destination-image">
                  <Image src={tile.image} alt={tile.alt} fill quality={90} sizes={index === 0 ? "(min-width: 1344px) 403px, (min-width: 768px) 31vw, 90vw" : "(min-width: 1344px) 403px, (min-width: 768px) 31vw, 44vw"} className="object-cover" />
                </div>
                <div className="home-destination-caption"><h3>{tile.label}</h3><ArrowUpRight size={18} aria-hidden="true" /></div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="home-destination-group" aria-labelledby="destination-groups-title">
          <div>
            <h3 id="destination-groups-title">Group Trips</h3>
            <p>Your people. More support. No planning fees.</p>
          </div>
          <Link href="/group-cruises" className="home-button">Explore group cruises <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
};
