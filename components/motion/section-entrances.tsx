"use client";

import { useEffect } from "react";

/** Enhance the existing sections without hiding content or changing document flow. */
export function SectionEntrances() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      'main.home-mobile-optimized > section:not(#hero):not(#ocean-pause)',
    ));
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const targets = new Map(sections.flatMap(section => {
      const content = section.firstElementChild;
      return content instanceof HTMLElement ? [[section, content] as const] : [];
    }));
    const animations = new Map<HTMLElement, Animation>();
    let observer: IntersectionObserver | undefined;

    const finish = (target: HTMLElement) => {
      animations.get(target)?.cancel();
      animations.delete(target);
      target.style.transform = '';
      target.style.transformOrigin = '';
      target.dataset.sectionEntrance = 'complete';
    };
    const focus = (event: FocusEvent) => {
      for (const [section, target] of targets) {
        if (event.target instanceof Node && target.contains(event.target)) {
          observer?.unobserve(section);
          finish(target);
        }
      }
    };
    const configure = () => {
      observer?.disconnect();
      for (const target of targets.values()) finish(target);
      if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = targets.get(entry.target as HTMLElement);
          if (!target) continue;
          observer?.unobserve(entry.target);
          if (preference.matches || target.contains(document.activeElement)) { finish(target); continue; }
          target.dataset.sectionEntrance = 'playing';
          const animation = target.animate([
            { transform: 'scale(.97)' },
            { transform: 'scale(1)' },
          ], { duration: 750, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
          animations.set(target, animation);
          animation.onfinish = () => finish(target);
        }
      }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });

      for (const [section, target] of targets) {
        // Content already in the main viewport stays full size at hydration.
        if (section.getBoundingClientRect().top < innerHeight * .75) continue;
        target.style.transformOrigin = 'center center';
        target.style.transform = 'scale(.97)';
        target.dataset.sectionEntrance = 'waiting';
        observer.observe(section);
      }
    };
    configure();
    document.addEventListener('focusin', focus);
    preference.addEventListener('change', configure);
    return () => {
      observer?.disconnect();
      for (const target of targets.values()) { finish(target); delete target.dataset.sectionEntrance; }
      document.removeEventListener('focusin', focus);
      preference.removeEventListener('change', configure);
    };
  }, []);
  return null;
}
