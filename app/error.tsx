"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LifeBuoy } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand pt-32 pb-20">
        <section className="mx-auto max-w-2xl px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral">
            <LifeBuoy className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-serif text-3xl text-ink">Something went wrong.</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-stone">
            We hit a wave we weren&apos;t expecting. Try again, or head back to calmer waters.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-full bg-coral px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-coral-deep"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border-2 border-emerald-deep px-7 py-3 text-[15px] font-semibold text-emerald-deep transition-colors hover:bg-emerald-deep hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
