"use client";

import Link from "next/link";
import { Mail, Anchor } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#162e6e] pt-12 pb-8 border-t-[3px] border-[#059669]">
      <div className="container mx-auto px-6">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/*
              REPLACE with finalized logo:
              <Image src="/images/travelholics-logo.png" alt="Travelholics"
                width={140} height={32} />
            */}
            <div className="w-9 h-9 rounded-lg bg-[#059669] flex items-center justify-center">
              <Anchor size={18} className="text-white" />
            </div>
            <span className="text-lg font-extrabold text-white">
              Travelholics
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm font-semibold">
            <a
              href="#about"
              className="text-blue-100/40 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#testimonials"
              className="text-blue-100/40 hover:text-white transition-colors"
            >
              Reviews
            </a>
            <a
              href="#process"
              className="text-blue-100/40 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#contact"
              className="text-blue-100/40 hover:text-white transition-colors"
            >
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
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-white"
              >
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
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-100/25">
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Travelholics</span>
            <Link
              href="/privacy"
              className="hover:text-white/50 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white/50 transition-colors"
            >
              Terms
            </Link>
          </div>
          <span>
            Built with &hearts; by{" "}
            <a
              href="https://creativeeyestudios.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100/40 hover:text-white/60 transition-colors"
            >
              Creative Eye Studios
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
