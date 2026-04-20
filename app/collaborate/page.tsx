"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Handshake,
  Building2,
  Ship,
  Hotel,
  UtensilsCrossed,
  Camera,
  CheckCircle2,
  Star,
  Heart,
  Video,
  MapPin,
  ShoppingBag,
  Gift,
  Check,
} from "lucide-react";

const collaborationTypes = [
  "Sponsored content",
  "Brand partnership",
  "Hotel or resort stay",
  "Cruise partnership",
  "Destination campaign",
  "Event coverage",
  "Restaurant feature",
  "Giveaway or promotion",
];

const partnerTypes = [
  { title: "Cruise brands", icon: Ship },
  { title: "Hotels and resorts", icon: Hotel },
  { title: "Tourism boards", icon: Building2 },
  { title: "Restaurants and experiences", icon: UtensilsCrossed },
  { title: "Travel products", icon: Camera },
  { title: "Hospitality campaigns", icon: Handshake },
];

const whyCards = [
  {
    icon: Star,
    title: "Trusted travel voice",
    body: "Yolanda's audience follows her because she doesn't guess — she's been at sea for 20+ years and recommends only what she'd book herself.",
  },
  {
    icon: Ship,
    title: "Real cruise expertise",
    body: "As a Certified Cruise Specialist and preferred partner of Royal Caribbean, Carnival, and more, Yolanda's recommendations carry genuine weight.",
  },
  {
    icon: Heart,
    title: "Content that connects",
    body: "No scripted posts. Yolanda's content style — personal, useful, story-driven — earns attention that branded content alone can't buy.",
  },
];

const partnershipExamples = [
  {
    icon: Video,
    title: "Sponsored TikTok or Reels",
    body: "Authentic integration into Yolanda's live or short-form content.",
  },
  {
    icon: MapPin,
    title: "Destination Features",
    body: "Full destination spotlight across written, video, and social.",
  },
  {
    icon: Hotel,
    title: "Hotel or Resort Stays",
    body: "On-property coverage with real storytelling, not stock photography.",
  },
  {
    icon: Ship,
    title: "Cruise Content",
    body: "Onboard or port content with cruise-audience reach.",
  },
  {
    icon: ShoppingBag,
    title: "Product Integrations",
    body: "Trusted placement in Yolanda's real packing and planning routine.",
  },
  {
    icon: Gift,
    title: "Giveaways and Campaigns",
    body: "Audience-growing activations with clear brand tie-ins.",
  },
];

const proofImages = [
  { src: "/images/hero-yolanda.jpg", alt: "Yolanda, Travelholics founder" },
  { src: "/images/about-on-deck.jpg", alt: "Yolanda on deck" },
  { src: "/images/about-with-travelers.jpg", alt: "Yolanda with travelers" },
  { src: "/images/dest-caribbean.jpg", alt: "Caribbean destination" },
  { src: "/images/dest-mediterranean.jpg", alt: "Mediterranean destination" },
];

