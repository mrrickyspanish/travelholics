"use client";

import Link from "next/link";
import { Ship, Instagram, Mail, ShieldCheck, FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#1e3a8a] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#059669]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-16 mb-20">
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-2xl font-bold mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center">
                <Ship size={24} />
              </div>
              <span>Travelholics</span>
            </div>
            <p className="text-blue-100/70 leading-relaxed mb-8 max-w-sm">
              Helping you navigate the world's most beautiful waters with 20+ years of certified expertise. Your journey starts here.
            </p>
            <div className="flex gap-4">
              <a href="https://tiktok.com/@rjsmom1" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#059669] transition-all">
                <Instagram size={20} />
              </a>
              <a href="mailto:yolanda@example.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#059669] transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm">Navigation</h4>
              <ul className="space-y-4 text-blue-100/70">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-all">Top</button></li>
                <li><a href="#why" className="hover:text-white transition-all">Why Us</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-all">Reviews</a></li>
                <li><a href="#process" className="hover:text-white transition-all">Process</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-4 text-blue-100/70">
                <li>
                  <Link href="/privacy" className="flex items-center gap-2 hover:text-white transition-all">
                    <ShieldCheck size={16} /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="flex items-center gap-2 hover:text-white transition-all">
                    <FileText size={16} /> Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust Column */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h4 className="font-bold mb-4 text-white">Expertise Guaranteed</h4>
            <p className="text-sm text-blue-100/60 leading-relaxed mb-6">
              Certified Cruise Specialist with CLIA accreditation and preferred partner status with major cruise lines.
            </p>
            <div className="flex gap-4 opacity-50">
              {/* Simple badge placeholders */}
              <div className="w-12 h-12 rounded bg-white/10" />
              <div className="w-12 h-12 rounded bg-white/10" />
              <div className="w-12 h-12 rounded bg-white/10" />
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 text-center text-blue-100/40 text-sm">
          <p>© {new Date().getFullYear()} Travelholics. All rights reserved. Built with ❤️ by Creative Eye Studios.</p>
        </div>
      </div>
    </footer>
  );
};
