import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb } from "@/components/breadcrumb";
import { RotateCcw, CheckCircle, XCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Travelholics return and exchange policy for merch orders — window, conditions, and how to start a return.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand pt-32 pb-20">
        <section className="mx-auto max-w-3xl px-6">
          <Breadcrumb
            crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Returns & Exchanges" }]}
          />
          <h1 className="mt-6 font-serif text-4xl text-ink">Returns &amp; Exchanges</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-stone">
            Not the right fit? We&apos;ll make it right. Here&apos;s how.
          </p>

          {/* Return window */}
          <div className="mt-10 rounded-2xl bg-cream p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-deep">
                <RotateCcw className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-ink">30-day return window</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
                  You have 30 days from the date your order is delivered to request a return or exchange.
                  Refunds are issued to the original payment method within 5–10 business days of us
                  receiving the item.
                </p>
              </div>
            </div>
          </div>

          {/* What we accept */}
          <div className="mt-6 rounded-2xl bg-cream p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-deep">
                <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-ink">What we accept</h2>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink/80">
                  {[
                    "Unworn and unwashed apparel (crewnecks, hoodies, polos)",
                    "Items with all original tags still attached",
                    "Items in original condition — no stains, odors, or damage",
                    "Items returned within 30 days of delivery",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-mid" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* What we don't accept */}
          <div className="mt-6 rounded-2xl bg-cream p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-coral">
                <XCircle className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-ink">What we don&apos;t accept</h2>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink/80">
                  {[
                    "Worn, washed, or damaged items",
                    "Items returned after 30 days",
                    "Accessories (lanyards, magnets) — these are final sale due to hygiene and collectible nature",
                    "Sale or discounted items marked final sale at checkout",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-coral" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* How to start */}
          <div className="mt-6 rounded-2xl bg-cream p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-deep">
                <Mail className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-ink">How to start a return</h2>
                <ol className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink/80 list-none">
                  {[
                    "Email hello@yotravelholic.com with your order number and reason for return.",
                    "We'll reply within 1–2 business days with a return shipping label.",
                    "Pack the item securely and drop it off using the provided label.",
                    "Once we receive and inspect the item, your refund or exchange ships within 5–10 business days.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-deep text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="mt-8 rounded-2xl border-2 border-coral/30 bg-cream p-7">
            <h2 className="font-serif text-xl text-ink">Exchanges</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
              Need a different size or color? We&apos;re happy to exchange eligible apparel items for
              another size or colorway within the same product. Just mention it when you email us
              to start the process and we&apos;ll hold the replacement until your return arrives.
            </p>
          </div>

          <p className="mt-8 text-sm text-stone">
            Last updated: June 2025 &nbsp;·&nbsp;{" "}
            <a href="/shipping" className="text-coral underline underline-offset-2 hover:text-coral-deep">
              View Shipping Policy →
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
