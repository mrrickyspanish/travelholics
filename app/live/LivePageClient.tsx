"use client";

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

export default function LivePageClient() {
  const status = useLiveStatus();
  const isLive = status?.state === "live";
  const liveShow = isLive ? status?.show : null;

  return (
    <main className="bg-sand text-navy">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="px-5 pt-16 pb-14 sm:px-8 md:pt-24 md:pb-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-coral sm:text-[15px]">
            Yo Travelholic · Live on TikTok
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
                className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#D04444] px-9 text-lg font-bold text-white transition-colors hover:bg-[#b83939] md:min-h-[56px]"
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
                Three lives.
                <br />
                <span className="text-coral">Every single day.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-stone md:text-xl">
                Worship in the morning. Cruise talk at lunch. Battles at night.
                All times Central — pull up to whichever one fits your day.
              </p>
              {status && (
                <a
                  href={TIKTOK_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-navy px-9 text-lg font-bold text-white transition-colors hover:bg-ink md:min-h-[56px]"
                >
                  Next live: {status.nextShow.name} in{" "}
                  {formatCountdown(status.minutesUntilNext)}
                </a>
              )}
            </>
          )}
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
                          : "bg-navy text-white"
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

      {/* ──────────────── WHILE YOU WAIT: SHOP + DUCK ──────────────── */}
      <section className="px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-7">
          {/* Shop */}
          <div className="flex flex-col justify-between rounded-2xl bg-navy p-8 text-white md:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-coral">
                As seen on the live
              </p>
              <h2 style={display} className="mt-3 text-4xl tracking-[-0.02em] md:text-5xl">
                Shop the goods
              </h2>
              <p className="mt-3 text-[17px] leading-relaxed text-cream/80">
                The lanyard, the door magnets — everything she holds up on
                stream lives here.
              </p>
            </div>
            <a
              href="/shop"
              className="mt-8 inline-flex min-h-[52px] w-fit items-center justify-center rounded-full bg-[#D04444] px-8 text-lg font-bold text-white transition-colors hover:bg-[#b83939]"
            >
              Shop the goods
            </a>
          </div>

          {/* Duck hunt */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-navy bg-white/65 p-8 shadow-[0_6px_16px_rgba(26,58,82,0.06)] backdrop-blur-[1px] md:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-coral">
                The duck hunt
              </p>
              <h2 style={display} className="mt-3 text-4xl tracking-[-0.02em] md:text-5xl">
                Find the duck
              </h2>
              <p className="mt-3 text-[17px] leading-relaxed text-stone">
                A duck is hiding somewhere on this site. Find it, enter, and
                listen for winners on the night live.
              </p>
            </div>
            <a
              href="/duck-hunt"
              className="mt-8 inline-flex min-h-[52px] w-fit items-center justify-center rounded-full bg-navy px-8 text-lg font-bold text-white transition-colors hover:bg-ink"
            >
              Start hunting
            </a>
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
            Follow on TikTok and the app pings you the second she goes live.
          </p>
          <a
            href={TIKTOK_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-navy px-9 text-lg font-bold text-white transition-colors hover:bg-ink md:min-h-[56px]"
          >
            Follow @rjsmom1
          </a>
        </div>
      </section>
    </main>
  );
}
