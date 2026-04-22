"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-[#145544] pt-12 pb-8 border-t-[3px] border-[#059669]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex items-center">
            <Image
              src="/images/travelholics_logo_stack.svg"
              alt="Travelholics"
              width={120}
              height={64}
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm font-semibold flex-wrap">
            <a href="/#about" className="text-emerald-100/60 hover:text-white transition-colors">
              About
            </a>
            <a href="/#testimonials" className="text-emerald-100/60 hover:text-white transition-colors">
              Reviews
            </a>
            <a href="/#process" className="text-emerald-100/60 hover:text-white transition-colors">
              How It Works
            </a>
            <Link href="/shop" className="text-emerald-100/60 hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/collaborate" className="text-emerald-100/60 hover:text-white transition-colors">
              Collaborate
            </Link>
            <a href="/#contact" className="text-emerald-100/60 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <a
              href="https://www.tiktok.com/@rjsmom1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#059669] transition-all"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
              </svg>
            </a>
            <a
              href="mailto:yo@travelholics.com"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#059669] transition-all"
              aria-label="Email"
            >
              <Mail size={16} className="text-white" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/40">
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Travelholics</span>
            <Link href="/privacy" className="hover:text-white/50 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">
              Terms
            </Link>
          </div>
          <span>
            Built with &hearts; by{" "}
            <a
              href="https://creativeeyestudios.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-100/60 hover:text-white/80 transition-colors"
            >
              Creative Eye Studios
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
