/**
 * Travelholics YouTube — single source of truth for featured videos.
 *
 * Cadence goal: 1 long-form + 3 Shorts per week.
 *
 * ─── HOW TO ADD THIS WEEK'S VIDEOS ───────────────────────────────────────────
 * 1. Open the video on YouTube and copy its ID:
 *      • Long-form: youtube.com/watch?v=XXXXXXXXXXX  → the part after `v=`
 *      • Short:     youtube.com/shorts/XXXXXXXXXXX   → the part after `/shorts/`
 * 2. Add one entry to the VIDEOS array below. Newest `published` date sorts first.
 * 3. Mark the week's headline long-form with `featured: true` (optional — if you
 *    skip it, the newest long-form is featured automatically).
 * 4. Commit + deploy. The homepage "Watch" section and /videos update instantly.
 *
 * Keep the list tidy — 8–12 recent videos is plenty. Older ones can be trimmed.
 *
 * Upgrade path (ask Creative Eye): this curated list can be swapped for an
 * automatic feed (YouTube RSS or Data API) or a Supabase-backed admin panel so
 * new uploads appear with zero code edits. The component layer already reads
 * through the selector functions below, so only this file would change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const CHANNEL_ID = "UCJ5E_Q26FDQxiQaA8jd8Itg";
export const CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}`;
export const CHANNEL_HANDLE = "@yotravelholic";
/** Deep link that opens YouTube with the subscribe confirmation prompt. */
export const SUBSCRIBE_URL = `${CHANNEL_URL}?sub_confirmation=1`;

export type VideoFormat = "long" | "short";

export interface Video {
  /** 11-character YouTube video ID (the part after `v=` or `/shorts/`). */
  id: string;
  format: VideoFormat;
  title: string;
  /** Optional one-line description shown on the /videos page. */
  blurb?: string;
  /** ISO date the video went live, e.g. "2026-07-11". Drives newest-first order. */
  published: string;
  /** Pin as the homepage/hero long-form. If unset, newest long-form is used. */
  featured?: boolean;
}

/**
 * ⚠️ Add real Travelholics video IDs here (see instructions at top of file).
 * Until this array has entries, the homepage "Watch" section hides itself and
 * /videos shows a "subscribe — episodes dropping weekly" state, so nothing
 * placeholder or broken ever ships. Example shape (uncomment + edit):
 *
 *   {
 *     id: "dQw4w9WgXcQ",
 *     format: "long",
 *     title: "7-Day Western Caribbean — Everything You Need to Know",
 *     blurb: "Ports, excursions, and what I'd book again.",
 *     published: "2026-07-11",
 *     featured: true,
 *   },
 *   { id: "abcdEFGH123", format: "short", title: "Packing hack for embarkation day", published: "2026-07-12" },
 */
export const VIDEOS: Video[] = [];

/** All videos, newest first. */
export function getAllVideos(): Video[] {
  return [...VIDEOS].sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );
}

/** Long-form videos, newest first. */
export function getLongForm(limit?: number): Video[] {
  const items = getAllVideos().filter((v) => v.format === "long");
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

/** Shorts, newest first. */
export function getShorts(limit?: number): Video[] {
  const items = getAllVideos().filter((v) => v.format === "short");
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

/** The pinned `featured` long-form, or the newest long-form, or null. */
export function getFeaturedLongForm(): Video | null {
  const longs = getLongForm();
  return longs.find((v) => v.featured) ?? longs[0] ?? null;
}

/** True when there is at least one video to show. */
export function hasVideos(): boolean {
  return VIDEOS.length > 0;
}

/** Privacy-friendly embed URL (no cookies until playback). */
export function embedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

/** Poster/thumbnail for a video ID (hqdefault always exists). */
export function thumbUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Canonical watch link on YouTube, correct for the format. */
export function watchUrl(video: Video): string {
  return video.format === "short"
    ? `https://www.youtube.com/shorts/${video.id}`
    : `https://www.youtube.com/watch?v=${video.id}`;
}
