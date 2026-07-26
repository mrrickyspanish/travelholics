"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import type { FreeGuide } from "@/lib/free-guides";
import { GuideUnlockPortal } from "../guide-unlock-modal";

export function GuideDownloadCta({
  guide,
  label = "Get the printable version",
  className = "",
}: {
  guide: FreeGuide;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 ${className}`}
      >
        <Download className="h-4 w-4" aria-hidden />
        {label}
      </button>

      <GuideUnlockPortal guide={open ? guide : null} onClose={() => setOpen(false)} />
    </>
  );
}
