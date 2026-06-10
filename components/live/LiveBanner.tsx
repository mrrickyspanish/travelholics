"use client";

import { useLiveStatus } from "@/hooks/useLiveStatus";
import { TIKTOK_LIVE_URL } from "@/lib/liveSchedule";

/**
 * Site-wide live banner. Drop into app/layout.tsx directly above {children}
 * (below the nav). Renders nothing when offline, so it costs zero space
 * for most of the day.
 *
 * States:
 *  LIVE → coral bar, pulsing dot, "Watch on TikTok"
 *  SOON → dark bar, countdown to the next live
 */
export default function LiveBanner() {
  const status = useLiveStatus();

  if (!status || status.state === "off" || !status.show) return null;

  const isLive = status.state === "live";

  return (
    <a
      href={TIKTOK_LIVE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        isLive
          ? `${status.show.name} is live now on TikTok. Tap to watch.`
          : `${status.show.name} starts in ${status.minutesUntilNext} minutes on TikTok.`
      }
      className={`group flex min-h-[56px] w-full items-center justify-center gap-3 px-4 py-3 text-center transition-colors ${
        isLive
          ? "bg-[#E85D5D] text-[#161311] hover:bg-[#e04c4c]"
          : "bg-[#161311] text-white hover:bg-[#26211d]"
      }`}
    >
      {/* Pulsing live dot */}
      <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping ${
            isLive ? "bg-[#161311]" : "bg-[#E85D5D]"
          }`}
        />
        <span
          className={`relative inline-flex h-3 w-3 rounded-full ${
            isLive ? "bg-[#161311]" : "bg-[#E85D5D]"
          }`}
        />
      </span>

      <span className="text-[15px] font-bold uppercase tracking-wide sm:text-base">
        {isLive ? (
          <>
            Live now: {status.show.name}
            <span className="ml-2 hidden font-semibold normal-case tracking-normal underline underline-offset-4 sm:inline">
              Watch on TikTok →
            </span>
          </>
        ) : (
          <>
            {status.show.name} starts in {status.minutesUntilNext} min
            <span className="ml-2 hidden font-semibold normal-case tracking-normal underline underline-offset-4 sm:inline">
              Get in early →
            </span>
          </>
        )}
      </span>

      {/* Mobile arrow — the whole bar is the tap target */}
      <span className="font-bold sm:hidden" aria-hidden="true">
        →
      </span>
    </a>
  );
}
