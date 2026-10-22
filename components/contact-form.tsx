"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { buildFallbackMailto, sendFormEmail } from "@/lib/form-email";
import { ArrowRight, CheckCircle } from "lucide-react";
import { appendLeadAttribution } from "@/lib/lead-attribution";

const DESTINATION_OPTIONS = ["Caribbean", "Alaska", "Mediterranean", "Bahamas", "Mexico / Mexican Riviera", "Hawaii", "Bermuda", "Europe (River Cruise)", "Not Sure Yet"];
const TIMING_OPTIONS = ["Within 3 months", "3–6 months", "6–12 months", "1–2 years", "Just exploring options"];
const EMPTY_FORM = { firstName: "", lastName: "", email: "", phone: "", destination: "", timing: "", message: "" };
type Field = keyof typeof EMPTY_FORM;
type Errors = Partial<Record<Field, string>>;
const contactFields = [
  { name: "firstName", label: "First name", type: "text", autocomplete: "given-name", placeholder: "Jane", required: true },
  { name: "lastName", label: "Last name", type: "text", autocomplete: "family-name", placeholder: "Smith", required: true },
  { name: "email", label: "Email address", type: "email", autocomplete: "email", placeholder: "jane@email.com", required: true },
  { name: "phone", label: "Phone", type: "tel", autocomplete: "tel", placeholder: "(555) 000-0000", required: false },
] as const;

