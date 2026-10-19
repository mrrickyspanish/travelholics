
import Link from "next/link";
import Image from "next/image";
import { HomeCardRail } from "@/components/home-card-rail";
import { ArrowUpRight } from "lucide-react";

// The page's explanation of the actual service. Nothing above this section
// tells a cold visitor what the mechanics of working with Yolanda are, or that
// it costs them nothing over booking direct. Keep it high in app/page.tsx —
// it is the spine, not a nice-to-have.
const steps = [
  {
    number: "01",
    image: "/images/Charlotte_Amalie_StThomas.jpg",
    alt: "Cruise ships docked beside the blue water of Charlotte Amalie harbour",
    title: "Tell her where your mind keeps going.",
    body:
      "No ship, no cabin number, no perfect dates required. A destination and a rough season is enough to start.",
  },
  {
    number: "02",
    image: "/images/about-on-deck.jpg",
    alt: "Life on board a cruise ship",
    title: "She matches the sailing to how you travel.",
    body:
      "Cruise line, ship, cabin category, itinerary, timing. Twenty years of knowing which ones actually feel the way the brochure says they do.",
  },
  {
    number: "03",
    image: "/images/about-with-travelers.jpg",
    alt: "The Travelholics crew enjoying a cruise together",
    title: "You book it and she stays with you.",
    body:
      "Through deposits, dining, excursions and sail day — one person who already knows your trip, instead of a call center.",
  },
];

export const HowItWorks = () => {

  return (
    <section id="how-it-works" className="home-how" aria-labelledby="process-title">
      <div className="home-container home-process-layout">
        <div className="home-process-intro">
            <p className="home-eyebrow">How it works</p>
            <h2 id="process-title" className="home-heading">
              A cruise specialist, not a booking site.
            </h2>
            <p className="home-body">
              Yolanda is a Certified Cruise Specialist. She helps you choose the sailing, cabins, and details that fit your trip. Travel suppliers compensate her, so you get her planning support without an added planning fee.
            </p>
            <Link href="/#contact" className="home-button">Plan my cruise <ArrowUpRight size={17} /></Link>
        </div>
        <HomeCardRail id="planning-steps" label="Planning steps" className="home-process-rail">
          {steps.map((step) => (
            <li
              key={step.number}
              className="home-process-card"
            >
              <div className="home-process-photo"><Image src={step.image} alt={step.alt} fill sizes="(min-width: 1024px) 22vw, 78vw" className="object-cover" /><span aria-hidden="true">{step.number}</span></div>
              <h3>
                {step.title}
              </h3>
              <p className="home-body">{step.body}</p>
            </li>
          ))}
        </HomeCardRail>
      </div>
    </section>
  );
};
