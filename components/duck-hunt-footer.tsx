import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";

// A stripped-down footer just for the duck-hunt claim funnel. The shared
// site-wide <Footer /> carries a full sitemap (Shop, Gift Cards, Group
// Trips, a second newsletter signup, etc.) — exactly the kind of exit ramp
// this single-goal page's minimal header was built to avoid. This keeps
// only what a cruiser actually needs here: a way to find us on social, and
// the legal minimum (copyright, privacy, terms).

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
  </svg>
);

export const DuckHuntFooter = () => {
  return (
    <footer className="bg-[#1A2E2A] px-6 py-14 sm:py-16">
      <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
        <div className="mb-5 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#0d4a3a] p-2">
          <Image
            src="/images/traveholics_duck.svg"
            alt="Travelholics duck"
            width={26}
            height={26}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="mb-7 flex gap-3">
          <a
            href="https://www.instagram.com/yotravelholic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#f59e0b]"
            aria-label="Instagram"
          >
            <Instagram size={18} className="text-white" />
          </a>
          <a
            href="https://www.tiktok.com/@rjsmom1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#f59e0b]"
            aria-label="TikTok"
          >
            <TikTokIcon />
          </a>
          <a
            href="https://www.youtube.com/@yotravelholic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#f59e0b]"
            aria-label="YouTube"
          >
            <Youtube size={18} className="text-white" />
          </a>
        </div>

        <p className="mb-3 text-[16px] text-white/55">
          &copy; {new Date().getFullYear()} Travelholics. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[16px] text-white/55">
          <Link href="/privacy" className="underline-offset-2 transition-colors hover:text-white hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="underline-offset-2 transition-colors hover:text-white hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};
