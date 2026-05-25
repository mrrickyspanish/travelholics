"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ship, Users, ShoppingBag, ArrowRight } from "lucide-react";

// TODO: Replace placeholder images with final photography when available
const cards = [
  {
    title: "Plan a Cruise",
    description:
      "Let us handle the details. We'll help you find the perfect cruise, at the best value, with VIP perks.",
    cta: "Start Planning",
    href: "/#contact",
    icon: Ship,
    iconBg: "bg-emerald-mid",
    image: "/images/about-on-deck.jpg",
    imageAlt: "Woman relaxing on a cruise ship deck at sunset",
  },
  {
    title: "Join a Group Trip",
    description:
      "Travel with amazing people, curated itineraries, exclusive events, and unforgettable experiences.",
    cta: "See Upcoming Trips",
    href: "/#group-trips",
    icon: Users,
    iconBg: "bg-coral",
    image: "/images/about-with-travelers.jpg",
    imageAlt: "Group of happy travelers together",
  },
  {
    title: "Shop Travel Picks",
    description:
      "From cruise must-haves to travel essentials, shop our curated picks and exclusive merch.",
    cta: "Shop Now",
    href: "/shop",
    icon: ShoppingBag,
    iconBg: "bg-emerald-mid",
    image: "/images/why-custom-planning.jpg",
    imageAlt: "Travel essentials and accessories flat lay",
  },
];

export const IntentCards = () => {
  return (
    <section className="bg-sand py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="type-kicker text-coral mb-3">Choose Your Path</p>
          <h2 className="type-section-title text-emerald-deep">
            How Can We Help You Travel?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map(({ title, description, cta, href, icon: Icon, iconBg, image, imageAlt }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-cream rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Top photo with icon badge overlapping bottom edge */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className={`absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shadow-lg z-10`}
                >
                  <Icon size={20} className="text-white" />
                </div>
              </div>

              {/* Card body */}
              <div className="pt-8 pb-6 px-6 text-center">
                <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
                <p className="text-sm text-stone leading-relaxed mb-5">{description}</p>
                <a
                  href={href}
                  className="inline-flex items-center gap-1.5 text-coral font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
                >
                  {cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
