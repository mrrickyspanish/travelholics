import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { AdventureShelf } from "@/components/adventure-shelf";
import { HowItWorks } from "@/components/how-it-works";
import { CruiseLineStrip } from "@/components/cruise-line-strip";
import { MeetYolanda } from "@/components/meet-yolanda";
import { LatestVideos } from "@/components/latest-videos";
import { GroupTrips } from "@/components/group-trips";
import { ShopStrip } from "@/components/shop-strip";
import { Testimonials } from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { MobileCTA } from "@/components/mobile-cta";
import { getFeaturedLongForm, getShorts } from "@/lib/youtube-feed";
import "./mobile-polish.css";
import "./home.css";

export const metadata: Metadata = {
  title: "Travelholics | Certified Cruise Specialist — Yolanda Harris",
  description:
    "Plan your cruise with Yolanda — Certified Cruise Specialist, 20+ years, every major line. Same price as booking direct, zero fees, plus daily cruise advice on TikTok.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Travelholics | Certified Cruise Specialist — Yolanda Harris",
    description:
      "Plan your cruise with Yolanda — Certified Cruise Specialist, 20+ years, every major line. Same price as booking direct, zero fees, plus daily cruise advice on TikTok.",
    url: "/",
    type: "website",
  },
};

export default async function Home() {
  const [featuredVideo, shorts] = await Promise.all([
    getFeaturedLongForm(),
    getShorts(3),
  ]);

  return (
    <>
      <Header />
      <MobileCTA />
      <main className="home-mobile-optimized">
        {/* Meet the planner early; optional browsing follows proof.
            home.css owns the homepage layout through named classes. */}
        <Hero />
        <AdventureShelf />
        <MeetYolanda />
        <HowItWorks />
        <Testimonials />
        <CruiseLineStrip />
        <GroupTrips />
        <LatestVideos featured={featuredVideo} shorts={shorts} />
        <ContactForm />
        <ShopStrip />
      </main>
      <Footer />
    </>
  );
}
