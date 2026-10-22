import type { Video } from "./youtube";

/** Verified public uploads, retained when the channel feed is unavailable.
 * Empty publication dates mean the exact date has not been confirmed.
 * Keep the editorial order here; a working feed puts newer uploads first.
 */
export const CURATED_VIDEOS: Video[] = [
  { id: "r8YbyrbIq-I", format: "long", title: "Ship or Destination? How to Choose the Right Cruise Itinerary | Cruise School Ep. 4", published: "", blurb: "A beautiful ship can't save the wrong itinerary." },
  { id: "J_AuPIpB938", format: "long", title: "Big Ship vs. Small Ship: Which Cruise Is Right for You?", published: "", blurb: "Compare the ship experience before choosing the cruise that fits your people." },
  { id: "FedmhJzYwdE", format: "long", title: "How to Choose the Right Cruise", published: "", blurb: "Start Cruise School with the decisions that shape your vacation." },
  { id: "Y4-Klol5hRU", format: "long", title: "Welcome to Cruise School with Yolanda", published: "", blurb: "Meet Yolanda and find your starting point." },
  { id: "pasJV8e3I0k", format: "long", title: "Best Way to Book a Cruise: Direct, Costco, or Travel Agent?", published: "", blurb: "Understand the booking options and decide how much planning support you want." },
  { id: "N4O_Km9eqFk", format: "long", title: "10 Things to Pack for a Cruise First-Timers Forget", published: "2026-07-13", blurb: "Pack with confidence, leave the extra suitcase at home, and prepare for embarkation." },
  { id: "CHx-ILsqDac", format: "long", title: "Can You Actually Remove Cruise Gratuities?", published: "", blurb: "Understand cruise gratuities and ask better questions about the total cost." },
  { id: "3GCsp99WmN8", format: "long", title: "My #1 Royal Caribbean Ship Will Surprise You", published: "", blurb: "Yolanda shares her firsthand ship opinions so you can choose for your travel style." },
  { id: "aRRyoFFFrIY", format: "short", title: "Did Brilliance of the Seas make my official Top 5 Royal Caribbean ships?", published: "" },
  { id: "3aYn5hLMgFM", format: "short", title: "Why Cruise Lines Hide the Service Charge", published: "" },
  { id: "3sLvrHKx1g4", format: "short", title: "SAME CRUISE. DIFFERENT DEALS.", published: "" },
];

export const START_HERE_IDS = ["FedmhJzYwdE", "N4O_Km9eqFk", "pasJV8e3I0k"];

export function videoNextStep(id: string) {
  if (id === "N4O_Km9eqFk") {
    return { href: "/guides/what-not-to-bring-on-a-cruise", label: "Get the free packing rules guide" };
  }
  return { href: "/cruise-interest", label: "Plan my cruise with Yolanda" };
}
