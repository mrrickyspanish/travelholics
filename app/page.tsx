import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/trust-strip";
import { MyStory } from "@/components/my-story";
import { DestinationMosaic } from "@/components/destination-mosaic";
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
      {/* --- Navigation --- */}
      <StickyHeader />
      <MobileCTA />

      {/* --- Page Flow ---
       *
       * The page follows the Yolanda-first trust journey:
       *   Who is she → Can she do this → Prove it → I'm in → Contact
       *
       * The form is at the bottom — the page earns the right to ask.
       */}

      {/* 1. Hero — Yolanda IS the hero */}
      <Hero />

      {/* 2. Trust Strip — cruise line certifications */}
      <TrustStrip />

      {/* 3. My Story — origin story + photo grid */}
      <MyStory />

      {/* Transition: white → cream */}
      <WaveDivider from="#ffffff" to="#FAF9F6" />

      {/* 4. Destinations — magazine mosaic */}
      <DestinationMosaic />

      {/* 5. Ship sails across (first instance) */}
      <ShipDivider />

      {/* 6. Why Work With Me — benefit cards */}
      <WhyTravelholics />

      {/* Transition: white → cream */}
      <WaveDivider from="#ffffff" to="#FAF9F6" />

      {/* 7. Social Proof — pull quote + testimonials */}
      <SocialProof />

      {/* 8. Ship sails across (second instance) */}
      <ShipDivider />

      {/* 9. Timeline — how it works */}
      <Timeline />

      {/* 10. Contact — form earns its place at the end */}
      <ContactForm />

      {/* 11. Footer */}
      <Footer />
    </>
  );
}
