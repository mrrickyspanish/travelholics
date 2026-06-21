import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { IntentCards } from "@/components/intent-cards";
import { MeetYolanda } from "@/components/meet-yolanda";
import { StatsStrip } from "@/components/stats-strip";
import { DestinationMap } from "@/components/destination-map";
import { GroupTrips } from "@/components/group-trips";
import { ShopStrip } from "@/components/shop-strip";
import { Testimonials } from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { MobileCTA } from "@/components/mobile-cta";

export const metadata: Metadata = {
  title: "Travelholics | Certified Cruise Specialist — Yolanda Harris",
  description:
    "Book your cruise through Yolanda — Certified Cruise Specialist, 20+ years, every major line. Same price as booking direct. Zero fees.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Travelholics | Certified Cruise Specialist — Yolanda Harris",
    description:
      "Book your cruise through Yolanda — Certified Cruise Specialist, 20+ years, every major line. Same price as booking direct. Zero fees.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <MobileCTA />
      <Hero />
      <MeetYolanda />
      <IntentCards />
      <GroupTrips />
      <DestinationMap />
      <StatsStrip />
      <ShopStrip />
      <Testimonials />
      <ContactForm />
      <Footer />
    </>
  );
}
