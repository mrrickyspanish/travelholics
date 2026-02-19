"use client";

import Link from "next/link";
import { Ship, Mail, ShieldCheck, FileText, Anchor } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#1e3a8a] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#059669] via-[#f59e0b] to-[#059669]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-16 mb-20">
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 text-2xl font-bold mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center">
                <Anchor size={22} />
              </div>
              <span>Travelholics</span>
            </div>
            <p className="text-blue-100/60 leading-relaxed mb-8 max-w-sm">
              Helping you navigate the world&apos;s most beautiful waters with
              20+ years of certified expertise. Your next chapter starts here.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.tiktok.com/@rjsmom1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#059669] transition-all"
                aria-label="Follow on TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
                </svg>
              </a>
              <a
                href="mailto:yolanda@example.com"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#059669] transition-all"
                aria-label="Send an email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm">
                Navigate
              </h4>
              <ul className="space-y-4 text-blue-100/60">
                <li>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="hover:text-white transition-colors"
                  >
                    Back to Top
                  </button>
                </li>
                <li>
                  <a
                    href="#why"
                    className="hover:text-white transition-colors"
                  >
                    Why Travelholics
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Traveler Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="#process"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm">
                Legal
              </h4>
              <ul className="space-y-4 text-blue-100/60">
                <li>
                  <Link
                    href="/privacy"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <ShieldCheck size={16} /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <FileText size={16} /> Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust Column */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h4 className="font-bold mb-3 text-white">
              Expertise You Can Trust
            </h4>
            <p className="text-sm text-blue-100/50 leading-relaxed mb-6">
              CLIA-accredited Cruise Specialist with preferred partner status
              across Royal Caribbean, Carnival, Norwegian, Celebrity, Disney,
              and Viking cruise lines.
            </p>
            <div className="flex gap-3">
              {["CLIA", "RCCL", "CCL"].map((badge) => (
                <div
                  key={badge}
                  className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold text-blue-100/40 border border-white/5"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-blue-100/30 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Travelholics. All rights
            reserved.
          </p>
          <p>
            Built with &hearts; by{" "}
            <a
              href="https://creativeeyestudios.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100/50 hover:text-white transition-colors"
            >
              Creative Eye Studios
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
