"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, Mail, Play, Ship, Truck, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";
import { sendFormEmail } from "@/lib/form-email";
import { DUCK_HUNT_WELCOME } from "@/lib/duck-hunt-content";
import { TIKTOK_PROFILE_URL } from "@/lib/liveSchedule";
import { DuckHuntFooter } from "@/components/duck-hunt-footer";
import styles from "./duck-hunt.module.css";

type TravelReason = "Vacation" | "Honeymoon" | "Anniversary" | "Family Reunion" | "Birthday" | "Other";
type FormState = "idle" | "submitting" | "success" | "error";
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
type Errors = Partial<Record<keyof ClaimValues | "consent", string>>;

const DUCK_HUNT_CONSENT_TEXT =
  "Yes, sign me up for the Travelholics Cruise Life list so I can receive cruise deals, shop drops, travel tips, and updates connected to my Duck Hunt reward. I understand I can unsubscribe anytime.";
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
const TRAVEL_OPTIONS: TravelReason[] = ["Vacation", "Honeymoon", "Anniversary", "Family Reunion", "Birthday", "Other"];
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "VI", "WA", "WV", "WI", "WY",
];
const CONFETTI_COLORS = ["#0d4a3a", "#10755A", "#f59e0b", "#F26A75", "#F4C4CC", "#FCFAF5"];
const MAGNET = "/images/travelholic_ticket_magnent_pacific.png";
const YOUTUBE = "https://www.youtube.com/@yotravelholic";

function formatShipName(ship: string | null) {
  if (!ship) return "";
  return ship.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function validate(values: ClaimValues, newsletterOptIn: boolean): Errors {
  const errors: Errors = {};
  if (!values.firstName.trim()) errors.firstName = "Add your first name.";
  if (!values.lastName.trim()) errors.lastName = "Add your last name for the package.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Add a valid email address.";
  if (!values.shippingAddress1.trim()) errors.shippingAddress1 = "Add your street address.";
  if (!values.shippingCity.trim()) errors.shippingCity = "Add your city.";
  if (!US_STATES.includes(values.shippingState)) errors.shippingState = "Choose your state or territory.";
  if (!/^\d{5}(-\d{4})?$/.test(values.shippingZip.trim())) errors.shippingZip = "Use a 5-digit ZIP or ZIP+4.";
  if (!newsletterOptIn) errors.consent = "Please agree to join the Cruise Life email list to claim your gift.";
  return errors;
}

function TextField({ id, label, value, onChange, error, optional, type = "text", autoComplete, inputMode }: {
  id: keyof ClaimValues;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric";
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}{optional && <span> (optional)</span>}</label>
      <input
        id={id}
        name={id}
        value={value}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p className={styles.error} id={`${id}-error`}>{error}</p>}
    </div>
  );
}

function Welcome() {
  const hasVideo = Boolean(DUCK_HUNT_WELCOME.videoSrc && DUCK_HUNT_WELCOME.captionsSrc);
  return (
    <div className={styles.welcome}>
      <div className={styles.portrait}>
        {hasVideo ? (
          <video src={DUCK_HUNT_WELCOME.videoSrc!} controls playsInline preload="none" poster="/images/hero-yolanda.jpg" aria-label="A welcome from Yolanda">
            <track kind="captions" src={DUCK_HUNT_WELCOME.captionsSrc!} srcLang="en" label="English" default />
          </video>
        ) : (
          <Image src="/images/hero-yolanda.jpg" alt="Yolanda Harris, your cruise host" fill sizes="112px" />
        )}
      </div>
      <div>
        <p className={styles.eyebrow}>Your new cruise friend</p>
        <h2>Hey, I&apos;m Yolanda.</h2>
        <p>That little duck brought you here, and I&apos;m so glad it did. Let&apos;s keep the cruise life going, even after you unpack.</p>
      </div>
    </div>
  );
}

