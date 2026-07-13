import "server-only";
import { cache } from "react";
import {
  FEED_URL,
  FORCE_FORMAT,
  HIDDEN_IDS,
  PINNED_FEATURED_ID,
  firstLine,
  looksLikeShortFromText,
  parseFeed,
  type Video,
  type VideoFormat,
} from "@/lib/youtube";

/** How long to cache the feed (seconds). New uploads appear within this window. */
const FEED_REVALIDATE = 60 * 30; // 30 min
/** Classification is permanent per video, so cache probes for much longer. */
const PROBE_REVALIDATE = 60 * 60 * 24 * 7; // 1 week
const FETCH_TIMEOUT_MS = 4000;

async function fetchWithTimeout(url: string, init: RequestInit & { next?: { revalidate: number } }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Is this ID a Short? YouTube serves `/shorts/{id}` with a 200 for genuine
 * Shorts and a redirect (to `/watch`) for normal videos. Returns null when the
 * probe is inconclusive (network error, consent redirect, etc.).
 */
async function probeIsShort(id: string): Promise<boolean | null> {
  try {
    const res = await fetchWithTimeout(`https://www.youtube.com/shorts/${id}`, {
      method: "HEAD",
      redirect: "manual",
      next: { revalidate: PROBE_REVALIDATE },
    });
    if (res.status >= 200 && res.status < 300) return true;
    if (res.status >= 300 && res.status < 400) return false;
    return null;
  } catch {
    return null;
  }
}

async function classify(id: string, title: string, description: string): Promise<VideoFormat> {
  if (FORCE_FORMAT[id]) return FORCE_FORMAT[id];
  if (looksLikeShortFromText(title, description)) return "short";
  const probed = await probeIsShort(id);
  if (probed === true) return "short";
  return "long"; // long-form is the safe default when unknown
}

/**
 * Live list of the channel's recent videos, newest first, with Short/long
 * classification resolved. Memoised per request; falls back to an empty list
 * (never throws) so the UI degrades gracefully if YouTube is unreachable.
 */
export const getChannelVideos = cache(async (): Promise<Video[]> => {
  let xml: string;
  try {
    const res = await fetchWithTimeout(FEED_URL, { next: { revalidate: FEED_REVALIDATE } });
    if (!res.ok) return [];
    xml = await res.text();
  } catch {
    return [];
  }

  const entries = parseFeed(xml).filter((e) => !HIDDEN_IDS.includes(e.id));

  const videos = await Promise.all(
    entries.map(async (e): Promise<Video> => ({
      id: e.id,
      title: e.title,
      published: e.published,
      blurb: firstLine(e.description),
      format: await classify(e.id, e.title, e.description),
    })),
  );

  return videos.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );
});

export async function getLongForm(limit?: number): Promise<Video[]> {
  const items = (await getChannelVideos()).filter((v) => v.format === "long");
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function getShorts(limit?: number): Promise<Video[]> {
  const items = (await getChannelVideos()).filter((v) => v.format === "short");
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function getFeaturedLongForm(): Promise<Video | null> {
  const longs = await getLongForm();
  if (PINNED_FEATURED_ID) {
    const pinned = longs.find((v) => v.id === PINNED_FEATURED_ID);
    if (pinned) return pinned;
  }
  return longs[0] ?? null;
}
