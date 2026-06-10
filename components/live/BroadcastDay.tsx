"use client";

import { SHOWS, type LiveStatus } from "@/lib/liveSchedule";

/**
 * The signature element of the /live page: one horizontal bar representing
 * the broadcast day (6 AM – 10 PM CT), with coral blocks for each live window
 * and a marker showing where "now" sits. Tells the whole story at a glance.
 */

const WINDOW_START = 6 * 60; // 6:00 AM
const WINDOW_END = 22 * 60; // 10:00 PM
const SPAN = WINDOW_END - WINDOW_START;

const pct = (min: number) =>
  Math.min(100, Math.max(0, ((min - WINDOW_START) / SPAN) * 100));

const TICKS = [
  { min: 6 * 60, label: "6 AM" },
  { min: 9 * 60, label: "9 AM" },
  { min: 12 * 60, label: "12 PM" },
  { min: 15 * 60, label: "3 PM" },
  { min: 18 * 60, label: "6 PM" },
  { min: 21 * 60, label: "9 PM" },
];

export default function BroadcastDay({ status }: { status: LiveStatus | null }) {
  const nowMin = status?.chicagoMinutes ?? null;
  const nowInWindow =
    nowMin !== null && nowMin >= WINDOW_START && nowMin <= WINDOW_END;
  const liveKey = status?.state === "live" ? status.show?.key : null;

  return (
    <div aria-label="Daily live schedule timeline, all times Central">
      {/* Track */}
      <div className="relative h-14 w-full rounded-full bg-neutral-200/80 sm:h-16">
        {SHOWS.map((show) => {
          const left = pct(show.startMin);
          const width = pct(show.endMin) - left;
          const isLiveNow = liveKey === show.key;
          return (
            <div
              key={show.key}
              className={`absolute top-0 flex h-full items-center justify-center rounded-full transition-colors ${
                isLiveNow ? "bg-[#161311]" : "bg-[#E85D5D]"
              }`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${show.name} · ${show.timeLabel}`}
            >
              <span className="hidden truncate px-2 text-xs font-bold uppercase tracking-wider text-white md:inline">
                {isLiveNow ? "Live now" : show.name}
              </span>
            </div>
          );
        })}

        {/* NOW marker */}
        {nowInWindow && (
          <div
            className="absolute -top-2 -bottom-2 z-10 w-[3px] rounded-full bg-[#161311]"
            style={{ left: `${pct(nowMin)}%` }}
            aria-hidden="true"
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-[#161311]">
              Now
            </span>
          </div>
        )}
      </div>

      {/* Hour ticks */}
      <div className="relative mt-3 h-5 w-full">
        {TICKS.map((t) => (
          <span
            key={t.label}
            className="absolute -translate-x-1/2 text-xs font-semibold uppercase tracking-wide text-neutral-500 first:translate-x-0 last:-translate-x-full"
            style={{ left: `${pct(t.min)}%` }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
