import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — Travelholics",
  description:
    "Drop 01 — The Vacation Edit. Official Travelholics merch and curated travel picks. Coming soon.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop — Travelholics",
    description: "Drop 01 is almost here. Get first access.",
    url: "/shop",
    type: "website",
  },
};

export default function ShopLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Jost:wght@200;300;400&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
