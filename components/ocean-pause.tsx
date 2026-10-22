import Image from "next/image";

/** A high-resolution coastal pause; only the image moves with the scroll. */
export function OceanPause() {
  return (
    <section id="ocean-pause" className="home-ocean-pause" aria-label="A moment by the ocean">
      <div className="home-ocean-media" aria-hidden="true">
        <Image src="/images/Charlotte_Amalie_StThomas.jpg" alt="" fill sizes="100vw" quality={90} className="object-cover" />
      </div>
    </section>
  );
}
