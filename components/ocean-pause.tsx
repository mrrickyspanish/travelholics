"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** A high-resolution coastal pause; only the image moves with the scroll. */
export function OceanPause() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const strip = section.current;
    const media = strip?.firstElementChild;
    if (!strip || !(media instanceof HTMLElement)) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (preference.matches) { media.style.removeProperty('--ocean-shift'); return; }
      const bounds = strip.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      // Reserve 16px beyond the travel at both edges so the strip stays filled.
      const travel = Math.max(0, (media.offsetHeight - bounds.height) / 2 - 16);
      const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
      media.style.setProperty('--ocean-shift', `${(progress * 2 - 1) * travel}px`);
    };
    const schedule = () => {
      if (!frame && !preference.matches) frame = requestAnimationFrame(update);
    };
    const configure = () => { cancelAnimationFrame(frame); frame = 0; update(); };
    configure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    preference.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      media.style.removeProperty('--ocean-shift');
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', configure);
    };
  }, []);

  return (
    <section ref={section} id="ocean-pause" className="home-ocean-pause" aria-label="A moment by the ocean">
      <div className="home-ocean-media" aria-hidden="true">
        <Image src="/images/Charlotte_Amalie_StThomas.jpg" alt="" fill sizes="100vw" quality={90} className="object-cover" />
      </div>
    </section>
  );
}
