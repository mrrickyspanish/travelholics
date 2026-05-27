"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Instagram, Youtube } from "lucide-react";

const quickLinks = [
  { label: "About",        href: "/#about"        },
  { label: "Group Trips",  href: "/#group-trips"  },
  { label: "Travel Picks", href: "/shop"           },
  { label: "Testimonials", href: "/#testimonials"  },
  { label: "Contact",      href: "/#contact"       },
];

const travelLinks = [
  { label: "Plan a Cruise",    href: "/#contact"     },
  { label: "Group Trips",      href: "/#group-trips" },
  { label: "Upcoming Trips",   href: "/#group-trips" },
  { label: "Destinations",     href: "/#map"         },
  { label: "Cruise Lines",     href: "/#contact"     },
];

const shopLinks = [
  { label: "Travel Picks", href: "/shop" },
  { label: "Gift Cards",   href: "/shop" },
  { label: "New Arrivals", href: "/shop" },
];

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-navy">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-4 focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none rounded">
              <Image
                src="/images/travelholics_logo_stack.png"
                alt="Travelholics"
                width={220}
                height={120}
                className="h-auto w-[180px] sm:w-[210px]"
              />
            </Link>
            <p className="text-footer-body text-white/60 leading-relaxed mb-5">
              Curated cruises. Real experience.<br />
              Stress-free planning.<br />
              Memories that last a lifetime.
            </p>
            <div className="flex gap-2 flex-wrap">
              <a
                href="https://www.instagram.com/yotravelholic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-coral flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={15} className="text-white" />
              </a>
              <a
                href="https://www.facebook.com/yotravelholic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-coral flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.tiktok.com/@rjsmom1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-coral flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://www.youtube.com/@yotravelholic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-coral flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={15} className="text-white" />
              </a>
              <a
                href="mailto:hello@yotravelholic.com"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-coral flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail size={15} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-eyebrow font-bold text-white/40 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-footer-body text-white/70 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel */}
          <div>
            <h3 className="text-eyebrow font-bold text-white/40 mb-4">Travel</h3>
            <ul className="space-y-2.5">
              {travelLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-footer-body text-white/70 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop + Connect */}
          <div>
            <h3 className="text-eyebrow font-bold text-white/40 mb-4">Shop</h3>
            <ul className="space-y-2.5 mb-7">
              {shopLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-footer-body text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-eyebrow font-bold text-white/40 mb-3">Let&apos;s Connect</h3>
            <a
              href="mailto:hello@yotravelholic.com"
              className="text-footer-body text-white/70 hover:text-white transition-colors block mb-1.5"
            >
              hello@yotravelholic.com
            </a>
            <a
              href="tel:+19855551234"
              className="text-footer-body text-white/70 hover:text-white transition-colors block"
            >
              (985) 555-1234
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-footer-body text-white/40">
          <span>
            &copy; {new Date().getFullYear()} Yolanda Harris | Travelholics. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
