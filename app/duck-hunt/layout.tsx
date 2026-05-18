import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duck Hunt",
  description: "Travelholics campaign landing page.",
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
