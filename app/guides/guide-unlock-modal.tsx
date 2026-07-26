"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, Loader2, X } from "lucide-react";

import { GUIDE_CONSENT_TEXT, type FreeGuide } from "@/lib/free-guides";

type Status = "idle" | "submitting" | "success" | "error";

export function GuideUnlockModal({
  guide,
  onClose,
}: {
  guide: FreeGuide;
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/guides/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          guideId: guide.id,
          newsletterOptIn: optIn,
        }),
      });

      const body = (await response.json().catch(() => null)) as
        | { downloadUrl?: string; error?: string }
        | null;

      if (!response.ok || !body?.downloadUrl) {
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setDownloadUrl(body.downloadUrl);
      setStatus("success");

      // Start the download straight away; the button stays as a fallback.
      window.location.href = body.downloadUrl;
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-unlock-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-t-[1.75rem] bg-cream p-6 shadow-[0_24px_70px_rgba(26,46,42,0.28)] sm:rounded-[1.75rem] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="py-2 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-mid/10 text-emerald-mid">
              <Check className="h-6 w-6" />
            </div>
            <h2
              id="guide-unlock-title"
              className="font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-ink"
            >
              Your guide is on the way
            </h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-stone">
              The download should start on its own. If it doesn&apos;t, use the button below.
            </p>
            <a
              href={downloadUrl}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              Download {guide.shortTitle}
            </a>
            <p className="mt-3 text-[0.78rem] text-stone">
              This link works for the next 30 minutes.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-coral">
              Free guide
            </p>
            <h2
              id="guide-unlock-title"
              className="mt-2 font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-ink"
            >
              {guide.title}
            </h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-stone">
              Tell us where to send it and it&apos;s yours — no cost, no catch.
            </p>

            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="sr-only" htmlFor="guide-first-name">
                  First name
                </label>
                <input
                  ref={nameRef}
                  id="guide-first-name"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="First name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-stone/70 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="guide-email">
                  Email address
                </label>
                <input
                  id="guide-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-stone/70 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 pt-1 text-[0.82rem] leading-relaxed text-stone">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(event) => setOptIn(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/20 text-coral focus:ring-coral"
                />
                <span>{GUIDE_CONSENT_TEXT}</span>
              </label>

              {status === "error" && (
                <p role="alert" className="text-[0.85rem] font-medium text-coral-deep">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-deep disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Unlocking…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Send me the guide
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function GuideUnlockPortal({
  guide,
  onClose,
}: {
  guide: FreeGuide | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {guide && <GuideUnlockModal guide={guide} onClose={onClose} />}
    </AnimatePresence>
  );
}
