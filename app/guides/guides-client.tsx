"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

import {
  GUIDE_CATEGORIES,
  formatGuideSize,
  type FreeGuide,
} from "@/lib/free-guides";
import { GuideUnlockPortal } from "./guide-unlock-modal";

const FORMAT_ICON = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  png: ImageIcon,
} as const;

const FORMAT_LABEL = {
  pdf: "PDF",
  xlsx: "Excel",
  png: "Printable",
} as const;

function GuideCard({
  guide,
  onUnlock,
}: {
  guide: FreeGuide;
  onUnlock: (guide: FreeGuide) => void;
}) {
  const Icon = FORMAT_ICON[guide.format];

  return (
    <article className="flex flex-col rounded-[1.5rem] bg-cream p-6 shadow-[0_18px_50px_rgba(26,58,82,0.08)] ring-1 ring-white/70 transition-shadow hover:shadow-[0_22px_60px_rgba(26,58,82,0.12)]">
      <div className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-stone">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        <span>{FORMAT_LABEL[guide.format]}</span>
        <span aria-hidden>·</span>
        <span>
          {guide.pages ? `${guide.pages} ${guide.pages === 1 ? "page" : "pages"}` : formatGuideSize(guide)}
        </span>
      </div>

      <h3 className="mt-3 font-serif text-[1.4rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
        <Link
          href={`/guides/${guide.slug}`}
          className="transition-colors hover:text-emerald-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        >
          {guide.title}
        </Link>
      </h3>

      <p className="mt-2 text-[0.95rem] leading-relaxed text-stone">{guide.blurb}</p>

      <ul className="mt-4 space-y-2">
        {guide.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-2.5 text-[0.88rem] leading-relaxed text-ink/80">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-mid" aria-hidden />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {/* Reading the guide is the primary path — it needs no email and it is
          the page that ranks. Downloading is the secondary upgrade. */}
      <div className="mt-auto pt-6">
        <Link
          href={`/guides/${guide.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
        >
          Read the guide
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>

        <button
          type="button"
          onClick={() => onUnlock(guide)}
          className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-[0.85rem] font-semibold text-stone transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          Or download the {FORMAT_LABEL[guide.format]}
        </button>
      </div>
    </article>
  );
}

export function GuidesClient({ guides }: { guides: FreeGuide[] }) {
  const [activeGuide, setActiveGuide] = useState<FreeGuide | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const present = GUIDE_CATEGORIES.filter((category) =>
      guides.some((guide) => guide.category === category),
    );
    return ["All", ...present];
  }, [guides]);

  const visible = useMemo(
    () =>
      activeCategory === "All"
        ? guides
        : guides.filter((guide) => guide.category === activeCategory),
    [guides, activeCategory],
  );

  return (
    <>
      {categories.length > 2 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={`rounded-full px-5 py-2 text-[0.82rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                  active
                    ? "bg-emerald-deep text-white"
                    : "bg-cream text-ink/70 ring-1 ring-ink/10 hover:text-ink"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {/* Four or fewer guides sit as a balanced 2×2; a third column only earns
          its place once there are enough cards to fill it. */}
      <div
        className={`mx-auto grid gap-6 sm:grid-cols-2 ${
          visible.length > 4 ? "lg:grid-cols-3" : "max-w-4xl"
        }`}
      >
        {visible.map((guide) => (
          <GuideCard key={guide.id} guide={guide} onUnlock={setActiveGuide} />
        ))}
      </div>

      <GuideUnlockPortal guide={activeGuide} onClose={() => setActiveGuide(null)} />
    </>
  );
}