export default function DuckHuntPage() {
  const [values, setValues] = useState<ClaimValues>(INITIAL_VALUES);
  const [step, setStep] = useState<1 | 2>(1);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [travelReason, setTravelReason] = useState<TravelReason>("Vacation");
  const [website, setWebsite] = useState("");
  const [campaign, setCampaign] = useState({ ship: "", duck: "" });
  const [showStickyCta, setShowStickyCta] = useState(false);
  const claimRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const submitLock = useRef(false);

  const celebrate = useCallback(async (success = false) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) return;
    try {
      const { default: confetti } = await import("canvas-confetti");
      confetti({
        particleCount: success ? 150 : 85,
        spread: 90,
        startVelocity: success ? 38 : 28,
        origin: { x: 0.5, y: 0.3 },
        gravity: 0.9,
        ticks: 160,
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
      });
    } catch {
      // Delight never blocks the welcome or a saved claim.
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ship = formatShipName(params.get("ship"));
    setCampaign({ ship, duck: params.get("duck")?.trim() || "" });
    if (ship) setValues((current) => ({ ...current, shipName: ship }));
    const timer = window.setTimeout(() => void celebrate(), 500);
    return () => window.clearTimeout(timer);
  }, [celebrate]);

  useEffect(() => {
    if (!claimRef.current || formState === "success") {
      setShowStickyCta(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setShowStickyCta(!entry.isIntersecting));
    observer.observe(claimRef.current);
    return () => observer.disconnect();
  }, [formState]);

  const setField = useCallback((key: keyof ClaimValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }, []);

  function changeStep(next: 1 | 2, nextErrors: Errors = {}) {
    setStep(next);
    setErrors(nextErrors);
    setSubmitError("");
    setFormState("idle");
    requestAnimationFrame(() => {
      const first = Object.keys(nextErrors)[0];
      const target = first ? document.getElementById(first === "consent" ? "newsletterOptIn" : first) : titleRef.current;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: "auto", block: "center" });
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitLock.current) return;

    const allErrors = validate(values, newsletterOptIn);
    const identityErrors: Errors = {};
    for (const key of ["firstName", "lastName", "email", "consent"] as const) {
      if (allErrors[key]) identityErrors[key] = allErrors[key];
    }
    if (Object.keys(identityErrors).length) {
      changeStep(1, identityErrors);
      return;
    }
    if (step === 1) {
      changeStep(2);
      return;
    }
    if (Object.keys(allErrors).length) {
      changeStep(2, allErrors);
      return;
    }
    if (website.trim()) return;

    submitLock.current = true;
    setFormState("submitting");
    setSubmitError("");
    setErrors({});

    const params = new URLSearchParams(window.location.search);
    const claimPayload = {
      ...values,
      travelReason,
      newsletterOptIn,
      consentText: DUCK_HUNT_CONSENT_TEXT,
      shipName: values.shipName.trim() || params.get("ship")?.trim() || null,
      duckNumber: params.get("duck")?.trim() || null,
      batch: params.get("batch")?.trim() || null,
      ship: params.get("ship")?.trim() || null,
      cruise: params.get("cruise")?.trim() || null,
      source: params.get("source")?.trim() || null,
      scanId: params.get("scan")?.trim() || null,
    };

    try {
      const response = await fetch("/api/duck-hunt/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claimPayload),
      });
      if (!response.ok) throw new Error("Claim not confirmed");
    } catch {
      setSubmitError("Your claim hasn’t been confirmed. Your details are still here. Check your connection and try again.");
      setFormState("error");
      submitLock.current = false;
      return;
    }

    setFormState("success");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      successRef.current?.focus({ preventScroll: true });
      void celebrate(true);
    });

    sendFormEmail({ formType: "duck-hunt", ...claimPayload }).catch((error) => {
      console.error("Duck hunt notification failed after claim saved:", error);
    });
  }

  return (
    <div className={styles.page}>
      <a href={formState === "success" ? "#community" : "#claim"} className={styles.skip}>Skip to {formState === "success" ? "community" : "claim form"}</a>
      <header className={styles.header}>
        <Image src="/images/travelholics_logo_wordmark.svg" alt="Travelholics" width={192} height={48} priority />
        <span>The duck hunt</span>
      </header>

      <main>
        {formState !== "success" ? (
          <>
            <section className={styles.hero} aria-labelledby="find-title">
              <div className={styles.heroGrid}>
                <div className={styles.intro}>
                  <p className={styles.campaign}><Ship size={17} aria-hidden="true" /><span>{campaign.ship || "A little luck at sea"}{campaign.duck && <> · Duck #{campaign.duck}</>}</span></p>
                  <h1 id="find-title">You found<br />the <span>duck.</span></h1>
                  <p className={styles.accent}>The magnet is on us.</p>
                  <p className={styles.description}>A little souvenir for your next sailing.<br />A whole crew to share it with.</p>
                </div>

                <div className={styles.reward}>
                  <div className={styles.rewardTop}><span className={styles.eyebrow}>Your duck hunt gift</span><b>FREE</b></div>
                  <div className={styles.rewardStage}>
                    <Image src={MAGNET} alt="Your free Travelholics Cruise Life door magnet" width={1920} height={1080} sizes="(max-width: 800px) 90vw, 520px" priority className={styles.magnet} />
                    <Image src="/images/traveholics_duck.svg" alt="" width={104} height={104} priority className={styles.duck} />
                  </div>
                  <div className={styles.rewardBottom}>
                    <p>Cruise Life<br /><strong>Door magnet</strong></p>
                    <span><Truck size={17} aria-hidden="true" /> Free US shipping<br />Ships in 2–3 weeks</span>
                  </div>
                </div>

                <div className={styles.heroAction}>
                  <a className={styles.primary} href="#claim">Claim my free magnet <ArrowDown size={20} aria-hidden="true" /></a>
                  <p>No purchase. No shipping charge. Just cruise life.</p>
                </div>
              </div>
              <div className={styles.ribbon} aria-hidden="true"><span>Good find.</span><span>Good people.</span><span>Great cruises.</span></div>
            </section>

            <div className={styles.claimLayout}>
              <div className={styles.welcomeSlot}><Welcome /></div>

              <section id="claim" ref={claimRef} className={styles.claimCard} aria-labelledby="claim-title">
                <ol className={styles.progress} aria-label={`Claim step ${step} of 2`}>
                  <li aria-current={step === 1 ? "step" : undefined}><b>{step === 2 ? <Check size={15} aria-hidden="true" /> : "1"}</b> Join the crew</li>
                  <li className={step === 1 ? styles.pending : ""} aria-current={step === 2 ? "step" : undefined}><b>2</b> Send it home</li>
                </ol>

                <div className={styles.claimHeading}>
                  <p className={styles.eyebrow}>Step {step} of 2</p>
                  <h2 id="claim-title" ref={titleRef} tabIndex={-1}>{step === 1 ? "Make it official." : "Where’s home?"}</h2>
                  <p>{step === 1 ? "Your free magnet comes with good company. Join Yolanda’s Cruise Life email list to claim yours." : "We’ll send your magnet there, free. US addresses only. Ships in 2–3 weeks."}</p>
                </div>

                <form onSubmit={handleSubmit} noValidate aria-busy={formState === "submitting"}>
                  <p className="sr-only" role="status">{formState === "submitting" ? "Saving your magnet claim and email signup." : ""}</p>
                  <div className={styles.honeypot} aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} autoComplete="off" tabIndex={-1} /></div>

                  <div hidden={step !== 1}>
                    <div className={styles.fields}>
                      <div className={styles.pair}>
                        <TextField id="firstName" label="First name" value={values.firstName} onChange={(value) => setField("firstName", value)} error={errors.firstName} autoComplete="given-name" />
                        <TextField id="lastName" label="Last name" value={values.lastName} onChange={(value) => setField("lastName", value)} error={errors.lastName} autoComplete="family-name" />
                      </div>
                      <TextField id="email" label="Email address" value={values.email} onChange={(value) => setField("email", value)} error={errors.email} type="email" inputMode="email" autoComplete="email" />
                      <label className={styles.consent}>
                        <input id="newsletterOptIn" name="newsletterOptIn" type="checkbox" checked={newsletterOptIn} onChange={(event) => { setNewsletterOptIn(event.target.checked); setErrors((current) => ({ ...current, consent: undefined })); }} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} />
                        <span>{DUCK_HUNT_CONSENT_TEXT}</span>
                      </label>
                      {errors.consent && <p id="consent-error" className={styles.error}>{errors.consent}</p>}
                    </div>
                    <button className={styles.submit} type="submit">Continue to shipping <ArrowRight size={19} aria-hidden="true" /></button>
                    <p className={styles.note}>One more step to save your claim and signup.</p>
                  </div>

                  <div hidden={step !== 2}>
                    <fieldset disabled={formState === "submitting"} className={styles.shipping}>
                      <legend className="sr-only">Your shipping address</legend>
                      <div className={styles.fields}>
                        <TextField id="shippingAddress1" label="Street address" value={values.shippingAddress1} onChange={(value) => setField("shippingAddress1", value)} error={errors.shippingAddress1} autoComplete="shipping address-line1" />
                        <TextField id="shippingAddress2" label="Apt / suite" value={values.shippingAddress2} onChange={(value) => setField("shippingAddress2", value)} optional autoComplete="shipping address-line2" />
                        <TextField id="shippingCity" label="City" value={values.shippingCity} onChange={(value) => setField("shippingCity", value)} error={errors.shippingCity} autoComplete="shipping address-level2" />
                        <div className={styles.pair}>
                          <div className={styles.field}>
                            <label htmlFor="shippingState">State / territory</label>
                            <select id="shippingState" name="shippingState" value={values.shippingState} onChange={(event) => setField("shippingState", event.target.value)} autoComplete="shipping address-level1" aria-invalid={Boolean(errors.shippingState)} aria-describedby={errors.shippingState ? "shippingState-error" : undefined}>
                              <option value="">Select</option>
                              {US_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                            </select>
                            {errors.shippingState && <p id="shippingState-error" className={styles.error}>{errors.shippingState}</p>}
                          </div>
                          <TextField id="shippingZip" label="ZIP code" value={values.shippingZip} onChange={(value) => setField("shippingZip", value)} error={errors.shippingZip} inputMode="numeric" autoComplete="shipping postal-code" />
                        </div>
                      </div>

                      <details className={styles.details}>
                        <summary>Your sailing details <span>(optional)</span><ChevronDown size={17} aria-hidden="true" /></summary>
                        <div className={styles.fields}>
                          <TextField id="shipName" label="Your ship" value={values.shipName} onChange={(value) => setField("shipName", value)} optional />
                          <TextField id="city" label="Where are you from?" value={values.city} onChange={(value) => setField("city", value)} optional />
                          <fieldset className={styles.occasions}>
                            <legend>What&apos;s the occasion?</legend>
                            <div>{TRAVEL_OPTIONS.map((option) => <label key={option}><input type="radio" name="travelReason" value={option} checked={travelReason === option} onChange={() => setTravelReason(option)} /><span>{option}</span></label>)}</div>
                          </fieldset>
                        </div>
                      </details>

                      <p className={styles.shippingNote}><Check size={18} aria-hidden="true" /><span><strong>Magnet + US shipping: free.</strong><br />Your address is used to mail your gift.</span></p>
                      {submitError && <p role="alert" className={styles.submitError}>{submitError}</p>}
                      <button type="submit" className={styles.submit} disabled={formState === "submitting"}>{formState === "submitting" ? "Saving your claim…" : "Send my free magnet"}{formState !== "submitting" && <ArrowRight size={19} aria-hidden="true" />}</button>
                      <button type="button" className={styles.back} onClick={() => changeStep(1)}><ArrowLeft size={16} aria-hidden="true" /> Back to my details</button>
                    </fieldset>
                  </div>
                </form>
              </section>

              <aside className={styles.communityPreview}>
                <p className={styles.eyebrow}>More than a lucky find</p>
                <h2>Welcome to<br />Cruise Life.</h2>
                <ul>
                  <li><Mail size={20} aria-hidden="true" /><span>Cruise tips, deals, and shop drops in your inbox.</span></li>
                  <li><Youtube size={20} aria-hidden="true" /><span>Ship reviews and the details worth knowing before you board.</span></li>
                  <li><FaTiktok size={19} aria-hidden="true" /><span>Real conversations with Yolanda and fellow cruisers on TikTok.</span></li>
                </ul>
                <p className={styles.nextHint}>Claim your gift, then come say hello.</p>
                <details className={styles.details}>
                  <summary><Play size={16} aria-hidden="true" /> See the magnet on a cabin door <ChevronDown size={16} aria-hidden="true" /></summary>
                  <video src="/videos/travelholics_pacific_mexican_door_magnet.mp4" controls playsInline preload="none" poster="/images/pacific_mexican_door_magnent.png" aria-label="See the Travelholics cruise door magnet" />
                </details>
              </aside>
            </div>
          </>
        ) : (
          <section id="community" className={styles.success} aria-labelledby="success-title">
            <div className={styles.successHeading}>
              <span><Check size={17} aria-hidden="true" /> Magnet claimed</span>
              <h1 id="success-title" ref={successRef} tabIndex={-1}>You&apos;re in,<br /><em>{values.firstName}.</em></h1>
              <p>Your magnet ships in <strong>2–3 weeks.</strong><br />Your next cruise crew is right here.</p>
            </div>

            <div className={styles.successGrid}>
              <div className={styles.followCard}>
                <Welcome />
                <div className={styles.followIntro}>
                  <p className={styles.eyebrow}>Let&apos;s keep this going</p>
                  <h2>Come for the duck.<br />Stay for the cruise life.</h2>
                  <p>Subscribe on YouTube, follow on TikTok, and come say hello. Tell Yolanda you found her duck!</p>
                </div>
                <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                  <span className={styles.youtube}><Youtube size={24} aria-hidden="true" /></span>
                  <span><strong>Subscribe on YouTube</strong><small>Ship reviews, cruise tips, and the full story.</small></span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a href={TIKTOK_PROFILE_URL} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                  <span className={styles.tiktok}><FaTiktok size={21} aria-hidden="true" /></span>
                  <span><strong>Follow on TikTok</strong><small>Join Yolanda and the crew in conversation.</small></span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <p className={styles.emailConfirmed}><Check size={18} aria-hidden="true" /><span>You&apos;re on the Cruise Life email list.<br /><strong>{values.email}</strong></span></p>
              </div>

              <aside className={styles.receipt}>
                <p className={styles.eyebrow}>A good find, coming home</p>
                <Image src={MAGNET} alt="Your claimed Cruise Life door magnet" width={1920} height={1080} sizes="(max-width: 800px) 85vw, 380px" />
                <h2>Your magnet is claimed.</h2>
                <p>Free US shipping. Ships in 2–3 weeks.</p>
                {campaign.ship && <p className={styles.receiptShip}><Ship size={17} aria-hidden="true" /><span>{campaign.ship}{campaign.duck && <> · Duck #{campaign.duck}</>}</span></p>}
                <details className={styles.details}>
                  <summary>Check your shipping details <ChevronDown size={17} aria-hidden="true" /></summary>
                  <address>{values.firstName} {values.lastName}<br />{values.shippingAddress1}<br />{values.shippingAddress2 && <>{values.shippingAddress2}<br /></>}{values.shippingCity}, {values.shippingState} {values.shippingZip}</address>
                  <p>Need a correction? Email <a href="mailto:hello@yotravelholic.com">hello@yotravelholic.com</a>.</p>
                </details>
                <Link href="/" className={styles.explore}>Explore Travelholics <ArrowRight size={16} aria-hidden="true" /></Link>
              </aside>
            </div>
          </section>
        )}
      </main>

      {showStickyCta && formState !== "success" && <div className={styles.sticky}><a href="#claim">Claim my free magnet <ArrowDown size={18} aria-hidden="true" /></a></div>}
      <DuckHuntFooter />
    </div>
  );
}
