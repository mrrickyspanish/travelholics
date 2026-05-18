import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collaborate",
  description:
    "Partner with Yolanda and Travelholics for authentic cruise and destination storytelling campaigns.",
  alternates: {
    canonical: "/collaborate",
  },
  openGraph: {
    title: "Collaborate with Travelholics",
    description:
      "Work with Yolanda on sponsored content, destination features, and travel brand partnerships.",
    url: "/collaborate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collaborate with Travelholics",
    description:
      "Campaign partnerships with trusted travel creator Yolanda.",
  },
};

export default function CollaborateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
