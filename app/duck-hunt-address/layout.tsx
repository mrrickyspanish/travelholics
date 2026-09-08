import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ship My Duck Hunt Magnet | Travelholics",
  description:
    "Add the mailing address for your Travelholics Duck Hunt cruise door magnet.",
  alternates: {
    canonical: "/duck-hunt-address",
  },
  // Same posture as /duck-hunt: a private campaign funnel reached from a
  // QR code or a campaign email, not something to surface in search.
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

export default function DuckHuntAddressLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
