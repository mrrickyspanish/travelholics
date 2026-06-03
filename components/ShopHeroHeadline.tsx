"use client";
import { useState } from "react";
import { AffiliateDisclosureModal } from "@/components/AffiliateDisclosureModal";

export function ShopHeroHeadline() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-xs font-bold tracking-[0.18em] uppercase text-stone-400 mb-3">The Travelholics Shop</p>
      <h1 className="type-page-title text-ink mb-4">
        What I use. What I love.<br />
        <span className="font-serif italic font-light text-[#1e3a8a]">What I recommend.</span>
      </h1>
      <p className="type-body-lg text-stone-700 max-w-lg mx-auto mb-2">
        20+ years of cruising experience distilled into the things I actually pack, use, and recommend.
      </p>
      <p className="text-xs text-stone-500 max-w-lg mx-auto mb-2">
        Some links on this page are affiliate links. If you purchase through them, Travelholics may earn a commission at no additional cost to you.
      </p>
      <button
        type="button"
        className="text-xs text-[#059669] underline underline-offset-2 hover:text-[#0E125C] transition-colors focus:outline-none mb-2"
        onClick={() => setModalOpen(true)}
        aria-haspopup="dialog"
        aria-controls="affiliate-disclosure-modal"
      >
        Why travelers trust these picks &rarr;
      </button>
      <AffiliateDisclosureModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}