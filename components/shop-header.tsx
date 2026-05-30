import React from "react";
import Link from "next/link";
import { FaBars, FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";

export function ShopHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Promo Bar */}
      <div className="header-top bg-yellow-100 text-yellow-900 text-xs h-8 flex items-center justify-center font-semibold">
        Free shipping on orders over $50
      </div>
      {/* Main Navigation Bar */}
      <div className="header-main bg-white shadow flex items-center justify-between h-16 px-4 md:px-8">
        <button aria-label="Menu" className="p-2 text-gray-700 md:hidden">
          <FaBars size={20} />
        </button>
        <button aria-label="Search" className="p-2 text-gray-700">
          <FaSearch size={20} />
        </button>
        <Link href="/" className="flex-1 flex justify-center">
          <span className="font-extrabold text-xl tracking-tight text-blue-900">Yotravelholic</span>
        </Link>
        <div className="flex items-center gap-4">
          <button aria-label="Wishlist" className="p-2 text-gray-700">
            <FaHeart size={20} />
          </button>
          <button aria-label="Cart" className="p-2 text-gray-700">
            <FaShoppingCart size={20} />
          </button>
          <button aria-label="Account" className="p-2 text-gray-700 hidden md:inline-flex">
            <FaUser size={20} />
          </button>
        </div>
      </div>
      {/* Bottom Trust/Info Bar */}
      <div className="header-sub bg-blue-50 text-blue-900 text-sm h-10 flex items-center justify-center gap-4 px-2">
        <span className="font-semibold">Trusted by 5,000+ travelers</span>
        <span className="hidden md:inline">|</span>
        <Link href="/shop#must-haves" className="underline underline-offset-2 hover:text-blue-700 text-xs md:text-sm">
          New here? Shop travel must-haves
        </Link>
      </div>
    </header>
  );
}
