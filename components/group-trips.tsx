
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const moments = [
  { src: "/images/about-with-travelers.jpg", alt: "Friends enjoying a cruise together", label: "Your people" },
  { src: "/images/about-port-of-call.jpg", alt: "Travelers enjoying a port day", label: "Your memories" },
  { src: "/images/dest-caribbean.jpg", alt: "Caribbean cruise destination", label: "Your sailing" },
];

export const GroupTrips = () => {

  return (
    <section id="group-trips" className="home-groups" aria-labelledby="groups-title">
      <div className="home-container"><div className="home-group-panel">
        <div
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">Group Cruises</p>
          <h2 id="groups-title" className="home-heading home-group-heading">
            Bring the people. We&apos;ll build the story.
          </h2>
          <p className="mt-7 max-w-[31rem] text-lg leading-7 text-white/64 sm:leading-8">
            Yolanda shapes the sailing. Your crew gets one place to keep the trip together.
          </p>

          <Link
            href="/group-cruises"
            className="mt-8 inline-flex min-h-11 w-fit items-center justify-center rounded-none bg-coral px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 gap-2"
          >
            Explore Group Cruises <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="group-trip-gallery">
          {moments.map((moment) => (
            <figure
              key={moment.label}
              className="group-trip-moment"
            >
              <Image
                src={moment.src}
                alt={moment.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 70vw, 38vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061d19]/72 via-transparent to-transparent" />
              <figcaption className="group-trip-caption">
                {moment.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div></div>
    </section>
  );
};
