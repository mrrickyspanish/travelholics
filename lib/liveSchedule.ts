/**
 * Travelholics Live Schedule — single source of truth.
 * All times are America/Chicago (CT). Edit the SHOWS array to change the schedule.
 */

// ⚠️ CONFIRM HANDLE before deploy — update if her TikTok username differs.
export const TIKTOK_LIVE_URL = "https://www.tiktok.com/@rjsmom1/live";
export const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@rjsmom1";

export const TIMEZONE = "America/Chicago";

/** Minutes before a show starts when the banner flips to "going live soon". */
export const SOON_WINDOW_MIN = 30;

/**
 * Manual override for the live state.
 * "auto"       → time-based (normal operation)
 * "force-live" → banner + page show LIVE regardless of clock (schedule change, bonus live)
 * "force-off"  → everything shows offline (sick day, travel day)
 * Future: move this flag to Supabase so Yolanda can flip it without a deploy.
 */
export const MANUAL_OVERRIDE: "auto" | "force-live" | "force-off" = "auto";

export interface LiveShow {
  key: "worship" | "cruise" | "battles";
  name: string;
  tagline: string;
  startMin: number; // minutes since midnight CT
  endMin: number;
  timeLabel: string;
  durationLabel: string;
}

export const SHOWS: LiveShow[] = [
  {
    key: "worship",
    name: "Morning Worship",
    tagline: "Praise and prayer to open the day. Come as you are.",
    startMin: 8 * 60, // 8:00 AM
    endMin: 9 * 60, // 9:00 AM
    timeLabel: "8:00 AM CT",
    durationLabel: "1 hour",
  },
  {
    key: "cruise",
    name: "Midday Cruise Talk",
    tagline: "Cruise news, real talk on deals, and answers to your booking questions.",
    startMin: 12 * 60, // 12:00 PM
    endMin: 13 * 60, // 1:00 PM
    timeLabel: "12:00 PM CT",
    durationLabel: "1 hour",
  },
  {
    key: "battles",
    name: "Night Battles",
    tagline: "Cruise talk and head-to-head TikTok battles. Pick a side and tap in.",
    startMin: 19 * 60 + 30, // 7:30 PM
    endMin: 21 * 60, // 9:00 PM
    timeLabel: "7:30 PM CT",
    durationLabel: "1.5 hours",
  },
];

export type LiveState = "live" | "soon" | "off";

export interface LiveStatus {
  state: LiveState;
  /** The show that is live now, or starting soon. Null when fully offline. */
  show: LiveShow | null;
  /** The next show after the current moment (tomorrow's first show if the day is done). */
  nextShow: LiveShow;
  /** Minutes until nextShow starts. 0 while live. */
  minutesUntilNext: number;
  /** Current CT time as minutes since midnight — used by the broadcast-day timeline. */
  chicagoMinutes: number;
}

/** Current time in Chicago as minutes since midnight, DST-safe via Intl. */
export function getChicagoMinutes(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

export function getLiveStatus(now: Date = new Date()): LiveStatus {
  const cur = getChicagoMinutes(now);

  const upcoming = SHOWS.find((s) => s.startMin > cur);
  const nextShow = upcoming ?? SHOWS[0];
  const minutesUntilNext = upcoming
    ? upcoming.startMin - cur
    : 1440 - cur + SHOWS[0].startMin;

  if (MANUAL_OVERRIDE === "force-off") {
    return { state: "off", show: null, nextShow, minutesUntilNext, chicagoMinutes: cur };
  }
  if (MANUAL_OVERRIDE === "force-live") {
    const liveShow = SHOWS.find((s) => cur >= s.startMin && cur < s.endMin) ?? nextShow;
    return { state: "live", show: liveShow, nextShow, minutesUntilNext: 0, chicagoMinutes: cur };
  }

  const liveShow = SHOWS.find((s) => cur >= s.startMin && cur < s.endMin);
  if (liveShow) {
    return { state: "live", show: liveShow, nextShow, minutesUntilNext: 0, chicagoMinutes: cur };
  }

  if (upcoming && upcoming.startMin - cur <= SOON_WINDOW_MIN) {
    return {
      state: "soon",
      show: upcoming,
      nextShow: upcoming,
      minutesUntilNext,
      chicagoMinutes: cur,
    };
  }

  return { state: "off", show: null, nextShow, minutesUntilNext, chicagoMinutes: cur };
}
