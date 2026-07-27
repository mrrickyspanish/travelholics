import type { Metadata } from "next";
import LaunchExperience from "@/components/launch/LaunchExperience";
import { travelholicsLaunch } from "@/lib/travelholics-launch";

export const metadata: Metadata = {
  title: "Start Here | Travelholics",
  description:
    "Book travel, watch the latest cruise content, explore resources, and shop Travelholics.",
  alternates: { canonical: "/go" },
};

export default function GoPage() {
  return <LaunchExperience config={travelholicsLaunch} />;
}
