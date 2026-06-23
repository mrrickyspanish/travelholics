import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has moved.",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand pt-32 pb-20">
        <section className="mx-auto max-w-2xl px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-deep">
            <Compass className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <p className="mt-6 font-serif text-7xl text-coral">404</p>
          <h1 className="mt-3 font-serif text-3xl text-ink">This page sailed off without us.</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-stone">
            The page you&apos;re looking for doesn&apos;t exist, or it&apos;s moved. Let&apos;s get you back on course.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-coral px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-coral-deep"
            >
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border-2 border-emerald-deep px-7 py-3 text-[15px] font-semibold text-emerald-deep transition-colors hover:bg-emerald-deep hover:text-white"
            >
              Shop the Goods
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
