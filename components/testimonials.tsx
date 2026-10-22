import { HomeCardRail } from "@/components/home-card-rail";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "Yolanda helped us plan a honeymoon cruise that felt easy from start to finish. She matched the ship, excursions, and details to the trip we wanted, and we cannot wait to book with Travelholics again.",
    name: "RJ Barnes",
    trip: "Caribbean Cruise · Royal Caribbean",
    photo: "/images/testimonials/barnes_cruise_travelholic.JPG",
  },
  {
    quote:
      "For years, Yolanda has planned my cruise vacations, and every trip has been exceptional. She matches the sailing, stateroom, and details to exactly what I love, taking all the stress out of planning.",
    name: "Tijuana Willis",
    trip: "Mediterranean Cruise · Repeat Guest",
    photo: "/images/testimonials/willis_cruise_travelholic.jpg",
  },
];

export const Testimonials = () => (
  <section id="testimonials" className="home-testimonials" aria-labelledby="testimonials-title">
    <div className="home-container">
      <div className="home-section-heading">
        <div><p className="home-eyebrow">From the crew</p><h2 id="testimonials-title" className="home-heading">The trip should feel good before you even leave.</h2></div>
        <p className="home-body">The proof is not just the itinerary. It is whether people felt taken care of, understood the plan, and came home ready to do it again.</p>
      </div>
      <HomeCardRail id="traveler-reviews" label="Traveler reviews" className="home-review-rail">
        {testimonials.map(testimonial => (
          <li key={testimonial.name} className="home-quote">
            <div className="home-quote-photo"><Image src={testimonial.photo} alt={`${testimonial.name} on ${testimonial.trip}`} fill className="object-cover" sizes="4rem" /></div>
            <div className="home-quote-copy"><span className="home-quote-mark" aria-hidden="true">“</span><blockquote>{testimonial.quote}</blockquote><div className="home-quote-credit"><p>{testimonial.name}</p><p>{testimonial.trip}</p></div></div>
          </li>
        ))}
      </HomeCardRail>
      <Link href="/#contact" className="home-text-link">Start my trip <ArrowUpRight size={16} /></Link>
    </div>
  </section>
);
