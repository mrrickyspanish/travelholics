import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { StatsStrip } from "@/components/stats-strip";
import { IntentCards } from "@/components/intent-cards";
import { MeetYolanda } from "@/components/meet-yolanda";
import { DestinationMap } from "@/components/destination-map";
import { GroupTrips } from "@/components/group-trips";
import { ShopStrip } from "@/components/shop-strip";
import { Testimonials } from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { MobileCTA } from "@/components/mobile-cta";

export default function Home() {
  return (
    <>
      <Header />
      <MobileCTA />
      <Hero />
      <StatsStrip />
      <MeetYolanda />
      <IntentCards />
      <GroupTrips />
      <DestinationMap />
      <ShopStrip />
      <Testimonials />
      <ContactForm />
      <Footer />
    </>
  );
}
