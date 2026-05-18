import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Yolanda's travel picks, affiliate finds, and official Travelholics merchandise.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Travelholics Shop | Yolanda's Picks",
    description:
      "Explore travel essentials, creator recommendations, and Travelholics merchandise curated by Yolanda.",
    url: "/shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travelholics Shop | Yolanda's Picks",
    description:
      "Shop trusted travel essentials and official Travelholics merchandise.",
  },
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
