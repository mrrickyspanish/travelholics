"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Reading content stays visible in SSR, without JS, and under reduced motion. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = element.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!el || preference.matches || !('IntersectionObserver' in window) || !el.animate) return;
    // Never hide or replay content the visitor has already seen at hydration.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    let animation: Animation | undefined;
    const finish = () => animation?.finish();
    const stop = () => { observer.disconnect(); animation?.cancel(); };
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (preference.matches || el.contains(document.activeElement)) return;
      animation = el.animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 600, easing: 'cubic-bezier(.22,.61,.36,1)' });
    }, { threshold: .15, rootMargin: '0px 0px -5% 0px' });
    observer.observe(el);
    el.addEventListener('focusin', finish);
    preference.addEventListener('change', stop);
    return () => { stop(); el.removeEventListener('focusin', finish); preference.removeEventListener('change', stop); };
  }, []);
  return <div ref={element} className={className}>{children}</div>;
}
