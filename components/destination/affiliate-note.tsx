"use client";

import { useState } from "react";
import { AffiliateDisclosureModal } from "@/components/AffiliateDisclosureModal";

export function AffiliateNote() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p className="text-xs text-stone">
        Some links on this page are affiliate links. Booking through them supports
        Travelholics at no extra cost to you.{" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="underline underline-offset-2 transition-colors hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
        >
          Learn more
        </button>
      </p>
      <AffiliateDisclosureModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
