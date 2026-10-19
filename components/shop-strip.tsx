// ⚠️ PLACEHOLDER PRICES AND PRODUCT DATA
// Product prices and URLs below are placeholders pending final data.


import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const products = [
  {
    name: "Atlantis Lanyard",
    price: "$12.00",
    image: "/images/travelholics_lanyard_transparent.png",
    href: "/shop-full",
    imageAlt: "Travelholics Atlantis lanyard",
  },
  {
    name: "Cruise Life Magnet",
    price: "$19.99",
    image: "/images/travelholics_product_ticket-magnet-pacific.png",
    href: "/shop-full",
    imageAlt: "Cruise Life ticket-style magnet",
  },
  {
    name: "Pacific Coast Magnet",
    price: "$19.99",
    image: "/images/travelholics_product_pacific-mexican-door-magnet.png",
    href: "/shop-full",
    imageAlt: "Pacific Mexican cruise magnet with coastal artwork",
  },
  {
    name: "Travelholics Bucket Hat",
    price: "$38.00",
    image: "/images/Travelholics_merch_bucket_hat.png",
    href: "/shop-full",
    imageAlt: "Travelholics beige bucket hat with embroidered logo",
  },
];

export const ShopStrip = () => (
  <section id="shop-strip" className="home-shop" aria-labelledby="shop-title">
    <div className="home-container">
      <div className="home-section-heading">
        <div><p className="home-eyebrow">Travelholics Originals</p><h2 id="shop-title" className="home-shop-heading">Bring a little cruise life home.</h2></div>
        <div><p className="home-body">Travel pieces, cabin personality, and small reminders that your next trip is never as far away as it feels.</p><Link href="/shop-full" className="home-text-link">Shop the collection <ArrowUpRight size={16} /></Link></div>
      </div>
      <ul className="home-shop-rail" aria-label="Travelholics products">
        {products.map(product => (
          <li key={product.name}>
            <Link href={product.href} className="home-product">
              <div className="home-product-image"><Image src={product.image} alt={product.imageAlt} fill sizes="(min-width: 1024px) 20vw, 70vw" className="object-contain" /><ArrowUpRight className="home-product-arrow" size={18} aria-hidden="true" /></div>
              <h3>{product.name}</h3><p>{product.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
