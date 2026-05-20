import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Navigator of the Seas Duck Hunt Magnet",
  description:
    "Claim your Travelholics cruise door magnet gift from the Navigator of the Seas Duck Hunt.",
  alternates: {
    canonical: "/duck-hunt",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function DuckHuntLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
