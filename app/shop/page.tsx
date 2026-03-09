"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, ShoppingBag, BookOpen, Star, Package } from "lucide-react";

const packingProducts = [
  {
    id: 1,
    name: "Cruise Luggage Tag Holders",
    description: "Heavy-duty clear holders that fit Royal Caribbean, Carnival, and all major cruise line tags. Pack for the whole family.",
    price: "$12.99",
    badge: "Yolanda's Pick",
    category: "packing",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
  {
    id: 2,
    name: "Hanging Toiletry Organizer",
    description: "The cabin bathroom is tiny. This over-the-door organizer is the single best thing you can pack. I bring it on every cruise.",
    price: "$24.99",
    badge: "Must-Have",
    category: "packing",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
  {
    id: 3,
    name: "Packing Cubes Set (6-Piece)",
    description: "Color-coded cubes that make unpacking in your cabin effortless. One set per person — game changer for families.",
    price: "$29.99",
    badge: "Fan Favorite",
    category: "packing",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
  {
    id: 4,
    name: "Magnetic Hooks (Set of 10)",
    description: "Cruise ship walls are magnetic. These hooks let you hang bags, lanyards, and accessories — instant cabin organization.",
    price: "$9.99",
    badge: "Under $10",
    category: "packing",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
  {
    id: 5,
    name: "Cruise Lanyard with ID Holder",
    description: "Keep your SeaPass card accessible all day. Waterproof sleeve, breakaway clasp. I wear one every sailing.",
    price: "$8.99",
    badge: null,
    category: "packing",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
  {
    id: 6,
    name: "Portable Over-Door Shoe Organizer",
    description: "Doubles as a storage unit for snacks, sunscreen, chargers, and more. Solves the small cabin storage problem instantly.",
    price: "$18.99",
    badge: "Space Saver",
    category: "packing",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
];

const digitalProducts = [
  {
    id: 7,
    name: "Caribbean Cruise Prep Guide",
    description: "My complete 30-page guide: what to pack, best excursions by port, dining strategy, upgrade tips, and first-timer secrets. 20 years of knowledge in one PDF.",
    price: "$14.99",
    badge: "Best Seller",
    category: "digital",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
  {
    id: 8,
    name: "Alaska Cruise Planning Checklist",
    description: "Alaska is a completely different beast. This checklist covers gear, layering, excursion booking windows, and the ports most people get wrong.",
    price: "$9.99",
    badge: "New",
    category: "digital",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
  {
    id: 9,
    name: "Group Cruise Coordinator Kit",
    description: "Planning a reunion or group cruise? This kit includes budget tracker, cabin assignment sheet, dining coordination template, and group communication scripts.",
    price: "$19.99",
    badge: "For Planners",
    category: "digital",
    url: "https://www.tiktok.com/@rjsmom1",
    image: null,
  },
];

const badgeColors: Record<string, string> = {
  "Yolanda's Pick": "bg-emerald-700 text-white",
  "Must-Have": "bg-amber-400 text-slate-900",
  "Fan Favorite": "bg-emerald-600 text-white",
  "Under $10": "bg-slate-700 text-white",
  "Space Saver": "bg-emerald-800 text-white",
  "Best Seller": "bg-amber-500 text-white",
  "New": "bg-teal-600 text-white",
  "For Planners": "bg-slate-800 text-white",
};

function ProductCard({ product, index }: { product: typeof packingProducts[0]; index: number }) {
  const isDigital = product.category === "digital";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Top color bar */}
      <div className={`h-1.5 w-full ${isDigital ? "bg-gradient-to-r from-amber-400 to-amber-600" : "bg-gradient-to-r from-emerald-600 to-teal-500"}`} />

      <div className="p-6 flex flex-col h-full">
        {/* Icon + Badge row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDigital ? "bg-amber-50" : "bg-emerald-50"}`}>
            {isDigital
              ? <BookOpen className="w-5 h-5 text-amber-600" />
              : <Package className="w-5 h-5 text-emerald-700" />
            }
          </div>
          {product.badge && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColors[product.badge] ?? "bg-stone-100 text-stone-700"}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="font-semibold text-slate-900 text-base leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="font-bold text-lg text-slate-900">{product.price}</span>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
              isDigital
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-emerald-700 hover:bg-emerald-800 text-white"
            }`}
          >
            {isDigital ? "Get It" : "Shop Now"}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-stone-50">

      {/* Nav — matches existing site */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900 text-lg tracking-tight">Travelholics</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-stone-600">
            <Link href="/#about" className="hover:text-emerald-700 transition-colors">About Yolanda</Link>
            <Link href="/#testimonials" className="hover:text-emerald-700 transition-colors">What Travelers Say</Link>
            <Link href="/#process" className="hover:text-emerald-700 transition-colors">How It Works</Link>
            <Link href="/shop" className="text-emerald-700 font-semibold">Shop</Link>
            <Link href="/#contact" className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Plan My Trip
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-700/30 text-emerald-400 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
                <ShoppingBag className="w-4 h-4" />
                Yolanda's Shop
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                Everything I Actually<br />
                <span className="text-emerald-400">Bring on Every Cruise.</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-xl">
                20+ years of sailing distilled into the gear I swear by and the guides I wish someone had given me on my first trip.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-5 py-4 shrink-0 border border-white/10">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">500+ happy travelers</div>
                <div className="text-xs text-slate-400">trust Yolanda's picks</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packing Essentials */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-emerald-700" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Cruise Packing Essentials</h2>
            </div>
            <p className="text-stone-500 ml-11">The exact items I recommend to every client before they board.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-stone-200" />
      </div>

      {/* Digital Guides */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Digital Guides & Itineraries</h2>
            </div>
            <p className="text-stone-500 ml-11">Downloadable PDFs packed with 20 years of cruise knowledge. Instant access after purchase.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl px-8 py-12 text-center text-white"
          >
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-widest mb-3">Ready to sail?</p>
            <h2 className="text-3xl font-bold mb-3">Want me to plan the whole trip?</h2>
            <p className="text-emerald-100 mb-8 max-w-md mx-auto">
              The gear and guides are a start — but nothing replaces a plan built just for you. Let's talk about your dream cruise.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Plan My Trip ✦
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <span>© 2026 Travelholics</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-stone-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-stone-600 transition-colors">Terms</Link>
            <Link href="https://www.tiktok.com/@rjsmom1" target="_blank" className="hover:text-stone-600 transition-colors">@rjsmom1</Link>
          </div>
          <span>Built with ♥ by <a href="https://creativeeyestudios.com" className="hover:text-stone-600 transition-colors">Creative Eye Studios</a></span>
        </div>
      </footer>

    </main>
  );
}
