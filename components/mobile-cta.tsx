"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export const MobileCTA = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const actions = document.querySelector('.hero-actions');
    const contact = document.getElementById('contact');
    const measure = () => {
      if (!actions || !contact) return;
      // Follow the actual controls, including short screens and text zoom.
      // Once contact has been reached, do not reappear over the shop/footer.
      setVisible(actions.getBoundingClientRect().bottom <= 64 && contact.getBoundingClientRect().top > window.innerHeight + 160);
    };
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const observer = new ResizeObserver(measure);
    if (contact) observer.observe(contact);
    if (actions) observer.observe(actions);
    measure();
    return () => { window.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); observer.disconnect(); };
  }, []);

  if (!visible) return null;
  return (
    <div className="home-sticky-cta fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] lg:hidden">
      <a href="#contact" className="mx-auto flex min-h-13 w-full max-w-md items-center justify-between rounded-none border border-white/18 bg-[#082d27]/96 px-5 py-3.5 text-left text-white shadow-[0_18px_45px_rgba(7,31,27,0.28)] backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral">
        <span><span className="block text-sm font-black uppercase tracking-[0.14em] text-coral">Ready when you are</span><span className="mt-0.5 block text-sm font-bold">Plan my cruise</span></span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white"><ArrowUpRight size={17} aria-hidden="true" /></span>
      </a>
    </div>
  );
};
