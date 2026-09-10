"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { SUBSCRIBE_URL } from "@/lib/youtube";
import { TIKTOK_PROFILE_URL } from "@/lib/liveSchedule";

type SignupState = "idle" | "submitting" | "success" | "error";

type NewsletterSignupProps = {
  source?: string;
  compact?: boolean;
  community?: boolean;
};

const CONSENT_TEXT =
  "By subscribing, you agree to receive Travelholics cruise deals, shop drops, travel tips, and updates. You can unsubscribe anytime.";

export function NewsletterSignup({ source = "footer-newsletter", compact = false, community = false }: NewsletterSignupProps) {
  const formId = useId();
  const pending = useRef(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SignupState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
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
        const fallbackMessage = "Unable to subscribe right now.";
        const baseMessage =
          typeof responseBody?.error === "string" && responseBody.error.length > 0
            ? responseBody.error
            : fallbackMessage;
        const detail =
          typeof responseBody?.detail === "string" && responseBody.detail.length > 0
            ? responseBody.detail
            : null;
        const code =
          typeof responseBody?.code === "string" && responseBody.code.length > 0
            ? responseBody.code
            : null;

        const debugSuffix = [detail, code ? `(code: ${code})` : null].filter(Boolean).join(" ");
        throw new Error(debugSuffix ? `${baseMessage} ${debugSuffix}` : baseMessage);
      }

      setStatus("success");
      setFirstName("");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("We couldn’t confirm your signup. Your details are still here. Please try again.");
    } finally {
      pending.current = false;
    }
  }

  return (
    <div className={compact || community ? "" : "rounded-2xl border border-white/10 bg-white/[0.04] p-5"}>
      <h3 className="text-lg font-bold text-white mb-3">{community ? "Save your spot in the Crew." : "Cruise Life List"}</h3>
      <p className="text-base text-white/80 leading-relaxed mb-4">
        {community ? "Just your email to get started. First name is optional." : "Cruise tips, deals, and Travelholics shop drops, straight to your inbox."}
      </p>

      {status === "success" ? (
        <div role="status" className="rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-base text-white">
          <p className="font-serif text-2xl">You&apos;re in. Welcome to the Crew!</p>
          <p className="mt-3">Cruise tips and Travelholics updates are headed to your inbox. Keep the conversation going with Yolanda.</p>
          <div className="mt-4 flex flex-wrap gap-4"><a className="inline-flex min-h-12 items-center underline underline-offset-4" href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer">Subscribe on YouTube</a><a className="inline-flex min-h-12 items-center underline underline-offset-4" href={TIKTOK_PROFILE_URL} target="_blank" rel="noopener noreferrer">Follow on TikTok</a></div>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm text-white/90" htmlFor={`${formId}-first-name`}>
            First name (optional)
          </label>
          <input
            id={`${formId}-first-name`}
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            className="min-h-12 w-full rounded-lg border border-white/40 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral"
          />

          <label className="block text-sm text-white/90" htmlFor={`${formId}-email`}>
            Email address
          </label>
          <input
            id={`${formId}-email`}
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="min-h-12 w-full rounded-lg border border-white/40 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral"
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="min-h-12 w-full rounded-lg bg-coral px-4 py-3 text-base font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Joining..." : "Join the Crew"}
          </button>

          <p className="text-sm leading-relaxed text-white/75">{CONSENT_TEXT}</p>

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
