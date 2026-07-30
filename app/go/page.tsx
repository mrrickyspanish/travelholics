import type { Metadata } from "next";
import LaunchExperience from "@/components/launch/LaunchExperience";
import { travelholicsLaunch } from "@/lib/travelholics-launch";

const title = "Start Here | Travelholics";
const description =
  "Every Travelholics link in one place — plan a cruise with Yolanda, catch the daily TikTok lives, grab the free packing guides, and shop cruise gear.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/go" },
  openGraph: {
    title,
    description,
    url: "/go",
    siteName: "Travelholics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function GoPage() {
  return <LaunchExperience config={travelholicsLaunch} />;
}
