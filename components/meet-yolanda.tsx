import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const proof = [["20+", "Years traveling"], ["6+", "Cruise lines sailed"], ["20K+", "Travelers in the community"], ["$0", "Planning fees"]];

export const MeetYolanda = () => (
  <section id="about" className="home-about" aria-labelledby="about-title">
    <div className="home-container home-about-grid">
      <div className="home-about-photo">
        <Image src="/images/hero-yolanda.jpg" alt="Yolanda Harris of Travelholics" fill className="object-cover object-center" sizes="(min-width: 1024px) 38vw, 90vw" />
        <div className="home-card-scrim" />
        <div className="home-about-name"><p>Yolanda Harris</p><span>Certified Cruise Specialist</span></div>
      </div>
      <div className="home-about-copy">
        <h2 id="about-title" className="home-heading">Meet Yolanda.</h2>
        <p className="home-body home-about-intro">The person behind the ship knowledge, cabin strategy, and advice that turns cruise curiosity into confidence.</p>
        <p className="home-body home-about-story">She has spent years learning how cruise lines, ships, cabin categories, itineraries, and timing actually feel once you are onboard. That experience becomes your shortcut to the cruise that fits you, not just the cruise that showed up first in a search.</p>
        <p className="home-about-promise" data-headline>Bring the dream. She&apos;ll help you find the cruise that fits it.</p>
        <dl id="proof" className="home-proof">
          {proof.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        <div className="home-about-actions">
          <Link href="/#contact" className="home-button">Plan with Yolanda</Link>
          <Link href="/videos" className="home-text-link">See her cruise advice <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </div>
  </section>
);
