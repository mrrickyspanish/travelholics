/**
 * Travelholics YouTube — shared constants, types, and pure helpers.
 *
 * This file is import-safe on both the client and the server (no network).
 * The automatic feed fetch + Short/long classification lives in
 * `lib/youtube-feed.ts` (server-only). Videos are pulled live from the
 * channel's public RSS feed, so new uploads appear with no code edits.
 *
 * ─── OPTIONAL MANUAL CONTROLS (edit only when you want to override the feed) ──
 * Everything below is optional. Leave them empty for fully-automatic behaviour.
 *   • PINNED_FEATURED_ID — force a specific long-form video as the homepage hero
 *   • HIDDEN_IDS         — hide specific videos from the site
 *   • FORCE_FORMAT       — correct a mis-classified video ("long" | "short")
 * A video ID is the part after `watch?v=` or `/shorts/` in its URL.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const CHANNEL_ID = "UCJ5E_Q26FDQxiQaA8jd8Itg";
export const CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}`;
export const CHANNEL_HANDLE = "@yotravelholic";
/** Public RSS feed — latest ~15 uploads, no API key required. */
export const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
/** Deep link that opens YouTube with the subscribe confirmation prompt. */
export const SUBSCRIBE_URL = `${CHANNEL_URL}?sub_confirmation=1`;

// ── Optional manual overrides (see header) ───────────────────────────────────
export const PINNED_FEATURED_ID = "";
export const HIDDEN_IDS: string[] = [];
export const FORCE_FORMAT: Record<string, VideoFormat> = {};

export type VideoFormat = "long" | "short";

export interface Video {
  /** 11-character YouTube video ID. */
  id: string;
  format: VideoFormat;
  title: string;
  /** Optional one-line description shown on the /videos page. */
  blurb?: string;
  /** ISO timestamp the video was published. Drives newest-first order. */
  published: string;
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

/** Decode the handful of XML entities YouTube's feed uses. */
export function decodeXml(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/** A Short if the creator tagged it #short(s) in the title or description. */
export function looksLikeShortFromText(...parts: string[]): boolean {
  return /#shorts?\b/i.test(parts.join(" "));
}

interface RawFeedEntry {
  id: string;
  title: string;
  published: string;
  description: string;
}

/**
 * Parse the YouTube channel RSS/Atom feed into raw entries. Pure and
 * dependency-free (regex over the stable feed shape) so it runs anywhere.
 */
export function parseFeed(xml: string): RawFeedEntry[] {
  const entries: RawFeedEntry[] = [];
  const entryBlocks = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  for (const block of entryBlocks) {
    const id = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    if (!id) continue;

    const title = decodeXml(block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "");
    const published = block.match(/<published>([^<]+)<\/published>/)?.[1]?.trim() ?? "";
    const description = decodeXml(
      block.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]?.trim() ?? "",
    );

    entries.push({ id, title, published, description });
  }

  return entries;
}

/** First non-empty line of a video description, trimmed for a card blurb. */
export function firstLine(description: string, max = 140): string | undefined {
  const line = description.split("\n").map((l) => l.trim()).find(Boolean);
  if (!line) return undefined;
  return line.length > max ? `${line.slice(0, max - 1).trimEnd()}…` : line;
}
