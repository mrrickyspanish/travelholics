import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, CalendarDays, Users, Quote, ExternalLink, Check } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb } from "@/components/breadcrumb";
import { DestinationForm } from "@/components/destination/destination-form";
import { AffiliateNote } from "@/components/destination/affiliate-note";
import { destinations, getDestination } from "@/lib/destinations";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yotravelholic.com";

type PageProps = { params: Promise<{ destination: string }> };

export function generateStaticParams() {
  return destinations.map((d) => ({ destination: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destination } = await params;
  const config = getDestination(destination);
  if (!config) return {};
  return {
    title: config.seoTitle,
    description: config.seoDescription,
    alternates: { canonical: `/cruises/${config.slug}` },
    openGraph: {
      title: `${config.seoTitle} | Travelholics`,
      description: config.seoDescription,
      url: `/cruises/${config.slug}`,
      type: "website",
    },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { destination } = await params;
  const config = getDestination(destination);
  if (!config) notFound();

  // Excursions only render once real affiliate links replace TODO placeholders,
  // so the page can ship before Yolanda's links are in.
  const liveExcursions = config.excursions.filter((e) => !e.url.includes("TODO"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        name: "Travelholics",
        url: siteUrl,
        description: config.seoDescription,
        founder: { "@type": "Person", name: "Yolanda Harris" },
        areaServed: config.name,
      },
      {
        "@type": "FAQPage",
        mainEntity: config.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Cruises", item: `${siteUrl}/cruises/${config.slug}` },
          { "@type": "ListItem", position: 3, name: config.name },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="bg-sand">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={config.heroImage}
              alt={config.heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/20" />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
            <Breadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Cruises" },
                { label: config.name },
              ]}
            />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blush">
              {config.heroEyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {config.heroHeadline}
            </h1>
            <p className="mt-4 font-script text-2xl text-blush sm:text-3xl">
              “{config.heroTake}” <span className="text-white/70">- Yolanda</span>
            </p>
            <div className="mt-8">
              <Link
                href="#plan"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-coral px-7 py-3 text-[16px] font-semibold text-white shadow-md transition-colors hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
              >
                Plan My {config.name} Cruise
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why this destination ─────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          <div className={config.personalPhoto ? "grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start" : undefined}>
            <div>
              <h2 className="font-serif text-3xl text-ink sm:text-4xl">
                Why the {config.name}?
              </h2>
              <div className="mt-6 space-y-5">
                {config.whyParagraphs.map((p, i) => (
                  <p key={i} className="text-[17px] leading-relaxed text-ink/85">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            {config.personalPhoto && (
              <figure className="mt-8 lg:mt-2">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src={config.personalPhoto.src}
                    alt={config.personalPhoto.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-sm italic text-stone">
                  {config.personalPhoto.caption}
                </figcaption>
              </figure>
            )}
          </div>
        </section>

        {/* ── Best time + who it's for ─────────────────────────── */}
        <section className="bg-emerald-deep py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="font-serif text-3xl text-white sm:text-4xl">
              {config.bestTime.headline}
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/85">
              {config.bestTime.body}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-6">
                <CalendarDays className="h-6 w-6 text-blush" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-white">Best months</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/80">
                  {config.bestTime.bestMonths}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <MapPin className="h-6 w-6 text-blush" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-white">Worth knowing</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/80">
                  {config.bestTime.avoid}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <Users className="h-6 w-6 text-blush" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-white">Made for</h3>
                <ul className="mt-2 space-y-1.5">
                  {config.bestTime.idealFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[15px] leading-relaxed text-white/80"
                    >
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-blush" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Yolanda's port notes ─────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">
            Straight from the deck
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
            Yolanda&apos;s port notes
          </h2>
          <p className="mt-3 max-w-2xl text-[17px] text-stone">
            Real opinions from ports she has actually walked. Not brochure copy.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {config.portNotes.map((pn) => (
              <article key={pn.port} className="rounded-2xl bg-cream p-6 shadow-sm">
                <h3 className="font-serif text-xl text-ink">{pn.port}</h3>
                {pn.verdict && (
                  <p className="mt-1 font-script text-lg text-coral">{pn.verdict}</p>
                )}
                <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{pn.note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Excursions worth booking (affiliate) ─────────────── */}
        {liveExcursions.length > 0 && (
          <section className="bg-cream py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
              <h2 className="font-serif text-3xl text-ink sm:text-4xl">
                The excursions worth it
              </h2>
              <p className="mt-3 max-w-2xl text-[17px] text-stone">
                The ones Yolanda books herself or sends her own travelers to.
              </p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {liveExcursions.map((ex) => (
                  <a
                    key={ex.name + ex.port}
                    href={ex.url}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="group rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-stone">
                      {ex.port}
                    </p>
                    <h3 className="mt-2 flex items-start gap-2 font-serif text-xl text-ink">
                      {ex.name}
                      <ExternalLink
                        className="mt-1 h-4 w-4 flex-shrink-0 text-coral opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{ex.blurb}</p>
                    {ex.priceFrom && (
                      <p className="mt-3 text-sm font-semibold text-emerald-mid">
                        {ex.priceFrom}
                      </p>
                    )}
                  </a>
                ))}
              </div>
              <div className="mt-8">
                <AffiliateNote />
              </div>
            </div>
          </section>
        )}

        {/* ── Testimonial ──────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-20">
          <Quote className="mx-auto h-8 w-8 text-coral" aria-hidden="true" />
          <blockquote className="mt-5 font-serif text-2xl leading-snug text-ink sm:text-3xl">
            “{config.testimonial.quote}”
          </blockquote>
          <p className="mt-5 font-semibold text-ink">{config.testimonial.name}</p>
          <p className="text-sm text-stone">{config.testimonial.trip}</p>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="bg-cream py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">
              {config.name} cruise questions, answered
            </h2>
            <div className="mt-8 space-y-3">
              {config.faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-2xl bg-white p-5 shadow-sm open:shadow-md"
                >
                  <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                    {f.question}
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline planning form ─────────────────────────────── */}
        <section id="plan" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            Plan your {config.name} cruise
          </h2>
          <p className="mt-3 text-[17px] text-stone">
            Tell Yolanda about the trip. She will come back with real options, not a brochure.
          </p>
          <div className="mt-8">
            <DestinationForm destination={config.name} />
          </div>
        </section>

        {/* ── Related destinations ─────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <h2 className="font-serif text-2xl text-ink">Still deciding?</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {config.relatedSlugs.map((slug) => {
              const related = getDestination(slug);
              if (!related) return null;
              return (
                <Link
                  key={slug}
                  href={`/cruises/${slug}`}
                  className="inline-flex min-h-[44px] items-center rounded-full border-2 border-emerald-mid px-6 py-2.5 text-[15px] font-semibold text-emerald-mid transition-colors hover:bg-emerald-mid hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-mid"
                >
                  Cruise {related.name} →
                </Link>
              );
            })}
            <Link
              href="/shop"
              className="inline-flex min-h-[44px] items-center rounded-full border-2 border-coral px-6 py-2.5 text-[15px] font-semibold text-coral transition-colors hover:bg-coral hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              Shop the gear →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
