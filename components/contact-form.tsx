"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Ship, CheckCircle, Anchor } from "lucide-react";

export const ContactForm = () => {
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
      const mailtoLink = `mailto:yo@travelholics.com?bcc=rj@creativeeyemultimedia.com&subject=New Cruise Inquiry from ${formData.name}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0AMessage: ${formData.message}`;
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
    <section
      id="contact"
      className="bg-[#1e3a8a] py-24 relative overflow-hidden"
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Personal touch */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              Ready to Start?
              <br />
              <span className="text-[#059669]">Let&apos;s Talk.</span>
            </h2>
            <p className="text-base text-blue-100/50 leading-relaxed mb-8">
              Tell me about your dream trip and I&apos;ll respond within 24
              hours with a personalized plan. No pressure, no spam — just a real
              conversation about your next adventure.
            </p>

            {/* Yolanda mini-portrait */}
            <div className="flex items-center gap-3">
              {/*
                REPLACE with Yolanda headshot:
                <Image src="/images/yolanda-headshot.jpg" alt="Yolanda"
                  width={52} height={52} className="rounded-full object-cover
                  border-2 border-[#059669]" />
              */}
              <div className="w-13 h-13 rounded-full bg-[#059669]/30 border-2 border-[#059669] flex items-center justify-center shrink-0">
                <Anchor size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-[15px]">Yolanda</p>
                <p className="text-[#059669] text-xs font-medium">
                  Replies within 24 hours
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white rounded-3xl p-7 lg:p-8"
          >
            {isSuccess ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-[#059669] rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-2">
                  You&apos;re on the List!
                </h3>
                <p className="text-slate-500 mb-6 text-sm">
                  I&apos;ve received your inquiry and will be in touch soon.
                  Start dreaming — I&apos;ll handle the rest.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-[#059669] font-semibold text-sm hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all text-[15px]"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="jane@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all text-[15px]"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all text-[15px]"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all resize-none text-[15px]"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-[15px]"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Let&apos;s Set Sail <Ship size={18} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400">
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
