import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronLeft, Minus, Printer } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  PUBLISHABLE_GUIDES,
  formatGuideSize,
  getGuideBySlug,
  getRelatedGuides,
  type GuideSection,
} from "@/lib/free-guides";
import { GuideDownloadCta } from "./guide-download-cta";

type Props = { params: Promise<{ slug: string }> };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yotravelholic.com";

export function generateStaticParams() {
  return PUBLISHABLE_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) return { title: "Guide Not Found" };

  const title = guide.metaTitle ?? guide.title;
  const description = guide.metaDescription ?? guide.blurb;

  return {
    title,
    description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title,
      description,
      url: `/guides/${guide.slug}`,
      type: "article",
      siteName: "Travelholics",
    },
  };
}

function SectionBlock({ section }: { section: GuideSection }) {
  return (
    <section className="border-t border-ink/10 pt-8">
      <h2 className="font-serif text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
        {section.heading}
      </h2>

      {section.body && (
        <p className="mt-3 text-[1rem] leading-relaxed text-stone">{section.body}</p>
      )}

      {section.items && (
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {section.items.map((item) => (
            <li key={item} className="flex gap-3 text-[0.97rem] leading-relaxed text-ink/85">
              <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-mid" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {(section.pros || section.cons) && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {section.pros && (
            <div className="rounded-2xl bg-emerald-mid/[0.07] p-5">
              <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-emerald-mid">
                Pros
              </h3>
              <ul className="mt-3 space-y-2">
                {section.pros.map((pro) => (
                  <li key={pro} className="flex gap-2.5 text-[0.93rem] leading-relaxed text-ink/85">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-mid" aria-hidden />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.cons && (
            <div className="rounded-2xl bg-coral/[0.07] p-5">
              <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-coral-deep">
                Cons
              </h3>
              <ul className="mt-3 space-y-2">
                {section.cons.map((con) => (
                  <li key={con} className="flex gap-2.5 text-[0.93rem] leading-relaxed text-ink/85">
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral-deep" aria-hidden />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {section.bestFor && (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/85">
          <span className="font-semibold text-ink">Best for:</span> {section.bestFor}
        </p>
      )}

      {section.callout && (
        <p className="mt-4 border-l-2 border-coral pl-4 font-serif text-[1.05rem] italic leading-relaxed text-ink/80">
          {section.callout}
        </p>
      )}
    </section>
  );
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  const related = getRelatedGuides(guide.slug);

  // Article schema so the page can earn a rich result rather than a bare link.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.metaTitle ?? guide.title,
    description: guide.metaDescription ?? guide.blurb,
    author: { "@type": "Person", name: "Yolanda Harris" },
    publisher: {
      "@type": "Organization",
      name: "Travelholics",
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`,
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="bg-sand pb-20 pt-28 sm:pt-32">
        <article className="mx-auto max-w-3xl px-5 lg:px-8">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-stone transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            All free guides
          </Link>

          <header className="mt-6">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-coral">
              {guide.category} · Free guide
            </p>
            <h1 className="mt-3 font-serif text-[2.2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.7rem]">
              {guide.title}
            </h1>
            {guide.intro && (
              <p className="mt-5 text-[1.06rem] leading-relaxed text-stone">{guide.intro}</p>
            )}
          </header>

          {/* Download offer sits above the content: the page is free to read,
              the formatted file is the upgrade. */}
          <div className="mt-8 rounded-[1.5rem] bg-cream p-6 shadow-[0_18px_50px_rgba(26,58,82,0.08)] ring-1 ring-white/70 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="flex items-center gap-2 font-serif text-[1.15rem] font-semibold text-ink">
                <Printer className="h-4 w-4 text-emerald-mid" aria-hidden />
                Want the printable version?
              </p>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-stone">
                Get the formatted {guide.format.toUpperCase()} to print and check off as you pack —{" "}
                {guide.pages
                  ? `${guide.pages} ${guide.pages === 1 ? "page" : "pages"}`
                  : formatGuideSize(guide)}
                , free.
              </p>
            </div>
            <GuideDownloadCta guide={guide} className="mt-4 w-full sm:mt-0 sm:w-auto sm:shrink-0" />
          </div>

          <div className="mt-12 space-y-10">
            {guide.sections?.map((section) => (
              <SectionBlock key={section.heading} section={section} />
            ))}
          </div>

          {guide.tip && (
            <aside className="mt-12 rounded-[1.5rem] bg-emerald-deep p-6 text-white sm:p-8">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/50">
                Travelholics tip
              </p>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-white/90">{guide.tip}</p>
            </aside>
          )}

          {guide.disclaimer && (
            <p className="mt-8 text-[0.82rem] leading-relaxed text-stone">{guide.disclaimer}</p>
          )}

          <div className="mt-12 rounded-[1.5rem] bg-cream p-7 text-center shadow-[0_18px_50px_rgba(26,58,82,0.08)] ring-1 ring-white/70">
            <h2 className="font-serif text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
              Take this guide with you
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-relaxed text-stone">
              Print it, check it off, pack smarter. Free — we just need to know where to send it.
            </p>
            <GuideDownloadCta guide={guide} className="mt-5 w-full sm:w-auto" />
          </div>

          <p className="mt-10 text-center font-script text-[1.3rem] text-stone">
            Same goal. New level. And I&apos;m rooting for you.
          </p>
        </article>

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-5xl px-5 lg:px-8">
            <h2 className="text-center font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
              More free guides
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/guides/${item.slug}`}
                  className="group rounded-[1.25rem] bg-cream p-5 shadow-[0_14px_40px_rgba(26,58,82,0.07)] ring-1 ring-white/70 transition-shadow hover:shadow-[0_18px_50px_rgba(26,58,82,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                >
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-stone">
                    {item.category}
                  </p>
                  <h3 className="mt-2 font-serif text-[1.15rem] font-semibold leading-tight text-ink group-hover:text-emerald-mid">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[0.88rem] leading-relaxed text-stone">
                    {item.blurb}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