export default function CollaboratePage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    website: "",
    collaborationType: "Sponsored content",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = encodeURIComponent(
      `Travelholics Collaboration Inquiry from ${formData.company || formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nWebsite / Social: ${formData.website}\nCollaboration Type: ${formData.collaborationType}\n\nProject Details:\n${formData.details}`
    );

    window.location.href = `mailto:rjsmom1_68@yahoo.com?subject=${subject}&body=${body}`;

    setIsSuccess(true);
    setIsSubmitting(false);
    setFormData({
      name: "",
      company: "",
      email: "",
      website: "",
      collaborationType: "Sponsored content",
      details: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-slate-900">

      {/* 1. Editorial Hero */}
      <section className="relative bg-[#FAF9F6] overflow-hidden pt-20 pb-16 px-6">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #1e3a8a 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute -top-3 -left-3 right-3 bottom-3 border-2 border-[#f59e0b]/20 rounded-[20px] -z-10" />
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/images/hero-yolanda.jpg"
                  alt="Yolanda, founder of Travelholics"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-4 -right-4 lg:-right-6 bg-[#059669] text-white rounded-2xl px-5 py-3 shadow-xl shadow-emerald-900/30"
              >
                <p className="text-3xl font-extrabold leading-none">20+</p>
                <p className="text-xs text-emerald-100 mt-0.5">Years at Sea</p>
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#059669]/10 text-[#059669] text-sm font-semibold mb-6"
              >
                <Handshake size={14} />
                <span className="uppercase tracking-wider text-xs">Travelholics × Brand</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] leading-[1.05] tracking-tight mb-6"
              >
                Work With Yolanda
                <br />
                <span className="text-[#059669]">and Travelholics.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-slate-500 leading-relaxed max-w-xl mb-8"
              >
                Travelholics partners with brands, destinations, cruise lines, and hospitality businesses to create useful, story-driven travel content that feels personal and performs with real people.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <a
                  href="#collab-form"
                  className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  Start a Collaboration
                </a>
                <Link
                  href="/shop"
                  className="flex items-center justify-center border-2 border-slate-200 hover:border-[#059669] bg-white text-[#1e3a8a] font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  See Yolanda&apos;s Picks
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Why Brands Partner With Travelholics */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">Why it works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] leading-tight">
              Built on trust. Driven by real experience.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {whyCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[#FAF9F6] border border-slate-100 rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center mb-5">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1e3a8a] mb-3">{card.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{card.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Visual Proof Image Strip */}
      <section className="bg-[#1e3a8a] py-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-white/50 mb-6">Yolanda&apos;s world</p>
        <div className="flex overflow-hidden">
          {proofImages.map((img) => (
            <div key={img.src} className="relative flex-1 h-64 md:h-80 min-w-0">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-all duration-500"
                sizes="20vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Collaboration Types */}
      <section className="py-20 px-6 bg-[#FAF9F6] border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">Ways we work together</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] leading-tight mb-4">
              Business-forward partnerships that still feel personal.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Travelholics is not just posting pretty pictures. Yolanda helps people discover trips worth taking, products worth packing, and experiences worth booking.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid sm:grid-cols-2 gap-3"
          >
            {collaborationTypes.map((item) => (
              <div
                key={item}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-4 font-semibold text-slate-700 flex items-center gap-2"
              >
                <Check size={15} className="text-[#059669] shrink-0" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. What a Partnership Can Look Like */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">Partnership examples</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] leading-tight max-w-xl">
              Here&apos;s what we can create together.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partnershipExamples.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#059669]/10 text-[#059669] flex items-center justify-center mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-extrabold text-[#1e3a8a] mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Ideal Partners */}
      <section className="py-20 px-6 bg-[#FAF9F6] border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">Ideal partners</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] leading-tight mb-4 max-w-xl">
              The kinds of brands and businesses we want to hear from.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
              We are especially interested in partnerships that help travelers plan better, experience more, and feel more prepared before they go.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerTypes.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <span className="font-bold text-slate-800">{item.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Form Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">Get in touch</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] leading-tight mb-4">
              Ready to work together?
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Tell us what you have in mind and Yolanda will be in touch.
            </p>
          </motion.div>

          <motion.div
            id="collab-form"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#FAF9F6] rounded-3xl border border-slate-200 p-7 lg:p-8 shadow-sm"
          >
            {isSuccess ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-[#059669] rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-2">
                  Collaboration request started.
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Your email draft should be open now. Send it through and Yolanda can review the opportunity.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-[#059669] font-semibold text-sm hover:underline"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Brand / Company</label>
                  <input
                    required
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                    placeholder="Brand or company name"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                      placeholder="name@brand.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Website or Social</label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                      placeholder="Website or @handle"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Collaboration Type</label>
                  <select
                    value={formData.collaborationType}
                    onChange={(e) => setFormData({ ...formData, collaborationType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                  >
                    {collaborationTypes.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Project Details</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all resize-none"
                    placeholder="Tell us what you have in mind, your goals, and any dates or deliverables that matter."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? "Opening..." : "Start a Collaboration"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

    </main>
  );
}
