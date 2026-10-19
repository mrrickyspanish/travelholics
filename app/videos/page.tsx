import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Users, Youtube } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VideoEmbed } from "@/components/video-embed";
import { watchUrl, SUBSCRIBE_URL, type Video } from "@/lib/youtube";
import { START_HERE_IDS, videoNextStep } from "@/lib/youtube-catalog";
import { getFeaturedLongForm, getLongForm, getShorts } from "@/lib/youtube-feed";

export const metadata: Metadata = {
  title: "Cruise School with Yolanda | Videos & Cruise Advice",
  description: "Watch Cruise School with Yolanda Harris. Get practical cruise answers, compare ships, find free packing guides, and start planning your individual or group cruise.",
  alternates: { canonical: "/videos" },
  openGraph: { title: "Cruise School with Yolanda", description: "Real cruise answers, useful guides, and a clear next step for your vacation.", url: "/videos", type: "website" },
};

export const revalidate = 1800;

function LongCard({ video }: { video: Video }) {
  const next = videoNextStep(video.id);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-cream p-4 shadow-sm ring-1 ring-ink/10">
      <VideoEmbed id={video.id} title={video.title} format="long" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      <div className="flex flex-1 flex-col px-1 pb-2 pt-5">
        <h3 className="font-serif text-2xl font-semibold leading-tight text-ink">{video.title}</h3>
        {video.blurb && <p className="mt-3 text-lg leading-7 text-stone">{video.blurb}</p>}
        <Link href={next.href} className="mt-auto inline-flex min-h-12 items-center gap-2 pt-5 text-base font-bold text-emerald-deep hover:underline">{next.label}<ArrowUpRight size={18} className="shrink-0" /></Link>
      </div>
    </article>
  );
}

export default async function VideosPage() {
  const [featured, allLongForm, shorts] = await Promise.all([getFeaturedLongForm(), getLongForm(), getShorts(4)]);
  const starters = START_HERE_IDS.map((id) => allLongForm.find((video) => video.id === id)).filter((video): video is Video => Boolean(video));
  const shown = new Set([featured?.id, ...START_HERE_IDS]);
  const more = allLongForm.filter((video) => !shown.has(video.id));
  const next = featured ? videoNextStep(featured.id) : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand">
        <section className="bg-[#1F2D86] px-5 pb-16 pt-32 text-cream sm:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-3 font-script text-3xl text-[#F4C4CC]">Cruise School with Yolanda</p>
            <h1 className="font-serif text-5xl font-semibold leading-tight sm:text-6xl">Watch &amp; Learn</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cream/85">Choose the right ship, understand the real cost, and get ready for your vacation with Yolanda&apos;s practical cruise advice.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="#start-here" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cream px-6 py-3 text-base font-bold text-ink"><BookOpen size={20} />Start Cruise School</Link>
              <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-6 py-3 text-base font-bold text-white hover:bg-coral-deep"><Youtube size={20} />Subscribe on YouTube</a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-16 px-5 py-14 sm:px-8">
          {featured && next && (
            <section aria-labelledby="featured-video" className="grid gap-7 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div className="rounded-3xl bg-ink p-3 shadow-lg"><VideoEmbed id={featured.id} title={featured.title} format="long" sizes="(max-width: 1024px) 100vw, 60vw" priority /></div>
              <div>
                <p className="text-base font-bold uppercase tracking-[0.12em] text-stone">Featured lesson</p>
                <h2 id="featured-video" className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">{featured.title}</h2>
                {featured.blurb && <p className="mt-4 text-lg leading-8 text-stone">{featured.blurb}</p>}
                <Link href={next.href} className="mt-5 inline-flex min-h-12 items-center gap-2 text-base font-bold text-emerald-deep hover:underline">{next.label}<ArrowUpRight size={18} /></Link>
                <a href={watchUrl(featured)} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 w-fit items-center gap-2 text-base font-semibold text-coral hover:underline">Watch on YouTube<ArrowUpRight size={16} /></a>
              </div>
            </section>
          )}

          <section id="start-here" aria-labelledby="start-here-title" className="scroll-mt-28">
            <p className="text-base font-bold uppercase tracking-[0.12em] text-stone">New to cruising?</p>
            <h2 id="start-here-title" className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">Start with Cruise School</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-stone">Start with choosing a cruise, packing for it, and deciding how to book. Each lesson gives you a useful next step.</p>
            <div className="mt-7 grid gap-6 md:grid-cols-3">{starters.map((video) => <LongCard key={video.id} video={video} />)}</div>
          </section>

          <section aria-labelledby="group-planning-title" className="rounded-3xl bg-[#082d27] px-6 py-9 text-white sm:p-10">
            <Users className="mb-4 text-coral" size={30} aria-hidden="true" />
            <p className="text-base font-bold uppercase tracking-[0.12em] text-white/70">From watching to planning</p>
            <h2 id="group-planning-title" className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">Bring your people.</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/85">Family reunion, milestone birthday, friends trip, or church group? Yolanda helps you choose the sailing and organize the details. Each traveler gets a clear way to request their own cabin.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/group-cruises" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-6 py-3 text-base font-bold text-white hover:bg-coral-deep">Plan a group cruise<ArrowUpRight size={18} /></Link>
              <Link href="/cruise-interest" className="inline-flex min-h-12 items-center rounded-xl border border-white/50 px-6 py-3 text-base font-bold">Plan my own cruise</Link>
              <Link href="/guides" className="inline-flex min-h-12 items-center gap-2 px-3 py-3 text-base font-bold text-white hover:underline">Browse free guides<ArrowUpRight size={18} /></Link>
            </div>
            <p className="mt-5 text-lg leading-8 text-white/75">No planning fees. Travelholics is compensated by travel suppliers.</p>
          </section>

          {shorts.length > 0 && (
            <section aria-labelledby="shorts-title">
              <h2 id="shorts-title" className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">Quick cruise answers</h2>
              <div className="mt-7 grid grid-cols-2 gap-5 lg:grid-cols-4">{shorts.map((video) => (
                <article key={video.id}>
                  <VideoEmbed id={video.id} title={video.title} format="short" sizes="(max-width: 1024px) 45vw, 250px" />
                  <p className="mt-3 text-lg font-semibold leading-7 text-ink">{video.title}</p>
                </article>
              ))}</div>
            </section>
          )}

          {more.length > 0 && <section aria-labelledby="more-title"><h2 id="more-title" className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">More from Yolanda</h2><div className="mt-7 grid gap-6 md:grid-cols-3">{more.map((video) => <LongCard key={video.id} video={video} />)}</div></section>}

          <section aria-labelledby="live-questions" className="rounded-3xl border border-ink/15 bg-cream p-6 sm:p-9">
            <h2 id="live-questions" className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">Live cruise Q&amp;A</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-stone">Bring the questions you still have. Subscribe on YouTube for new lessons and live conversations with Yolanda, or explore her TikTok shows.</p>
            <div className="mt-5 flex flex-wrap gap-5">
              <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-base font-bold text-emerald-deep hover:underline"><Youtube size={20} />Subscribe for updates</a>
              <Link href="/live" className="inline-flex min-h-12 items-center gap-2 text-base font-bold text-emerald-deep hover:underline">Explore the TikTok shows<ArrowUpRight size={18} /></Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
