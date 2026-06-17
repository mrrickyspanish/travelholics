"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ship, Users, ShoppingBag } from "lucide-react";

// TODO: Replace placeholder images with final photography when available
const cards = [
  {
    title: "THE TRIP",
    description:
      "Cruise, all-inclusive, or fully custom — Yolanda plans the whole thing. Same price as booking direct, zero fees, and a real person in your corner when something goes sideways at sea.",
    cta: "Plan My Cruise",
    href: "/cruises/caribbean",
    icon: Ship,
    iconBg: "bg-emerald-mid",
    image: "/images/about-on-deck.jpg",
    imageAlt: "Woman relaxing on a cruise ship deck at sunset",
  },
  {
    title: "THE CREW TRIP",
    description:
      "Sail with the community, not strangers. Group dinners, deck parties, port days — all planned. Next sailing: Caribbean 2027.",
    cta: "See the Sailing",
    href: "/#group-trips",
    icon: Users,
    iconBg: "bg-emerald-mid",
    image: "/images/about-with-travelers.jpg",
    imageAlt: "Group of happy travelers together",
  },
  {
    title: "THE GEAR",
    description:
      "Hats, totes, the Travelholic crewneck. The merch that says it without saying it - for people who pack their outfits a week early.",
    cta: "Shop the Lifestyle",
    href: "/shop",
    icon: ShoppingBag,
    iconBg: "bg-emerald-mid",
    image: "/images/travelholics_merch_card_2.png",
    imageAlt: "Travel essentials and accessories flat lay",
    imageFit: "cover",
    imagePosition: "top",
  },
];

export const IntentCards = () => {
  return (
    <section className="bg-sand py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-eyebrow text-coral mb-3">THREE WAYS TO TRAVEL WITH US</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ink tracking-tight">
            Start with the trip.
          </h2>
          <p className="text-eyebrow text-ink/65 mt-3">
            Yolanda books it. The crew comes with it. The gear says it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map(({ title, description, cta, href, icon: Icon, iconBg, image, imageAlt, imageFit, imagePosition }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Photo with icon badge overlapping bottom edge */}
              <div className="relative aspect-[4/3] z-20">
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className={imageFit === "contain" ? "object-contain" : imagePosition === "top" ? "object-cover object-top" : "object-cover"}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div
                  className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shadow-md z-30`}
                >
                  <Icon size={18} className="text-white" />
                </div>
              </div>

              {/* Card body — tighter padding */}
              <div className="relative z-10 pt-7 pb-5 px-5 text-center">
                <h3 className="font-serif text-card-body font-semibold text-ink mb-1.5 tracking-wide">{title}</h3>
                <p className="mb-4 text-card-body text-ink/82">{description}</p>
                <a
                  href={href}
                  className="group inline-flex items-center gap-1 text-coral font-semibold text-footer-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
                >
                  <span>{cta}</span>
                  <span className="inline-block translate-x-0 group-hover:translate-x-[2px] transition-transform duration-200" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
