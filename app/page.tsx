import { Hero } from "@/components/hero";
import { IntentRouter } from "@/components/intent-router";
import { TrustStrip } from "@/components/trust-strip";
import { MyStory } from "@/components/my-story";
import { DestinationMap } from "@/components/destination-map";
import { ShipDivider } from "@/components/ship-divider";
import { WhyTravelholics } from "@/components/why-travelholics";
import { SocialProof } from "@/components/social-proof";
import { Timeline } from "@/components/timeline";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { StickyHeader } from "@/components/sticky-header";
import { MobileCTA } from "@/components/mobile-cta";
import { WaveDivider } from "@/components/wave-divider";

export default function Home() {
  return (
    <>
      <StickyHeader />
      <MobileCTA />

      <Hero />
      <IntentRouter />
      <TrustStrip />
      <MyStory />
      <WaveDivider from="#ffffff" to="#FAF9F6" />
      <DestinationMap />
      <ShipDivider />
      <WhyTravelholics />
      <WaveDivider from="#ffffff" to="#FAF9F6" />
      <SocialProof />
      <ShipDivider />
      <Timeline />
      <ContactForm />
      <Footer />
    </>
  );
}
