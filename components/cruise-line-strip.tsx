
"use client";

import Image from "next/image";
import { useState } from "react";
import { Pause, Play } from "lucide-react";

// Each line renders its approved logo when one is present in
// public/images/cruise-lines/, and a styled wordmark until then. The two
// occupy the same box, so dropping a file in changes nothing structurally
// and the strip stays correct while the folder is filled in one line at a
// time. See that folder's README for what to collect and why a scraped
// logo is not an approved asset.
type CruiseLine = {
  name: string;
  /** Path under /public. Omit until an approved asset is in hand. */
  logo?: string;
  /** Intrinsic size of that asset. Required by next/image; only the ratio matters. */
  width?: number;
  height?: number;
  /**
   * Share of the row's height this mark fills, for optical balance. Sizing six
   * logos to one height does not make them look one size: Celebrity is 4.5:1
   * and rendered 145px wide, while NCL at 1.3:1 rendered 41px and its letters
   * were unreadable. Wide wordmarks sit below 1, compact stacked marks at 1.
   */
  scale?: number;
};

const cruiseLines: CruiseLine[] = [
  { name: "Royal Caribbean", logo: "/images/cruise-lines/royal-caribbean.png", width: 469, height: 128, scale: 0.72 },
  { name: "Celebrity Cruises", logo: "/images/cruise-lines/celebrity.png", width: 581, height: 128, scale: 0.64 },
  { name: "Norwegian Cruise Line", logo: "/images/cruise-lines/norwegian.png", width: 162, height: 128, scale: 1 },
  { name: "MSC Cruises", logo: "/images/cruise-lines/msc.png", width: 357, height: 128, scale: 0.86 },
  { name: "Carnival Cruise Line", logo: "/images/cruise-lines/carnival.png", width: 522, height: 128, scale: 0.7 },
  { name: "Princess Cruises", logo: "/images/cruise-lines/princess.png", width: 182, height: 128, scale: 1 },
];

// One optical height for every mark, so a wide wordmark and a tall roundel
// still read as one row.
const LOGO_BOX = "h-9 sm:h-10";

export const CruiseLineStrip = ({ river = false }: { river?: boolean }) => {
  const [paused, setPaused] = useState(false);

  return (
    <section id="cruise-lines" className="overflow-hidden border-y border-ink/10 bg-[#f1ebdf] text-ink">
      <div className="mx-auto max-w-[96rem] px-5 py-9 sm:px-8 sm:py-11 lg:px-12 xl:px-16">
        <div className="grid gap-6 lg:grid-cols-[0.45fr_0.55fr] lg:items-center lg:gap-10">
          <p data-headline className="home-cruise-lines-heading text-balance font-serif text-[clamp(1.375rem,2.1vw,1.75rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-royal-deep">
            Find your cruise line.
          </p>

          <div className={`${river ? 'home-cruise-logo-window ' : ''}relative overflow-hidden lg:overflow-visible`} data-paused={paused}>
            <ul aria-label="Cruise lines"
              className={`${river ? 'home-cruise-logo-track ' : ''}-mx-5 flex gap-7 overflow-x-auto px-5 py-2 [scrollbar-width:none] sm:-mx-8 sm:gap-9 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-9 lg:gap-y-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden`}
            >
              {(river ? [...cruiseLines, ...cruiseLines] : cruiseLines).map((line, index) => (
                <li
                  key={`${line.name}-${index}`}
                  aria-hidden={index >= cruiseLines.length ? true : undefined}
                  className={`flex ${LOGO_BOX} shrink-0 items-center border-l border-ink/14 pl-4 lg:shrink ${index >= cruiseLines.length ? 'home-cruise-logo-duplicate' : ''}`}
                >
                  {line.logo ? (
                    <Image
                      src={line.logo}
                      alt={line.name}
                      width={line.width ?? 160}
                      height={line.height ?? 32}
                      // No grayscale/invert filter on purpose: several of these
                      // brands prohibit altering the mark, and a CSS filter is
                      // an alteration. Supply the approved mono file instead.
                      style={{ height: `${(line.scale ?? 1) * 100}%` }}
                      className="w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
                    />
                  ) : (
                    <span className="whitespace-nowrap text-sm font-black tracking-[-0.02em] text-royal-deep/72 sm:text-base lg:whitespace-normal">
                      {line.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {river && <button type="button" className="home-cruise-logo-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play cruise logo animation' : 'Pause cruise logo animation'} aria-pressed={paused}>
              {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
            </button>}
          </div>
        </div>
      </div>
    </section>
  );
};