export const ContactForm = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const pending = useRef(false);

  useEffect(() => { if (isSuccess) successRef.current?.focus(); }, [isSuccess]);

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();
  const directMailto = buildFallbackMailto(
    `New Cruise Inquiry from ${fullName || "Website Visitor"}`,
    `Name: ${fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDestination: ${formData.destination}\nTiming: ${formData.timing}\nMessage: ${formData.message}`,
  );
  const updateField = (name: Field, value: string) => setFormData(current => ({ ...current, [name]: value }));
  const fieldProps = (name: Field) => ({
    id: name, name, value: formData[name],
    "aria-invalid": !!fieldErrors[name],
    "aria-describedby": fieldErrors[name] ? `${name}-error` : undefined,
  });
  const errorFor = (name: Field) => fieldErrors[name] ? <span id={`${name}-error`} className="contact-field-error">{fieldErrors[name]}</span> : null;

  const celebrate = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 45, spread: 55, origin: { y: .65 }, colors: ["#F26A75", "#10755A", "#FCFAF5"], disableForReducedMotion: true });
    }).catch(() => { /* A decorative effect must never affect delivery. */ });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    setSubmitError(null);
    const errors: Errors = {};
    for (const [name, label] of [["firstName", "your first name"], ["lastName", "your last name"], ["email", "your email address"], ["destination", "a destination"], ["timing", "a travel timeframe"], ["message", "a few details about your trip"]] as const) {
      if (!formData[name].trim()) errors[name] = `Please enter ${label}.`;
    }
    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) errors.email = "Please enter a valid email address.";
    setFieldErrors(errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`#${firstError}`)?.focus());
      return;
    }
    if (website.trim()) { setIsSuccess(true); return; }
    pending.current = true;
    setIsSubmitting(true);
    const inquiryMessage = appendLeadAttribution(formData.message);
    try {
      if (supabase) {
        const { error } = await supabase.from("cruise_inquiries").insert([{
          name: fullName, first_name: formData.firstName, last_name: formData.lastName,
          email: formData.email, phone: formData.phone, destination: formData.destination,
          timing: formData.timing, message: inquiryMessage,
        }]);
        if (error) console.warn("Supabase insert failed, continuing:", error);
      }
      await sendFormEmail({ formType: "contact", name: fullName, email: formData.email, phone: formData.phone, message: `Destination: ${formData.destination}\nTiming: ${formData.timing}\n\n${inquiryMessage}` });
      setIsSuccess(true);
      setFormData(EMPTY_FORM);
      setWebsite("");
      celebrate();
    } catch {
      setSubmitError("We could not send your inquiry right now. Please try again or email me directly.");
    } finally {
      pending.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="home-contact" aria-labelledby="contact-title">
      <div className="home-container home-contact-grid">
        <div className="home-contact-intro">
          <p className="home-eyebrow">Your turn</p>
          <h2 id="contact-title" className="home-heading">Tell Yolanda where your mind keeps going.</h2>
          <p className="home-body">You do not need the ship, cabin, or perfect dates figured out. Start with what you know. She will help shape the rest.</p>
          <div className="contact-reassurance"><p>Personal recommendations</p><p>No planning fees</p></div>
        </div>
        <div className="home-contact-panel">
          {isSuccess ? (
            <div className="contact-success" role="status" aria-live="polite">
              <CheckCircle aria-hidden="true" className="text-coral" size={42} />
              <p className="home-eyebrow">Inquiry received</p>
              <h3 ref={successRef} tabIndex={-1} className="home-heading">Now the fun part starts.</h3>
              <p className="home-body">Yolanda has your inquiry and will be in touch within 24 hours. Start dreaming. She will help with the decisions.</p>
              <button type="button" onClick={() => { setIsSuccess(false); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('#firstName')?.focus()); }} className="home-text-link">Send another inquiry</button>
            </div>
          ) : (
            <>
              <div className="contact-form-heading"><p className="home-eyebrow">Cruise planning inquiry</p><p data-headline>Give us the starting point.</p><p id="contact-required">* Required</p></div>
              <noscript><style>{'.contact-form { display: none; }'}</style><p className="home-body">To start planning without JavaScript, <a className="home-text-link" href={directMailto}>Email directly instead</a>.</p></noscript>
              <form ref={formRef} onSubmit={handleSubmit} noValidate aria-describedby="contact-required" aria-busy={isSubmitting} className="contact-form">
                <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
                {Object.keys(fieldErrors).length > 0 && <p role="alert" className="contact-error-summary">Please check the highlighted fields below.</p>}
                <div className="contact-name-fields">
                  {contactFields.map(field => <div key={field.name} className="contact-field"><label htmlFor={field.name}>{field.label} {field.required ? '*' : <span>(optional)</span>}</label><input {...fieldProps(field.name)} type={field.type} inputMode={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'} autoComplete={field.autocomplete} required={field.required} placeholder={field.placeholder} onChange={e => updateField(field.name, e.target.value)} />{errorFor(field.name)}</div>)}
                </div>
                <div className="contact-trip-fields">
                  <div className="contact-field"><label htmlFor="destination">Destination *</label><select {...fieldProps('destination')} required onChange={e => updateField('destination', e.target.value)}><option value="" disabled>Select destination...</option>{DESTINATION_OPTIONS.map(option => <option key={option}>{option}</option>)}</select>{errorFor('destination')}</div>
                  <div className="contact-field"><label htmlFor="timing">Travel timeframe *</label><select {...fieldProps('timing')} required onChange={e => updateField('timing', e.target.value)}><option value="" disabled>Select timeframe...</option>{TIMING_OPTIONS.map(option => <option key={option}>{option}</option>)}</select>{errorFor('timing')}</div>
                </div>
                <div className="contact-field"><label htmlFor="message">Tell us about the trip *</label><textarea {...fieldProps('message')} required rows={4} placeholder="Where do you want to go? Who is traveling? Any special occasion?" onChange={e => updateField('message', e.target.value)} />{errorFor('message')}</div>
                {submitError && <div role="alert" className="contact-error-summary"><p className="font-semibold">Submission issue</p><p>{submitError}</p><a href={directMailto} className="home-text-link">Email directly instead</a></div>}
                <button disabled={isSubmitting} type="submit" className="home-button contact-submit">{isSubmitting ? "Sending..." : "Start planning my trip"}<ArrowRight size={17} aria-hidden="true" /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
