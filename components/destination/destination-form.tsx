"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { buildFallbackMailto, sendFormEmail } from "@/lib/form-email";
import { Button } from "@/components/button";
import { CheckCircle } from "lucide-react";

const TIMING_OPTIONS = [
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "1–2 years",
  "Just exploring options",
];

const inputClasses =
  "w-full rounded-xl border border-stone/30 bg-white px-4 py-3 text-[16px] text-ink placeholder:text-stone/70 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30 min-h-[44px]";

export function DestinationForm({ destination }: { destination: string }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    timing: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (website) return; // bot caught by honeypot

    const missing: string[] = [];
    if (!formData.firstName) missing.push("First Name");
    if (!formData.lastName) missing.push("Last Name");
    if (!formData.email) missing.push("Email Address");
    if (!formData.timing) missing.push("Travel Timeframe");
    if (!formData.message) missing.push("Trip Details");
    if (missing.length) {
      setSubmitError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    // Destination + timeframe ride inside the message so the existing
    // "contact" email template surfaces them without API changes.
    const composedMessage = `[${destination} destination page]\nTimeframe: ${formData.timing}\n\n${formData.message}`;

    try {
      if (supabase) {
        const { error } = await supabase.from("cruise_inquiries").insert([
          {
            name: fullName,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            destination,
            timing: formData.timing,
            message: formData.message,
          },
        ]);
        if (error) console.warn("Supabase insert failed, continuing:", error);
      }

      await sendFormEmail({
        formType: "contact",
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        message: composedMessage,
      });

      setIsSuccess(true);
    } catch {
      const mailto = buildFallbackMailto(
        `${destination} Cruise Inquiry from ${fullName}`,
        composedMessage,
      );
      setSubmitError(
        `Something went wrong sending your inquiry. You can email Yolanda directly instead: ${mailto}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl bg-cream p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-mid" aria-hidden="true" />
        <h3 className="font-serif text-2xl text-ink">You&apos;re on the list.</h3>
        <p className="mt-2 text-stone">
          Yolanda will reach out about your {destination} trip soon. Start thinking about
          cabin sides.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-cream p-6 shadow-sm sm:p-8">
      {/* Honeypot, hidden from humans */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dest-firstName" className="mb-1 block text-sm font-semibold text-ink">
            First Name *
          </label>
          <input
            id="dest-firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className={inputClasses}
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="dest-lastName" className="mb-1 block text-sm font-semibold text-ink">
            Last Name *
          </label>
          <input
            id="dest-lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className={inputClasses}
            autoComplete="family-name"
          />
        </div>
        <div>
          <label htmlFor="dest-email" className="mb-1 block text-sm font-semibold text-ink">
            Email Address *
          </label>
          <input
            id="dest-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="dest-phone" className="mb-1 block text-sm font-semibold text-ink">
            Phone (Optional)
          </label>
          <input
            id="dest-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
            autoComplete="tel"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="dest-timing" className="mb-1 block text-sm font-semibold text-ink">
            Travel Timeframe *
          </label>
          <select
            id="dest-timing"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select timeframe…</option>
            {TIMING_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="dest-message" className="mb-1 block text-sm font-semibold text-ink">
            Tell us about your {destination} trip *
          </label>
          <textarea
            id="dest-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Who's going, what you're celebrating, what a perfect day looks like…"
          />
        </div>
      </div>

      {submitError && (
        <p className="mt-4 text-sm font-medium text-coral-deep" role="alert">
          {submitError}
        </p>
      )}

      <Button
        variant="coral"
        className="mt-6 w-full sm:w-auto"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending…" : `Start Planning My ${destination} Trip`}
      </Button>
      <p className="mt-3 text-xs text-stone">
        No booking fees, ever. Same prices as booking direct.
      </p>
    </div>
  );
}
