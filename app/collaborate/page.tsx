"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake, Building2, Ship, Hotel, UtensilsCrossed, Camera, CheckCircle2 } from "lucide-react";

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
  {
    title: "Cruise brands",
    icon: Ship,
  },
  {
    title: "Hotels and resorts",
    icon: Hotel,
  },
  {
    title: "Tourism boards",
    icon: Building2,
  },
  {
    title: "Restaurants and experiences",
    icon: UtensilsCrossed,
  },
  {
    title: "Travel products",
    icon: Camera,
  },
  {
    title: "Hospitality campaigns",
    icon: Handshake,
  },
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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#111827] text-white pt-28 pb-20 px-6">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-emerald-300 text-sm font-semibold mb-6">
              <Handshake size={16} />
              Partner With Travelholics
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              Thoughtful collaborations for brands that want trusted travel visibility.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              Travelholics is open to meaningful collaborations with cruise lines, hotels, destinations, restaurants, travel products, and hospitality brands that want to connect with real travelers through useful, personal content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#collab-form" className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-6 py-4 rounded-xl transition-all text-center">
                Start a Collaboration
              </a>
              <Link href="/shop" className="border border-white/20 hover:border-emerald-400 text-white font-bold px-6 py-4 rounded-xl transition-all text-center">
                See Yolanda&apos;s Picks
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">Ways we work together</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] leading-tight mb-4">
              Business-forward partnerships that still feel personal.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Travelholics is not just posting pretty pictures. Yolanda helps people discover trips worth taking, products worth packing, and experiences worth booking.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {collaborationTypes.map((item) => (
              <div key={item} className="bg-[#FAF9F6] border border-slate-200 rounded-2xl px-4 py-4 font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#059669] mb-3">Ideal partners</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] leading-tight mb-4">
              The kinds of brands and businesses we want to hear from.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              We are especially interested in partnerships that help travelers plan better, experience more, and feel more prepared before they go.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {partnerTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-3 shadow-sm">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="font-bold text-slate-800">{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <motion.div
            id="collab-form"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border border-slate-200 p-7 lg:p-8 shadow-sm"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                      placeholder="name@brand.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Website or Social</label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all resize-none"
                    placeholder="Tell us what you have in mind, your goals, and any dates or deliverables that matter."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
