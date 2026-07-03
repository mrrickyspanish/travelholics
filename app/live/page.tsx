import type { Metadata } from "next";
import LivePageClient from "./LivePageClient";

export const metadata: Metadata = {
  title: "Daily Cruise Advice, Live",
  description:
    "Yolanda goes live on TikTok three times a day — cruise tips, packing help, ship talk, and real Q&A for a community of 20K+ travelers. See the schedule and catch the next one.",
};

export default function LivePage() {
  return <LivePageClient />;
}
