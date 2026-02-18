import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travelholics | Certified Cruise Specialist & Travel Planning",
  description: "Let Yolanda, your certified cruise specialist, plan your dream voyage. 20+ years of expertise in luxury, family, and group cruises.",
  keywords: ["cruise planning", "travel advisor", "certified cruise specialist", "Royal Caribbean expert", "group travel"],
  authors: [{ name: "Yolanda" }],
  openGraph: {
    title: "Travelholics | Plan Your Dream Cruise",
    description: "Expert cruise planning with Yolanda. 20+ years of experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-[#059669]/30`}
      >
        {children}
      </body>
    </html>
  );
}
