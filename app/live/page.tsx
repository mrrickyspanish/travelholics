import type { Metadata } from "next";
import LivePageClient from "./LivePageClient";

export const metadata: Metadata = {
  title: "Live Schedule | Travelholics",
  description:
    "Yo Travelholic goes live on TikTok three times a day — morning worship at 8 AM, cruise talk at noon, and night battles at 7:30 PM CT. See the full schedule and catch the next one.",
};

export default function LivePage() {
  return <LivePageClient />;
}
