import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PUBLISHABLE_GUIDES } from "@/lib/free-guides";
import { GuidesClient } from "./guides-client";

export const metadata: Metadata = {
  title: "Free Cruise Guides | Travelholics — Packing Lists & Booking Tips",
  description:
    "Free Travelholics cruise guides: Alaska and Hawaii packing checklists, what not to bring, and the best time to book a cruise. From Certified Cruise Specialist Yolanda Harris.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Free Cruise Guides — Travelholics",
    description:
      "Packing checklists, prohibited-item lists, and booking-window advice — free from Travelholics.",
    url: "/guides",
    type: "website",
  },
};

export default function GuidesPage() {
  const guides = PUBLISHABLE_GUIDES;

  return (
    <>
      <Header />

      <main className="bg-sand pb-20 pt-28 sm:pt-32">
        <section className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-coral">
            Free downloads
          </p>
          <h1 className="mt-3 font-serif text-[2.4rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3rem]">
            Cruise guides, on the house
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[1.02rem] leading-relaxed text-stone">
            The checklists and cheat sheets I actually hand people before their
            sailing. Print them, save them, pack smarter.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-5 lg:px-8">
          {guides.length > 0 ? (
            <GuidesClient guides={guides} />
          ) : (
            <p className="text-center text-[0.95rem] text-stone">
              New guides are on the way — check back shortly.
            </p>
          )}
        </section>

        <section className="mx-auto mt-16 max-w-2xl px-5 text-center lg:px-8">
          <p className="text-[0.85rem] leading-relaxed text-stone">
            Same goal. New level. And I&apos;m rooting for you.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
