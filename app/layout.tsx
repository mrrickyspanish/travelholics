import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yotravelholic.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Travelholics | Cruise Planning by Yolanda",
    template: "%s | Travelholics",
  },
  description:
    "Travelholics helps families, couples, and groups plan cruise vacations with expert guidance from Certified Cruise Specialist Yolanda.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Travelholics | Cruise Planning by Yolanda",
    description:
      "Cruise planning support, destination insights, and trusted travel recommendations from Yolanda at Travelholics.",
    url: "/",
    siteName: "Travelholics",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travelholics | Cruise Planning by Yolanda",
    description:
      "Certified cruise expertise and personalized travel planning for your next getaway.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/images/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/images/favicon-32.png",
    apple: [{ url: "/images/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Travelholics",
      url: siteUrl,
      sameAs: ["https://www.tiktok.com/@rjsmom1"],
      founder: {
        "@id": `${siteUrl}/#person`,
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Yolanda",
      jobTitle: "Certified Cruise Specialist",
      worksFor: {
        "@id": `${siteUrl}/#organization`,
      },
      url: siteUrl,
      sameAs: ["https://www.tiktok.com/@rjsmom1"],
      description:
        "Yolanda is a Certified Cruise Specialist helping travelers book family, group, and couples cruise vacations.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
