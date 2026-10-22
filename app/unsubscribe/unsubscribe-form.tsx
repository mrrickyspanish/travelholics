"use client";

import Link from "next/link";
import { useState } from "react";

type Props = { email: string; token: string; encodedEmail: string };

/**
 * Posts to the same endpoint the one-click header uses.
 *
 * The <form> action/method are real, so this still works with JavaScript off
 * or still loading -- mail clients routinely open links in a stripped-down
 * webview, and an unsubscribe that needs hydration to function is an
 * unsubscribe that sometimes doesn't.
 */
export const UnsubscribeForm = ({ email, token, encodedEmail }: Props) => {
  const [state, setState] = useState<"idle" | "working" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("working");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setState("error");
        setMessage(body.error || "Something went wrong. Please try again.");
        return;
      }
      window.location.href = `/unsubscribe?e=${encodedEmail}&done=1`;
    } catch {
      setState("error");
      setMessage("We couldn't reach the server. Please try again.");
    }
  };

  return (
    <form
      action={`/api/newsletter/unsubscribe?e=${encodedEmail}&t=${encodeURIComponent(token)}`}
      method="post"
      onSubmit={onSubmit}
      className="mt-7"
    >
      <button
        type="submit"
        disabled={state === "working"}
        className="inline-flex min-h-11 w-full items-center justify-center bg-coral px-6 py-3 text-base font-black uppercase tracking-[0.08em] text-white transition hover:bg-coral-deep disabled:opacity-60 sm:w-auto"
      >
        {state === "working" ? "Unsubscribing…" : "Unsubscribe me"}
      </button>

      {state === "error" && (
        <p role="alert" className="mt-4 text-base leading-6 text-coral-deep">
          {message}
        </p>
      )}

      <p className="mt-5 text-base leading-6 text-stone">
        Changed your mind?{" "}
        <Link href="/" className="font-bold text-ink underline">
          Stay on the list
        </Link>{" "}
        and close this page.
      </p>
    </form>
  );
};
