"use client";

import { useEffect } from "react";

/** Grow visible content with scroll position, then leave it settled at full size. */
export function SectionEntrances() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      'main.home-mobile-optimized > section:not(#hero):not(#ocean-pause)',
    ));
    const targets = new Map(sections.flatMap(section => {
      const content = section.firstElementChild;
      return content instanceof HTMLElement ? [[section, content] as const] : [];
    }));
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const pending = new Map<HTMLElement, HTMLElement>();
    const completed = new Set<HTMLElement>();
    let frame = 0;
    const finish = (section: HTMLElement, target: HTMLElement) => {
      pending.delete(section);
      completed.add(target);
      target.style.transform = '';
      target.style.transformOrigin = '';
      target.dataset.sectionEntrance = 'complete';
    };
    const update = () => {
      frame = 0;
      const startScale = innerWidth >= 1024 ? .94 : .97;
      // Read untransformed section positions together before writing styles.
      const positions = Array.from(pending, ([section, target]) => ({ section, target, top: section.getBoundingClientRect().top }));
      for (const { section, target, top } of positions) {
        const progress = Math.max(0, Math.min(1, (innerHeight * .95 - top) / (innerHeight * .75)));
        if (progress >= 1 || target.contains(document.activeElement)) { finish(section, target); continue; }
        const eased = progress * progress * (3 - 2 * progress);
        target.style.transform = `scale(${startScale + (1 - startScale) * eased})`;
        target.dataset.sectionEntrance = progress > 0 ? 'growing' : 'waiting';
      }
    };
    const schedule = () => {
      if (!frame && pending.size && !preference.matches) frame = requestAnimationFrame(update);
    };
    const configure = () => {
      cancelAnimationFrame(frame); frame = 0; pending.clear();
      for (const [section, target] of targets) {
        target.style.transform = ''; target.style.transformOrigin = '';
        if (preference.matches) { target.dataset.sectionEntrance = 'static'; continue; }
        // Never shrink content already prominent when the page is hydrated.
        if (completed.has(target) || section.getBoundingClientRect().top < innerHeight * .5) { finish(section, target); continue; }
        target.style.transformOrigin = 'center center';
        pending.set(section, target);
      }
      if (!preference.matches) update();
    };
    const focus = (event: FocusEvent) => {
      for (const [section, target] of targets) {
        if (event.target instanceof Node && target.contains(event.target)) finish(section, target);
      }
    };
    configure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('focusin', focus);
    preference.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      for (const [section, target] of targets) { finish(section, target); delete target.dataset.sectionEntrance; }
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('focusin', focus);
      preference.removeEventListener('change', configure);
    };
  }, []);
  return null;
}
