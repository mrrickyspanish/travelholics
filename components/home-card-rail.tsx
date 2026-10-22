"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

/** Native scrolling keeps every card available to touch, keyboard, and no-JS users. */
export function HomeCardRail({ id, label, className, children, controls = 'below', showCounter = true }: {
  id: string; label: string; className: string; children: ReactNode; controls?: 'below' | 'edge'; showCounter?: boolean;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const count = Children.count(children);
  const [position, setPosition] = useState({ first: 1, last: 1, previous: false, next: true });
  const measure = () => {
    const el = rail.current;
    if (!el) return;
    const frame = el.getBoundingClientRect();
    const visible = Array.from(el.children).flatMap((card, index) => {
      const rect = card.getBoundingClientRect();
      return Math.min(rect.right, frame.right) - Math.max(rect.left, frame.left) > rect.width / 2 ? [index + 1] : [];
    });
    setPosition({ first: visible[0] || 1, last: visible.at(-1) || 1, previous: el.scrollLeft > 2, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
  };
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const move = (direction: number) => {
    const el = rail.current;
    const first = el?.firstElementChild as HTMLElement | undefined;
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: direction * (first.offsetWidth + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return (
    <div className={`home-card-rail ${className}`} data-scrollable={position.previous || position.next} data-controls={controls}>
      <ul ref={rail} id={id} tabIndex={0} aria-label={label} className="home-card-rail-viewport" onScroll={measure}
        onKeyDown={event => {
          if (event.target === event.currentTarget && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
            event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}>{children}</ul>
      {controls === 'edge' ? <>
        <button type="button" className="home-card-rail-next" aria-label={`Next ${label.toLowerCase()}`} aria-controls={id} disabled={!position.next} onClick={() => move(1)}><ChevronRight size={26} strokeWidth={1.5} /></button>
        <div className="home-card-rail-edge-footer">
          <button type="button" aria-label={`Previous ${label.toLowerCase()}`} aria-controls={id} disabled={!position.previous} onClick={() => move(-1)}>Back</button>
          {showCounter && <span aria-live="polite" aria-atomic="true">{position.first}{position.last > position.first ? `–${position.last}` : ''} / {count}</span>}
        </div>
      </> : <div className="home-card-rail-controls">
        {showCounter && <span aria-live="polite" aria-atomic="true">{position.first}{position.last > position.first ? `–${position.last}` : ''} / {count}</span>}
        <div>
          <button type="button" aria-label={`Previous ${label.toLowerCase()}`} aria-controls={id} disabled={!position.previous} onClick={() => move(-1)}><ArrowLeft size={18} /></button>
          <button type="button" aria-label={`Next ${label.toLowerCase()}`} aria-controls={id} disabled={!position.next} onClick={() => move(1)}><ArrowRight size={18} /></button>
        </div>
      </div>}
    </div>
  );
}
