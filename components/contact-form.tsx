"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";
import { buildFallbackMailto, sendFormEmail } from "@/lib/form-email";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

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

export const ContactForm = () => {
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    destination: "",
    timing: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [website, setWebsite] = useState("");

  const getMissingRequiredFields = () => {
    const checks: Array<[string, string]> = [
      ["First Name", formData.firstName],
      ["Last Name", formData.lastName],
      ["Email Address", formData.email],
      ["Destination", formData.destination],
      ["Travel Timeframe", formData.timing],
      ["Dream Trip Details", formData.message],
    ];
    return checks.filter(([, value]) => !value.trim()).map(([label]) => label);
  };

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();
  const directMailto = buildFallbackMailto(
    `New Cruise Inquiry from ${fullName || "Website Visitor"}`,
    `Name: ${fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDestination: ${formData.destination}\nTiming: ${formData.timing}\nMessage: ${formData.message}`,
  );

  const fireConfetti = () => {
    const colors = ["#F26A75", "#0d4a3a", "#10755A", "#FCFAF5", "#F4C4CC"];
    confetti({ particleCount: 90, spread: 70, origin: { x: 0.35, y: 0.55 }, colors });
    setTimeout(() => confetti({ particleCount: 90, spread: 70, origin: { x: 0.65, y: 0.55 }, colors }), 160);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (website.trim()) {
      fireConfetti();
      setIsSuccess(true);
      setIsSubmitting(false);
      return;
    }

    const missingFields = getMissingRequiredFields();
    if (missingFields.length) {
      setSubmitError(`Please complete: ${missingFields.join(", ")}.`);
      setIsSubmitting(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setSubmitError("Please enter a valid email address.");
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

  const inputClass = "mt-2 w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-base text-ink outline-none transition placeholder:text-stone/45 focus:border-coral focus:ring-0";
  const labelClass = "block text-sm font-bold text-ink";

  return (
    <section id="contact" className="overflow-hidden bg-[#082d27] text-white">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto grid max-w-[96rem] lg:grid-cols-[0.4fr_0.6fr]"
      >
        <div className="flex flex-col justify-between px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">Your turn</p>
            <h2 className="mt-5 max-w-[8ch] font-serif text-[clamp(3.8rem,7vw,7.4rem)] font-semibold leading-[0.83] tracking-[-0.07em]">
              Tell Yolanda where your mind keeps going.
            </h2>
            <p className="mt-7 max-w-md text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
              You do not need the ship, cabin, or perfect dates figured out. Start with what you know. She will help shape the rest.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 border-y border-white/14 py-5 text-sm font-semibold text-white/66">
            <p className="border-r border-white/14 pr-5">Personal recommendations</p>
            <p className="pl-5">No planning fees</p>
          </div>
        </div>

        <div className="bg-[#fbf7ef] px-5 py-16 text-ink sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
          <div className="mx-auto max-w-[48rem] lg:mx-0">
            {isSuccess ? (
              <div className="flex min-h-[34rem] flex-col justify-center border-y border-ink/12 py-10">
                <CheckCircle className="text-coral" size={42} />
                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-coral">Inquiry received</p>
                <h3 className="mt-3 max-w-[12ch] font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.055em] text-royal-deep sm:text-6xl">Now the fun part starts.</h3>
                <p className="mt-5 max-w-xl text-base leading-7 text-stone">Yolanda has your inquiry and will be in touch within 24 hours. Start dreaming. She will help with the decisions.</p>
                <button onClick={() => setIsSuccess(false)} className="mt-7 w-fit text-sm font-black text-ink underline decoration-coral decoration-2 underline-offset-4">Send another inquiry</button>
              </div>
            ) : (
              <>
                <div className="flex items-end justify-between gap-5 border-b border-ink/12 pb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-coral">Cruise planning inquiry</p>
                    <p className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-royal-deep sm:text-4xl">Give us the starting point.</p>
                  </div>
                  <p className="hidden text-xs font-semibold text-stone/65 sm:block">* Required</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
                  <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>

                  <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                    <label htmlFor="firstName" className={labelClass}>First name *<input id="firstName" required type="text" placeholder="Jane" className={inputClass} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} /></label>
                    <label htmlFor="lastName" className={labelClass}>Last name *<input id="lastName" required type="text" placeholder="Smith" className={inputClass} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} /></label>
                    <label htmlFor="email" className={labelClass}>Email address *<input id="email" required type="email" placeholder="jane@email.com" className={inputClass} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></label>
                    <label htmlFor="phone" className={labelClass}>Phone <span className="font-normal text-stone">(optional)</span><input id="phone" type="tel" placeholder="(555) 000-0000" className={inputClass} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></label>
                    <label htmlFor="destination" className={labelClass}>Destination *<select id="destination" required className={`${inputClass} cursor-pointer`} value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })}><option value="" disabled>Select destination...</option>{DESTINATION_OPTIONS.map((destination) => <option key={destination} value={destination}>{destination}</option>)}</select></label>
                    <label htmlFor="timing" className={labelClass}>Travel timeframe *<select id="timing" required className={`${inputClass} cursor-pointer`} value={formData.timing} onChange={(e) => setFormData({ ...formData, timing: e.target.value })}><option value="" disabled>Select timeframe...</option>{TIMING_OPTIONS.map((timing) => <option key={timing} value={timing}>{timing}</option>)}</select></label>
                  </div>

                  <label htmlFor="message" className={labelClass}>Tell us about the trip *<textarea id="message" required rows={4} placeholder="Where do you want to go? Who is traveling? Any special occasion?" className={`${inputClass} min-h-28 resize-y`} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} /></label>

                  {submitError && (
                    <div className="border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <p className="font-semibold">Submission issue</p>
                      <p className="mt-1">{submitError}</p>
                      <a href={directMailto} className="mt-2 inline-flex underline underline-offset-2">Email directly instead</a>
                    </div>
                  )}

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {isSubmitting ? "Sending..." : "Start planning my trip"} <ArrowRight size={17} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
