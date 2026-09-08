"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { sendFormEmail } from "@/lib/form-email";
import { DuckHuntFooter } from "@/components/duck-hunt-footer";

// ------------------------------------------------------------------
// Duck Hunt claim funnel
//
// Reached by scanning a duck's QR code on a ship — so it is phone-first,
// on bad wifi, from someone standing in a hallway holding a rubber duck.
// Every decision below serves that: one goal, no exit ramps, no extra
// font downloads, and a form that reads as three small asks rather than
// twelve fields.
//
// Palette and type are the SITE's tokens (app/globals.css), not a private
// set: Fraunces via the global `font-serif` utility, emerald-deep #0d4a3a,
// sand #F5EFE4, cream #FCFAF5, ink #1A2E2A, gold #f59e0b, coral #F26A75.
// An earlier version forked its own near-miss palette and loaded Playfair
// on top of the global fonts, which is most of why it read as off-brand.
// ------------------------------------------------------------------

type TravelReason =
  | "Vacation"
  | "Honeymoon"
  | "Anniversary"
  | "Family Reunion"
  | "Birthday"
  | "Other";
type FormState = "idle" | "submitting" | "success" | "error";
type AnimPhase = "sealed" | "revealed";

const CONFETTI_COLORS = [
  "#0d4a3a",
  "#10755A",
  "#f59e0b",
  "#F26A75",
  "#F4C4CC",
  "#FCFAF5",
];

const TRAVEL_OPTIONS: TravelReason[] = [
  "Vacation",
  "Honeymoon",
  "Anniversary",
  "Family Reunion",
  "Birthday",
  "Other",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA",
  "VI", "WA", "WV", "WI", "WY",
];

// Must stay byte-identical to the copy in /api/duck-hunt/claim — it is the
// consent record stored against the subscriber, not decoration.
const DUCK_HUNT_CONSENT_TEXT =
  "Yes, sign me up for the Travelholics Cruise Life list so I can receive cruise deals, shop drops, travel tips, and updates connected to my Duck Hunt reward. I understand I can unsubscribe anytime.";

type ClaimValues = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  shipName: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
};

const INITIAL_VALUES: ClaimValues = {
  firstName: "",
  lastName: "",
  email: "",
  city: "",
  shipName: "",
  shippingAddress1: "",
  shippingAddress2: "",
  shippingCity: "",
  shippingState: "",
  shippingZip: "",
};

// Drives both validation and the progress meter, so the bar can never
// disagree with what the submit button will actually accept.
const REQUIRED_FIELDS: (keyof ClaimValues)[] = [
  "firstName",
  "lastName",
  "email",
  "shippingAddress1",
  "shippingCity",
  "shippingState",
  "shippingZip",
];

function formatShipName(ship: string | null) {
  if (!ship) return "your ship";

  if (ship === "navigator-of-the-seas") {
    return "Navigator of the Seas";
  }

  return ship
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: ClaimValues, newsletterOptIn: boolean) {
  const errors: Partial<Record<keyof ClaimValues | "consent", string>> = {};

  if (!values.firstName.trim()) errors.firstName = "We need a first name for the package.";
  if (!values.lastName.trim()) errors.lastName = "We need a last name for the package.";
  if (!values.email.trim()) {
    errors.email = "Add an email so we can confirm it shipped.";
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = "That email doesn't look quite right.";
  }
  if (!values.shippingAddress1.trim()) errors.shippingAddress1 = "Add a street address.";
  if (!values.shippingCity.trim()) errors.shippingCity = "Add a city.";
  if (!values.shippingState.trim()) errors.shippingState = "Pick a state.";
  if (!values.shippingZip.trim()) {
    errors.shippingZip = "Add a ZIP code.";
  } else if (!/^\d{5}(-\d{4})?$/.test(values.shippingZip.trim())) {
    errors.shippingZip = "ZIP should be 5 digits.";
  }
  if (!newsletterOptIn) errors.consent = "Check the box so we can send your magnet and updates.";

  return errors;
}

// ------------------------------------------------------------------
// Form primitives
//
// Defined at module scope so React keeps the input instances mounted
// between renders (a component defined inside the page body remounts on
// every keystroke and drops focus). Visible persistent labels, 54px
// targets and 17px text are deliberate: the old placeholder-as-label
// underlines vanished the moment someone started typing.
// ------------------------------------------------------------------

