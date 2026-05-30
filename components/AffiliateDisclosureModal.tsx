"use client";
import { useEffect, useRef } from "react";

interface AffiliateDisclosureModalProps {
  open: boolean;
  onClose: () => void;
}

export function AffiliateDisclosureModal({ open, onClose }: AffiliateDisclosureModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus inside modal
  useEffect(() => {
    if (!open) return;
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && focusable && focusable.length > 1) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      aria-modal="true"
      role="dialog"
      aria-labelledby="affiliate-disclosure-title"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FCFAF5] rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 border border-[#0E125C]/10"
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[#0E125C] hover:text-[#059669] text-2xl font-bold focus:outline-none"
        >
          ×
        </button>
        <h2 id="affiliate-disclosure-title" className="text-2xl font-bold text-[#0E125C] mb-4">Why travelers trust these picks</h2>
        <div className="text-base text-[#1e3a8a] mb-4">
          <strong>Our Recommendation Philosophy</strong>
        </div>
        <div className="text-stone-700 mb-4">
          Every product or service recommended on Travelholics is chosen based on 20+ years of real cruise experience. We only suggest items we actually use, pack, or would recommend to close friends and family. Our goal is to make your travel easier, safer, and more enjoyable.
        </div>
        <div className="text-stone-500 text-sm">
          Some links on this page are affiliate links. If you purchase through them, Travelholics may earn a commission at no additional cost to you. Affiliate purchases are always handled by the outside retailer. Official Travelholics merch is sold through this site using secure Stripe checkout.
        </div>
      </div>
    </div>
  );
}
