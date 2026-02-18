import { Hero } from "@/components/hero";
import { Credentials } from "@/components/credentials";
import { WhyTravelholics } from "@/components/why-travelholics";
import { SocialProof } from "@/components/social-proof";
import { Timeline } from "@/components/timeline";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <div id="hero">
        <Hero />
      </div>
      <Credentials />
      <div id="why">
        <WhyTravelholics />
      </div>
      <div id="testimonials">
        <SocialProof />
      </div>
      <div id="process">
        <Timeline />
      </div>
      <Footer />
    </main>
  );
}
