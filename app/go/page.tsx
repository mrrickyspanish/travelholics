import type { Metadata } from "next";
import LaunchExperience from "@/components/launch/LaunchExperience";
import { travelholicsLaunch } from "@/lib/travelholics-launch";
import wordmarkStyles from "@/components/travelholics-wordmark.module.css";

export const metadata: Metadata = {
  title: "Start Here | Travelholics",
  description:
    "Book travel, watch the latest cruise content, explore resources, and shop Travelholics.",
  alternates: { canonical: "/go" },
};

export default function GoPage() {
  return (
    <div className={wordmarkStyles.launchScope}>
      <LaunchExperience config={travelholicsLaunch} />
    </div>
  );
}
