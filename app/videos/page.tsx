import type { Metadata } from "next";
import { Youtube } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VideoEmbed } from "@/components/video-embed";
import { watchUrl, SUBSCRIBE_URL, CHANNEL_HANDLE, type Video } from "@/lib/youtube";
import { getFeaturedLongForm, getLongForm, getShorts } from "@/lib/youtube-feed";

export const metadata: Metadata = {
  title: "Videos | Travelholics — Cruise Tips & Trip Guides on YouTube",
  description:
    "Watch Travelholics on YouTube — weekly cruise deep-dives, ship tours, packing hacks, and quick tips from Certified Cruise Specialist Yolanda Harris.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Travelholics on YouTube",
    description:
      "Weekly cruise deep-dives, ship tours, and quick tips from Yolanda Harris.",
    url: "/videos",
    type: "website",
  },
};

// Feed data is cached inside the loader; keep the page fresh too.
export const revalidate = 1800;

function LongCard({ video }: { video: Video }) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] bg-cream p-3 shadow-[0_18px_50px_rgba(26,58,82,0.08)] ring-1 ring-white/70">
      <VideoEmbed
        id={video.id}
        title={video.title}
        format="long"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="px-1 pb-1 pt-4">
        <h3 className="font-serif text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
          {video.title}
        </h3>
        {video.blurb && (
          <p className="mt-2 text-[0.95rem] leading-relaxed text-stone">{video.blurb}</p>
        )}
      </div>
    </article>
  );
}

function ShortCard({ video }: { video: Video }) {
  return (
    <article>
      <VideoEmbed
        id={video.id}
        title={video.title}
        format="short"
        sizes="(max-width: 640px) 45vw, 200px"
      />
      <p className="mt-2 line-clamp-2 text-[0.9rem] font-semibold leading-snug text-ink">
        {video.title}
      </p>
    </article>
  );
}

export default async function VideosPage() {
  const [featured, allLongForm, shorts] = await Promise.all([
    getFeaturedLongForm(),
    getLongForm(),
    getShorts(),
  ]);
  const longForm = allLongForm.filter((v) => v.id !== featured?.id);
  const isEmpty = !featured && longForm.length === 0 && shorts.length === 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand">
        {/* Hero */}
        <section className="bg-[#1F2D86] px-6 pb-16 pt-32 text-cream">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-2 font-script text-2xl text-[#F4C4CC] sm:text-3xl">
              Travelholics TV
            </p>
            <h1 className="mb-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl">
              Watch &amp; Learn
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-cream/75 sm:text-xl">
              Cruise deep-dives, ship tours, and quick tips — a new long-form
              video plus fresh Shorts every week.
            </p>
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-coral px-7 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-coral-deep"
            >
              <Youtube size={20} />
              Subscribe on YouTube
            </a>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-14">
          {isEmpty ? (
            <div className="rounded-[2rem] bg-cream px-6 py-20 text-center shadow-sm ring-1 ring-white/70">
              <p className="mb-3 font-serif text-3xl text-ink">Episodes dropping weekly</p>
              <p className="mx-auto max-w-md text-lg text-stone">
                Our first videos are on the way. Subscribe on YouTube ({CHANNEL_HANDLE})
                and you&apos;ll be first to know when they go live.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured */}
              {featured && (
                <section>
                  <p className="type-kicker mb-4 text-stone">Latest episode</p>
                  <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-10">
                    <div className="overflow-hidden rounded-[2rem] bg-[#0E125C] p-3 shadow-[0_30px_80px_rgba(14,18,92,0.18)] sm:p-4">
                      <VideoEmbed
                        id={featured.id}
                        title={featured.title}
                        format="long"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    </div>
                    <div className="lg:pt-2">
                      <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
                        {featured.title}
                      </h2>
                      {featured.blurb && (
                        <p className="mt-4 text-lg leading-relaxed text-stone">
                          {featured.blurb}
                        </p>
                      )}
                      <a
                        href={watchUrl(featured)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-coral hover:text-coral-deep"
                      >
                        Watch on YouTube →
                      </a>
                    </div>
                  </div>
                </section>
              )}

              {/* Shorts */}
              {shorts.length > 0 && (
                <section>
                  <p className="type-kicker mb-4 text-stone">Shorts</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {shorts.map((short) => (
                      <ShortCard key={short.id} video={short} />
                    ))}
                  </div>
                </section>
              )}

              {/* More long-form */}
              {longForm.length > 0 && (
                <section>
                  <p className="type-kicker mb-4 text-stone">More episodes</p>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {longForm.map((video) => (
                      <LongCard key={video.id} video={video} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
