import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb } from "@/components/breadcrumb";
import { Truck, Clock, MapPin, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping information for Travelholics merch orders — processing times, delivery windows, and carriers.",
  alternates: { canonical: "/shipping" },
};

const sections = [
  {
    icon: Clock,
    heading: "Processing time",
    body: "All merch orders are processed within 2–3 business days (Monday–Friday, excluding federal holidays). You'll receive a shipping confirmation email with a tracking number once your order leaves our hands.",
  },
  {
    icon: Truck,
    heading: "Delivery window",
    body: "Standard domestic shipping takes 5–7 business days after processing. Most orders arrive within 10 business days total. Delays can occur during peak seasons (holiday weeks, major cruise season launches).",
  },
  {
    icon: MapPin,
    heading: "Where we ship",
    body: "We currently ship to the contiguous United States. Hawaii, Alaska, and U.S. territories may require additional handling time. International shipping is not available at this time — stay tuned.",
  },
  {
    icon: Package,
    heading: "Free shipping threshold",
    body: "Orders of $50 or more ship free. Orders under $50 are charged a flat rate at checkout. Shipping cost is calculated and displayed before you complete payment — no surprises.",
  },
];

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand pt-32 pb-20">
        <section className="mx-auto max-w-3xl px-6">
          <Breadcrumb
            crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Shipping Policy" }]}
          />
          <h1 className="mt-6 font-serif text-4xl text-ink">Shipping Policy</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-stone">
            Everything you need to know about getting your Travelholics gear to your door.
          </p>

          <div className="mt-10 space-y-6">
            {sections.map(({ icon: Icon, heading, body }) => (
              <div key={heading} className="rounded-2xl bg-cream p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-deep">
                    <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-ink">{heading}</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border-2 border-coral/30 bg-cream p-7">
            <h2 className="font-serif text-xl text-ink">Lost or delayed orders</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
              If your tracking shows delivered but your order hasn&apos;t arrived, or if it&apos;s been more than
              15 business days with no update, email us at{" "}
              <a
                href="mailto:hello@yotravelholic.com"
                className="text-coral underline underline-offset-2 hover:text-coral-deep"
              >
                hello@yotravelholic.com
              </a>{" "}
              with your order number and we&apos;ll sort it out.
            </p>
          </div>

          <p className="mt-8 text-sm text-stone">
            Last updated: June 2025 &nbsp;·&nbsp;{" "}
            <a href="/returns" className="text-coral underline underline-offset-2 hover:text-coral-deep">
              View Returns Policy →
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
