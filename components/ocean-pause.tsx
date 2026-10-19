"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

export function OceanPause() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = section.current;
    const media = video.current;
    if (!el || !media || !('IntersectionObserver' in window)) return;
    el.dataset.videoReady = 'true';
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let userPaused = false;
    const update = () => {
      if (!visible || document.hidden || userPaused || preference.matches) { media.pause(); return; }
      if (!media.getAttribute('src')) media.src = '/videos/ocean-shoreline.mp4';
      void media.play().catch(() => {});
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      update();
    }, { threshold: .05 });
    const toggle = () => { userPaused = !media.paused; if (!userPaused) visible = true; update(); };
    const button = el.querySelector('button');
    button?.addEventListener('click', toggle);
    observer.observe(el);
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect(); media.pause();
      delete el.dataset.videoReady;
      button?.removeEventListener('click', toggle);
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <section ref={section} id="ocean-pause" className="home-ocean-pause" aria-label="A moment by the ocean">
      <div className="home-ocean-media" aria-hidden="true">
        <Image src="/images/ocean-shoreline.webp" alt="" fill sizes="100vw" className="object-cover" />
        <video ref={video} muted loop playsInline preload="none" tabIndex={-1}
          onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      </div>
      <button type="button" className="home-ocean-control" aria-label={playing ? 'Pause ocean video' : 'Play ocean video'}>
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        <span>{playing ? 'Pause' : 'Play'}</span>
      </button>
    </section>
  );
}
