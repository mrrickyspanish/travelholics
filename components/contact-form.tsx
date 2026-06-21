"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";
import { buildFallbackMailto, sendFormEmail } from "@/lib/form-email";
import { motion } from "framer-motion";
import { CheckCircle, Ship } from "lucide-react";
import { Button } from "@/components/button";

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

    return checks
      .filter(([, value]) => !value.trim())
      .map(([label]) => label);
  };

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

  const inputClass =
    "w-full min-h-12 rounded-2xl border border-blush bg-white px-4 py-3 text-[15px] text-ink outline-none transition-all placeholder:text-stone/55 focus:border-emerald-mid focus:ring-2 focus:ring-emerald-mid/20";
  const labelClass = "mb-1.5 block text-[0.95rem] font-semibold text-ink";

  return (
    <section id="contact" className="relative overflow-hidden bg-emerald-deep text-white">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid min-h-[42rem] lg:grid-cols-[0.44fr_0.56fr]"
      >
        <div className="relative flex items-center bg-emerald-deep px-5 py-16 sm:px-8 lg:px-10 xl:px-16">
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #FCFAF5 1px, transparent 0)", backgroundSize: "28px 28px" }} aria-hidden="true" />
          <div className="relative z-10 mx-auto w-full max-w-[34rem] lg:mr-0 lg:ml-auto">
            <p className="font-script text-[2.7rem] font-semibold leading-none text-coral sm:text-[3.1rem]">
              Let&apos;s make it happen
            </p>
            <h2 className="type-homepage-h2 mt-4 font-serif text-white">
              Plan your next cruise.
            </h2>
            <p className="mt-6 max-w-[31ch] text-[1.08rem] font-medium leading-[1.75] text-white/78 sm:text-[1.18rem]">
              Tell Yolanda where your mind keeps wandering. She will help turn the idea into the right ship, stay, timing, and plan.
            </p>

            <ul className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Personalized recommendations",
                "Exclusive perks and upgrades",
                "Group trips made easier",
                "No booking fees, ever",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-coral ring-1 ring-white/12">
                    <CheckCircle size={16} strokeWidth={2.3} />
                  </span>
                  <span className="text-[1rem] font-semibold text-white/88">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center bg-cream px-5 py-16 text-ink sm:px-8 lg:px-10 xl:px-16">
          <div className="mx-auto w-full max-w-[48rem] lg:ml-0 lg:mr-auto">
            {isSuccess ? (
              <div className="flex min-h-[30rem] flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-[0_22px_60px_rgba(26,58,82,0.08)]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blush text-coral">
                  <CheckCircle size={34} />
                </div>
                <h3 className="font-serif text-[2rem] font-semibold leading-tight text-ink">You&apos;re on the list!</h3>
                <p className="mt-3 max-w-[38ch] text-[1.05rem] font-medium leading-relaxed text-ink/76">
                  I&apos;ve received your inquiry and will be in touch within 24 hours. Start dreaming. I&apos;ll handle the rest.
                </p>
                <button onClick={() => setIsSuccess(false)} className="mt-6 font-semibold text-coral underline underline-offset-4">
                  Send another inquiry
                </button>
              </div>
            ) : (
              <div className="rounded-[2rem] bg-white/76 p-5 shadow-[0_22px_60px_rgba(26,58,82,0.08)] ring-1 ring-white/80 sm:p-7 lg:p-8">
                <p className="max-w-[42ch] text-[1.05rem] font-semibold leading-relaxed text-ink/78">
                  Ready to set sail? Tell us a little about your trip.
                </p>
                <p className="mt-2 text-[0.95rem] font-semibold text-stone/70">* Required fields</p>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                  <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>First Name *</label>
                      <input id="firstName" required type="text" placeholder="Jane" className={inputClass} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>Last Name *</label>
                      <input id="lastName" required type="text" placeholder="Smith" className={inputClass} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className={labelClass}>Email Address *</label>
                      <input id="email" required type="email" placeholder="jane@email.com" className={inputClass} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone <span className="font-normal text-stone">(Optional)</span></label>
                      <input id="phone" type="tel" placeholder="(555) 000-0000" className={inputClass} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="destination" className={labelClass}>Destination *</label>
                      <select id="destination" required className={`${inputClass} cursor-pointer appearance-none`} value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })}>
                        <option value="" disabled>Select destination...</option>
                        {DESTINATION_OPTIONS.map((destination) => <option key={destination} value={destination}>{destination}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timing" className={labelClass}>Travel Timeframe *</label>
                      <select id="timing" required className={`${inputClass} cursor-pointer appearance-none`} value={formData.timing} onChange={(e) => setFormData({ ...formData, timing: e.target.value })}>
                        <option value="" disabled>Select timeframe...</option>
                        {TIMING_OPTIONS.map((timing) => <option key={timing} value={timing}>{timing}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>Tell us about your dream trip *</label>
                    <textarea id="message" required rows={5} placeholder="Where do you want to go? How many travelers? Any special occasions?" className={`${inputClass} resize-none`} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                  </div>

                  <Button disabled={isSubmitting} type="submit" variant="coral" className="flex w-full items-center justify-center gap-2 text-[15px]">
                    {isSubmitting ? "Submitting..." : (<><span>Start Planning My Trip</span> <Ship size={16} /></>)}
                  </Button>

                  {submitError && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <p className="font-semibold">Submission issue</p>
                      <p className="mt-1">{submitError}</p>
                      <a href={directMailto} className="mt-2 inline-flex text-amber-900 underline underline-offset-2">Email directly instead</a>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
