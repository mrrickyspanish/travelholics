import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | Travelholics Originals",
  description:
    "Official Travelholics gear — cruise lanyards, stateroom door magnets, and travel-ready pieces made for cruise days and vacation countdowns.",
  robots: { index: false, follow: false },
};

export default function ShopFullLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
