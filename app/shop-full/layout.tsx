import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cruise Travel Shop — Full",
  description:
    "Browse Yolanda's travel picks, affiliate finds, and official Travelholics merchandise.",
  robots: { index: false, follow: false },
};

export default function ShopFullLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
