import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OceanPause } from "@/components/ocean-pause";
import "../../home.css";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "Destination layout preview",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const destinations = [
  { name: "Caribbean", note: "Warm water, big ships, easy yes.", slug: "caribbean", alt: "Turquoise Caribbean water and a palm-lined beach" },
  { name: "Alaska", note: "Glaciers, wildlife, and the kind of quiet you remember.", slug: "alaska", alt: "An Alaska cruise ship in a mountain-lined fjord" },
  { name: "Mediterranean", note: "Wake up somewhere different every morning.", slug: "mediterranean", alt: "Whitewashed buildings and blue domes above the Mediterranean" },
];

function DestinationOption({ variant }: { variant: "portraits" | "panorama" }) {
  const option = variant === "portraits" ? "a" : "b";
  return (
    <section id={`option-${option}`} className={styles.option} data-layout={variant} aria-labelledby={`heading-${option}`}>
      <p className={styles.reviewLabel}>Option {option.toUpperCase()} · {option === "a" ? "Three destination portraits" : "Panorama and supporting images"}</p>
      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Start with a feeling</p>
          <h2 id={`heading-${option}`}>Where should we wake up next?</h2>
        </div>
        <div>
          <p>You do not need to know the ship yet. Pick the kind of trip you want to feel, then let Yolanda help narrow down the sailing that actually fits.</p>
          <Link href="/#contact" className={styles.help}>Help me choose</Link>
        </div>
      </header>
      <ul className={styles.destinations} tabIndex={0} aria-label={`Option ${option.toUpperCase()} destinations`}>
        {destinations.map(destination => (
          <li key={destination.slug}>
            <Link href={`/cruises/${destination.slug}`} className={styles.destination}>
              <div className={styles.photo}>
                <Image src={`/images/destinations/${destination.slug}-hero.png`} alt={destination.alt} fill quality={90}
                  sizes={variant === "portraits" ? "(max-width: 767px) 700px, 900px" : "(max-width: 767px) 100vw, 60vw"} />
                <div className={styles.caption}><h3>{destination.name}</h3></div>
              </div>
              <p>{destination.note}</p>
            </Link>
          </li>
        ))}
      </ul>
      {variant === "portraits" && <p className={styles.swipeHint}>Swipe to explore destinations</p>}
      <div className={styles.group}>
        <div><p className={styles.groupTitle}>Group Trips</p><p>Your people. More support. No planning fees.</p></div>
        <Link href="/group-cruises" className={styles.button}>Explore Group Cruises</Link>
      </div>
    </section>
  );
}

export default function DestinationPreview() {
  return (
    <main className={styles.page}>
      <header className={styles.reviewHeader}>
        <h1>Destination layout preview</h1>
        <p>Both options, back to back. Scroll through the layouts and the coastal parallax strip between them.</p>
        <nav aria-label="Compare destination layouts"><a href="#option-a">Option A</a><a href="#option-b">Option B</a></nav>
      </header>
      <DestinationOption variant="portraits" />
      <OceanPause />
      <DestinationOption variant="panorama" />
    </main>
  );
}
