"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Ship, CheckCircle, ExternalLink, Anchor, Waves } from "lucide-react";

export const Hero = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase
      if (supabase) {
        const { error } = await supabase.from("cruise_inquiries").insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          },
        ]);
        if (error) throw error;
      }

      // 2. Trigger mailto (V1 fallback as requested)
      const mailtoLink = `mailto:yolanda@example.com?subject=New Cruise Inquiry from ${formData.name}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0AMessage: ${formData.message}`;
      window.location.href = mailtoLink;

      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=2000&q=80"
          alt="Cruise ship sailing through turquoise waters at sunset"
          className="w-full h-full object-cover"
        />
        {/* Multi-layer overlay for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#1e3a8a]/70 to-[#1e3a8a]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/60 via-transparent to-[#1e3a8a]/20" />
      </div>

      {/* Subtle animated wave accent */}
      <div className="absolute bottom-0 left-0 w-full z-[1] opacity-20 text-[#059669]">
        <Waves size={2000} strokeWidth={0.3} className="w-full" />
      </div>

      <div className="container mx-auto px-6 py-16 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Storytelling Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-8 border border-white/10"
            >
              <Anchor size={14} className="text-[#f59e0b]" />
              <span>Certified Cruise Specialist · 20+ Years</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
              Your Next Chapter{" "}
              <br />
              <span className="text-[#059669]">Starts at Sea</span>
            </h1>

            <p className="text-lg lg:text-xl text-blue-100/80 mb-10 max-w-lg leading-relaxed">
              I&apos;m Yolanda — and for over two decades, I&apos;ve been turning
              bucket-list destinations into boarding passes. Whether it&apos;s a
              family reunion on the Caribbean or a once-in-a-lifetime Alaskan
              glacier voyage, I handle every detail so you can simply enjoy the
              horizon.
            </p>

            {/* Social proof + TikTok CTA row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              {/* TikTok — now a real linked CTA */}
              <a
                href="https://www.tiktok.com/@rjsmom1"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3 hover:bg-white/20 transition-all"
              >
                {/* TikTok SVG icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
                </svg>
                <div className="text-left">
                  <p className="text-xs text-blue-100/60 leading-tight">
                    Follow the journey
                  </p>
                  <p className="font-bold text-white text-sm group-hover:text-[#059669] transition-colors">
                    @rjsmom1
                  </p>
                </div>
                <ExternalLink
                  size={14}
                  className="text-white/40 group-hover:text-white/70 ml-1 transition-colors"
                />
              </a>

              <div className="h-10 w-px bg-white/10 hidden sm:block" />

              {/* Traveler count */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["#059669", "#f59e0b", "#1e3a8a", "#e11d48"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: color }}
                      >
                        {["YT", "MR", "SJ", "ED"][i]}
                      </div>
                    )
                  )}
                </div>
                <p className="text-sm text-blue-100/60">
                  <span className="text-white font-bold">500+</span> happy
                  travelers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-xl p-8 lg:p-10 rounded-3xl shadow-2xl shadow-black/20 border border-white/50"
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center">
                  <Ship size={16} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1e3a8a]">
                  Start Your Voyage
                </h2>
              </div>
              <p className="text-slate-500">
                Tell me about your dream trip — I&apos;ll respond within 24
                hours with a personalized plan.
              </p>
            </div>

            {isSuccess ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-2">
                  You&apos;re on the List!
                </h3>
                <p className="text-slate-500 mb-6">
                  I&apos;ve received your inquiry and will be in touch soon.
                  Start dreaming — I&apos;ll handle the rest.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-[#059669] font-semibold hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="jane@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Phone{" "}
                      <span className="text-slate-400 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Tell me about your dream trip
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Where do you want to go? How many travelers? Any special occasions?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all resize-none"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Let&apos;s Set Sail <Ship size={18} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  No spam, no pressure — just a conversation about your next
                  adventure.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
