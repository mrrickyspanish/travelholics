"use client";

import Link from "next/link";
import {
  CalendarCheck,
  DoorOpen,
  HelpCircle,
  Luggage,
  MapPin,
  Ship,
  Users,
} from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import BroadcastDay from "@/components/live/BroadcastDay";
import { useLiveStatus } from "@/hooks/useLiveStatus";
import {
  SHOWS,
  TIKTOK_LIVE_URL,
  TIKTOK_PROFILE_URL,
} from "@/lib/liveSchedule";

const display = {
  fontFamily: 'var(--font-fraunces, Georgia, serif)',
} as const;

function formatCountdown(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

const HERO_PROOF = [
  { icon: CalendarCheck, label: "Live three times a day" },
  { icon: Users, label: "20K+ travelers following along" },
  { icon: HelpCircle, label: "Real Q&A on every cruise talk" },
];

const COVERED_TOPICS = [
  {
    icon: Luggage,
    title: "What to pack — and what to skip",
    note: "Carry-on strategy, cabin storage, and the stuff that never earns its suitcase space.",
  },
  {
    icon: Ship,
    title: "Ship and cruise line talk",
    note: "Which lines and ships actually fit your crew, your budget, and your kind of trip.",
  },
  {
    icon: HelpCircle,
    title: "First-time cruiser questions",
    note: "Boarding, dining, tipping, sea days — ask before you book instead of learning the hard way.",
  },
  {
    icon: MapPin,
    title: "Port day advice",
    note: "Excursions that earn their price, beaches worth the walk, and when to just enjoy the ship.",
  },
  {
    icon: Users,
    title: "Group trips and family sailings",
    note: "How to get a whole crew booked, packed, and on board without the group-chat chaos.",
  },
  {
    icon: DoorOpen,
    title: "Cruise life and cabin doors",
    note: "Door magnets, countdown energy, and the fun side of sailing that keeps people coming back.",
  },
];

export default function LivePageClient() {
  const status = useLiveStatus();
  const isLive = status?.state === "live";
  const liveShow = isLive ? status?.show : null;

  return (
    <>
      <Header />
      <main className="bg-sand text-ink">
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="px-5 pb-14 pt-28 sm:px-8 md:pb-20 md:pt-36">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-coral sm:text-[15px]">
              Live on TikTok · Every single day
            </p>

            {isLive && liveShow ? (
              <>
                <h1
                  style={display}
                  className="text-5xl leading-[0.98] tracking-[-0.02em] sm:text-7xl md:text-8xl"
                >
                  We&rsquo;re live
                  <br />
                  <span className="text-coral">right now.</span>
                </h1>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-stone md:text-xl">
                  {liveShow.name} is on. The replay disappears — the live
                  doesn&rsquo;t wait.
                </p>
                <a
                  href={TIKTOK_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-coral px-9 text-lg font-bold text-white transition-colors hover:bg-coral-deep md:min-h-[56px]"
                >
                  <span className="relative flex h-3 w-3" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                  </span>
                  Watch the live
                </a>
              </>
            ) : (
              <>
                <h1
                  style={display}
                  className="text-5xl leading-[0.98] tracking-[-0.02em] sm:text-7xl md:text-8xl"
                >
                  Daily cruise advice
                  <br />
                  <span className="text-coral">from Yolanda.</span>
                </h1>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-stone md:text-xl">
                  Cruise tips, packing help, ship talk, and straight answers to
                  your booking questions — live on TikTok every day, with a
                  community of 20K+ travelers pulling up alongside you.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  {status && (
                    <a
                      href={TIKTOK_PROFILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-8 text-lg font-bold text-white transition-colors hover:bg-emerald-deep md:min-h-[56px]"
                    >
                      Next live: {status.nextShow.name} in{" "}
                      {formatCountdown(status.minutesUntilNext)}
                    </a>
                  )}
                  <a
                    href={TIKTOK_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-8 text-lg font-bold text-emerald-mid shadow-sm ring-1 ring-emerald-mid/15 transition-colors hover:bg-cream md:min-h-[56px]"
                  >
                    Follow on TikTok
                  </a>
                </div>
              </>
            )}

            <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
              {HERO_PROOF.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-ink/72"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
                    <Icon size={15} strokeWidth={2.3} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─────────────────── BROADCAST DAY TIMELINE ─────────────────── */}
        <section className="px-5 pb-16 sm:px-8 md:pb-24">
          <div className="mx-auto max-w-5xl">
            <BroadcastDay status={status} />
          </div>
        </section>

        {/* ───────────────────── SCHEDULE CARDS ───────────────────── */}
        <section className="bg-cream px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2
              style={display}
              className="text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl"
            >
              The daily lineup
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-stone">
              Same rhythm every day, all times Central. Pull up to whichever
              one fits your schedule.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-7">
              {SHOWS.map((show) => {
                const isThisLive = isLive && liveShow?.key === show.key;
                const isNext = !isLive && status?.nextShow.key === show.key;
                return (
                  <article
                    key={show.key}
                    className={`flex flex-col rounded-2xl border-2 p-7 transition-colors md:p-8 ${
                      isThisLive
                        ? "border-coral bg-coral/[0.06]"
                        : "border-stone/10 bg-white/65 shadow-[0_6px_16px_rgba(26,58,82,0.06)] backdrop-blur-[1px]"
                    }`}
                  >
                    {(isThisLive || isNext) && (
                      <span
                        className={`mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-wider ${
                          isThisLive
                            ? "bg-coral text-white"
                            : "bg-ink text-white"
                        }`}
                      >
                        {isThisLive && (
                          <span
                            className="h-2 w-2 rounded-full bg-white motion-safe:animate-pulse"
                            aria-hidden="true"
                          />
                        )}
                        {isThisLive ? "Live now" : "Up next"}
                      </span>
                    )}

                    <p
                      style={display}
                      className="text-4xl tracking-[-0.02em] text-coral md:text-5xl"
                    >
                      {show.timeLabel.replace(" CT", "")}
                      <span className="ml-2 text-xl text-stone/60">CT</span>
                    </p>
                    <h3 className="mt-3 text-xl font-bold md:text-2xl">
                      {show.name}
                    </h3>
                    <p className="mt-2 flex-1 text-[17px] leading-relaxed text-stone">
                      {show.tagline}
                    </p>
                    <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-stone/60">
                      {show.durationLabel} · Every day
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────── WHAT YOLANDA COVERS ─────────────────── */}
        <section className="bg-emerald-deep px-5 py-16 text-white sm:px-8 md:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-coral">
              What she covers
            </p>
            <h2
              style={display}
              className="text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl"
            >
              Real questions.
              <br />
              Real answers. Daily.
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/72 md:text-lg">
              Whether you&rsquo;re planning, packing, or just cruise-curious,
              there&rsquo;s something in the rotation for you.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {COVERED_TOPICS.map(({ icon: Icon, title, note }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/12 md:p-7"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-coral/15 text-coral">
                    <Icon size={20} strokeWidth={2.1} />
                  </span>
                  <h3 className="text-[1.08rem] font-bold leading-snug text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-white/68">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────── AFTER THE LIVE: PLAN + SHOP + DUCK ──────────────── */}
        <section className="px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2
              style={display}
              className="text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl"
            >
              After the live
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-stone">
              The lives are where the advice happens. This is where it turns
              into a trip.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-7">
              {/* Plan a trip */}
              <div className="flex flex-col justify-between rounded-2xl bg-emerald-deep p-8 text-white md:p-9">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-coral">
                    From advice to booked
                  </p>
                  <h3
                    style={display}
                    className="mt-3 text-3xl tracking-[-0.02em] md:text-4xl"
                  >
                    Plan the trip
                  </h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-white/78">
                    Take what you heard on the live and let Yolanda turn it
                    into the right ship, cabin, and dates. No fees, same price
                    as booking direct.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="mt-8 inline-flex min-h-[52px] w-fit items-center justify-center rounded-full bg-coral px-8 text-lg font-bold text-white transition-colors hover:bg-coral-deep"
                >
                  Start planning
                </Link>
              </div>

              {/* Shop */}
              <div className="flex flex-col justify-between rounded-2xl bg-[#0E125C] p-8 text-white md:p-9">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-coral">
                    As seen on the live
                  </p>
                  <h3
                    style={display}
                    className="mt-3 text-3xl tracking-[-0.02em] md:text-4xl"
                  >
                    Shop the goods
                  </h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-cream/80">
                    The lanyard, the door magnets — everything she holds up on
                    stream lives here.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="mt-8 inline-flex min-h-[52px] w-fit items-center justify-center rounded-full bg-white px-8 text-lg font-bold text-[#0E125C] transition-colors hover:bg-cream"
                >
                  Shop Originals
                </Link>
              </div>

              {/* Duck hunt */}
              <div className="flex flex-col justify-between rounded-2xl border-2 border-ink/80 bg-white/65 p-8 shadow-[0_6px_16px_rgba(26,58,82,0.06)] backdrop-blur-[1px] md:p-9">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-coral">
                    The duck hunt
                  </p>
                  <h3
                    style={display}
                    className="mt-3 text-3xl tracking-[-0.02em] md:text-4xl"
                  >
                    Find the duck
                  </h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-stone">
                    A duck is hiding somewhere on this site. Find it, enter,
                    and listen for winners on the night live.
                  </p>
                </div>
                <Link
                  href="/duck-hunt"
                  className="mt-8 inline-flex min-h-[52px] w-fit items-center justify-center rounded-full bg-ink px-8 text-lg font-bold text-white transition-colors hover:bg-emerald-deep"
                >
                  Start hunting
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── FOLLOW CTA ───────────────────────── */}
        <section className="bg-coral px-5 py-16 text-center sm:px-8 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2
              style={display}
              className="text-4xl tracking-[-0.02em] text-white sm:text-5xl md:text-6xl"
            >
              Never miss a live
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-white/90 md:text-lg">
              Follow on TikTok and you&rsquo;ll get pinged the second Yolanda
              goes live.
            </p>
            <a
              href={TIKTOK_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-9 text-lg font-bold text-white transition-colors hover:bg-emerald-deep md:min-h-[56px]"
            >
              Follow @rjsmom1
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
