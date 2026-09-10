import type { Metadata } from "next";
import { Header } from "@/components/header";
import { HomeHero, HomeVideo, HomeCommunity, HomeStories } from "@/components/home-community";
import { IntentCards } from "@/components/intent-cards";
import { MeetYolanda } from "@/components/meet-yolanda";
import { DestinationMap } from "@/components/destination-map";
import { GroupTrips } from "@/components/group-trips";
import { ShopStrip } from "@/components/shop-strip";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { MobileCTA } from "@/components/mobile-cta";
import { getArticles } from "@/lib/articles";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Travelholics | Find Your Cruise People with Yolanda",
  description:
    "Join Yolanda’s cruise community for practical tips, packing advice, ship stories, and Travelholics updates. Watch on YouTube, hang on TikTok, and join the email crew.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Travelholics | Find Your Cruise People with Yolanda",
    description:
      "Real cruise advice, good company, and your next great story. Join Yolanda and the Travelholics crew.",
    url: "/",
    type: "website",
  },
};

export default async function Home() {
  const stories = await getArticles({ category: "trip-blog", limit: 2 });

  return (
    <>
      <Header />
      <MobileCTA community />
      <main>
      <HomeHero />
      <HomeVideo />
      <HomeCommunity />
      <HomeStories articles={stories} />
      <MeetYolanda />
      <IntentCards />
      <GroupTrips />
      <DestinationMap />
      <ShopStrip />
      <ContactForm />
      </main>
      <Footer />
    </>
  );
}
