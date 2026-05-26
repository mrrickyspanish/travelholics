"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { buildFallbackMailto, sendFormEmail } from "@/lib/form-email";
import { motion } from "framer-motion";
import { CheckCircle, Ship } from "lucide-react";
import { RippleButton } from "@/components/ripple-button";

// TODO: Confirm destination options with Yolanda — these are reasonable defaults
const DESTINATION_OPTIONS = [
  "Caribbean",
  "Alaska",
  "Mediterranean",
  "Bahamas",
  "Mexico / Mexican Riviera",
  "Hawaii",
  "Bermuda",
  "Europe (River Cruise)",
  "Not Sure Yet",
];

const TIMING_OPTIONS = [
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "1–2 years",
  "Just exploring options",
];

// Postage-stamp decoration for left column bottom
const PostageStamp = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 100" className={className} aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="74" height="94" rx="2" stroke="rgba(244,196,204,0.5)" strokeWidth="1.5" strokeDasharray="5 3" fill="rgba(255,255,255,0.06)" />
    <rect x="10" y="10" width="60" height="62" rx="2" fill="rgba(255,255,255,0.07)" />
    <text x="40" y="50" textAnchor="middle" fontSize="28" fill="rgba(255,255,255,0.2)">✈</text>
    <text x="40" y="82" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="monospace" fontWeight="bold" letterSpacing="1">TRAVELHOLIC</text>
  </svg>
);

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    destination: "", timing: "", message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

  const directMailto = buildFallbackMailto(
    `New Cruise Inquiry from ${fullName || "Website Visitor"}`,
    `Name: ${fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDestination: ${formData.destination}\nTiming: ${formData.timing}\nMessage: ${formData.message}`
  );

  const fireConfetti = () => {
    const colors = ["#F26A75", "#0d4a3a", "#10755A", "#FCFAF5", "#F4C4CC"];
    confetti({ particleCount: 90, spread: 70, origin: { x: 0.35, y: 0.55 }, colors });
    setTimeout(() => {
      confetti({ particleCount: 90, spread: 70, origin: { x: 0.65, y: 0.55 }, colors });
    }, 160);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Honeypot — silent discard
    if (website.trim()) {
      fireConfetti();
      setIsSuccess(true);
      setIsSubmitting(false);
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase.from("cruise_inquiries").insert([{
          name: fullName,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          destination: formData.destination,
          timing: formData.timing,
          message: formData.message,
        }]);
        if (error) console.warn("Supabase insert failed, continuing:", error);
      }

      await sendFormEmail({
        formType: "contact",
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        message: `Destination: ${formData.destination}\nTiming: ${formData.timing}\n\n${formData.message}`,
      });

      fireConfetti();
      setIsSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", destination: "", timing: "", message: "" });
      setWebsite("");
    } catch (err) {
      console.error("Form submit error:", err);
      setSubmitError("We could not send your inquiry right now. Please try again or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-blush bg-white focus:border-emerald-mid focus:ring-2 focus:ring-emerald-mid/20 outline-none transition-all text-[14px] text-ink placeholder:text-stone/55";
  const labelClass = "block text-[13px] font-semibold text-ink mb-1.5";

  return (
    <section id="contact" className="bg-sand py-20 relative overflow-hidden">
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #2A3B36 1px, transparent 0)", backgroundSize: "32px 32px" }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-[22%_28%_50%] rounded-3xl overflow-hidden shadow-2xl shadow-ink/10"
        >

          {/* ── Col 1: Tropical beach photo ── */}
          <div className="relative hidden lg:block min-h-[420px]">
            {/* TODO: Replace with a real tropical island/beach photo when available */}
            {/* Using dest-caribbean.jpg as placeholder — needs a proper beach/island shot */}
            <Image
              src="/images/dest-caribbean.jpg"
              alt="Tropical cruise destination"
              fill
              className="object-cover object-center"
              sizes="22vw"
            />
            {/* Very light emerald tint to tie it to the panel next to it */}
            <div className="absolute inset-0 bg-emerald-deep/10" />
          </div>

          {/* ── Col 2: Emerald-deep headline + bullets panel ── */}
          <div className="relative bg-emerald-deep px-7 py-10 flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <p className="type-kicker text-coral mb-3">Let&apos;s Make It Happen</p>
              <h2 className="font-serif text-2xl lg:text-[1.65rem] font-semibold text-white leading-tight mb-3 tracking-tight">
                Plan Your Next Cruise
              </h2>
              <p className="font-script text-[1.5rem] text-coral leading-tight mb-7">
                Let&apos;s make your dream vacation a reality.
              </p>
              <ul className="space-y-3">
                {[
                  "Personalized recommendations",
                  "Exclusive perks & upgrades",
                  "Group trips made easy",
                  "No booking fees—ever",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-coral shrink-0" />
                    <span className="text-[13px] font-medium text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <PostageStamp className="relative z-10 mt-8 w-12 h-[60px] self-start opacity-50" />
          </div>

          {/* ── Col 3: Form ── */}
          <div className="bg-cream px-8 py-8">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <div className="w-14 h-14 bg-blush text-coral rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={30} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-ink mb-2">You&apos;re on the List!</h3>
                <p className="mb-5 max-w-[38ch] text-[17px] font-medium leading-[1.65] text-ink/82">
                  I&apos;ve received your inquiry and will be in touch within 24 hours. Start dreaming—I&apos;ll handle the rest.
                </p>
                <button onClick={() => setIsSuccess(false)} className="text-coral font-semibold text-sm hover:underline">
                  Send another inquiry
                </button>
              </div>
            ) : (
              <>
                <p className="mb-5 max-w-[38ch] text-[17px] font-medium leading-[1.65] text-ink/82">Ready to set sail? Tell us a little about your trip.</p>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Honeypot */}
                  <div className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>

                  {/* Row 1: First + Last */}
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>First Name</label>
                      <input id="firstName" required type="text" placeholder="Jane" className={inputClass}
                        value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>Last Name</label>
                      <input id="lastName" required type="text" placeholder="Smith" className={inputClass}
                        value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                  </div>

                  {/* Row 2: Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="email" className={labelClass}>Email Address</label>
                      <input id="email" required type="email" placeholder="jane@email.com" className={inputClass}
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone <span className="text-stone font-normal">(Optional)</span>
                      </label>
                      <input id="phone" type="tel" placeholder="(555) 000-0000" className={inputClass}
                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>

                  {/* Row 3: Destination + Timing */}
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="destination" className={labelClass}>Where would you like to go?</label>
                      <select id="destination" required className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })}>
                        <option value="" disabled>Select destination…</option>
                        {DESTINATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timing" className={labelClass}>When are you looking to travel?</label>
                      <select id="timing" required className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.timing} onChange={(e) => setFormData({ ...formData, timing: e.target.value })}>
                        <option value="" disabled>Select timeframe…</option>
                        {TIMING_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label htmlFor="message" className={labelClass}>Tell us about your dream trip…</label>
                    <textarea id="message" required rows={4} placeholder="Where do you want to go? How many travelers? Any special occasions?"
                      className={`${inputClass} resize-none`}
                      value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                  </div>

                  <RippleButton
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-coral hover:bg-coral-deep text-white font-semibold py-3.5 rounded-xl shadow-md shadow-coral/15 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-[14px]"
                  >
                    {isSubmitting ? "Submitting…" : (<>Send My Cruise Inquiry <Ship size={16} /></>)}
                  </RippleButton>

                  {submitError && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <p className="font-semibold">Submission issue</p>
                      <p className="mt-1">{submitError}</p>
                      <a href={directMailto} className="mt-2 inline-flex text-amber-900 underline underline-offset-2">Email directly instead</a>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>

        </motion.div>
      </div>
    </section>
  );
};