const FIELD_BASE =
  "w-full min-h-[54px] rounded-2xl border bg-white px-4 py-3.5 text-[17px] leading-snug text-[#1A2E2A] outline-none transition-shadow transition-colors placeholder:text-[#A9B3AC] focus:ring-4";

function fieldClass(hasError?: boolean) {
  return `${FIELD_BASE} ${
    hasError
      ? "border-[#D9505C] focus:border-[#D9505C] focus:ring-[#D9505C]/15"
      : "border-[#DED6C6] focus:border-[#0d4a3a] focus:ring-[#0d4a3a]/12"
  }`;
}

function FieldShell({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[16px] font-bold text-[#1A2E2A]">
        {label}
        {optional && <span className="ml-1.5 font-medium text-[#6B7B74]">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-[15px] font-medium text-[#C0392B]">
          <span aria-hidden="true">↑</span>
          {error}
        </p>
      ) : hint ? (
        <p className="text-[15px] text-[#6B7B74]">{hint}</p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
  type?: string;
  inputMode?: "text" | "email" | "numeric" | "tel";
  autoComplete?: string;
  placeholder?: string;
};

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  optional,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} error={error} hint={hint}>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClass(Boolean(error))}
      />
    </FieldShell>
  );
}

function StateField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <FieldShell id="shippingState" label="State" error={error}>
      <select
        id="shippingState"
        name="shippingState"
        autoComplete="address-level1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "shippingState-error" : undefined}
        className={`${fieldClass(Boolean(error))} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236B7B74%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:22px_22px] bg-[right_1rem_center] bg-no-repeat pr-12`}
      >
        <option value="">Select</option>
        {US_STATES.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function StepHeading({ step, title, blurb }: { step: number; title: string; blurb: string }) {
  return (
    <div className="mb-7 flex items-start gap-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d4a3a] text-[16px] font-black text-[#FCFAF5]">
        {step}
      </span>
      <div>
        <h3 className="font-serif text-[26px] leading-tight font-semibold text-[#1A2E2A] sm:text-[30px]">
          {title}
        </h3>
        <p className="mt-1.5 text-[17px] leading-relaxed text-[#4B5B54]">{blurb}</p>
      </div>
    </div>
  );
}

export default function DuckHuntPage() {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const claimRef = useRef<HTMLElement>(null);

  const [animPhase, setAnimPhase] = useState<AnimPhase>("sealed");
  const [ringsActive, setRingsActive] = useState(false);
  const [duckVisible, setDuckVisible] = useState(false);
  const [duckBob, setDuckBob] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  const [values, setValues] = useState<ClaimValues>(INITIAL_VALUES);
  const [travelReason, setTravelReason] = useState<TravelReason>("Vacation");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ClaimValues | "consent", string>>
  >({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [submitError, setSubmitError] = useState("");
  const [website, setWebsite] = useState("");
  const [shipLabel, setShipLabel] = useState("your ship");

  const setField = useCallback(
    <K extends keyof ClaimValues>(key: K, value: ClaimValues[K]) => {
      setValues((current) => ({ ...current, [key]: value }));
      // Clear a field's error the moment it's being fixed — leaving stale red
      // under a field someone is actively correcting reads as broken.
      setErrors((current) => {
        if (!current[key]) return current;
        const next = { ...current };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const progress = useMemo(() => {
    const filled = REQUIRED_FIELDS.filter((key) => values[key].trim()).length;
    const total = REQUIRED_FIELDS.length + 1; // + the consent checkbox
    return Math.round(((filled + (newsletterOptIn ? 1 : 0)) / total) * 100);
  }, [values, newsletterOptIn]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const shipParam = queryParams.get("ship");
    const formattedShip = formatShipName(shipParam);
    setShipLabel(formattedShip);
    // Pre-fill from the QR scan so cruisers aren't asked to retype what we
    // already know — the field stays editable in case it's wrong.
    if (shipParam) {
      setValues((current) => ({ ...current, shipName: formattedShip }));
    }
  }, []);

  const fireConfetti = useCallback(async () => {
    if (typeof window === "undefined" || prefersReducedMotion) return;
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 260,
      spread: 100,
      origin: { x: 0.5, y: 0.45 },
      colors: CONFETTI_COLORS,
      startVelocity: 52,
      gravity: 0.85,
      scalar: 1.15,
      ticks: 190,
    });
    setTimeout(() => {
      confetti({
        particleCount: 130,
        spread: 120,
        origin: { x: 0.1, y: 0.5 },
        colors: CONFETTI_COLORS,
        startVelocity: 44,
        angle: 60,
        gravity: 0.85,
      });
      confetti({
        particleCount: 130,
        spread: 120,
        origin: { x: 0.9, y: 0.5 },
        colors: CONFETTI_COLORS,
        startVelocity: 44,
        angle: 120,
        gravity: 0.85,
      });
    }, 150);
  }, [prefersReducedMotion]);

  // The reveal: a porthole on the water, ripples spreading, then the duck
  // surfaces. Replaces a gift box made of three bare divs that read as an
  // unfinished placeholder rather than a gift.
  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimPhase("revealed");
      setRingsActive(false);
      setDuckVisible(true);
      setDuckBob(false);
      setCopyVisible(true);
      return;
    }

    const timers = [
      setTimeout(() => setRingsActive(true), 250),
      setTimeout(() => {
        setAnimPhase("revealed");
        setDuckVisible(true);
        fireConfetti();
      }, 1500),
      setTimeout(() => setCopyVisible(true), 1850),
      setTimeout(() => setDuckBob(true), 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion, fireConfetti]);

  // Sticky CTA only while the form is off-screen, so it can never sit on top
  // of the submit button it's pointing at.
  useEffect(() => {
    const target = claimRef.current;
    if (!target || formState === "success") {
      setShowStickyCta(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0.03 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [formState]);

  // Safari doesn't toggle play/pause on a tap anywhere on the video like
  // other browsers do — only its own tiny control-bar button does, which
  // reads as "the video is broken" on an iPhone. Wire the tap explicitly.
  function handleVideoClick() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");

    if (website.trim()) {
      setFormState("success");
      return;
    }

    const nextErrors = validate(values, newsletterOptIn);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormState("error");
      // Send focus to the first problem rather than making someone hunt for
      // the red text on a long mobile form.
      const firstKey = Object.keys(nextErrors)[0];
      const target = document.getElementById(firstKey === "consent" ? "newsletterOptIn" : firstKey);
      target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
      target?.focus({ preventScroll: true });
      return;
    }

    setErrors({});
    setFormState("submitting");

    const queryParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const duckNumber = queryParams?.get("duck")?.trim() || null;
    const batch = queryParams?.get("batch")?.trim() || null;
    const ship = queryParams?.get("ship")?.trim() || null;
    const source = queryParams?.get("source")?.trim() || null;
    const cruise = queryParams?.get("cruise")?.trim() || null;
    const scanId = queryParams?.get("scan")?.trim() || null;

    const claimPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      city: values.city,
      shipName: values.shipName.trim() || ship || null,
      travelReason,
      duckNumber,
      batch,
      ship,
      source,
      cruise,
      scanId,
      shippingAddress1: values.shippingAddress1,
      shippingAddress2: values.shippingAddress2,
      shippingCity: values.shippingCity,
      shippingState: values.shippingState,
      shippingZip: values.shippingZip,
      newsletterOptIn,
      consentText: DUCK_HUNT_CONSENT_TEXT,
    };

    try {
      const claimResponse = await fetch("/api/duck-hunt/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claimPayload),
      });

      if (!claimResponse.ok) {
        const responseBody = await claimResponse.json().catch(() => null);
        throw new Error(responseBody?.error || "Unable to submit Duck Hunt claim.");
      }
    } catch (err) {
      console.error("Duck hunt claim submission error:", err);
      setSubmitError(
        "Something went wrong submitting your claim. Ship wifi can be rough — please try again in a moment.",
      );
      setFormState("error");
      return;
    }

    // The claim is safely saved at this point — the reward is secured
    // regardless of what happens next. The internal notification email is
    // a secondary, best-effort side effect: it must never flip the user
    // back to an "error" state (and risk a confusing duplicate resubmit)
    // just because Resend hiccupped or ship wifi dropped a request.
    setFormState("success");
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    fireConfetti();

    sendFormEmail({ formType: "duck-hunt", ...claimPayload }).catch((err) => {
      console.error("Duck hunt notification email failed (claim already saved):", err);
    });
  }

  return (
    <>
      <style>{`
        @keyframes dhRipple {
          0%   { transform: scale(0.55); opacity: 0.55; }
          100% { transform: scale(2.1); opacity: 0; }
        }
        @keyframes dhDuckRise {
          0%   { transform: translateY(64px) scale(0.55); opacity: 0; }
          60%  { transform: translateY(-14px) scale(1.06); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes dhDuckBob {
          0%,100% { transform: translateY(0) rotate(-1.5deg); }
          50%     { transform: translateY(-11px) rotate(1.5deg); }
        }
        @keyframes dhFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dhSheen {
          0%,100% { opacity: 0.45; }
          50%     { opacity: 0.9; }
        }
        @keyframes dhSlideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen overflow-x-hidden bg-[#F5EFE4] text-[#1A2E2A] antialiased">
        {/* Intentionally not the shared site <Header /> — this is a single-goal
            claim funnel, so the nav is a minimal brand mark only, no site links
            to navigate away on. */}
        <nav className="fixed top-0 z-50 flex h-[68px] w-full items-center justify-between border-b border-[#E0D8C8] bg-[#F5EFE4]/92 px-5 backdrop-blur-md sm:px-8">
          <span className="font-serif text-[21px] font-black uppercase tracking-[0.18em] text-[#0d4a3a]">
            Travelholics
          </span>
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0d4a3a] p-1.5">
            <Image
              src="/images/traveholics_duck.svg"
              alt="Travelholics duck"
              width={26}
              height={26}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </nav>

        <main className="pt-[68px]">
          {/* ---------------------------------------------------------- */}
          {/* Reveal                                                      */}
          {/* ---------------------------------------------------------- */}
          <section
            className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-24 lg:py-32"
            hidden={formState === "success"}
          >
            <div
              className="pointer-events-none absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(13,74,58,0.16), transparent 68%)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-32 -right-24 h-[380px] w-[380px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(245,158,11,0.18), transparent 68%)" }}
            />

            <div className="relative mx-auto max-w-[760px] text-center">
              {/* Porthole + duck */}
              <div className="relative mx-auto mb-12 flex h-[240px] w-[240px] items-center justify-center sm:h-[300px] sm:w-[300px]">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    className="absolute h-[150px] w-[150px] rounded-full border-2 border-[#0d4a3a]/35 sm:h-[190px] sm:w-[190px]"
                    style={{
                      animation:
                        ringsActive && !prefersReducedMotion
                          ? `dhRipple 2.6s cubic-bezier(.2,.6,.35,1) ${index * 0.55}s infinite`
                          : "none",
                      opacity: prefersReducedMotion ? 0.18 : 0,
                    }}
                  />
                ))}

                <div
                  aria-hidden="true"
                  className="absolute h-[164px] w-[164px] rounded-full border-[3px] border-[#f59e0b]/55 bg-[#0d4a3a] sm:h-[206px] sm:w-[206px]"
                  style={{
                    boxShadow: "inset 0 14px 40px rgba(0,0,0,.4), 0 22px 50px rgba(13,74,58,.28)",
                    animation:
                      animPhase === "sealed" && !prefersReducedMotion
                        ? "dhSheen 1.5s ease-in-out infinite"
                        : "none",
                  }}
                />

                <div
                  className="relative h-[176px] w-[176px] sm:h-[220px] sm:w-[220px]"
                  style={{
                    animation: prefersReducedMotion
                      ? "none"
                      : !duckVisible
                        ? "none"
                        : duckBob
                          ? "dhDuckBob 3.4s ease-in-out infinite"
                          : "dhDuckRise .8s cubic-bezier(.22,.61,.36,1) forwards",
                    opacity: duckVisible ? 1 : 0,
                    filter: "drop-shadow(0 16px 34px rgba(26,46,42,.34))",
                  }}
                >
                  <Image
                    src="/images/traveholics_duck.svg"
                    alt="The Travelholics duck you found"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {animPhase === "sealed" && !prefersReducedMotion && (
                <p className="text-[17px] font-bold uppercase tracking-[0.22em] text-[#0d4a3a]/70">
                  Something&apos;s surfacing…
                </p>
              )}

              {animPhase === "revealed" && (
                <div
                  style={{
                    animation: prefersReducedMotion
                      ? "none"
                      : copyVisible
                        ? "dhFadeUp .6s ease forwards"
                        : "none",
                    opacity: prefersReducedMotion ? 1 : 0,
                  }}
                >
                  <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#0d4a3a]/25 bg-[#0d4a3a]/8 px-5 py-2.5 text-[14px] font-extrabold uppercase tracking-[0.16em] text-[#0d4a3a]">
                    Official duck find
                  </span>

                  <h1 className="font-serif text-[44px] font-bold leading-[1.02] tracking-[-0.02em] text-[#1A2E2A] sm:text-[62px] lg:text-[76px]">
                    You found the duck.
                  </h1>
                  <p className="mt-3 font-serif text-[30px] font-semibold italic leading-tight text-[#10755A] sm:text-[40px] lg:text-[46px]">
                    Now claim your magnet.
                  </p>

                  <p className="mx-auto mt-8 max-w-[52ch] text-[18px] leading-[1.65] text-[#3F5049] sm:text-[20px]">
                    Travelholics ducks are hidden across cruise ships for fellow
                    travelers to discover. You found one — so we&apos;re sending you
                    an official Cruise Life door magnet to bring the memory home
                    and rep your next sailing in style.
                  </p>

                  <a
                    href="#claim"
                    className="mt-11 inline-flex min-h-[56px] w-full max-w-[420px] items-center justify-center rounded-2xl bg-[#0d4a3a] px-9 text-[17px] font-extrabold uppercase tracking-[0.1em] text-[#FCFAF5] shadow-[0_14px_32px_rgba(13,74,58,0.3)] transition-transform hover:bg-[#0f5a46] active:scale-[.985]"
                  >
                    Claim my magnet →
                  </a>

                  <p className="mt-5 text-[16px] text-[#6B7B74]">
                    Free. No purchase necessary. Welcome to Cruise Life.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ---------------------------------------------------------- */}
          {/* Claim: product panel + form                                 */}
          {/* ---------------------------------------------------------- */}
          {formState !== "success" && (
            <section
              ref={claimRef}
              id="claim"
              className="scroll-mt-[68px] border-t border-[#E5DDCD] bg-[#FCFAF5] px-6 py-20 sm:px-10 sm:py-24 lg:py-28"
            >
              <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
                {/* What you're getting */}
                <aside className="lg:sticky lg:top-[100px] lg:self-start">
                  <p className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#10755A]">
                    Your reward
                  </p>
                  <h2 className="mt-3 font-serif text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-[#1A2E2A] sm:text-[42px]">
                    The Cruise Life door magnet
                  </h2>
                  <p className="mt-4 max-w-[46ch] text-[18px] leading-[1.65] text-[#3F5049]">
                    Hand-picked for the {shipLabel} duck hunt. It goes on your
                    cabin door, survives the sea air, and comes home with you.
                  </p>

                  <div className="mt-8 overflow-hidden rounded-3xl border border-[#E5DDCD] bg-white shadow-[0_18px_44px_rgba(26,46,42,0.09)]">
                    <div className="relative aspect-square w-full bg-[#F5EFE4]">
                      <Image
                        src="/images/travelholic_ticket_magnent_pacific.png"
                        alt="Travelholics Cruise Life cruise door magnet"
                        fill
                        className="object-contain p-8"
                        sizes="(max-width: 1024px) 92vw, 440px"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#EFE7D8] px-6 py-5 text-[16px] font-semibold text-[#3F5049]">
                      <span>Ships free</span>
                      <span className="text-[#C9BFAC]">•</span>
                      <span>2–3 weeks</span>
                      <span className="text-[#C9BFAC]">•</span>
                      <span>US addresses</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#10755A]">
                      See it in action
                    </p>
                    <p className="mt-2 max-w-[46ch] text-[17px] leading-relaxed text-[#4B5B54]">
                      A quick look at why cruisers are making the magnet part of
                      their cabin door tradition.
                    </p>
                    <video
                      ref={videoRef}
                      onClick={handleVideoClick}
                      src="/videos/travelholics_pacific_mexican_door_magnet.mp4"
                      controls
                      loop
                      playsInline
                      poster="/images/pacific_mexican_door_magnent.png"
                      className="mt-4 aspect-video w-full cursor-pointer rounded-2xl border border-[#E5DDCD] bg-black shadow-[0_14px_34px_rgba(26,46,42,0.12)]"
                      preload="metadata"
                      aria-label="Watch a Travelholics cruiser show off their magnet"
                    >
                      Sorry, your browser does not support embedded videos.
                    </video>
                  </div>
                </aside>

                {/* Form */}
                <div>
                  <div className="mb-10">
                    <h2 className="font-serif text-[36px] font-bold leading-[1.06] tracking-[-0.02em] text-[#1A2E2A] sm:text-[46px]">
                      Where should we send it?
                    </h2>
                    <p className="mt-4 max-w-[46ch] text-[18px] leading-[1.65] text-[#3F5049]">
                      Three quick steps. Takes about a minute, even on ship wifi.
                    </p>

                    <div className="mt-7">
                      <div
                        className="h-2 w-full overflow-hidden rounded-full bg-[#E5DDCD]"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Claim form progress"
                      >
                        <div
                          className="h-full rounded-full bg-[#10755A] transition-[width] duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-2.5 text-[15px] font-semibold text-[#6B7B74]">
                        {progress === 100 ? "All set — send it through." : `${progress}% complete`}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="relative space-y-12" noValidate>
                    <p className="sr-only" aria-live="polite" role="status">
                      {formState === "submitting" ? "Submitting your magnet claim." : ""}
                    </p>

                    <div
                      className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                      aria-hidden="true"
                    >
                      <label htmlFor="website">Website</label>
                      <input
                        id="website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>

                    {/* Step 1 */}
                    <div>
                      <StepHeading
                        step={1}
                        title="Who found it?"
                        blurb="So we know whose name goes on the package."
                      />
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField
                          id="firstName"
                          label="First name"
                          value={values.firstName}
                          onChange={(value) => setField("firstName", value)}
                          error={errors.firstName}
                          autoComplete="given-name"
                          placeholder="Jane"
                        />
                        <TextField
                          id="lastName"
                          label="Last name"
                          value={values.lastName}
                          onChange={(value) => setField("lastName", value)}
                          error={errors.lastName}
                          autoComplete="family-name"
                          placeholder="Smith"
                        />
                        <div className="sm:col-span-2">
                          <TextField
                            id="email"
                            label="Email address"
                            type="email"
                            inputMode="email"
                            value={values.email}
                            onChange={(value) => setField("email", value)}
                            error={errors.email}
                            hint="We'll confirm here when your magnet ships."
                            autoComplete="email"
                            placeholder="jane@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div>
                      <StepHeading
                        step={2}
                        title="Where should we ship it?"
                        blurb="US addresses only for now. Double-check the apartment number — it's the top reason a magnet comes back."
                      />
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <TextField
                            id="shippingAddress1"
                            label="Street address"
                            value={values.shippingAddress1}
                            onChange={(value) => setField("shippingAddress1", value)}
                            error={errors.shippingAddress1}
                            autoComplete="address-line1"
                            placeholder="123 Harbor Lane"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <TextField
                            id="shippingAddress2"
                            label="Apt / suite"
                            optional
                            value={values.shippingAddress2}
                            onChange={(value) => setField("shippingAddress2", value)}
                            autoComplete="address-line2"
                            placeholder="Apt 4B"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <TextField
                            id="shippingCity"
                            label="City"
                            value={values.shippingCity}
                            onChange={(value) => setField("shippingCity", value)}
                            error={errors.shippingCity}
                            autoComplete="address-level2"
                            placeholder="Port Canaveral"
                          />
                        </div>
                        <StateField
                          value={values.shippingState}
                          onChange={(value) => setField("shippingState", value)}
                          error={errors.shippingState}
                        />
                        <TextField
                          id="shippingZip"
                          label="ZIP code"
                          inputMode="numeric"
                          value={values.shippingZip}
                          onChange={(value) => setField("shippingZip", value)}
                          error={errors.shippingZip}
                          autoComplete="postal-code"
                          placeholder="32920"
                        />
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div>
                      <StepHeading
                        step={3}
                        title="Tell us about your sailing"
                        blurb="Optional, but it helps us personalize what we send you next."
                      />
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField
                          id="shipName"
                          label="What ship are you on?"
                          optional
                          value={values.shipName}
                          onChange={(value) => setField("shipName", value)}
                          autoComplete="organization"
                          placeholder="Navigator of the Seas"
                        />
                        <TextField
                          id="city"
                          label="Where are you from?"
                          optional
                          value={values.city}
                          onChange={(value) => setField("city", value)}
                          autoComplete="address-level2"
                          placeholder="City, State"
                        />
                      </div>

                      <fieldset className="mt-7">
                        <legend className="mb-3.5 block text-[16px] font-bold text-[#1A2E2A]">
                          What&apos;s the occasion?
                        </legend>
                        <div className="flex flex-wrap gap-2.5">
                          {TRAVEL_OPTIONS.map((option) => (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={travelReason === option}
                              onClick={() => setTravelReason(option)}
                              className={`min-h-[48px] rounded-full border px-5 text-[16px] font-bold transition-colors ${
                                travelReason === option
                                  ? "border-[#0d4a3a] bg-[#0d4a3a] text-[#FCFAF5]"
                                  : "border-[#DED6C6] bg-white text-[#1A2E2A] hover:border-[#0d4a3a]"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    </div>

                    {/* Consent + submit */}
                    <div className="space-y-6">
                      <label
                        htmlFor="newsletterOptIn"
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-colors ${
                          errors.consent
                            ? "border-[#D9505C] bg-[#D9505C]/5"
                            : "border-[#0d4a3a]/20 bg-[#0d4a3a]/[0.05]"
                        }`}
                      >
                        <input
                          id="newsletterOptIn"
                          name="newsletterOptIn"
                          type="checkbox"
                          checked={newsletterOptIn}
                          onChange={(e) => {
                            setNewsletterOptIn(e.target.checked);
                            if (e.target.checked) {
                              setErrors((current) => {
                                if (!current.consent) return current;
                                const next = { ...current };
                                delete next.consent;
                                return next;
                              });
                            }
                          }}
                          aria-invalid={errors.consent ? true : undefined}
                          aria-describedby={errors.consent ? "consent-error" : undefined}
                          className="mt-0.5 h-6 w-6 shrink-0 accent-[#0d4a3a]"
                        />
                        <span className="text-[16px] leading-[1.6] text-[#3F5049]">
                          {DUCK_HUNT_CONSENT_TEXT}
                        </span>
                      </label>

                      {errors.consent && (
                        <p id="consent-error" className="text-[16px] font-semibold text-[#C0392B]">
                          {errors.consent}
                        </p>
                      )}

                      {submitError && (
                        <p
                          role="alert"
                          className="rounded-2xl border border-[#D9505C]/35 bg-[#D9505C]/8 p-4 text-[16px] font-medium leading-relaxed text-[#C0392B]"
                        >
                          {submitError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={formState === "submitting"}
                        className="min-h-[58px] w-full rounded-2xl bg-[#0d4a3a] px-8 text-[17px] font-extrabold uppercase tracking-[0.1em] text-[#FCFAF5] shadow-[0_14px_32px_rgba(13,74,58,0.3)] transition-transform hover:bg-[#0f5a46] active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {formState === "submitting" ? "Sending…" : "Send my magnet"}
                      </button>

                      <p className="text-center text-[16px] text-[#6B7B74]">
                        We only use your address to mail the magnet. Unsubscribe anytime.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          )}

          {/* ---------------------------------------------------------- */}
          {/* Confirmation                                                */}
          {/* ---------------------------------------------------------- */}
          {formState === "success" && (
            <section className="bg-[#0d4a3a] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
              <div className="mx-auto max-w-[720px] text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/45 bg-[#f59e0b]/12 px-5 py-2.5 text-[14px] font-extrabold uppercase tracking-[0.16em] text-[#f59e0b]">
                  Gift claimed
                </span>

                <h2 className="mt-7 font-serif text-[42px] font-bold leading-[1.04] tracking-[-0.02em] text-[#FCFAF5] sm:text-[58px]">
                  Your magnet is on the way.
                </h2>
                <p className="mx-auto mt-5 max-w-[46ch] text-[19px] leading-[1.65] text-[#FCFAF5]/72">
                  Nice find, {values.firstName || "cruiser"}. Here&apos;s exactly
                  what happens next.
                </p>

                {/* Shipping-to card: echoing the address back catches typos while
                    the cruiser is still on the page and can do something about it. */}
                <div className="mt-12 overflow-hidden rounded-3xl bg-[#FCFAF5] text-left shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                  <div className="relative aspect-[16/10] w-full bg-[#F5EFE4]">
                    <Image
                      src="/images/travelholic_ticket_magnent_pacific.png"
                      alt={`${shipLabel} cruise door magnet`}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 92vw, 680px"
                      priority
                    />
                  </div>
                  <div className="border-t border-[#EFE7D8] p-7 sm:p-9">
                    <p className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#10755A]">
                      Shipping to
                    </p>
                    <address className="mt-3 text-[19px] not-italic leading-[1.6] font-semibold text-[#1A2E2A]">
                      {values.firstName} {values.lastName}
                      <br />
                      {values.shippingAddress1}
                      {values.shippingAddress2 && (
                        <>
                          <br />
                          {values.shippingAddress2}
                        </>
                      )}
                      <br />
                      {values.shippingCity}, {values.shippingState} {values.shippingZip}
                    </address>
                    <p className="mt-5 text-[16px] leading-relaxed text-[#6B7B74]">
                      Wrong address? Email{" "}
                      <a
                        href="mailto:hello@yotravelholic.com"
                        className="font-semibold text-[#0d4a3a] underline underline-offset-2"
                      >
                        hello@yotravelholic.com
                      </a>{" "}
                      and we&apos;ll fix it before it ships.
                    </p>
                  </div>
                </div>

                <div className="mt-10 space-y-4 text-left">
                  {[
                    {
                      title: "We're packing your magnet",
                      body: `It ships within 2–3 weeks. A confirmation goes to ${values.email}.`,
                    },
                    {
                      title: "Follow along on TikTok",
                      body: "Cruise tips, deals, and trip ideas @rjsmom1 — plus Instagram and YouTube below.",
                    },
                  ].map((step, index) => (
                    <div
                      key={step.title}
                      className="flex gap-5 rounded-2xl border border-[#f59e0b]/20 bg-white/[0.04] p-6"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f59e0b] text-[16px] font-black text-[#0d4a3a]">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-[19px] font-bold text-[#FCFAF5]">{step.title}</p>
                        <p className="mt-1.5 text-[17px] leading-relaxed text-[#FCFAF5]/60">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/"
                  className="mt-12 inline-flex min-h-[56px] w-full max-w-[420px] items-center justify-center rounded-2xl border-2 border-[#f59e0b] px-9 text-[17px] font-extrabold uppercase tracking-[0.1em] text-[#f59e0b] transition-colors hover:bg-[#f59e0b] hover:text-[#0d4a3a]"
                >
                  Explore Cruise Life →
                </Link>
              </div>
            </section>
          )}
        </main>

        {/* Mobile sticky CTA — only while the form is off-screen, and never
            over the submit button it points at. */}
        {showStickyCta && animPhase === "revealed" && formState !== "success" && (
          <div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E0D8C8] bg-[#F5EFE4]/95 px-5 pt-4 backdrop-blur-md lg:hidden"
            style={{
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
              animation: prefersReducedMotion ? "none" : "dhSlideUp .3s ease forwards",
            }}
          >
            <a
              href="#claim"
              className="flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#0d4a3a] px-8 text-[17px] font-extrabold uppercase tracking-[0.1em] text-[#FCFAF5] shadow-[0_10px_26px_rgba(13,74,58,0.28)] active:scale-[.985]"
            >
              Claim my magnet →
            </a>
          </div>
        )}

        <div
          className="pointer-events-none fixed inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>
      <DuckHuntFooter />
    </>
  );
}
