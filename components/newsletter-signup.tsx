"use client";

import { FormEvent, useState } from "react";

type SignupState = "idle" | "submitting" | "success" | "error";

type NewsletterSignupProps = {
  source?: string;
  compact?: boolean;
};

const CONSENT_TEXT =
  "By subscribing, you agree to receive Travelholics cruise deals, shop drops, travel tips, and updates. You can unsubscribe anytime.";

export function NewsletterSignup({ source = "footer-newsletter", compact = false }: NewsletterSignupProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SignupState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          source,
          interests: ["newsletter", "shop_deals", "cruise_deals"],
          consentText: CONSENT_TEXT,
        }),
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseBody?.error || "Unable to subscribe right now.");
      }

      setStatus("success");
      setFirstName("");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
    }
  }

  return (
    <div className={compact ? "" : "rounded-2xl border border-white/10 bg-white/[0.04] p-5"}>
      <h3 className="text-eyebrow font-bold text-white/40 mb-3">Cruise Life List</h3>
      <p className="text-footer-body text-white/65 leading-relaxed mb-4">
        Join Cruise Life. Get cruise deals, shop drops, and Travelholics updates before they disappear.
      </p>

      {status === "success" ? (
        <div className="rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-footer-body text-white">
          You&apos;re in. We&apos;ll send the good cruise and shop deals your way.
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="newsletter-first-name">
            First name
          </label>
          <input
            id="newsletter-first-name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-coral"
          />

          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-coral"
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-lg bg-coral px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-navy transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Joining..." : "Join the List"}
          </button>

          <p className="text-[11px] leading-relaxed text-white/35">{CONSENT_TEXT}</p>

          {status === "error" && (
            <p className="text-footer-body text-coral" role="alert">
              {errorMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
